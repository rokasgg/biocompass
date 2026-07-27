import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet, Alert, Platform } from 'react-native';
import { THEME } from '../theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SunIcon, AnalyticsIcon, SettingsIcon } from '../../assets/icons';
import * as Notifications from 'expo-notifications';
import { useStore } from '../store/useStore';
import { supabase } from '../../backend/supabase';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

const WEEKLY_NOTIF_ID = 'weekly-report';

async function requestPermission(): Promise<boolean> {
    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing === 'granted') return true;
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
}

async function scheduleDailyReminder() {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
        identifier: 'daily-reminder',
        content: {
            title: 'Good morning 🌿',
            body: 'Your morning check-in is ready. Start your day with intention.',
            sound: true,
        },
        trigger: { hour: 8, minute: 0, repeats: true } as any,
    });
}

async function scheduleWeeklyReport() {
    await Notifications.scheduleNotificationAsync({
        identifier: WEEKLY_NOTIF_ID,
        content: {
            title: 'Your weekly wellness summary 📊',
            body: 'See how your habits shaped your week. Tap to explore.',
            sound: true,
        },
        trigger: { weekday: 2, hour: 9, minute: 0, repeats: true } as any,
    });
}

const NotificationSettingsScreen = ({ navigation }: any) => {
    // 📦 Zustand Store pajungimas (pataisyk kintamuosius pagal savo Store struktūrą)
    const user = useStore(state => state.user);
    const setUser = useStore(state => state.setUser);

    // Būsenos jungikliams – pradžioje paima reikšmę iš Zustand, fallbackas – true
    const [reminders, setReminders] = useState(user?.dailyRemindersEnabled ?? true);
    const [reports, setReports] = useState(user?.weeklyReportsEnabled ?? true);
    const [system, setSystem] = useState(user?.systemAlertsEnabled ?? true);

    useEffect(() => {
        if (user) {
            setReminders(user.dailyRemindersEnabled ?? true);
            setReports(user.weeklyReportsEnabled ?? true);
            setSystem(user.systemAlertsEnabled ?? true);
        }
    }, [user]);

    useEffect(() => {
        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'Default',
                importance: Notifications.AndroidImportance.HIGH,
                sound: 'default',
            });
        }
    }, []);

    const handleDailyRemindersToggle = async (value: boolean) => {
        setReminders(value);
        setUser({ ...user, dailyRemindersEnabled: value });

        if (value) {
            const granted = await requestPermission();
            if (!granted) {
                Alert.alert('Permissions Required', 'Please enable notifications in your phone settings to receive daily wellness nudges.');
                setReminders(false);
                setUser({ ...user, dailyRemindersEnabled: false });
                return;
            }
            await scheduleDailyReminder();

            // Store push token for future server-side use
            try {
                const { data: tokenData } = await Notifications.getExpoPushTokenAsync();
                await supabase.from('profiles').update({ expo_push_token: tokenData, daily_reminders_enabled: true }).eq('id', user?.userId);
                setUser({ ...user, dailyRemindersEnabled: true, expoPushToken: tokenData });
            } catch {
                await supabase.from('profiles').update({ daily_reminders_enabled: true }).eq('id', user?.userId);
            }
        } else {
            await Notifications.cancelScheduledNotificationAsync('daily-reminder').catch(() => {});
            await supabase.from('profiles').update({ daily_reminders_enabled: false }).eq('id', user?.userId);
        }
    };

    const handleWeeklyReportsToggle = async (value: boolean) => {
        setReports(value);
        setUser({ ...user, weeklyReportsEnabled: value });

        if (value) {
            const granted = await requestPermission();
            if (!granted) {
                setReports(false);
                setUser({ ...user, weeklyReportsEnabled: false });
                return;
            }
            await scheduleWeeklyReport();
        } else {
            await Notifications.cancelScheduledNotificationAsync(WEEKLY_NOTIF_ID).catch(() => {});
        }

        await supabase.from('profiles').update({ weekly_reports_enabled: value }).eq('id', user?.userId);
    };

    const handleSystemAlertsToggle = async (value: boolean) => {
        setSystem(value);
        setUser({ ...user, systemAlertsEnabled: value });
        await supabase.from('profiles').update({ system_alerts_enabled: value }).eq('id', user?.userId);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* --- Header --- */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Text style={styles.backArrow}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Sage Wellness</Text>
                </View>
                <TouchableOpacity style={styles.headerBtn}>
                    <Text>...</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* --- Editorial Header --- */}
                <View style={styles.heroSection}>
                    <Text style={styles.overline}>PREFERENCES</Text>
                    <Text style={styles.heroTitle}>Your Quiet {"\n"}Space.</Text>
                    <Text style={styles.heroSubtitle}>
                        Configure how and when you want to receive updates. We believe in restorative technology, not distractions.
                    </Text>
                </View>

                {/* --- Notification List --- */}
                <View style={styles.listContainer}>
                    <NotificationItem
                        title="Daily Reminders"
                        sub="Morning focus and habit nudges"
                        value={reminders}
                        onValueChange={handleDailyRemindersToggle}
                        Icon={SunIcon}
                        iconBg={THEME.colors.primaryContainer}
                        iconColor={THEME.colors.primary}
                    />

                    <NotificationItem
                        title="Weekly Reports"
                        sub="Summary of your wellness journey"
                        value={reports}
                        onValueChange={handleWeeklyReportsToggle}
                        Icon={AnalyticsIcon}
                        iconBg={THEME.colors.secondaryContainer}
                        iconColor={THEME.colors.secondary}
                    />

                    <NotificationItem
                        title="System Alerts"
                        sub="Security and account notifications"
                        value={system}
                        onValueChange={handleSystemAlertsToggle}
                        Icon={SettingsIcon}
                        iconBg={THEME.colors.tabBackground}
                        iconColor={THEME.colors.onSurfaceVariant}
                    />
                </View>

                <Text style={styles.footerNote}>Changes are saved automatically.</Text>
            </ScrollView>
        </SafeAreaView>
    );
};

