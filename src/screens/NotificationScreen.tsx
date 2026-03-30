import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Switch,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { THEME } from '../theme';
import {


    SunIcon,
    AnalyticsIcon,
    GroupsIcon,
    SettingsIcon,
    LeafIcon
} from '../../assets/icons';

const NotificationSettingsScreen = ({ navigation }) => {
    // State for toggles
    const [reminders, setReminders] = useState(true);
    const [reports, setReports] = useState(true);
    const [community, setCommunity] = useState(false);
    const [system, setSystem] = useState(true);

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
                    <Text >...</Text>
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
                        onValueChange={setReminders}
                        Icon={SunIcon}
                        iconBg={THEME.colors.primaryContainer}
                        iconColor={THEME.colors.primary}
                    />

                    <NotificationItem
                        title="Weekly Reports"
                        sub="Summary of your wellness journey"
                        value={reports}
                        onValueChange={setReports}
                        Icon={AnalyticsIcon}
                        iconBg={THEME.colors.secondaryContainer}
                        iconColor={THEME.colors.secondary}
                    />

                    <NotificationItem
                        title="Community Updates"
                        sub="New challenges and shared goals"
                        value={community}
                        onValueChange={setCommunity}
                        Icon={GroupsIcon}
                        iconBg={THEME.colors.tertiaryContainer}
                        iconColor={THEME.colors.tertiary}
                    />

                    <NotificationItem
                        title="System Alerts"
                        sub="Security and account notifications"
                        value={system}
                        onValueChange={setSystem}
                        Icon={SettingsIcon}
                        iconBg={THEME.colors.tabBackground}
                        iconColor={THEME.colors.onSurfaceVariant}
                    />
                </View>

                {/* --- Inspiration / Focus Card --- */}
                <LinearGradient
                    colors={[THEME.colors.primaryContainer, THEME.colors.primary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.focusCard}
                >
                    <View style={styles.focusContent}>
                        <LeafIcon width={32} height={32} fill="white" />
                        <Text style={styles.focusTitle}>Deep Work Mode</Text>
                        <Text style={styles.focusSubtitle}>
                            Activate Focus mode to automatically silence all notifications during your scheduled meditation or deep-work hours.
                        </Text>
                        <TouchableOpacity style={styles.focusButton}>
                            <Text style={styles.focusButtonText}>Enable Focus Mode</Text>
                        </TouchableOpacity>
                    </View>
                    {/* Subtle background glow effect */}
                    <View style={styles.cardGlow} />
                </LinearGradient>

                <Text style={styles.footerNote}>Changes are saved automatically.</Text>

            </ScrollView>
        </SafeAreaView>
    );
};

// --- Reusable Sub-component ---

const NotificationItem = ({ title, sub, value, onValueChange, Icon, iconBg, iconColor }) => (
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
        <View style={styles.switchWrapper} pointerEvents="box-none">
            <Switch
                value={value}
                onValueChange={onValueChange}
                trackColor={{ false: THEME.colors.outlineVariant, true: THEME.colors.primary }}
                ios_background_color={THEME.colors.outlineVariant}
            />
        </View>
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
    navLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingRight: 72 },
    iconCircle: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    textColumn: { flex: 1 },
    switchWrapper: { position: 'absolute', right: 16, top: 0, bottom: 0, justifyContent: 'center', width: 56 },
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

    footerNote: { textAlign: 'center', marginTop: 40, fontSize: 12, color: THEME.colors.onSurfaceVariant, fontWeight: '600' }
});

export default NotificationSettingsScreen;