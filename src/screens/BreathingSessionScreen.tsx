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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { THEME } from '../theme';
import ModalCompleteScreen from '../compoments/ModalComplete';
import ModalConfirmation from '../compoments/ModalConfirmation';
import { useStore } from '../store/useStore';

const { width } = Dimensions.get('window');

const BreathingSessionScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const breathingType = (route.params as { breathingType?: string })?.breathingType ?? 'coherent';
    const fromCheckIn = (route.params as { fromCheckIn?: boolean })?.fromCheckIn ?? false;
    const passedDuration = (route.params as { duration?: number })?.duration;

    const durationMap: Record<string, number> = { coherent: 180, sleep: 240, focus: 120 };
    const sessionDuration = passedDuration ?? (durationMap[breathingType] ?? 180);

    const [isStarted, setIsStarted] = useState(!fromCheckIn);
    const [isRunning, setIsRunning] = useState(!fromCheckIn);

    const [phase, setPhase] = useState('INHALE');
    const [durationSecs] = useState(sessionDuration);
    const [progress, setProgress] = useState(0);

    const breatheAnim = useRef(new Animated.Value(1)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const bgAnim = useRef(new Animated.Value(0)).current;
    const bgAnimStarted = useRef(false);
    const [bgAnimValue, setBgAnimValue] = useState(0);
    const [modalShow, setModalShow] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const lastAnimValue = useRef(1);

    useEffect(() => {
        if (!isStarted) return;

        const listenerId = breatheAnim.addListener(({ value }) => {
            if (value > lastAnimValue.current + 0.001) {
                setPhase('INHALE');
            } else if (value < lastAnimValue.current - 0.001) {
                setPhase('EXHALE');
            }
            lastAnimValue.current = value;
        });

        if (isRunning && !bgAnimStarted.current) {
            bgAnimStarted.current = true;
            Animated.timing(bgAnim, {
                toValue: 1,
                duration: 4000,
                easing: Easing.linear,
                useNativeDriver: false,
            }).start();

            bgAnim.addListener(({ value }) => {
                setBgAnimValue(value);
            });
        }

        const runBreathing = () => {
            if (!isRunning) return;
            setPhase('INHALE');

            Animated.timing(breatheAnim, {
                toValue: 1.2,
                duration: 4000,
                easing: Easing.inOut(Easing.sin),
                useNativeDriver: true,
            }).start(({ finished }) => {
                if (finished && isRunning) {
                    Animated.delay(500).start(() => {
                        if (!isRunning) return;
                        setPhase('EXHALE');

                        Animated.timing(breatheAnim, {
                            toValue: 1,
                            duration: 4000,
                            easing: Easing.inOut(Easing.sin),
                            useNativeDriver: true,
                        }).start(({ finished: f }) => {
                            if (f && isRunning) runBreathing();
                        });
                    });
                }
            });
        };

        if (isRunning) {
            runBreathing();
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, { toValue: 1.05, duration: 1500, useNativeDriver: true }),
                    Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
                ])
            ).start();
        } else {
            breatheAnim.stopAnimation();
            pulseAnim.stopAnimation();
        }

        return () => {
            breatheAnim.removeListener(listenerId);
            breatheAnim.stopAnimation();
            pulseAnim.stopAnimation();
        };
    }, [isRunning, isStarted]);

    // Finišo sekimas (suveikia TIK jei sąžiningai pabaigia kvėpuoti)
    useEffect(() => {
        if (progress >= 100) {
            setIsRunning(false);
            breatheAnim.stopAnimation();
            pulseAnim.stopAnimation();

            // 🎁 BONUSAS: Kadangi atlaikė visą sesiją, įpilam +5 taškus
            if (fromCheckIn) {
                useStore.setState((state: any) => ({
                    score: (state.score || 0) + 5
                }));
            }

            setIsCompleted(true);
        }
    }, [progress]);

    // Laikmačio useEffect
    useEffect(() => {
        if (!isRunning || progress >= 100) return;

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
    }, [isRunning, durationSecs, progress]);

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
        (navigation as any).navigate('MainTabs', { screen: 'Home' });
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
    };

    if (modalShow) {
        return <ModalConfirmation onConfirm={closeModal} onCancel={keepGoing} />
    }

    // 🌟 Jei isCompleted tampa true – išpina tavo pabaigos modalą!
    if (isCompleted) {
        return <ModalCompleteScreen onClose={redirectToHome} />
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: getBgColor() }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* --- Session Header --- */}
                <View style={styles.sessionHeader}>
                    <Text style={[styles.title, isStarted && { color: 'white' }]}>Deep Restoration</Text>
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
                                    {isStarted ? phase : "READY"}
                                </Text>
                                <Text style={[styles.timerText, { color: '#FFF9C4' }]}>
                                    {isStarted ? "4 Seconds" : "1 Min Session"}
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
            </ScrollView>

            {/* Ready Overlay */}
            {!isStarted && (
                <View style={styles.readyOverlay}>
                    <Text style={styles.readyTitle}>Are you ready to center?</Text>
                    <Text style={styles.readySub}>
                        Find a comfortable sitting position, relax your shoulders, and prepare for 1 minute of deep conscious breathing.
                    </Text>
                    <TouchableOpacity style={styles.startCheckInBtn} onPress={handleStartSession}>
                        <Text style={styles.startCheckInBtnText}>Begin Breathing Session</Text>
                    </TouchableOpacity>

                    {/* 🌟 PAKEISTA: Paspaudus Skip, tiesiog įjungiam isCompleted būseną! */}
                    {/* Tai iškart iššauks ModalCompleteScreen be papildomų taškų įpylimo */}
                    <TouchableOpacity style={{ marginTop: 20 }} onPress={() => setIsCompleted(true)}>
                        <Text style={{ color: THEME.colors.primary, fontWeight: '700' }}>Skip for now</Text>
                    </TouchableOpacity>
                </View>
            )}
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
    timerText: { color: 'white', opacity: 0.9, fontSize: 12, fontWeight: '700', marginTop: 6, textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 6 },
    readyOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: THEME.colors.background, justifyContent: 'center', alignItems: 'center', padding: 32, zIndex: 999 },
    readyTitle: { fontSize: 28, fontWeight: '900', fontStyle: 'italic', color: THEME.colors.onSurface, marginBottom: 12, textAlign: 'center' },
    readySub: { fontSize: 15, color: THEME.colors.onSurfaceVariant, textAlign: 'center', marginBottom: 36, lineHeight: 24 },
    startCheckInBtn: { backgroundColor: THEME.colors.primary, paddingVertical: 16, paddingHorizontal: 36, borderRadius: 28, ...THEME.shadows.editorial },
    startCheckInBtnText: { color: 'white', fontWeight: '800', fontSize: 16 }
});

export default BreathingSessionScreen;