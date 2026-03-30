import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Switch,
    Platform,
} from 'react-native';
import { THEME } from '../theme';
import {
    SleepIcon,
    NutritionIcon,
    HeartIcon,
    BellIcon,
    FeetIcon,
    PsychologyIcon,
    ScaleIcon,
    BrainIcon,
    ProfileIcon,
    BreatheInIcon,
    HoldIcon,
    BreatheOutIcon,
    ClockIcon,
    LeafIcon,
    EyeIcon,
    LockIcon,
    ShieldIcon,
    FingerprintIcon,
    TrashIcon,
    AnalyticsIcon,
    OpenArrow
} from '../../assets/icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const PrivacyScreen = ({ navigation }) => {
    const [healthSync, setHealthSync] = useState(true);
    const [researchData, setResearchData] = useState(false);
    const [leaderboard, setLeaderboard] = useState(true);

    return (
        <SafeAreaView style={styles.container}>
            {/* --- Top App Bar --- */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Text style={styles.backArrow}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Sage Wellness</Text>
                </View>
                <TouchableOpacity >
                    <Text>⋮</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* --- Hero Section --- */}
                <View style={styles.heroSection}>
                    <Text style={styles.heroTitle}>Privacy & Security</Text>
                    <Text style={styles.heroSubtitle}>
                        Manage how your data is handled and who can see your progress. Your wellness journey is personal.
                    </Text>
                </View>

                {/* --- Data Sharing Section --- */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <AnalyticsIcon width={20} height={20} fill={THEME.colors.primary} />
                        <Text style={styles.sectionTitle}>Data Sharing</Text>
                    </View>

                    <ToggleCard
                        title="Health Metric Sync"
                        description="Allow Sage to sync with Apple Health or Google Fit to track your daily steps and sleep patterns."
                        value={healthSync}
                        onValueChange={setHealthSync}
                    />

                    <ToggleCard
                        title="Anonymized Research"
                        description="Contribute your progress data to wellness research. All identifying information is permanently removed."
                        value={researchData}
                        onValueChange={setResearchData}
                    />
                </View>

                {/* --- Profile Visibility Section --- */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <EyeIcon width={20} height={20} fill={THEME.colors.primary} />
                        <Text style={styles.sectionTitle}>Profile Visibility</Text>
                    </View>

                    <TouchableOpacity style={styles.actionCard}>
                        <View>
                            <Text style={styles.cardTitle}>Community Presence</Text>
                            <Text style={styles.cardSubValue}>Visible to Friends Only</Text>
                        </View>
                        <EyeIcon width={20} fill={THEME.colors.outline} />
                    </TouchableOpacity>

                    <ToggleCard
                        title="Leaderboard Participation"
                        description="Show your name and score on weekly wellness challenges."
                        value={leaderboard}
                        onValueChange={setLeaderboard}
                    />
                </View>

                {/* --- Account Security Section --- */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <ShieldIcon width={20} height={20} fill={THEME.colors.primary} />
                        <Text style={styles.sectionTitle}>Account Security</Text>
                    </View>

                    <SecurityButton
                        title="Change Password"
                        subtitle="LAST CHANGED 3 MONTHS AGO"
                        Icon={LockIcon}
                    />

                    <SecurityButton
                        title="Biometric Authentication"
                        subtitle="FACEID / FINGERPRINT ENABLED"
                        Icon={FingerprintIcon}
                    />

                    <TouchableOpacity style={styles.deleteButton}>
                        <TrashIcon width={16} height={16} fill={THEME.colors.error} />
                        <Text style={styles.deleteText}>Delete My Account</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

// --- Reusable Sub-Components ---

const ToggleCard = ({ title, description, value, onValueChange }) => (
    <View style={styles.card}>
        <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardDescription}>{description}</Text>
        </View>
        <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{ false: THEME.colors.outlineVariant, true: THEME.colors.primary }}
            ios_backgroundColor={THEME.colors.outlineVariant}
        />
    </View>
);

const SecurityButton = ({ title, subtitle, Icon }) => (
    <TouchableOpacity style={styles.actionCard}>
        <View style={styles.securityIconRow}>
            <View style={styles.securityIconCircle}>
                <Icon width={20} height={20} fill={THEME.colors.primary} />
            </View>
            <View>
                <Text style={styles.cardTitle}>{title}</Text>
                <Text style={styles.securitySub}>{subtitle}</Text>
            </View>
        </View>
        <OpenArrow width={20} fill={THEME.colors.outline} />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: THEME.colors.background },
    header: {
        height: 64,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        backgroundColor: 'rgba(249, 250, 246, 0.7)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    headerLeft: { flexDirection: 'row', alignItems: 'center' },
    backButton: { padding: 8 },
    backArrow: { fontSize: 24, color: THEME.colors.primary },
    headerTitle: { fontSize: 18, fontWeight: '700', color: THEME.colors.primary, marginLeft: 8 },

    scrollContent: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 120 },

    heroSection: { marginBottom: 40 },
    heroTitle: { fontSize: 32, fontWeight: '600', color: THEME.colors.onSurface, marginBottom: 8 },
    heroSubtitle: { fontSize: 16, color: THEME.colors.onSurfaceVariant, lineHeight: 24 },

    section: { marginBottom: 40 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
    sectionTitle: { fontSize: 20, fontWeight: '600', color: THEME.colors.secondary },

    card: {
        backgroundColor: THEME.colors.surfaceContainerLow,
        padding: 20,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    cardTextContainer: { flex: 1, paddingRight: 16 },
    cardTitle: { fontSize: 16, fontWeight: '700', color: THEME.colors.onSurface, marginBottom: 4 },
    cardDescription: { fontSize: 13, color: THEME.colors.onSurfaceVariant, lineHeight: 18 },
    cardSubValue: { fontSize: 14, color: THEME.colors.onSurfaceVariant },

    actionCard: {
        backgroundColor: THEME.colors.surfaceContainerLow,
        padding: 20,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    securityIconRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    securityIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: THEME.colors.tabBackground,
        justifyContent: 'center',
        alignItems: 'center'
    },
    securitySub: { fontSize: 10, fontWeight: '800', color: THEME.colors.onSurfaceVariant, letterSpacing: 1, marginTop: 2 },

    deleteButton: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 16, marginTop: 8 },
    deleteText: { color: THEME.colors.error, fontWeight: '700', fontSize: 14 }
});

export default PrivacyScreen;