// --- Reusable Sub-component ---
const NotificationItem = ({ title, sub, value, onValueChange, Icon, iconBg, iconColor }: any) => (
    <View style={styles.navItem}>
        <View style={styles.navLeft}>
            <View style={[styles.iconCircle, { backgroundColor: iconBg }]}>
                <Icon width={24} height={24} fill={iconColor} />
            </View>
            <View style={styles.textColumn}>
                <Text style={styles.itemTitle}>{title}</Text>
                <Text style={styles.itemSub}>{sub}</Text>
            </View>
        </View>
        <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{ false: THEME.colors.outlineVariant, true: THEME.colors.primary }}
            thumbColor="#ffffff"
            ios_backgroundColor={THEME.colors.outlineVariant}
        />
    </View>
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
    },
    headerLeft: { flexDirection: 'row', alignItems: 'center' },
    headerTitle: { fontSize: 18, fontWeight: '700', color: THEME.colors.primary, marginLeft: 8 },
    headerBtn: { padding: 8 },

    scrollContent: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 120 },

    heroSection: { marginBottom: 48 },
    overline: { fontSize: 12, fontWeight: '800', color: THEME.colors.primary, letterSpacing: 2, marginBottom: 8 },
    heroTitle: { fontSize: 40, fontWeight: '900', color: THEME.colors.onSurface, lineHeight: 46 },
    heroSubtitle: { fontSize: 16, color: THEME.colors.onSurfaceVariant, lineHeight: 24, marginTop: 16, fontWeight: '500' },

    listContainer: { gap: 12 },
    navItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: THEME.colors.surfaceContainerLow,
        padding: 20,
        borderRadius: 24,
    },
    navLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingRight: 16 },
    iconCircle: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    textColumn: { flex: 1 },
    itemTitle: { fontSize: 16, fontWeight: '600', color: THEME.colors.onSurface },
    itemSub: { fontSize: 13, color: THEME.colors.onSurfaceVariant, marginTop: 2, flexWrap: 'wrap' },

    focusCard: {
        marginTop: 48,
        borderRadius: 24,
        padding: 32,
        overflow: 'hidden',
        ...THEME.shadows.editorial,
    },
    focusContent: { zIndex: 10 },
    focusTitle: { color: 'white', fontSize: 24, fontWeight: '800', marginTop: 16, marginBottom: 8 },
    focusSubtitle: { color: 'white', opacity: 0.8, fontSize: 14, lineHeight: 22, fontWeight: '500' },
    focusButton: {
        backgroundColor: THEME.colors.primary,
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 100,
        alignSelf: 'flex-start',
        marginTop: 24,
    },
    focusButtonText: { color: 'white', fontWeight: '800', fontSize: 14 },
    cardGlow: {
        position: 'absolute',
        bottom: -60,
        right: -60,
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'rgba(255,255,255,0.15)',
    },

    footerNote: { textAlign: 'center', marginTop: 40, fontSize: 12, color: THEME.colors.onSurfaceVariant, fontWeight: '600' },
    backButton: { padding: 8 },
    backArrow: { fontSize: 24, color: THEME.colors.primary },
});

export default NotificationSettingsScreen;