import React, { useEffect, useRef, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Animated,
    Easing,
    Dimensions,
    ScrollView,
    Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import { THEME } from '../theme';

import ModalConfirmation from '../compoments/ModalConfirmation';
import { useStore } from '../store/useStore';
import ModalInformation from 'src/compoments/ModalInfo';
import ConfettiBurst from 'src/compoments/ConfettiBurst';
import { supabase } from '@backend/supabase';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';

const { width } = Dimensions.get('window');

type PhaseType = 'inhale' | 'hold-in' | 'exhale' | 'hold-out';
type BreathPhaseConfig = { type: PhaseType; duration: number; label: string };

const BREATHING_PATTERNS: Record<string, BreathPhaseConfig[]> = {
    equal: [{ type: 'inhale', duration: 4000, label: 'INHALE' }, { type: 'exhale', duration: 4000, label: 'EXHALE' }],
    coherent: [{ type: 'inhale', duration: 4000, label: 'INHALE' }, { type: 'exhale', duration: 4000, label: 'EXHALE' }],
    focus: [{ type: 'inhale', duration: 4000, label: 'INHALE' }, { type: 'exhale', duration: 4000, label: 'EXHALE' }],
    sleep: [{ type: 'inhale', duration: 4000, label: 'INHALE' }, { type: 'hold-in', duration: 7000, label: 'HOLD' }, { type: 'exhale', duration: 8000, label: 'EXHALE' }],
    box: [{ type: 'inhale', duration: 4000, label: 'INHALE' }, { type: 'hold-in', duration: 4000, label: 'HOLD' }, { type: 'exhale', duration: 4000, label: 'EXHALE' }, { type: 'hold-out', duration: 4000, label: 'HOLD' }],
};

const BreathingSessionScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const breathingType = (route.params as { breathingType?: string })?.breathingType ?? 'coherent';
    const user = useStore(state => state.user);
    const addMindfulMinutes = useStore((s: any) => s.addMindfulMinutes);

    const fromCheckIn = (route.params as { fromCheckIn?: boolean })?.fromCheckIn ?? false;
    const passedDuration = (route.params as { duration?: number })?.duration;

    const durationMap: Record<string, number> = { coherent: 180, equal: 180, sleep: 300, focus: 120, box: 240 };
    const sessionDuration = passedDuration ?? (durationMap[breathingType] ?? 180);

    const [isStarted, setIsStarted] = useState(false);
    const [isRunning, setIsRunning] = useState(false);

    const [phase, setPhase] = useState('INHALE');
    const [phaseCountdown, setPhaseCountdown] = useState(4);
    const [durationSecs] = useState(sessionDuration);
    const [progress, setProgress] = useState(0);

    const breatheAnim = useRef(new Animated.Value(1)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const bgAnim = useRef(new Animated.Value(0)).current;
    const bgAnimStarted = useRef(false);
    const [bgAnimValue, setBgAnimValue] = useState(0);
    const [modalShow, setModalShow] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const pausedAnimValue = useRef(1);
    const currentPhaseIdxRef = useRef(0);
    const isRunningRef = useRef(false);
    const readyOpacity = useRef(new Animated.Value(1)).current;
    const [readyVisible, setReadyVisible] = useState(true);

    useEffect(() => {
        isRunningRef.current = isRunning;
        if (!isStarted) return;

        if (isRunning && !bgAnimStarted.current) {
            bgAnimStarted.current = true;
            Animated.timing(bgAnim, {
                toValue: 1,
                duration: 4000,
                easing: Easing.linear,
                useNativeDriver: false,
            }).start();
            bgAnim.addListener(({ value }) => setBgAnimValue(value));
        }

        const pattern = BREATHING_PATTERNS[breathingType] ?? BREATHING_PATTERNS.equal;

        const runPhase = (idx: number, currentValue: number) => {
            if (!isRunningRef.current) return;
            currentPhaseIdxRef.current = idx;
            const { type, duration, label } = pattern[idx];
            const next = (idx + 1) % pattern.length;

            if (type === 'inhale') {
                const remaining = Math.max(0.02, (1.2 - currentValue) / 0.2);
                setPhase(label);
                setPhaseCountdown(duration / 1000);
                Animated.timing(breatheAnim, {
                    toValue: 1.2,
                    duration: Math.round(duration * remaining),
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }).start(({ finished }) => {
                    if (finished && isRunningRef.current) runPhase(next, 1.2);
                });
            } else if (type === 'hold-in' || type === 'hold-out') {
                setPhase(label);
                setPhaseCountdown(duration / 1000);
                Animated.delay(duration).start(({ finished }) => {
                    if (finished && isRunningRef.current) runPhase(next, currentValue);
                });
            } else {
                const remaining = Math.max(0.02, (currentValue - 1.0) / 0.2);
                setPhase(label);
                setPhaseCountdown(duration / 1000);
                Animated.timing(breatheAnim, {
                    toValue: 1.0,
                    duration: Math.round(duration * remaining),
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }).start(({ finished: f }) => {
                    if (f && isRunningRef.current) runPhase(next, 1.0);
                });
            }
        };

        if (isRunning) {
            runPhase(currentPhaseIdxRef.current, pausedAnimValue.current);
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, { toValue: 1.05, duration: 1500, useNativeDriver: true }),
                    Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
                ])
            ).start();
        } else {
            breatheAnim.stopAnimation(v => { pausedAnimValue.current = v; });
            pulseAnim.stopAnimation();
        }

        return () => {
            breatheAnim.stopAnimation(v => { pausedAnimValue.current = v; });
            pulseAnim.stopAnimation();
        };
    }, [isRunning, isStarted]);

    useEffect(() => {
        if (!isRunning || phaseCountdown <= 0) return;
        const timer = setTimeout(() => setPhaseCountdown(prev => Math.max(0, prev - 1)), 1000);
        return () => clearTimeout(timer);
    }, [isRunning, phaseCountdown]);

    const triggerDB = async () => {

        setIsRunning(false);



        const today = new Date().toISOString().split('T')[0];
        const sessionMinutes = Math.round(durationSecs / 60);
        console.log('******************* PIRST', user.userId, breathingType, sessionMinutes);

        // 1. Įrašom sesiją į istoriją(tavo sessions lentelė profilio kortelei)
        console.log('******************* ANTRAS', user.userId, breathingType, sessionMinutes);

        const { data, error: insertError } = await supabase.from('sessions').insert([
            {
                user_id: user.userId, type: 'breathing',       // <- Čia įkalat bendrą kategoriją profilio kortelėms
                sub_type: breathingType, duration: sessionMinutes
            }
        ]);

        if (insertError) {
            console.log('❌ SUPABASE SESSIONS KLAIDA:', JSON.stringify(insertError, null, 2));
        } else {
            console.log('✅ SESSIONS SĖKMINGAI ĮRAŠYTA:', data);
        }

        // 2. Pasiimam šios dienos esamas minutes iš daily_metrics
        const { data: current } = await supabase
            .from('daily_metrics')
            .select('rituals_count')
            .eq('user_id', user.userId)
            .eq('date', today)
            .single();

        const currentMinutes = current?.rituals_count || 0;

        // 🛡️ APSAUGA NUO SPAMINIMO: Neleidžiam kelti minučių virš 20 per dieną
        const maxMinutes = 20;
        if (currentMinutes >= maxMinutes) {
            console.log('Limit pasiektas, minutės nebepildomos, taškai nebeaugs.');
            setIsCompleted(true);
            return;
        }

        // Skaičiuojam naujas minutes, bet neviršijam limito
        const newMinutes = Math.min(currentMinutes + sessionMinutes, maxMinutes);

        // 3. Tiesiog siunčiam naują minučių skaičių į DB. 
        //             Kadangi tavo trigeris dabar nereaguoja į rituals_count, taškai kol kas nesikeis,
        //     bet įrašas išsisaugos saugiai ir neperrašys jokių kitų tavo check -in duomenų!
        await supabase
            .from('daily_metrics')
            .upsert({
                user_id: user.userId,
                date: today,
                rituals_count: newMinutes
            }, { onConflict: 'user_id, date' });

        addMindfulMinutes(sessionMinutes);
    }

    // Finišo sekimas (suveikia TIK jei sąžiningai pabaigia kvėpuoti)
    useEffect(() => {
        if (progress >= 100) {
            setIsRunning(false);
            breatheAnim.stopAnimation();
            pulseAnim.stopAnimation();
            triggerDB();

            setIsCompleted(true);
        }
    }, [progress]);

    // Laikmačio useEffect
    useEffect(() => {
        if (!isRunning) return;

        const interval = setInterval(() => {
            setProgress((prev) => {
                const next = Math.min(prev + 100 / durationSecs, 100);
                if (next >= 100) {
                    setIsRunning(false);
                }
                return next;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning, durationSecs]);

    useEffect(() => {
        if (isRunning) {
            activateKeepAwakeAsync();
        } else {
            deactivateKeepAwake();
        }
        return () => { deactivateKeepAwake(); };
    }, [isRunning]);

    const displaySeconds = Math.min(Math.round((progress / 100) * durationSecs), durationSecs);
    const bgProgress = bgAnimValue;

    const getBgColor = () => {
        const lightR = 249, lightG = 250, lightB = 246;
        const darkR = 15, darkG = 15, darkB = 23;
        const r = Math.round(lightR - (lightR - darkR) * bgProgress);
        const g = Math.round(lightG - (lightG - darkG) * bgProgress);
        const b = Math.round(lightB - (lightB - darkB) * bgProgress);
        return `rgb(${r}, ${g}, ${b})`;
    };

    const redirectToHome = () => {
        navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'MainTabs' }] }));
    };

    const closeModal = () => {
        setModalShow(false);
        redirectToHome();
    }

    const stopSession = () => {
        setIsRunning(false);
        setModalShow(true);
    }

    const keepGoing = () => {
        setIsRunning(true);
        setModalShow(false);
    }

    const handleStartSession = () => {
        setIsStarted(true);
        setIsRunning(true);
        Animated.timing(readyOpacity, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
        }).start(() => {
            setReadyVisible(false);
        });
    };

    if (modalShow) {
        return <ModalConfirmation onConfirm={closeModal} onCancel={keepGoing} />
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: getBgColor() }]}>
            <View style={styles.scrollContent}>

                {/* --- Session Header --- */}
                <View style={styles.sessionHeader}>
                    <TouchableOpacity onPress={triggerDB}><Text style={[styles.title, isStarted && { color: 'white' }]}>Deep Restoration</Text></TouchableOpacity>
                    <Text style={[styles.subtitle, isStarted && { color: 'rgba(255,255,255,0.8)' }]}>
                        Coherent breathing for nervous system balance
                    </Text>
                </View>

                {/* --- Central Breathing Interface --- */}
                <View style={styles.visualizerContainer}>
                    <View style={styles.bgGlow} />

                    <View style={styles.mainInterface}>
                        <View style={styles.outerRing} />

                        <Animated.View style={[styles.breatheCoreWrapper, { transform: [{ scale: breatheAnim }] }]}>
                            <LinearGradient
                                colors={[THEME.colors.primary, THEME.colors.primaryContainer]}
                                style={styles.breatheCore}
                            >
                                <Text style={[styles.phaseText, { color: '#eae2b4ff' }]}>
                                    {isStarted ? phase : "GO"}
                                </Text>
                                <Text style={[styles.timerText, { color: '#FFF9C4' }]}>
                                    {isStarted ? `${phaseCountdown} ` : `${Math.round(sessionDuration / 60)} Min Session`}
                                </Text>
                            </LinearGradient>
                        </Animated.View>
                    </View>
                </View>

                {/* --- Progress Section --- */}
                <View style={styles.progressWrapper}>
                    <Text style={[styles.progressLabel, isStarted && { color: 'white' }]}>Session Progress</Text>
                    <View style={styles.progressBarContainer}>
                        <View style={[styles.progressBarFill, { width: `${progress}%` }, isStarted && { backgroundColor: 'white' }]} />
                    </View>
                    <Text style={[styles.progressText, isStarted && { color: 'white' }]}>{displaySeconds} / {durationSecs} sec</Text>
                </View>

                {isStarted && (
                    <TouchableOpacity style={styles.stopBtn} onPress={stopSession}>
                        <Text style={styles.stopBtnText}>Stop Session</Text>
                    </TouchableOpacity>
                )}
            </View>


            {readyVisible &&
                <ModalInformation
                    title='Are you ready to center?'
                    description={`Find a comfortable sitting position, relax your shoulders, and prepare for ${durationSecs} seconds of deep conscious breathing.`}
                    primaryButtonDetails={{ text: 'Begin Breathing Session', onPress: handleStartSession }}
                    secondaryButtonDetails={fromCheckIn ? { text: 'Skip for now', onPress: () => navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'MainTabs' }] })) } : { text: 'Go back', onPress: navigation.goBack }}
                    optionalStyle={{ opacity: readyOpacity }}
                />

            }

            {isCompleted && isStarted && progress >= 100 && <ConfettiBurst />}
            {isCompleted && isStarted && progress >= 100 &&
                <ModalInformation
                    title='You completed the session!'
                    description="Great job! You ve completed your breathing session. Take a moment to notice how you feel and carry this calmness with you throughout the day."
                    primaryButtonDetails={{ text: 'Go Home', onPress: redirectToHome }}
                />
            }
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: THEME.colors.background },
    scrollContent: { paddingBottom: 100 },
    sessionHeader: { alignItems: 'center', marginTop: 24, marginBottom: 40, paddingHorizontal: 24 },
    title: { fontSize: 32, fontWeight: '800', color: THEME.colors.secondary, textAlign: 'center' },
    subtitle: { color: THEME.colors.onSurfaceVariant, marginTop: 8, textAlign: 'center', lineHeight: 20 },
    progressWrapper: { marginTop: 20, paddingHorizontal: 24, gap: 8 },
    progressLabel: { fontSize: 12, color: THEME.colors.secondary, fontWeight: '600' },
    progressBarContainer: { width: '100%', height: 10, borderRadius: 5, backgroundColor: 'rgba(0,0,0,0.06)', overflow: 'hidden' },
    progressBarFill: { height: '100%', backgroundColor: THEME.colors.primary },
    progressText: { fontSize: 12, color: THEME.colors.secondary, marginTop: 4, textAlign: 'right' },
    stopBtn: { marginTop: 24, marginHorizontal: 24, paddingVertical: 12, borderRadius: 28, backgroundColor: 'white', alignItems: 'center', height: 60, justifyContent: 'center', ...THEME.shadows.editorial },
    stopBtnText: { color: 'black', fontWeight: '800', letterSpacing: 0.5 },
    visualizerContainer: { height: 360, justifyContent: 'center', alignItems: 'center' },
    bgGlow: { position: 'absolute', width: 340, height: 340, backgroundColor: THEME.colors.primary + '08', borderRadius: 170 },
    mainInterface: { width: 300, height: 300, justifyContent: 'center', alignItems: 'center' },
    outerRing: { position: 'absolute', width: '100%', height: '100%', borderRadius: 150, borderWidth: 2, borderColor: THEME.colors.primaryContainer, opacity: 0.2 },
    breatheCoreWrapper: { width: 220, height: 220, borderRadius: 110, ...THEME.shadows.editorial },
    breatheCore: { flex: 1, borderRadius: 110, justifyContent: 'center', alignItems: 'center' },
    phaseText: { color: 'white', fontSize: 30, fontWeight: '900', letterSpacing: 4, textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 6 },
    timerText: { color: 'white', opacity: 0.9, fontSize: 16, fontWeight: '700', marginTop: 6, textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 6 },


    startCheckInBtn: { backgroundColor: THEME.colors.primary, paddingVertical: 16, paddingHorizontal: 36, borderRadius: 28, ...THEME.shadows.editorial },
    startCheckInBtnText: { color: 'white', fontWeight: '800', fontSize: 16 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(2,6,23,0.5)', justifyContent: 'center', alignItems: 'center', padding: 24 },
    modalContainer: { width: '100%', maxWidth: 420, backgroundColor: '#fff', borderRadius: 14, padding: 20 },
    modalTitle: { fontSize: 18, fontWeight: '800', marginBottom: 8, color: THEME.colors.onSurface },
    modalMessage: { fontSize: 14, color: THEME.colors.onSurfaceVariant, marginBottom: 18 },
    modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
    modalButton: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10 },
    modalButtonText: { fontSize: 15, fontWeight: '800' }
});

export default BreathingSessionScreen;