import React, { useEffect, useState, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Platform,
    Linking,
    TextInput,
    Animated,
    Easing,
    Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { THEME } from '../theme';
import BioLoader from '../compoments/BioLoader';
import Slider from '@react-native-community/slider';
import { useStore } from '../store/useStore';
import Check from '../../assets/icons/Check';
import { checkInService } from '@backend/services/checkInService';
import { supabase } from '@backend/supabase';
import { useStatisticsForQuantity, requestAuthorization } from '@kingstinct/react-native-healthkit';
import Face1 from '../../assets/icons/face1.svg';
import Face2 from '../../assets/icons/face2.svg';
import Face3 from '../../assets/icons/face3.svg';
import Face4 from '../../assets/icons/face4.svg';
import Face5 from '../../assets/icons/face5.svg';

import {
    EyeIcon,
} from '../../assets/icons';


const { width } = Dimensions.get('window');

const DailyCheckInEntry = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const phaseParam = (route.params as any)?.phase;
    const currentPhase = phaseParam || (new Date().getHours() >= 6 && new Date().getHours() < 17 ? 'morning' : 'evening');

    const [isLoading, setIsLoading] = useState(true);
    const [step, setStep] = useState<number>(0);

    // --- STATE'AI ---
    const [todayFocus, setTodayFocus] = useState('');
    const [drankWater, setDrankWater] = useState(false);
    const [meditated, setMeditated] = useState(false);
    const [paidCompliment, setPaidCompliment] = useState(false);

    const [screenHours, setScreenHours] = useState<number>(2);
    const [emojiIndex, setEmojiIndex] = useState<number | null>(null);
    const [noSugar, setNoSugar] = useState(false);
    const [stretched, setStretched] = useState(false);
    const [hitGym, setHitGym] = useState(false);

    const dropAnim = useRef(new Animated.Value(0)).current;
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        requestAuthorization({ toRead: ['HKQuantityTypeIdentifierStepCount'] } as any).catch(() => {});
    }, []);

    const now = new Date();
    const startOfDay = new Date(now); startOfDay.setHours(0, 0, 0, 0);
    const stepStats = useStatisticsForQuantity('HKQuantityTypeIdentifierStepCount', ['cumulativeSum'], startOfDay, now);
    const todaySteps = stepStats?.sumQuantity?.quantity ? Math.round(stepStats.sumQuantity.quantity) : 0;

    // --- Morning Check-In State ---
    const [path, setPath] = useState('');
    const [manifestation, setManifestation] = useState('');

    const handleBackPress = () => {
        if (step > 1) setStep((s) => s - 1);
        else setShowConfirm(true);
    };

    const confirmLeave = () => {
        setShowConfirm(false);
        (navigation as any).goBack();
    };

    const cancelLeave = () => setShowConfirm(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 400);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        navigation.setOptions({ gestureEnabled: step === 0 });
    }, [step, navigation]);

    useEffect(() => {
        dropAnim.setValue(-30);
        Animated.timing(dropAnim, {
            toValue: 0,
            duration: 300,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
        }).start();
    }, [step]);

    if (isLoading) return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <BioLoader />
            </View>
        </SafeAreaView>
    );

    // Dinamiškai nustatom maksimalų žingsnių skaičių pagal fazę
    const maxSteps = currentPhase === 'morning' ? 3 : 3;

    // --- SUBMIT LOGIKA ---

    const handleSubmitCheckIn = async () => {
        console.log('Fire123')
        setIsLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Vartotojas nerastas");

            // Formuojame objektą pagal tai, kokioje fazėje esame
            const payload = currentPhase === 'morning' ? {
                morning_focus: manifestation,
                drank_water: drankWater,
                meditated: meditated,
                paid_compliment: paidCompliment,
                morning_theme: path,
                morning_completed: true,
                steps: todaySteps,
            } : {
                screen_hours: screenHours,
                digital_fatigue: emojiIndex,
                no_sugar: noSugar,
                stretched: stretched,
                hit_gym: hitGym,
                evening_completed: true,
                steps: todaySteps,
            };

            // Siunčiame į servisą
            await checkInService.submitDailyMetrics(user.id, payload);

            // Viskas pavyko, einame toliau
            navigation.replace('BreathingSession', {
                duration: 60,
                fromCheckIn: true,
                breathingType: currentPhase === 'morning' ? 'focus' : 'sleep'
            });

        } catch (err) {
            console.error("Check-in klaida:", err);
            alert("Nepavyko išsaugoti. Bandyk dar kartą.");
        } finally {
            setIsLoading(false);
        }
    };

    const onSelect = (selectedPath: string) => {
        setPath(selectedPath);
    }



    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                    <Text style={styles.backArrow}>← Back</Text>
                </TouchableOpacity>

                <Animated.View style={{ transform: [{ translateY: dropAnim }], opacity: dropAnim.interpolate({ inputRange: [-30, 0], outputRange: [0, 1] }) }}>

                    {/* ========================================== */}
                    {/* RYTO ANKETOS ŽINGSNIAI                  */}
                    {/* ========================================== */}
                    {currentPhase === 'morning' && (
                        <View>
                            {/* Žingsnis 0: INTRO */}
                            {step === 0 && (
                                <View style={styles.card}>
                                    <Text style={styles.overline}>DAILY RITUAL</Text>
                                    <Text style={styles.title}>Morning Check-in</Text>
                                    <Text style={styles.subtitle}>
                                        Welcome to your morning alignment. Take a deep breath. We will quickly prime your focus, sync your sleep metrics, and unlock your daily potential.
                                    </Text>
                                    <View style={styles.introBadge}>
                                        <Text style={styles.introBadgeText}>⚡ Sleep sync bonus already waiting for you</Text>
                                    </View>
                                </View>
                            )}
                            {step === 1 && (
                                <View style={styles.step}>
                                    <Text style={styles.overline}>STEP 01 — FOCUS</Text>
                                    <Text style={styles.title}>What is your focus today?</Text>
                                    <Text style={styles.subtitle}>Select an intention to guide your morning ritual.</Text>

                                    <View style={styles.grid}>
                                        <PathCard
                                            title="Abundance"
                                            sub="Cultivate a mindset of prosperity."
                                            // icon={PaymentsIcon}
                                            color={THEME.colors.primaryContainer}
                                            onPress={() => onSelect('Abundance')}
                                            selected={path === 'Abundance'}
                                        />
                                        <PathCard
                                            title="Inner Peace"
                                            sub="Silence the noise and find stillness."
                                            // icon={SelfImprovementIcon}
                                            color={THEME.colors.secondary}
                                            onPress={() => onSelect('Inner Peace')}
                                            selected={path === 'Inner Peace'}
                                        />
                                        <PathCard
                                            title="Physical Vitality"
                                            sub="Energize your body and soul."
                                            // icon={BoltIcon}
                                            color={THEME.colors.tertiary}
                                            onPress={() => onSelect('Physical Vitality')}
                                            selected={path === 'Physical Vitality'}
                                        />
                                    </View>
                                </View>
                            )}

                            {step === 2 && (
                                <View style={styles.step}>
                                    <Text style={styles.overline}>STEP 02 — MANIFEST</Text>
                                    <Text style={styles.title}>What are you calling in today?</Text>

                                    <View style={styles.inputContainer}>
                                        <EyeIcon width={40} fill={THEME.colors.primary} opacity={0.1} style={styles.quoteIcon} />
                                        <Text style={styles.inputLabel}>I am manifesting...</Text>
                                        <TextInput
                                            multiline
                                            style={styles.textArea}
                                            placeholder="Speak it as if it is already yours..."
                                            placeholderTextColor={THEME.colors.outlineVariant}
                                            value={manifestation}
                                            onChangeText={setManifestation}
                                        />
                                    </View>
                                </View>
                            )}

                            {step === 3 && (
                                <View style={styles.card}>
                                    <Text style={styles.overline}>STEP 3 OF 3</Text>
                                    <Text style={styles.title}>Morning Habits</Text>
                                    <Text style={styles.subtitle}>Check items you have already unlocked this morning:</Text>
                                    <View style={styles.checkboxContainer}>
                                        <TouchableOpacity style={[styles.checkboxRow, drankWater && styles.checkboxActive]} onPress={() => setDrankWater(!drankWater)}>
                                            <Check width={18} height={18} color={drankWater ? THEME.colors.primary : '#7e8085ff'} />
                                            <Text style={[styles.checkboxText, { marginLeft: 12 }]}>Drank a fresh glass of water (+5 pts)</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.checkboxRow, meditated && styles.checkboxActive]} onPress={() => setMeditated(!meditated)}>
                                            <Check width={18} height={18} color={meditated ? THEME.colors.primary : '#7e8085ff'} />
                                            <Text style={[styles.checkboxText, { marginLeft: 12 }]}>Spent time meditating (+10 pts)</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.checkboxRow, paidCompliment && styles.checkboxActive]} onPress={() => setPaidCompliment(!paidCompliment)}>
                                            <Check width={18} height={18} color={paidCompliment ? THEME.colors.primary : '#7e8085ff'} />
                                            <Text style={[styles.checkboxText, { marginLeft: 12 }]}>Planned/paid a warm compliment (+5 pts)</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        </View>
                    )}

                    {/* ========================================== */}
                    {/* 🌙 VAKARO ANKETOS ŽINGSNIAI                 */}
                    {/* ========================================== */}
                    {currentPhase === 'evening' && (
                        <View>
                            {/* Žingsnis 0: INTRO */}
                            {step === 0 && (
                                <View style={styles.card}>
                                    <Text style={styles.overline}>DAILY REFLECTION</Text>
                                    <Text style={styles.title}>Evening Review 🌙</Text>
                                    <Text style={styles.subtitle}>
                                        Time to decompress and summarize your day. We will evaluate your digital fatigue, track your physical habits, and prepare your mind for clean recovery.
                                    </Text>
                                    <View style={[styles.introBadge, { backgroundColor: '#8e44ad15' }]}>
                                        <Text style={[styles.introBadgeText, { color: '#8e44ad' }]}>🏃 Step count sync bonus waiting for you</Text>
                                    </View>
                                </View>
                            )}

                            {/* Žingsnis 1: SCREEN TIME */}
                            {step === 1 && (
                                <View style={styles.card}>
                                    <Text style={styles.overline}>STEP 1 OF 3</Text>
                                    <Text style={styles.title}>Screen Time 📱</Text>
                                    <Text style={styles.subtitle}>How many hours did you spend looking at the phone screen today?</Text>
                                    <View style={styles.sliderContainer}>
                                        <Text style={styles.sliderValue}>{screenHours.toFixed(1)} hours</Text>
                                        <Slider
                                            style={{ width: '100%', height: 40 }}
                                            minimumValue={0} maximumValue={12} step={0.5}
                                            minimumTrackTintColor={THEME.colors.primary}
                                            maximumTrackTintColor="#E2E8F0"
                                            thumbTintColor={THEME.colors.primary}
                                            value={screenHours}
                                            onValueChange={setScreenHours}
                                        />
                                        {Platform.OS === 'ios' && (
                                            <TouchableOpacity style={styles.linkButton} onPress={async () => {
                                                try { await Linking.openURL('App-Prefs:root=SCREEN_TIME'); } catch { Linking.openSettings(); }
                                            }}>
                                                <Text style={styles.linkButtonText}>🔗 Open Screen Time Settings</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            )}

                            {/* Žingsnis 2: IŠSKIRTA - DIGITAL FATIGUE */}
                            {step === 2 && (
                                <View style={styles.card}>
                                    <Text style={styles.overline}>STEP 2 OF 3</Text>
                                    <Text style={styles.title}>Digital Fatigue</Text>
                                    <Text style={styles.subtitle}>How is your brain feeling after today's total scrolling and digital exposure?</Text>
                                    <View style={{ marginTop: 20 }}>
                                        <View style={styles.emojiRow}>
                                            {[<Face5 width={35} height={35} />, <Face4 width={35} height={35} />, <Face3 width={35} height={35} />, <Face2 width={35} height={35} />, <Face1 width={35} height={35} />].map((emoji, idx) => (
                                                <TouchableOpacity key={idx} style={[styles.emojiBtn, emojiIndex === idx && styles.emojiSelected]} onPress={() => setEmojiIndex(idx)}>
                                                    {/* <Text style={styles.emojiText}>{emoji}</Text> */}
                                                    {typeof emoji === 'string' ? <Text style={styles.emojiText}>{emoji}</Text> : emoji}
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                        <Text style={styles.emojiExplainer}>
                                            {emojiIndex === 0 ? "Completely fried..." : emojiIndex === 4 ? "Peaceful & controlled" : emojiIndex === 1 ? "Overwhelmed & stressed" : emojiIndex === 2 ? "Neutral & okay" : emojiIndex === 3 ? "Relaxed & calm" : "Select an emoji to describe your mental state."}
                                        </Text>
                                    </View>
                                </View>
                            )}

                            {/* Žingsnis 3: IŠSKIRTA - EVENING HABITS */}
                            {step === 3 && (
                                <View style={styles.card}>
                                    <Text style={styles.overline}>STEP 3 OF 3</Text>
                                    <Text style={styles.title}>Evening Habits 🤸‍♂️</Text>
                                    <Text style={styles.subtitle}>Mark the healthy choices you managed to secure for your body today:</Text>
                                    <View style={styles.checkboxContainer}>
                                        <TouchableOpacity style={[styles.checkboxRow, noSugar && styles.checkboxActive]} onPress={() => setNoSugar(!noSugar)}>
                                            <Check width={18} height={18} color={noSugar ? THEME.colors.primary : '#7e8085ff'} />
                                            <Text style={[styles.checkboxText, { marginLeft: 12 }]}>Avoided added sugar (+10 pts)</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.checkboxRow, stretched && styles.checkboxActive]} onPress={() => setStretched(!stretched)}>
                                            <Check width={18} height={18} color={stretched ? THEME.colors.primary : '#7e8085ff'} />
                                            <Text style={[styles.checkboxText, { marginLeft: 12 }]}>Done body stretching (+10 pts)</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.checkboxRow, hitGym && styles.checkboxActive]} onPress={() => setHitGym(!hitGym)}>
                                            <Check width={18} height={18} color={hitGym ? THEME.colors.primary : '#7e8085ff'} />
                                            <Text style={[styles.checkboxText, { marginLeft: 12 }]}>Hit the gym / intense workout (+15 pts)</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        </View>
                    )}

                </Animated.View>
                <Modal visible={showConfirm} transparent animationType="fade" onRequestClose={cancelLeave}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Leave {currentPhase === 'morning' ? 'Morning' : 'Evening'} Check‑in?</Text>
                            <Text style={styles.modalMessage}>Are you sure you want to leave the {currentPhase} check‑in? Your progress will not be saved.</Text>
                            <View style={styles.modalButtons}>
                                <TouchableOpacity onPress={cancelLeave} style={[styles.modalButton, { backgroundColor: '#F1F5F9' }]}>
                                    <Text style={[styles.modalButtonText, { color: THEME.colors.onSurface }]}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={confirmLeave} style={[styles.modalButton, { backgroundColor: THEME.colors.primary }]}>
                                    <Text style={[styles.modalButtonText, { color: '#fff' }]}>Leave</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Fixed Footer */}
            <View style={styles.footer}>
                {step < maxSteps ? (
                    <TouchableOpacity style={styles.footerButton} onPress={() => setStep((s) => s + 1)}>
                        <Text style={styles.buttonText}>
                            {step === 0 ? "Let's Begin" : "Next Step"}
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.footerButton} onPress={handleSubmitCheckIn}>
                        <Text style={styles.buttonText}>
                            {currentPhase === 'morning' ? "Save & Start Morning Breath" : "Save & Start Evening Breath"}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
};
const PathCard = ({ title, sub, color, onPress, selected }) => (
    <TouchableOpacity style={[styles.pathCard, selected && { backgroundColor: THEME.colors.primary + '15' }]} onPress={onPress}>
        <View style={[styles.iconCircle, { backgroundColor: color }]}>
            {/* <Icon width={24} height={24} fill={THEME.colors.primary} /> */}
        </View>
        <View style={styles.cardText}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardSub}>{sub}</Text>
        </View>
        {/* <OpenArrow width={16} fill={THEME.colors.outlineVariant} /> */}
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: THEME.colors.background },
    scrollContent: { paddingHorizontal: 24, paddingTop: 10, paddingBottom: 120 },
    backButton: { paddingVertical: 10, alignSelf: 'flex-start', marginBottom: 10 },
    backArrow: { fontSize: 16, fontWeight: '700', color: THEME.colors.primary },
    card: { minHeight: 320 },
    overline: { fontSize: 11, fontWeight: '800', color: THEME.colors.primary, letterSpacing: 2, marginBottom: 6 },
    title: { fontSize: 32, fontWeight: '900', color: THEME.colors.onSurface, fontStyle: 'italic', marginBottom: 8 },
    subtitle: { fontSize: 15, color: THEME.colors.onSurfaceVariant, lineHeight: 22, marginBottom: 20 },
    textInput: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, padding: 16, fontSize: 16, color: THEME.colors.onSurface, minHeight: 120, textAlignVertical: 'top', marginTop: 10 },
    checkboxContainer: { gap: 10, marginTop: 10 },
    checkboxRow: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', padding: 16, borderRadius: 16, flexDirection: 'row', alignItems: 'center' },
    checkboxActive: { borderColor: THEME.colors.primary, backgroundColor: THEME.colors.primary + '08' },
    checkboxText: { fontSize: 14, fontWeight: '600', color: THEME.colors.onSurface },
    sliderContainer: { marginTop: 20, alignItems: 'center' },
    sliderValue: { fontSize: 36, fontWeight: '800', color: THEME.colors.primary, marginBottom: 10 },
    linkButton: { marginTop: 20, padding: 10 },
    linkButtonText: { color: THEME.colors.primary, fontWeight: '700', fontSize: 14 },
    emojiRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
    emojiBtn: { padding: 12, borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#F8FAFC', minWidth: 54, alignItems: 'center' },
    emojiSelected: { borderColor: THEME.colors.primary, backgroundColor: THEME.colors.primary + '15' },
    emojiText: { fontSize: 22 },
    footer: { position: 'absolute', left: 24, right: 24, bottom: Platform.OS === 'ios' ? 34 : 24 },
    footerButton: { backgroundColor: THEME.colors.primary, paddingVertical: 16, borderRadius: 28, alignItems: 'center', ...THEME.shadows.editorial },
    buttonText: { color: 'white', fontSize: 16, fontWeight: '800' },

    // Papildomi nauji stiliai
    introBadge: { backgroundColor: THEME.colors.primary + '12', padding: 14, borderRadius: 12, marginTop: 10 },
    introBadgeText: { color: THEME.colors.primary, fontWeight: '700', fontSize: 13, textAlign: 'center' },
    emojiExplainer: { textAlign: 'center', marginTop: 16, fontSize: 14, color: THEME.colors.onSurfaceVariant, fontWeight: '600' }
    ,
    modalOverlay: { flex: 1, backgroundColor: 'rgba(2,6,23,0.5)', justifyContent: 'center', alignItems: 'center', padding: 24 },
    modalContainer: { width: '100%', maxWidth: 420, backgroundColor: '#fff', borderRadius: 14, padding: 20 },
    modalTitle: { fontSize: 18, fontWeight: '800', marginBottom: 8, color: THEME.colors.onSurface },
    modalMessage: { fontSize: 14, color: THEME.colors.onSurfaceVariant, marginBottom: 18 },
    modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
    modalButton: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10 },
    modalButtonText: { fontSize: 15, fontWeight: '800' },


    // --- Morning Check-In Styles ---
    step: { width: '100%' },
    grid: { gap: 16 },



    // --- Step 1 styles ---
    pathCard: { backgroundColor: THEME.colors.background, borderRadius: 20, padding: 24, flexDirection: 'row', alignItems: 'center' },
    iconCircle: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    cardText: { flex: 1 },
    cardTitle: { fontSize: 20, fontWeight: '700', color: THEME.colors.onSurface },
    cardSub: { fontSize: 13, color: THEME.colors.onSurfaceVariant, marginTop: 4 },

    // --- Step 2 styles ---
    inputContainer: { backgroundColor: THEME.colors.surfaceContainerLow, borderRadius: 24, padding: 24, minHeight: 280, marginBottom: 40 },
    quoteIcon: { position: 'absolute', top: 20, left: 10 },
    inputLabel: { fontSize: 18, fontStyle: 'italic', color: THEME.colors.secondary, marginBottom: 16 },
    textArea: { fontSize: 22, fontWeight: '700', color: THEME.colors.onSurface, textAlignVertical: 'top', flex: 1 },
});

export default DailyCheckInEntry;