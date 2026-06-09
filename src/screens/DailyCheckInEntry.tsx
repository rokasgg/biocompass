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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { THEME } from '../theme';
import BioLoader from '../compoments/BioLoader';
import Slider from '@react-native-community/slider';
import { useStore } from '../store/useStore';

const { width } = Dimensions.get('window');

const DailyCheckInEntry = () => {
    const navigation = navigation || useNavigation();
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

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 400);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        dropAnim.setValue(-30);
        Animated.timing(dropAnim, {
            toValue: 0,
            duration: 300,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
        }).start();
    }, [step]);

    if (isLoading) return <BioLoader />;

    // Dinamiškai nustatom maksimalų žingsnių skaičių pagal fazę
    const maxSteps = currentPhase === 'morning' ? 2 : 3;

    // --- SUBMIT LOGIKA ---
    const handleSubmitCheckIn = () => {
        let pointsEarned = 0;
        const globalStore = useStore.getState() as any;

        if (currentPhase === 'morning') {
            pointsEarned += 15; // Miego bonusas fone
            if (drankWater) pointsEarned += 5;
            if (meditated) pointsEarned += 10;
            if (paidCompliment) pointsEarned += 5;

            if (globalStore.completeMorningCheckIn) globalStore.completeMorningCheckIn();
        } else {
            pointsEarned += 15; // Žingsnių bonusas fone
            if (noSugar) pointsEarned += 10;
            if (stretched) pointsEarned += 10;
            if (hitGym) pointsEarned += 15;

            if (screenHours <= 2) pointsEarned += 15;
            else if (screenHours > 5) pointsEarned -= 20;

            if (globalStore.updateScreenTime) {
                globalStore.updateScreenTime(Math.round(screenHours * 60));
            }

            if (globalStore.completeEveningCheckIn) globalStore.completeEveningCheckIn();
        }

        // Įrašom taškus
        useStore.setState((state: any) => ({
            score: (state.score || 0) + pointsEarned
        }));

        const targetBreathingType = currentPhase === 'morning' ? 'focus' : 'sleep';

        // Keliaujam į kvėpavimą
        (navigation as any).replace('BreathingSession', {
            duration: 60,
            fromCheckIn: true,
            breathingType: targetBreathingType
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backArrow}>← Back</Text>
                </TouchableOpacity>

                <Animated.View style={{ transform: [{ translateY: dropAnim }], opacity: dropAnim.interpolate({ inputRange: [-30, 0], outputRange: [0, 1] }) }}>

                    {/* ========================================== */}
                    {/* ☀️ RYTO ANKETOS ŽINGSNIAI                  */}
                    {/* ========================================== */}
                    {currentPhase === 'morning' && (
                        <View>
                            {/* Žingsnis 0: INTRO */}
                            {step === 0 && (
                                <View style={styles.card}>
                                    <Text style={styles.overline}>DAILY RITUAL</Text>
                                    <Text style={styles.title}>Morning Check-in ☀️</Text>
                                    <Text style={styles.subtitle}>
                                        Welcome to your morning alignment. Take a deep breath. We will quickly prime your focus, sync your sleep metrics, and unlock your daily potential.
                                    </Text>
                                    <View style={styles.introBadge}>
                                        <Text style={styles.introBadgeText}>⚡ Sleep sync bonus already waiting for you</Text>
                                    </View>
                                </View>
                            )}

                            {step === 1 && (
                                <View style={styles.card}>
                                    <Text style={styles.overline}>STEP 1 OF 2</Text>
                                    <Text style={styles.title}>Set Your Intent</Text>
                                    <Text style={styles.subtitle}>What is your main focus or absolute win for today?</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder="Write down your focus..."
                                        placeholderTextColor="#94A3B8"
                                        value={todayFocus}
                                        onChangeText={setTodayFocus}
                                        multiline
                                    />
                                </View>
                            )}

                            {step === 2 && (
                                <View style={styles.card}>
                                    <Text style={styles.overline}>STEP 2 OF 2</Text>
                                    <Text style={styles.title}>Morning Habits 💧</Text>
                                    <Text style={styles.subtitle}>Check items you have already unlocked this morning:</Text>
                                    <View style={styles.checkboxContainer}>
                                        <TouchableOpacity style={[styles.checkboxRow, drankWater && styles.checkboxActive]} onPress={() => setDrankWater(!drankWater)}>
                                            <Text style={styles.checkboxText}>{drankWater ? "✅" : "⬜"} Drank a fresh glass of water (+5 pts)</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.checkboxRow, meditated && styles.checkboxActive]} onPress={() => setMeditated(!meditated)}>
                                            <Text style={styles.checkboxText}>{meditated ? "✅" : "⬜"} Spent time meditating (+10 pts)</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.checkboxRow, paidCompliment && styles.checkboxActive]} onPress={() => setPaidCompliment(!paidCompliment)}>
                                            <Text style={styles.checkboxText}>{paidCompliment ? "✅" : "⬜"} Planned/paid a warm compliment (+5 pts)</Text>
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
                                    <Text style={styles.title}>Digital Fatigue 🧠</Text>
                                    <Text style={styles.subtitle}>How is your brain feeling after today's total scrolling and digital exposure?</Text>
                                    <View style={{ marginTop: 20 }}>
                                        <View style={styles.emojiRow}>
                                            {['🧠☠️', '😵', '😕', '🙂', '🧘‍♂️'].map((emoji, idx) => (
                                                <TouchableOpacity key={idx} style={[styles.emojiBtn, emojiIndex === idx && styles.emojiSelected]} onPress={() => setEmojiIndex(idx)}>
                                                    <Text style={styles.emojiText}>{emoji}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                        <Text style={styles.emojiExplainer}>
                                            {emojiIndex === 0 ? "Completely fried..." : emojiIndex === 4 ? "Peaceful & controlled" : "Select a state"}
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
                                            <Text style={styles.checkboxText}>{noSugar ? "✅" : "⬜"} Avoided added sugar (+10 pts)</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.checkboxRow, stretched && styles.checkboxActive]} onPress={() => setStretched(!stretched)}>
                                            <Text style={styles.checkboxText}>{stretched ? "✅" : "⬜"} Done body stretching (+10 pts)</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.checkboxRow, hitGym && styles.checkboxActive]} onPress={() => setHitGym(!hitGym)}>
                                            <Text style={styles.checkboxText}>{hitGym ? "✅" : "⬜"} Hit the gym / intense workout (+15 pts)</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        </View>
                    )}

                </Animated.View>
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
                            {currentPhase === 'morning' ? "Save & Start Morning Breath ☀️" : "Save & Start Evening Breath 🌙"}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
};

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
    checkboxRow: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', padding: 16, borderRadius: 16 },
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
});

export default DailyCheckInEntry;