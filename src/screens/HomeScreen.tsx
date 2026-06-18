import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Dimensions,
    Animated,
    Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { THEME } from '../theme';
import MetricCard from '../compoments/MetricWidget';
import VitalityPlumbob from '../compoments/VitalityPlumbob';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../store/useStore';

import {
    requestAuthorization,
    useStatisticsForQuantity,
    queryCategorySamples,
} from '@kingstinct/react-native-healthkit';
import { checkInService } from '@backend/services/checkInService';
import { supabase } from '@backend/supabase';
import { useFocusEffect } from '@react-navigation/native';
import CheckInTimer from 'src/compoments/CheckInTimer';

const { width } = Dimensions.get('window');
const STATS_OPTIONS: ('cumulativeSum')[] = ['cumulativeSum'];
const HomeScreen = () => {
    // 1. Išsitraukiam iš Store, ar checkinai jau padaryti!
    // (Pridėk juos į savo store. Jei dar nepridėjai, kol kas gali naudoti useState testavimui)
    const score = useStore((state) => state.score);



    const navigation = useNavigation();
    const [error, setError] = useState<string | null>(null);
    const [isAuthorized, setIsAuthorized] = useState(false);

    const pulse = useRef(new Animated.Value(1)).current;

    const checkAndResetDaily = useStore(state => (state as any).checkAndResetDaily);


    const [totalScore, setTotalScore] = useState<number>(0);
    const [dailyScore, setDailyScore] = useState<number>(0);
    const [screenTimeMinutes, setScreenTimeMinutes] = useState<number>(0);
    const [hasCompletedMorningCheckIn, setHasCompletedMorningCheckIn] = useState<boolean>(false);
    const [hasCompletedEveningCheckIn, setHasCompletedEveningCheckIn] = useState<boolean>(false);
    const [isLoadingDb, setIsLoadingDb] = useState<boolean>(true);

    const loadData = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const data = await checkInService.getUserDashboardData(user.id);
            console.log("Gauti duomenys iš checkInService:", data);
            // setTotalScore(data.totalScore);
            setDailyScore(data.todayMetrics?.daily_score || 0);
        }
        setIsLoadingDb(false);
    };



    useEffect(() => {
        console.log("Fire1");
        loadData();
    }, []);

    useEffect(() => {
        checkAndResetDaily();
        console.log("Fire2");
    }, []);



    useEffect(() => {
        console.log("Fire4");
        const requestHealthKitPermissions = async () => {
            try {
                const authorized = await requestAuthorization({
                    toRead: [
                        'HKQuantityTypeIdentifierStepCount',
                        'HKCategoryTypeIdentifierSleepAnalysis'
                    ]
                } as any);
                setIsAuthorized(authorized);
            } catch (e: any) {
                console.error("HealthKit authorization error:", e);
                setIsAuthorized(false);
            }
        };
        requestHealthKitPermissions();
    }, []);

    const { start, end } = useMemo(() => {
        const s = new Date();
        s.setHours(0, 0, 0, 0);
        const e = new Date();
        return { start: s, end: e };
    }, []);

    // --- DIENOS FAZIŲ IR MYGTUKŲ RODYMO LOGIKA ---
    const currentHour = new Date().getHours();
    const isMorningPhase = currentHour >= 6 && currentHour < 17;
    const isEveningPhase = currentHour >= 17 && currentHour < 24;
    const isNightPhase = currentHour >= 0 && currentHour < 6;

    // Ar tikrai rodyti mygtuką? (Fazė aktyvi IR checkinas dar nepadarytas)
    const showMorningButton = isMorningPhase && !hasCompletedMorningCheckIn;
    const showEveningButton = isEveningPhase && !hasCompletedEveningCheckIn;

    // Jei nerodom jokio mygtuko, reiškia esam "Užrakintame / Laukimo" režime
    const isCheckinLocked = !showMorningButton && !showEveningButton;

    const maxAvailableScore = isMorningPhase ? 35 : 100;
    const vitalityPercentage = Math.min(Math.round((dailyScore / maxAvailableScore) * 100), 100);


    useFocusEffect(
        React.useCallback(() => {
            console.log("Fire7");
            const fetchDbData = async () => {
                try {
                    const { data: { user } } = await supabase.auth.getUser();
                    if (!user) return;

                    const data = await checkInService.getUserDashboardData(user.id);

                    // Supildom gautus duomenis iš Supabase
                    // setTotalScore(data.totalScore);
                    setDailyScore(data.todayMetrics?.daily_score || 0);

                    // Konvertuojam ekrano valandas atgal į minutes, kad Bento grid'as suprastų
                    const hours = data.todayMetrics?.screen_hours || 0;
                    setScreenTimeMinutes(Math.round(hours * 60));

                    // Protingai nustatom ar check-in atlikti (tikrinam ar yra įrašai bazėje)
                    setHasCompletedMorningCheckIn(!!data.todayMetrics?.morning_focus);

                    // Vakaro check-in skaitom kaip atliktą, jei jau yra įvestos ekrano valandos (net jei jos 0)
                    setHasCompletedEveningCheckIn(data.todayMetrics?.screen_hours !== null && data.todayMetrics?.screen_hours !== undefined);

                } catch (err) {
                    console.error("Nepavyko užkrauti duomenų iš DB:", err);
                } finally {
                    setIsLoadingDb(false);
                }
            };

            fetchDbData();
        }, [])
    );


    useEffect(() => {
        if (!isCheckinLocked) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulse, { toValue: 1.04, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
                    Animated.timing(pulse, { toValue: 1.0, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
                ])
            ).start();
        } else {
            pulse.setValue(1);
        }
    }, [isCheckinLocked]);

    // --- HEALTHKIT DATA ---
    const stats = useStatisticsForQuantity(
        'HKQuantityTypeIdentifierStepCount',
        STATS_OPTIONS,
        start,
        end
    );
    const stepCount = stats?.sumQuantity?.quantity ? Math.round(stats.sumQuantity.quantity) : 0;
    const isLoadingSteps = isAuthorized && stats === null;

    const [sleepDisplayText, setSleepDisplayText] = useState("--");
    const [isLoadingSleep, setIsLoadingSleep] = useState(false);

    useEffect(() => {
        if (!isAuthorized) return;
        const fetchSleepData = async () => {
            try {
                setIsLoadingSleep(true);
                const sleepSamples = await queryCategorySamples(
                    'HKCategoryTypeIdentifierSleepAnalysis',
                    { limit: 0, filter: { date: { startDate: start, endDate: end } } }
                );

                if (sleepSamples && sleepSamples.length > 0) {
                    const totalSleepMs = sleepSamples.reduce((total, sample) => {
                        return total + (new Date(sample.endDate).getTime() - new Date(sample.startDate).getTime());
                    }, 0);
                    const totalSleepMinutes = Math.floor(totalSleepMs / 60000);
                    const hours = Math.floor(totalSleepMinutes / 60);
                    const minutes = totalSleepMinutes % 60;
                    setSleepDisplayText(hours > 0 || minutes > 0 ? `${hours}h ${minutes}m` : "No data");
                } else {
                    setSleepDisplayText("No data");
                }
            } catch (err) {
                setSleepDisplayText("Error");
            } finally {
                setIsLoadingSleep(false);
            }
        };
        fetchSleepData();
    }, [isAuthorized, start, end]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* --- Hero Section --- */}
                <View style={styles.heroSection}>

                    {/* --- Dinaminis Check-in Mygtukas / Laikmatis --- */}
                    <View style={styles.checkinWrapper}>
                        {!isCheckinLocked ? (
                            <Animated.View style={[styles.checkinButtonWrap, { transform: [{ scale: pulse }] }]}>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={[styles.checkinButton, showEveningButton && { backgroundColor: '#8e44ad' }]}
                                    onPress={() => (navigation as any).navigate('DailyCheckInEntry', { phase: showMorningButton ? 'morning' : 'evening' })}
                                >
                                    <Text style={styles.checkinText}>
                                        {showMorningButton ? "Complete Morning Check-in" : "🌙 Complete Evening Check-in"}
                                    </Text>
                                </TouchableOpacity>
                            </Animated.View>
                        ) : (
                            <CheckInTimer
                                hasCompletedMorningCheckIn={hasCompletedMorningCheckIn}
                                hasCompletedEveningCheckIn={hasCompletedEveningCheckIn}
                            />
                        )}
                    </View>

                    <View style={styles.heroTextContainer}>
                        <Text style={styles.heroOverline}>
                            {isMorningPhase ? "MORNING ENERGY EXPECTATION" : "EVENING BALANCE EXPECTATION"}
                        </Text>
                        <Text style={styles.heroMainTitle}>BioCompass</Text>
                    </View>

                    {/* Plumbob Deimantukas */}
                    <View style={styles.plumbobContainer}>
                        <TouchableOpacity style={styles.plumbobDiamond} activeOpacity={0.9}>
                            <VitalityPlumbob isLoading={false} score={vitalityPercentage} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.heroFooter}>
                        <Text style={styles.vitalityPercentage}>{vitalityPercentage}%</Text>
                        <Text style={styles.vitalitySubtext}>Phase capacity filled</Text>
                    </View>
                </View>

                {/* --- Bento Grid Metrics --- */}
                <View style={styles.metricsGrid}>
                    <MetricCard vibe="steps" value={stepCount.toLocaleString()} badge={isLoadingSteps ? "Loading..." : "Syncing"} progress={Math.min(stepCount / 10000, 1)} />
                    <MetricCard vibe="sleep" value={sleepDisplayText} badge={isLoadingSleep ? "Loading..." : "Rest Tracker"} progress={0.85} />
                    <MetricCard vibe="screenTime" value={(() => {
                        const m = screenTimeMinutes || 0;
                        const h = Math.floor(m / 60);
                        const mm = m % 60;
                        return h > 0 || mm > 0 ? `${h}h ${mm}m` : '0h';
                    })()} badge={screenTimeMinutes ? 'Manual Input' : '—'} progress={Math.min((screenTimeMinutes || 0) / (12 * 60), 1)} />
                </View>

                {/* --- Nukreipimo skiltis --- */}
                <View style={styles.inspirationCard}>
                    <View style={styles.inspirationTextContent}>
                        <Text style={styles.inspirationTitle}>Need to breathe?</Text>
                        <Text style={styles.inspirationBody}>Take a moment for quick centering right now.</Text>
                        <TouchableOpacity style={styles.primaryButton} onPress={() => (navigation as any).navigate('BreathworkGallery')}>
                            <Text style={styles.buttonText}>Quick Breathing</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: THEME.colors.background },
    scrollContent: { paddingHorizontal: THEME.spacing.lg, paddingBottom: 120 },
    heroSection: { backgroundColor: THEME.colors.surfaceContainerLow, borderRadius: THEME.radius.lg, padding: THEME.spacing.xl, marginTop: THEME.spacing.md, minHeight: 440, alignItems: 'center', justifyContent: 'center' },
    heroTextContainer: { width: '100%', alignItems: 'flex-start', marginVertical: 10 },
    heroOverline: { fontSize: 11, fontWeight: '700', color: THEME.colors.secondary, letterSpacing: 1.5 },
    heroMainTitle: { fontSize: 34, fontWeight: '900', color: THEME.colors.onSurface, fontStyle: 'italic' },
    plumbobContainer: { alignItems: 'center', justifyContent: 'center', marginVertical: 20 },
    plumbobDiamond: {},
    heroFooter: { width: '100%', alignItems: 'flex-end', marginTop: 10 },
    vitalityPercentage: { fontSize: 32, fontWeight: '800', color: THEME.colors.primary },
    vitalitySubtext: { fontSize: 12, color: THEME.colors.onSurfaceVariant },
    metricsGrid: { marginTop: THEME.spacing.lg },
    checkinWrapper: { width: '100%', alignItems: 'center', marginBottom: 16 },
    checkinButtonWrap: { width: '100%' },
    checkinButton: { backgroundColor: THEME.colors.primary, paddingVertical: 16, paddingHorizontal: 20, borderRadius: 28, alignItems: 'center' },
    checkinText: { color: THEME.colors.white, fontWeight: '800', textAlign: 'center', fontSize: 16 },

    progressBarBackground: { width: '100%', height: 6, backgroundColor: THEME.colors.surfaceContainerHigh, borderRadius: 6, overflow: 'hidden' },
    progressBarFill: { height: '100%', backgroundColor: THEME.colors.primary },
    inspirationCard: { backgroundColor: THEME.colors.primary + '10', borderRadius: THEME.radius.lg, padding: THEME.spacing.xl, marginTop: THEME.spacing.lg },
    inspirationTitle: { fontSize: 24, fontWeight: '800', color: THEME.colors.primary },
    inspirationBody: { fontSize: 16, color: THEME.colors.secondary, lineHeight: 24, marginVertical: THEME.spacing.md },
    primaryButton: { backgroundColor: THEME.colors.primary, paddingVertical: THEME.spacing.md, paddingHorizontal: THEME.spacing.xl, borderRadius: THEME.radius.full, alignSelf: 'flex-start' },
    buttonText: { color: THEME.colors.white, fontWeight: '700' },
    inspirationTextContent: { flex: 1, alignItems: 'flex-start', justifyContent: 'center' },
});

export default HomeScreen;