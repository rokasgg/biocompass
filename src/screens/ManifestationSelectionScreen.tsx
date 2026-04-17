import React, { useState, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Animated,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { THEME } from '../theme';
import {
    OpenArrow,
    EyeIcon,

} from '../../assets/icons';

const { width } = Dimensions.get('window');

const ManifestationSelectionScreen = ({ navigation }) => {
    const [step, setStep] = useState(1);
    const [path, setPath] = useState('');
    const [manifestation, setManifestation] = useState('');

    // Progress bar animacija
    const progress = useRef(new Animated.Value(0.33)).current;

    const animateProgress = (toValue) => {
        Animated.timing(progress, {
            toValue,
            duration: 600,
            useNativeDriver: false, // Negalima naudoti su width/flex
        }).start();
    };

    const nextStep = (selectedPath) => {
        if (step === 1) {
            setPath(selectedPath);
            setStep(2);
            animateProgress(0.66);
        } else if (step === 2) {
            setStep(3);
            animateProgress(1);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* --- Header --- */}
            <View style={styles.header}>

                {/* Progress Bar */}
                <View style={styles.progressBg}>
                    <Animated.View
                        style={[
                            styles.progressFill,
                            {
                                width: progress.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0%', '100%']
                                })
                            }
                        ]}
                    />
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* STEP 1: FOCUS SELECTION */}
                {step === 1 && (
                    <View style={styles.step}>
                        <Text style={styles.overline}>STEP 01 — INTENTION</Text>
                        <Text style={styles.title}>What is your focus today?</Text>
                        <Text style={styles.subtitle}>Select an intention to guide your morning ritual.</Text>

                        <View style={styles.grid}>
                            <PathCard
                                title="Abundance"
                                sub="Cultivate a mindset of prosperity."
                                // icon={PaymentsIcon}
                                color={THEME.colors.primaryContainer}
                                onPress={() => nextStep('Abundance')}
                            />
                            <PathCard
                                title="Inner Peace"
                                sub="Silence the noise and find stillness."
                                // icon={SelfImprovementIcon}
                                color={THEME.colors.secondary}
                                onPress={() => nextStep('Inner Peace')}
                            />
                            <PathCard
                                title="Physical Vitality"
                                sub="Energize your body and soul."
                                // icon={BoltIcon}
                                color={THEME.colors.tertiary}
                                onPress={() => nextStep('Physical Vitality')}
                            />
                        </View>
                    </View>
                )}

                {/* STEP 2: INPUT */}
                {step === 2 && (
                    <View style={styles.step}>
                        <Text style={styles.overline}>STEP 02 — INTENTIONS</Text>
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

                        <TouchableOpacity activeOpacity={0.8} onPress={nextStep}>
                            <LinearGradient colors={[THEME.colors.primary, THEME.colors.primaryContainer]} style={styles.primaryBtn}>
                                <Text style={styles.btnText}>Seal My Intention</Text>
                                <OpenArrow width={18} fill="white" />
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                )}

                {/* STEP 3: COMPLETION */}
                {step === 3 && (
                    <View style={[styles.step, styles.center]}>
                        <View style={styles.successCircle}>
                            <LinearGradient colors={[THEME.colors.primary, THEME.colors.primaryContainer]} style={styles.successCore}>
                                <EyeIcon width={40} fill="white" />
                            </LinearGradient>
                        </View>
                        <Text style={[styles.title, { color: THEME.colors.primary }]}>Ritual Complete</Text>
                        <Text style={styles.subtitle}>Your intention has been set into the universe.</Text>

                        <View style={styles.pointsCard}>
                            <Text style={styles.pointsValue}>+50</Text>
                            <Text style={styles.pointsLabel}>Points added to Sage Score</Text>
                        </View>

                        <View style={styles.finalQuoteCard}>
                            <Text style={styles.finalManifestation}>"{manifestation}"</Text>
                        </View>

                        <TouchableOpacity style={{ width: '100%' }} onPress={() => navigation.navigate('MainTabs')}>
                            <LinearGradient colors={[THEME.colors.primary, THEME.colors.primaryContainer]} style={styles.primaryBtn}>
                                <Text style={styles.btnText}>Back to Dashboard</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                )}

            </ScrollView>
        </SafeAreaView>
    );
};

