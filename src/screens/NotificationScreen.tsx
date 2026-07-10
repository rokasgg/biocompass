import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet, Alert, } from 'react-native';
import { THEME } from '../theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SunIcon, AnalyticsIcon, SettingsIcon } from '../../assets/icons';
import * as Notifications from 'expo-notifications';
import { useStore } from '../store/useStore';
import { supabase } from '../../backend/supabase';

// Sukonfigūruojam, kaip appsas elgiasi, kai notifikacija ateina jam esant atidarytam
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

const NotificationSettingsScreen = ({ navigation }: any) => {
    // 📦 Zustand Store pajungimas (pataisyk kintamuosius pagal savo Store struktūrą)
    const user = useStore(state => state.user);
    const setUser = useStore(state => state.setUser);

    // Būsenos jungikliams – pradžioje paima reikšmę iš Zustand, fallbackas – true
    const [reminders, setReminders] = useState(user?.dailyRemindersEnabled ?? true);
    const [reports, setReports] = useState(user?.weeklyReportsEnabled ?? true);
    const [system, setSystem] = useState(user?.systemAlertsEnabled ?? true);

    // Sinchronizuojam vietinį useState, jei user objektas store užsikrauna vėliau
    useEffect(() => {
        if (user) {
            setReminders(user.dailyRemindersEnabled ?? true);
            setReports(user.weeklyReportsEnabled ?? true);
            setSystem(user.systemAlertsEnabled ?? true);
        }
    }, [user]);

    // 🔔 1. HANDLERIS: Daily Reminders (Su Expo Push Token generavimu)
    const handleDailyRemindersToggle = async (value: boolean) => {
        // 1. Iškart pakeičiam vietinę būseną ir Zustand, kad UI reaguotų žaibiškai
        setReminders(value);
        setUser({ ...user, dailyRemindersEnabled: value });

        // 2. Atnaujinam pagrindinį nustatymą Supabase duomenų bazėje
        const { error: dbError } = await supabase
            .from('profiles')
            .update({ daily_reminders_enabled: value })
            .eq('id', user?.userId);

        if (dbError) console.error('Error updating daily reminders in DB:', dbError.message);

        // 3. Jei vartotojas įjungia pranešimus, sutvarkom teises ir žetonus
        if (value && user?.userId) {
            try {
                // Patikrinam, ar telefonas išvis leidžia siųsti notifikacijas
                const { status: existingStatus } = await Notifications.getPermissionsAsync();
                let finalStatus = existingStatus;

                if (existingStatus !== 'granted') {
                    const { status } = await Notifications.requestPermissionsAsync();
                    finalStatus = status;
                }

                // Jei vartotojas griežtai pasakė NE sisteminiame lange
                if (finalStatus !== 'granted') {
                    Alert.alert(
                        'Permissions Required',
                        'Please enable notifications in your phone settings to receive daily wellness nudges.'
                    );
                    setReminders(false);
                    setUser({ ...user, dailyRemindersEnabled: false });
                    return;
                }

                // 🚀 SAUGIKLIS NUO KLAIDOS (Expo Go / Simulator apėjimas)
                let token = `sandbox-token-${user.userId.slice(0, 8)}`; // default testinis žetonas

                try {
                    // Bandome paimti tikrąjį žetoną iš Apple/Google per Expo
                    const tokenData = await Notifications.getExpoPushTokenAsync();
                    token = tokenData.data;
                    console.log('✅ Successfully fetched native Push Token:', token);
                } catch (tokenError) {
                    // Šitas blokas sugauna tavo turėtą "aps-environment" klaidą ir leidžia appe testuoti toliau!
                    console.log('⚠️ Running via Expo Go or Simulator. Generated sandbox token for testing.');
                }

                // 4. Įrašome žetoną (tikrą arba testinį) į Supabase profilio lentelę
                const { error: tokenUpdateError } = await supabase
                    .from('profiles')
                    .update({ expo_push_token: token })
                    .eq('id', user.userId);

                if (tokenUpdateError) {
                    console.error('Error saving push token to Supabase:', tokenUpdateError.message);
                } else {
                    // Atnaujinam Zustand, kad appsas atmintyje turėtų šį kodą
                    setUser({ ...user, dailyRemindersEnabled: true, expoPushToken: token });
                }

            } catch (err) {
                console.error('Unexpected notification configuration error:', err);
                setReminders(false);
                setUser({ ...user, dailyRemindersEnabled: false });
            }
        }
    };

    // 📊 2. HANDLERIS: Weekly Reports
    const handleWeeklyReportsToggle = async (value: boolean) => {
        setReports(value);
        setUser({ ...user, weeklyReportsEnabled: value });

        const { error } = await supabase
            .from('profiles')
            .update({ weekly_reports_enabled: value })
            .eq('id', user?.userId);

        if (error) console.error('Error updating weekly reports:', error.message);
    };

    // ⚙️ 3. HANDLERIS: System Alerts
    const handleSystemAlertsToggle = async (value: boolean) => {
        setSystem(value);
        setUser({ ...user, systemAlertsEnabled: value });

        const { error } = await supabase
            .from('profiles')
            .update({ system_alerts_enabled: value })
            .eq('id', user?.userId);

        if (error) console.error('Error updating system alerts:', error.message);
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