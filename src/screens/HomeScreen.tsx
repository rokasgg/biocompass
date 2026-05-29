import React, { useEffect, useState, useMemo } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Dimensions,
    Platform,
    Button,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// Importing your Global Design Tokens
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

const { width } = Dimensions.get('window');



const HomeScreen = () => {

    const score = useStore((state) => state.score);
    const user = useStore(state => state.user);
    const navigation = useNavigation();
    const addScore = () => {
        // Logic to add score would go here
        // setScore(score + 20)
        console.log('🏃 Step Count Data:', {
            stepCount,
            rawStats: stats,
            isAuthorized,
            isLoadingSteps,
            error,
            score,
        });
    };

    const [error, setError] = useState<string | null>(null);
    const [isAuthorized, setIsAuthorized] = useState(false);

    // 1. Request authorization for both steps and sleep on mount
    useEffect(() => {
        const requestHealthKitPermissions = async () => {
            try {
                const authorized = await requestAuthorization({
                    toRead: [
                        'HKQuantityTypeIdentifierStepCount',
                        'HKCategoryTypeIdentifierSleepAnalysis'
                    ]
                });
                setIsAuthorized(authorized);
                if (!authorized) {
                    setError("HealthKit permission was denied.");
                }
            } catch (e: any) {
                console.error("HealthKit authorization error:", e);
                setError(e?.message || "Failed to authorize HealthKit.");
                setIsAuthorized(false);
            }
        };
        requestHealthKitPermissions();
    }, []);

    // 2. Set up stable date range
    const { start, end } = useMemo(() => {
        const s = new Date();
        s.setHours(0, 0, 0, 0);
        const e = new Date();
        return { start: s, end: e };
    }, []);

    // 3. Always call the hook unconditionally (even if not authorized, it handles it)
    const stats = useStatisticsForQuantity(
        'HKQuantityTypeIdentifierStepCount',
        ['cumulativeSum'],
        start,
        end
    );

    // Extract step count from hook result
    const stepCount = stats?.sumQuantity?.quantity ? Math.round(stats.sumQuantity.quantity) : 0;
    const isLoadingSteps = isAuthorized && stats === null;

    // 4. Fetch sleep data - query category samples for sleep analysis
    const [sleepDisplayText, setSleepDisplayText] = useState("--");
    const [isLoadingSleep, setIsLoadingSleep] = useState(false);

    useEffect(() => {
        if (!isAuthorized) return;

        const fetchSleepData = async () => {
            try {
                setIsLoadingSleep(true);
                const sleepSamples = await queryCategorySamples(
                    'HKCategoryTypeIdentifierSleepAnalysis',
                    {
                        limit: 0,
                        filter: {
                            date: {
                                startDate: start,
                                endDate: end
                            }
                        }
                    }
                );

                if (sleepSamples && sleepSamples.length > 0) {
                    // Calculate total sleep time
                    const totalSleepMs = sleepSamples.reduce((total, sample) => {
                        const duration = new Date(sample.endDate).getTime() - new Date(sample.startDate).getTime();
                        return total + duration;
                    }, 0);

                    const totalSleepMinutes = Math.floor(totalSleepMs / 60000);
                    const hours = Math.floor(totalSleepMinutes / 60);
                    const minutes = totalSleepMinutes % 60;
                    setSleepDisplayText(hours > 0 || minutes > 0 ? `${hours}h ${minutes}m` : "No data");
                } else {
                    setSleepDisplayText("No data");
                }
            } catch (err) {
                console.error("Error fetching sleep data:", err);
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

            {/* --- Top App Bar --- */}
            {/* <HeaderBar title="BioCompass" onPress={() => alert('Header pressed')} /> */}

            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* --- Hero Section: Plumbob / Vitality --- */}
                <View style={styles.heroSection}>
                    <View style={styles.heroTextContainer}>
                        <Text style={styles.heroOverline}>VITALITY SCORE</Text>
                        <Text style={styles.heroMainTitle}>BioCompass</Text>
                    </View>


                    {/* Plumbob Visual Placeholder */}
                    <View style={styles.plumbobContainer}>
                        <TouchableOpacity style={styles.plumbobDiamond} onPress={addScore}>
                            {/* Note: In a real app, this would be an SVG or 3D model */}
                            <VitalityPlumbob isLoading={false} score={score} />
                        </TouchableOpacity>
                        {/* <View style={styles.plumbobShadow} /> */}
                    </View>

                    <View style={styles.heroFooter}>
                        <Text style={styles.vitalityPercentage}>84%</Text>
                        <Text style={styles.vitalitySubtext}>Capacity maintained</Text>
                    </View>
                </View>

                {/* --- Metrics Bento Grid --- */}
                <View style={styles.metricsGrid}>
                    <MetricCard
                        vibe="steps"
                        value={stepCount.toLocaleString()}
                        badge={isLoadingSteps ? "Loading..." : "+12%"}
                        progress={Math.min(stepCount / 10000, 1)}
                    />
                    <MetricCard
                        vibe="sleep"
                        value={sleepDisplayText}
                        badge={isLoadingSleep ? "Loading..." : "Deep Rest"}
                        progress={0.85}
                    />
                    <MetricCard
                        vibe="calories"
                        value="1,850"
                        badge="BALANCED"
                        progress={0.6}
                    />
                </View>

                {/* --- Inspiration Section --- */}
                <View style={styles.inspirationCard}>
                    <View style={styles.inspirationTextContent}>
                        <Text style={styles.inspirationTitle}>Focus on the Breath</Text>
                        <Text style={styles.inspirationBody}>
                            Your heart rate variability indicates a high readiness for mindful movement.
                        </Text>
                        <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('BreathworkGallery')}>
                            <Text style={styles.buttonText}>Start Session</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </ScrollView>

        </SafeAreaView>
    );
};

// Internal Metric Card Component

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: THEME.colors.background },
    header: {
        height: 64,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: THEME.spacing.lg,
        backgroundColor: 'rgba(243, 244, 240, 0.8)',
    },
    headerLeft: { flexDirection: 'row', alignItems: 'center' },
    avatarMiniContainer: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: THEME.colors.surfaceContainerHigh, overflow: 'hidden'
    },
    miniAvatar: { width: '100%', height: '100%' },
    headerTitle: {
        fontSize: THEME.fontSize.lg,
        fontWeight: '800',
        color: THEME.colors.primary,
        marginLeft: THEME.spacing.sm
    },
    iconButton: {
        width: 40, height: 40, borderRadius: 20,
        justifyContent: 'center', alignItems: 'center'
    },
    scrollContent: { paddingHorizontal: THEME.spacing.lg, paddingBottom: 120 },

    // Hero / Vitality Section
    heroSection: {
        backgroundColor: THEME.colors.surfaceContainerLow,
        borderRadius: THEME.radius.lg,
        padding: THEME.spacing.xl,
        marginTop: THEME.spacing.md,
        minHeight: 400,
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroTextContainer: { position: 'absolute', top: 30, left: 25 },
    heroOverline: {
        fontSize: 12, fontWeight: '700',
        color: THEME.colors.secondary, letterSpacing: 1.5
    },
    heroMainTitle: {
        fontSize: 38, fontWeight: '900',
        color: THEME.colors.onSurface, fontStyle: 'italic'
    },
    plumbobContainer: { alignItems: 'center', justifyContent: 'center' },
    plumbobDiamond: { /* Logic for 3D rotation would go here */ },
    plumbobShadow: {
        width: 100, height: 15,
        backgroundColor: 'rgba(74, 101, 73, 0.1)',
        borderRadius: 50, marginTop: 20,
        filter: Platform.OS === 'ios' ? 'blur(10px)' : undefined
    },
    heroFooter: { position: 'absolute', bottom: 30, right: 25, alignItems: 'flex-end' },
    vitalityPercentage: { fontSize: 24, fontWeight: '800', color: THEME.colors.primary },
    vitalitySubtext: { fontSize: 12, color: THEME.colors.onSurfaceVariant },

    // Bento Metrics
    metricsGrid: { marginTop: THEME.spacing.lg },
    metricCard: {
        backgroundColor: THEME.colors.white,
        borderRadius: THEME.radius.lg,
        padding: THEME.spacing.lg,
        marginBottom: THEME.spacing.md,
        minHeight: 200,
        justifyContent: 'space-between',
        ...THEME.shadows.editorial,
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between' },
    iconBox: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
    badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
    badgeText: { fontSize: 10, fontWeight: '800' },
    metricValue: { fontSize: 36, fontWeight: '800', color: THEME.colors.onSurface },
    metricLabel: { fontSize: 14, color: THEME.colors.onSurfaceVariant },
    miniProgressBar: {
        height: 6, backgroundColor: THEME.colors.surfaceContainerHigh,
        borderRadius: 3, marginTop: THEME.spacing.md, overflow: 'hidden'
    },
    miniProgressFill: { height: '100%', borderRadius: 3 },

    // Inspiration Section
    inspirationCard: {
        backgroundColor: THEME.colors.primary + '10',
        borderRadius: THEME.radius.lg,
        padding: THEME.spacing.xl,
        marginTop: THEME.spacing.lg,
    },
    inspirationTitle: { fontSize: 24, fontWeight: '800', color: THEME.colors.primary },
    inspirationBody: {
        fontSize: 16, color: THEME.colors.secondary,
        lineHeight: 24, marginVertical: THEME.spacing.md
    },
    primaryButton: {
        backgroundColor: THEME.colors.primary,
        paddingVertical: THEME.spacing.md,
        paddingHorizontal: THEME.spacing.xl,
        borderRadius: THEME.radius.full,
        alignSelf: 'flex-start'
    },
    buttonText: { color: THEME.colors.white, fontWeight: '700' },

    // Bottom Nav
    bottomNav: {
        position: 'absolute', bottom: 0, width: '100%', height: 90,
        backgroundColor: 'rgba(249, 250, 246, 0.95)',
        flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
        paddingBottom: Platform.OS === 'ios' ? 20 : 0,
        borderTopLeftRadius: 30, borderTopRightRadius: 30,
        ...THEME.shadows.editorial
    },
    navItem: { alignItems: 'center', padding: 10 },
    navItemActive: { backgroundColor: THEME.colors.primaryContainer + '40', borderRadius: 25, paddingHorizontal: 15 },
    navLabel: { fontSize: 11, fontWeight: '600', marginTop: 4, color: THEME.colors.secondary },
    // This wraps the value, label, and progress bar in the Metric cards
    cardBottom: {
        marginTop: THEME.spacing.lg,
        gap: THEME.spacing.xs, // Modern RN support for gap, otherwise use margin
    },

    // This ensures the text inside the inspiration section takes up 
    // the correct space and aligns with the button
    inspirationTextContent: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
});

export default HomeScreen;