// --- Pagalbiniai Komponentai ---

const PathCard = ({ title, sub, color, onPress }) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
        <View style={[styles.iconCircle, { backgroundColor: color }]}>
            {/* <Icon width={24} height={24} fill={THEME.colors.primary} /> */}
        </View>
        <View style={styles.cardText}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardSub}>{sub}</Text>
        </View>
        <OpenArrow width={16} fill={THEME.colors.outlineVariant} />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: THEME.colors.background },
    header: { paddingBottom: 16 },
    headerTop: { height: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24 },
    headerTitle: { fontSize: 18, fontWeight: '700', color: THEME.colors.primary, fontFamily: 'Plus Jakarta Sans' },

    progressBg: { height: 4, backgroundColor: THEME.colors.primaryFixed + '40', marginHorizontal: 24, borderRadius: 2, overflow: 'hidden' },
    progressFill: { height: '100%', backgroundColor: THEME.colors.primary },

    scrollContent: { paddingHorizontal: 24, paddingTop: 32, paddingBottom: 100 },
    step: { width: '100%' },
    overline: { fontSize: 10, fontWeight: '800', color: THEME.colors.primary, letterSpacing: 2, marginBottom: 12 },
    title: { fontSize: 32, fontWeight: '800', color: THEME.colors.onSurface, lineHeight: 38, marginBottom: 12 },
    subtitle: { fontSize: 16, color: THEME.colors.onSurfaceVariant, lineHeight: 24, marginBottom: 40 },

    grid: { gap: 16 },
    card: { backgroundColor: THEME.colors.surfaceContainerLow, borderRadius: 20, padding: 24, flexDirection: 'row', alignItems: 'center' },
    iconCircle: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    cardText: { flex: 1 },
    cardTitle: { fontSize: 20, fontWeight: '700', color: THEME.colors.onSurface },
    cardSub: { fontSize: 13, color: THEME.colors.onSurfaceVariant, marginTop: 4 },

    inputContainer: { backgroundColor: THEME.colors.surfaceContainerLow, borderRadius: 24, padding: 24, minHeight: 280, marginBottom: 40 },
    quoteIcon: { position: 'absolute', top: 20, left: 10 },
    inputLabel: { fontSize: 18, fontStyle: 'italic', color: THEME.colors.secondary, marginBottom: 16 },
    textArea: { fontSize: 22, fontWeight: '700', color: THEME.colors.onSurface, textAlignVertical: 'top', flex: 1 },

    primaryBtn: { height: 64, borderRadius: 32, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12, ...THEME.shadows.editorial },
    btnText: { color: 'white', fontSize: 18, fontWeight: '800' },

    center: { alignItems: 'center' },
    successCircle: { width: 160, height: 160, borderRadius: 80, backgroundColor: THEME.colors.surfaceContainerLow, justifyContent: 'center', alignItems: 'center', marginBottom: 32 },
    successCore: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center' },

    pointsCard: { backgroundColor: 'white', padding: 32, borderRadius: 24, width: '100%', alignItems: 'center', marginBottom: 24, ...THEME.shadows.editorial },
    pointsValue: { fontSize: 48, fontWeight: '800', color: THEME.colors.primary },
    pointsLabel: { fontSize: 10, fontWeight: '800', color: THEME.colors.secondary, letterSpacing: 1 },

    finalQuoteCard: { backgroundColor: THEME.colors.surfaceContainerLow, padding: 32, borderRadius: 24, width: '100%', marginBottom: 40 },
    finalManifestation: { fontSize: 20, fontStyle: 'italic', fontWeight: '600', color: THEME.colors.onSurface, textAlign: 'center' }
});

export default ManifestationSelectionScreen;