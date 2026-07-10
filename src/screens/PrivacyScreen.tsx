import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Switch,
    Alert,
    Linking,
} from 'react-native';
import { THEME } from '../theme';
import {
    EyeIcon,
    LockIcon,
    ShieldIcon,
    TrashIcon,
    AnalyticsIcon,
    OpenArrow
} from '../../assets/icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { requestAuthorization, getRequestStatusForAuthorization } from '@kingstinct/react-native-healthkit';
import { useStore } from '../store/useStore';
import { supabase } from '../../backend/supabase';

const HEALTHKIT_TYPES: any[] = [
    'HKQuantityTypeIdentifierStepCount',
    'HKCategoryTypeIdentifierSleepAnalysis',
];

const PrivacyScreen = () => {
    const user = useStore(s => s.user);
    const setUser = useStore(s => s.setUser);

    // 🔥 Pasiimam tavo Zustand store laukus ir setterius (pasitikslink pavadinimus pagal savo slice'ą)
    const healthSyncEnabled = useStore(s => s.healthSyncEnabled);
    const setHealthSyncEnabled = useStore(s => s.setHealthSyncEnabled);

    const navigation = useNavigation();

    const [researchData, setResearchData] = useState(user?.shareResearch ?? false);
    const [leaderboard, setLeaderboard] = useState(user?.leaderboardEnabled ?? true);

    // Patikrinam realią situaciją telefone atidarant ekraną
    useEffect(() => {
        getRequestStatusForAuthorization({ toRead: HEALTHKIT_TYPES } as any)
            .then(async (status: any) => {
                const hasOSPermission = status === 'unnecessary';

                // Jeigu vartotojas telefone atėmė teises, bet pas mus DB/Zustand stovi 'true' -> sinchronizuojam ir išjungiam
                if (!hasOSPermission && healthSyncEnabled) {
                    await updateHealthSyncStatus(false);
                }
            })
            .catch(() => { });
    }, []);

    // Pagalbinė funkcija centralizuotam būsenos atnaujinimui
    const updateHealthSyncStatus = async (enabled: boolean) => {
        setHealthSyncEnabled(enabled); // Atnaujinam Zustand lokaliai

        if (user?.userId) {
            const { error } = await supabase
                .from('profiles')
                .update({ health_sync_enabled: enabled }) // Tavo stulpelis Supabase
                .eq('id', user.userId);

            if (error) console.error('Error updating health sync in DB:', error.message);
        }
    };

    const handleHealthSyncToggle = async (value: boolean) => {
        if (value) {
            // Vartotojas nori ĮJUNGTI
            try {
                const granted = await requestAuthorization({ toRead: HEALTHKIT_TYPES } as any);
                if (granted) {
                    await updateHealthSyncStatus(true);
                } else {
                    await updateHealthSyncStatus(false);
                    Alert.alert(
                        'Permission Denied',
                        'HealthKit access was denied. You can enable it in Settings > Privacy & Security > Health.',
                        [
                            { text: 'Open Settings', onPress: () => Linking.openURL('app-settings:') },
                            { text: 'Cancel', style: 'cancel' },
                        ]
                    );
                }
            } catch {
                await updateHealthSyncStatus(false);
            }
        } else {
            // Vartotojas nori IŠJUNGTI tavo appso fono sinchronizaciją (telefonas teises išlaiko)
            Alert.alert(
                'Disable Health Sync',
                'Do you want to temporarily disable health metric syncing within Sage Wellness? To revoke full phone permissions, go to iOS Settings.',
                [
                    {
                        text: 'Disable Sync',
                        onPress: async () => await updateHealthSyncStatus(false)
                    },
                    {
                        text: 'Open iOS Settings',
                        onPress: () => Linking.openURL('app-settings:')
                    },
                    { text: 'Cancel', style: 'cancel' },
                ]
            );
        }
    };

    const handleResearchToggle = async (value: boolean) => {
        setResearchData(value);
        await supabase.from('profiles').update({ share_research: value }).eq('id', user?.userId);
        setUser({ ...user, shareResearch: value });
    };

    const handleLeaderboardToggle = async (value: boolean) => {
        setLeaderboard(value);
        await supabase.from('profiles').update({ leaderboard_enabled: value }).eq('id', user?.userId);
        setUser({ ...user, leaderboardEnabled: value });
    };

    const onChangePassword = () => {
        navigation.navigate('ChangePassword');
    };

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

                    {/* 🔥 Perduodam Zustand store reikšmę */}
                    <ToggleCard
                        title="Health Metric Sync"
                        description="Allow Sage to sync with Apple Health or Google Fit to track your daily steps and sleep patterns."
                        value={!!healthSyncEnabled}
                        onValueChange={handleHealthSyncToggle}
                    />
                </View>

                {/* --- Profile Visibility Section --- */}
                {/* <View style={styles.section}>
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
                        onValueChange={handleLeaderboardToggle}
                    />
                </View> */}

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
                        onPress={onChangePassword}
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
const ToggleCard = ({ title, description, value, onValueChange }: { title: string; description: string; value: boolean; onValueChange: (v: boolean) => void }) => (
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

const SecurityButton = ({ title, subtitle, Icon, onPress }: { title: string; subtitle: string; Icon: React.ComponentType<any>; onPress?: () => void }) => (
    <TouchableOpacity style={styles.actionCard} onPress={onPress}>
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