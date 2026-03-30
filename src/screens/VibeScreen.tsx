import React, { useEffect, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Animated,
    Easing,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LinearGradient } from 'expo-linear-gradient';
import { THEME } from '../theme';
import { HoldIcon, BreatheOutIcon, BreatheInIcon, HeartIcon, ClockIcon } from '../../assets/icons';

const { width } = Dimensions.get('window');

const WellnessScreen = () => {
    // Animation value for the breathing circle
    const breatheAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Continuous breathing animation: Inhale (1.4x) -> Hold -> Exhale (1.0x)
        const startBreathing = () => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(breatheAnim, {
                        toValue: 1.4,
                        duration: 4000,
                        easing: Easing.inOut(Easing.sin),
                        useNativeDriver: true,
                    }),
                    Animated.delay(1000), // Hold
                    Animated.timing(breatheAnim, {
                        toValue: 1,
                        duration: 4000,
                        easing: Easing.inOut(Easing.sin),
                        useNativeDriver: true,
                    }),
                    Animated.delay(1000), // Hold
                ])
            ).start();
        };

        startBreathing();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* --- Top App Bar --- */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.avatarMiniContainer}>
                        <Image
                            source={{ uri: 'https://avatar.iran.liara.run/public/woman' }}
                            style={styles.miniAvatar}
                        />
                    </View>
                    <Text style={styles.headerTitle}>Restorative Health</Text>
                </View>
                <TouchableOpacity style={styles.iconButton}>
                    <Text style={{ fontSize: 20 }}>🔔</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* --- Manifestation Header --- */}
                <View style={styles.manifestHeader}>
                    <Text style={styles.overline}>DAILY INTENTIONS</Text>
                    <Text style={styles.heroTitle}>Manifest Harmony</Text>

                    <View style={styles.affirmationCard}>
                        <Text style={styles.quoteIcon}>“</Text>
                        <Text style={styles.affirmationText}>
                            "I am grounded in the present moment, inhaling peace and exhaling all that no longer serves my growth."
                        </Text>
                        <View style={styles.affirmationFooter}>
                            <View style={styles.footerLine} />
                            <Text style={styles.footerText}>DAILY AFFIRMATION</Text>
                        </View>
                    </View>
                </View>

                {/* --- Breathing Interface --- */}
                <View style={styles.breathingContainer}>
                    <View style={styles.breathingText}>
                        <Text style={styles.sectionTitle}>Box Breathing</Text>
                        <Text style={styles.sectionSubtitle}>Find your rhythm and follow the circle</Text>
                    </View>

                    <View style={styles.visualizerContainer}>
                        {/* Outer Pulse Ring */}
                        <Animated.View style={[styles.pulseRing, { transform: [{ scale: breatheAnim }], opacity: 0.1 }]} />

                        {/* Main Core Circle */}
                        <Animated.View style={[styles.mainCircleWrapper, { transform: [{ scale: breatheAnim }] }]}>
                            <LinearGradient
                                colors={[THEME.colors.primary, THEME.colors.primaryContainer]}
                                style={styles.mainCircle}
                            >
                                <Text style={styles.breatheStatus}>Inhale</Text>
                                <Text style={styles.breatheTimer}>4 Seconds</Text>
                            </LinearGradient>
                        </Animated.View>
                    </View>

                    {/* Phase Controls */}
                    <View style={styles.phaseControls}>
                        <PhaseIcon icon={BreatheInIcon} label="Inhale" />
                        <PhaseIcon icon={HoldIcon} label="Hold" active />
                        <PhaseIcon icon={BreatheOutIcon} label="Exhale" />
                    </View>
                </View>

                {/* --- Insights Grid --- */}
                <View style={styles.bentoGrid}>
                    <View style={styles.row}>
                        <View style={[styles.smallCard, { backgroundColor: THEME.colors.secondaryContainer + '40' }]}>
                            <ClockIcon width={24} height={24} style={{ marginBottom: 8 }} />
                            <View>
                                <Text style={styles.cardLabel}>Session Time</Text>
                                <Text style={styles.cardValue}>08:45</Text>
                            </View>
                        </View>
                        <View style={[styles.smallCard, { backgroundColor: THEME.colors.tertiaryContainer + '30' }]}>
                            <HeartIcon width={24} height={24} style={{ marginBottom: 8 }} />
                            <View>
                                <Text style={[styles.cardLabel, { color: THEME.colors.tertiary }]}>Heart Rate</Text>
                                <Text style={[styles.cardValue, { color: THEME.colors.onTertiaryContainer }]}>64 BPM</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.fullCard}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardLabel}>Calmness Level</Text>
                            <Text style={styles.statusText}>Optimal</Text>
                        </View>
                        <View style={styles.progressBg}>
                            <View style={[styles.progressFill, { width: '85%' }]} />
                        </View>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const PhaseIcon = ({ icon: Icon, label, active }) => (
    <View style={styles.phaseItem}>
        <View style={[styles.phaseCircle, active && styles.phaseCircleActive]}>
            <Icon width={24} height={24} />
        </View>
        <Text style={[styles.phaseLabel, active && { color: THEME.colors.primary }]}>{label}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: THEME.colors.background },
    header: { height: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, backgroundColor: THEME.colors.surfaceContainerLow },
    headerLeft: { flexDirection: 'row', alignItems: 'center' },
    avatarMiniContainer: { width: 32, height: 32, borderRadius: 16, overflow: 'hidden', backgroundColor: THEME.colors.surfaceContainerHigh },
    miniAvatar: { width: '100%', height: '100%' },
    headerTitle: { fontSize: 16, fontWeight: '700', color: THEME.colors.onSurface, marginLeft: 12 },
    iconButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },

    scrollContent: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 120 },

    manifestHeader: { marginBottom: 40 },
    overline: { color: THEME.colors.primary, fontWeight: '600', fontSize: 12, letterSpacing: 2 },
    heroTitle: { fontSize: 36, fontWeight: '700', color: '#1c1c1c', marginTop: 4 },
    affirmationCard: { backgroundColor: THEME.colors.surfaceContainerLow, borderRadius: 24, padding: 32, marginTop: 24, overflow: 'hidden' },
    quoteIcon: { fontSize: 40, color: THEME.colors.primaryContainer, fontWeight: '900', marginBottom: -10 },
    affirmationText: { fontSize: 18, color: '#444', fontStyle: 'italic', lineHeight: 28, fontWeight: '500' },
    affirmationFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 20 },
    footerLine: { width: 32, height: 1, backgroundColor: THEME.colors.outlineVariant, marginRight: 8 },
    footerText: { fontSize: 10, fontWeight: '800', color: THEME.colors.onSurfaceVariant },

    breathingContainer: { alignItems: 'center', marginBottom: 40 },
    breathingText: { alignItems: 'center', marginBottom: 40 },
    sectionTitle: { fontSize: 24, fontWeight: '600', color: THEME.colors.secondary },
    sectionSubtitle: { fontSize: 14, color: THEME.colors.onSurfaceVariant, marginTop: 4 },

    visualizerContainer: { width: 300, height: 300, justifyContent: 'center', alignItems: 'center' },
    pulseRing: { position: 'absolute', width: 280, height: 280, borderRadius: 140, borderWidth: 1, borderColor: THEME.colors.primary },
    mainCircleWrapper: { width: 190, height: 190, borderRadius: 95, ...THEME.shadows.editorial },
    mainCircle: { flex: 1, borderRadius: 95, justifyContent: 'center', alignItems: 'center' },
    breatheStatus: { color: 'white', fontSize: 24, fontWeight: '900' },
    breatheTimer: { color: 'white', fontSize: 10, fontWeight: '700', opacity: 0.8, letterSpacing: 1, marginTop: 4 },

    phaseControls: { flexDirection: 'row', width: '100%', justifyContent: 'space-around', marginTop: 40 },
    phaseItem: { alignItems: 'center' },
    phaseCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: THEME.colors.surfaceContainerHigh, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
    phaseCircleActive: { borderWidth: 2, borderColor: THEME.colors.primary + '40', backgroundColor: THEME.colors.surfaceContainerHigh },
    phaseLabel: { fontSize: 11, fontWeight: '700', color: '#888' },

    bentoGrid: { gap: 16 },
    row: { flexDirection: 'row', gap: 16 },
    smallCard: { flex: 1, borderRadius: 20, padding: 20, gap: 12 },
    cardLabel: { fontSize: 12, fontWeight: '700', color: THEME.colors.secondary },
    cardValue: { fontSize: 20, fontWeight: '800', color: THEME.colors.onSecondaryContainer },
    fullCard: { backgroundColor: THEME.colors.surfaceContainer, borderRadius: 20, padding: 24 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
    statusText: { fontSize: 12, fontWeight: '800', color: THEME.colors.primary },
    progressBg: { height: 8, backgroundColor: THEME.colors.surfaceContainerHighest, borderRadius: 4 },
    progressFill: { height: '100%', backgroundColor: THEME.colors.primary, borderRadius: 4 },
});

export default WellnessScreen;