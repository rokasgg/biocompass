import React, { useEffect, useRef, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Animated,
    Easing,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { THEME } from '../theme';
import ModalCompleteScreen from '../compoments/ModalComplete';
import ModalConfirmation from '../compoments/ModalConfirmation';

const { width } = Dimensions.get('window');

const BreathingSessionScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const breathingType = (route.params as { breathingType?: string })?.breathingType ?? 'coherent';
    const durationMap: Record<string, number> = { coherent: 180, sleep: 240, focus: 120 };
    const sessionDuration = durationMap[breathingType] ?? 180;

    const [phase, setPhase] = useState('INHALE');
    const [durationSecs] = useState(sessionDuration);
    const [progress, setProgress] = useState(0);
    const [isRunning, setIsRunning] = useState(true);
    const breatheAnim = useRef(new Animated.Value(1)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const bgAnim = useRef(new Animated.Value(0)).current;
    const bgAnimStarted = useRef(false);
    const [bgAnimValue, setBgAnimValue] = useState(0);
    const [modalShow, setModalShow] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const lastAnimValue = useRef(1);

    useEffect(() => {
        // 1. PHASE LISTENER su krypties sekimu
        const listenerId = breatheAnim.addListener(({ value }) => {
            if (value > lastAnimValue.current + 0.001) {
                setPhase('INHALE');
            } else if (value < lastAnimValue.current - 0.001) {
                setPhase('EXHALE');
            }
            lastAnimValue.current = value;
        });

        // 2. BACKGROUND ANIMATION
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

        // 3. BREATHING LOGIC
        const runBreathing = () => {
            if (!isRunning) return;

            // 1. Iškart keičiame tekstą prieš pat animaciją
            setPhase('INHALE');

            Animated.timing(breatheAnim, {
                toValue: 1.2,
                duration: 4000,
                easing: Easing.inOut(Easing.sin),
                useNativeDriver: true,
            }).start(({ finished }) => {
                // Tikriname, ar animacija baigėsi natūraliai (nebuvo sustabdyta)
                if (finished && isRunning) {

                    // 2. "HOLD" fazė (jei nori, gali čia uždėti setPhase('HOLD'))
                    Animated.delay(500).start(() => {
                        if (!isRunning) return;

                        // 3. Iškart keičiame į EXHALE ir pradedame trauktis
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
    }, [isRunning]);

    useEffect(() => {
        if (progress >= 100) {
            // 1. Sustabdom visas animacijas ir laikmačius
            setIsRunning(false);
            breatheAnim.stopAnimation();
            pulseAnim.stopAnimation();

            // 2. Parodom pabaigos modalą
            setIsCompleted(true);
        }
    }, [progress]);

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

    // Smooth background color transition using animated value
    const bgProgress = bgAnimValue;

    const getBgColor = () => {
        const lightR = 249, lightG = 250, lightB = 246;  // THEME.colors.background
        const darkR = 15, darkG = 15, darkB = 23;        // Very dark
        const r = Math.round(lightR - (lightR - darkR) * bgProgress);
        const g = Math.round(lightG - (lightG - darkG) * bgProgress);
        const b = Math.round(lightB - (lightB - darkB) * bgProgress);
        return `rgb(${r}, ${g}, ${b})`;
    };

    const closeModal = () => {
        setModalShow(false);
        navigation.goBack();
    }

    const stopSession = () => {
        setIsRunning(false);
        setModalShow(true);
    }

    const keepGoing = () => {
        setIsRunning(true);
        setModalShow(false);
    }

    if (modalShow) {
        return <ModalConfirmation onConfirm={closeModal} onCancel={keepGoing} />
    }
    if (isCompleted) {
        return <ModalCompleteScreen />
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: getBgColor() }]}>
            {/* --- Top Bar --- */}
            <View style={styles.scrollContent}>
                <View style={styles.sessionHeader}>
                    <Text style={[styles.title, { color: 'white' }]}>Deep Restoration</Text>
                    <Text style={[styles.subtitle, { color: 'rgba(255,255,255,0.8)' }]}>Coherent breathing for nervous system balance</Text>
                </View>

                {/* --- Central Breathing Interface --- */}
                <View style={styles.visualizerContainer}>
                    <View style={styles.bgGlow} />

                    <View style={styles.mainInterface}>
                        {/* Outer Static Ring */}
                        <View style={styles.outerRing} />

                        {/* Animated Core */}
                        <Animated.View style={[styles.breatheCoreWrapper, { transform: [{ scale: breatheAnim }] }]}>
                            <LinearGradient
                                colors={[THEME.colors.primary, THEME.colors.primaryContainer]}
                                style={styles.breatheCore}
                            >
                                <Text style={[styles.phaseText, { color: '#eae2b4ff' }]}>{phase}</Text>
                                <Text style={[styles.timerText, { color: '#FFF9C4' }]}>4 Seconds</Text>
                            </LinearGradient>
                        </Animated.View>
                    </View>
                </View>

                <View style={styles.progressWrapper}>
                    <Text style={styles.progressLabel}>Session Progress</Text>
                    <View style={styles.progressBarContainer}>
                        <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
                    </View>
                    <Text style={styles.progressText}>{displaySeconds} / {durationSecs} sec</Text>
                </View>

                <TouchableOpacity style={styles.stopBtn} onPress={stopSession}>
                    <Text style={styles.stopBtnText}>Stop Session</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: THEME.colors.background },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, height: 64 },
    scrollContent: { paddingBottom: 100 },
    sessionHeader: { alignItems: 'center', marginTop: 24, marginBottom: 40 },
    title: { fontSize: 32, fontWeight: '800', color: THEME.colors.secondary, fontFamily: 'Plus Jakarta Sans' },
    subtitle: { color: THEME.colors.onSurfaceVariant, marginTop: 4 },

    progressWrapper: { marginTop: 20, paddingHorizontal: 24, gap: 8 },
    progressLabel: { fontSize: 12, color: 'white', fontWeight: '600' },
    progressBarContainer: { width: '100%', height: 10, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.2)', overflow: 'hidden' },
    progressBarFill: { height: '100%', backgroundColor: 'white' },
    progressText: { fontSize: 12, color: 'white', marginTop: 4, textAlign: 'right' },

    stopBtn: { marginTop: 14, marginHorizontal: 24, paddingVertical: 12, borderRadius: 28, backgroundColor: 'white', alignItems: 'center', height: 60, justifyContent: 'center' },
    stopBtnText: { color: 'black', fontWeight: '800', letterSpacing: 0.5 },

    visualizerContainer: { height: 400, justifyContent: 'center', alignItems: 'center' },

    bgGlow: { position: 'absolute', width: 400, height: 400, backgroundColor: THEME.colors.primary + '10', borderRadius: 200 },
    mainInterface: { width: 320, height: 320, justifyContent: 'center', alignItems: 'center' },
    outerRing: { position: 'absolute', width: '100%', height: '100%', borderRadius: 160, borderWidth: 2, borderColor: THEME.colors.primaryContainer, opacity: 0.3 },

    breatheCoreWrapper: { width: 240, height: 240, borderRadius: 120, ...THEME.shadows.editorial },
    breatheCore: { flex: 1, borderRadius: 120, justifyContent: 'center', alignItems: 'center' },

    phaseText: { color: 'white', fontSize: 32, fontWeight: '900', letterSpacing: 4, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10 },
    timerText: { color: 'white', opacity: 0.9, fontSize: 12, fontWeight: '700', marginTop: 8, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10 },


    activeFilter: { backgroundColor: THEME.colors.primary },
    activeFilterText: { color: 'white', fontWeight: '700' },
    filterText: { color: THEME.colors.onSurfaceVariant, fontWeight: '600' },

});

export default BreathingSessionScreen;