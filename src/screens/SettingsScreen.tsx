import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Dimensions,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../theme/colors';
import { THEME } from '../theme';
import Header from '../compoments/HeaderBar';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import FlowerIcon from '../../assets/icons/flower.svg';
import PulseIcon from '../../assets/icons/pulse.svg';
import ProfileIcon from '../../assets/icons/profile.svg';
import MarkIcon from '../../assets/icons/mark.svg';
import Bell2Icon from '../../assets/icons/bell2.svg';
import LockIcon from '../../assets/icons/lock.svg';
import SignOut from '../../assets/icons/signOut.svg';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../store/useStore';

const SettingsScreen = () => {
    const navigation = useNavigation();
    const tabBarHeight = useBottomTabBarHeight();
    const logout = useStore((s) => s.logout);
    const logoutHandler = () => {
        // logout();


        logout(); // optional: still clear persisted auth state
    };
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* --- Top App Bar --- */}
            <Header title="Settings" />

            <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: THEME.spacing.xl + tabBarHeight }]}>

                {/* --- Profile Hero Section --- */}
                <View style={styles.heroSection}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: 'https://avatar.iran.liara.run/public/woman' }}
                            style={styles.mainAvatar}
                        />
                        <TouchableOpacity style={styles.editBadge}>
                            <Text style={{ fontSize: 12, color: THEME.colors.onPrimaryContainer }}>✎</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.userName}>Elena Richardson</Text>
                    <Text style={styles.membershipStatus}>Premium Wellness Member</Text>
                </View>

                {/* --- Health Goals Bento Grid --- */}
                <View style={styles.bentoGrid}>
                    {/* Main Focus Card */}
                    <View style={[styles.card, styles.fullWidthCard]}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle}>Current Focus</Text>
                            <Text style={styles.statusLabel}>IN PROGRESS</Text>
                        </View>
                        <View style={styles.progressData}>
                            <Text style={styles.percentageText}>74%</Text>
                            <Text style={styles.progressSubtext}>Weekly completion</Text>
                        </View>
                        <View style={styles.progressBarBg}>
                            <View style={[styles.progressBarFill, { width: '74%' }]} />
                        </View>
                    </View>

                    {/* Small Bento Cards */}
                    <View style={styles.row}>
                        <View style={[styles.card, styles.squareCard]}>
                            <FlowerIcon width={28} height={28} fill={COLORS.secondary} style={{ marginBottom: 12 }} />
                            <View>
                                <Text style={styles.statNumber}>12</Text>
                                <Text style={styles.statLabel}>Mindful Sessions</Text>
                            </View>
                        </View>
                        <View style={styles.separator}></View>
                        <View style={[styles.card, styles.squareCard]}>

                            <PulseIcon width={28} height={28} fill={COLORS.tertiary} style={{ marginBottom: 12 }} />
                            <View>
                                <Text style={styles.statNumber}>Resting</Text>
                                <Text style={styles.statLabel}>Heart Rate Opt.</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* --- Settings List --- */}
                <View style={styles.settingsSection}>
                    <Text style={styles.sectionHeader}>ACCOUNT SETTINGS</Text>
                    <View style={styles.settingsList}>
                        <SettingsItem icon={ProfileIcon} title="Personal Info" sub="Update your stats and data" onPress={() => navigation.navigate('PersonalInfo')} />
                        <SettingsItem icon={MarkIcon} title="Health Goals" sub="Define your wellness targets" />
                        <SettingsItem icon={Bell2Icon} title="Notifications" sub="Manage alerts and reminders" onPress={() => navigation.navigate('Notifications')} />
                        <SettingsItem icon={LockIcon} title="Privacy" sub="Your data security & sharing" last onPress={() => navigation.navigate('Privacy')} />
                    </View>

                    <TouchableOpacity style={styles.signOutButton} onPress={logoutHandler}>
                        <SignOut width={20} height={20} fill={THEME.colors.error} style={{ marginRight: 8 }} />
                        <Text style={styles.signOutText}>Sign Out</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>

            {/* --- Bottom Navigation --- */}

        </SafeAreaView >
    );
};

// Sub-components for cleaner code
const SettingsItem = ({ icon: Icon, title, sub, last, onPress }) => (
    <TouchableOpacity style={[styles.settingsItem, last && { borderBottomWidth: 0 }]} onPress={onPress}>
        <View style={styles.settingsItemLeft}>
            <View style={styles.iconCircle}>
                <Icon width={20} height={20} fill={THEME.colors.onSurfaceVariant} />
            </View>
            <View>
                <Text style={styles.itemTitle}>{title}</Text>
                <Text style={styles.itemSub}>{sub}</Text>
            </View>
        </View>
        <Text style={{ color: COLORS.outlineVariant }}>❯</Text>
    </TouchableOpacity>
);

// const NavItem = ({ icon, label, active }) => (
//     <TouchableOpacity style={[styles.navItem, active && styles.navItemActive]}>
//         <Text style={active ? { color: COLORS.primary } : { color: COLORS.secondary }}>{icon}</Text>
//         <Text style={[styles.navLabel, active && { color: COLORS.primary }]}>{label}</Text>
//     </TouchableOpacity>
// );

const styles = StyleSheet.create({
    // --- Layout & Containers ---
    container: {
        flex: 1,
        backgroundColor: THEME.colors.background
    },
    scrollContent: {
        paddingHorizontal: THEME.spacing.lg,
        paddingTop: THEME.spacing.xl,
        // paddingBottom: 120,
        // backgroundColor: THEME.colors.primary
    },
    row: {
        flexDirection: 'row',
        marginTop: THEME.spacing.md,
        alignItems: 'stretch'

    },

    // --- Bento Grid & Cards ---
    bentoGrid: {
        marginBottom: THEME.spacing.xl
    },
    card: {
        backgroundColor: THEME.colors.surfaceContainerLow,
        borderRadius: THEME.radius.lg,
        padding: THEME.spacing.lg

    },
    fullWidthCard: {
        width: '100%'
    },
    squareCard: {
        // width is calculated in the component based on screen dimensions
        flex: 1,
        flexBasis: 0,
        minWidth: 0,
        height: 160,
        justifyContent: 'space-between'
    },
    separator: {
        width: THEME.spacing.sm,
        alignSelf: 'stretch'
    },

    // --- Typography: Progress Section ---
    progressData: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginTop: THEME.spacing.md
    },
    percentageText: {
        fontSize: 36,
        fontWeight: '800',
        color: THEME.colors.primary,
        marginRight: THEME.spacing.sm
    },
    progressSubtext: {
        fontSize: THEME.fontSize.sm,
        color: THEME.colors.onSurfaceVariant,
        fontWeight: '500'
    },
    progressBarBg: {
        height: 10,
        backgroundColor: THEME.colors.surfaceContainerHigh,
        borderRadius: THEME.radius.full,
        marginTop: THEME.spacing.sm,
        overflow: 'hidden'
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: THEME.colors.primary
    },

    // --- Typography: Stats & Icons ---
    iconPlaceholder: {
        fontSize: 28,
        marginBottom: THEME.spacing.sm
    },
    statNumber: {
        fontSize: THEME.fontSize.xl,
        fontWeight: '800',
        color: THEME.colors.onSurface
    },
    statLabel: {
        fontSize: THEME.fontSize.xs,
        color: THEME.colors.onSurfaceVariant,
        fontWeight: '600'
    },

    // --- Header & Hero ---
    header: {
        height: 64,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: THEME.spacing.lg,
        backgroundColor: THEME.colors.surfaceContainerLow,
    },
    headerTitle: {
        fontSize: THEME.fontSize.lg,
        fontWeight: '700',
        color: THEME.colors.onSurface
    },
    userName: {
        fontSize: THEME.fontSize.xxl,
        fontWeight: '800',
        color: THEME.colors.onSurface,
        marginTop: THEME.spacing.md
    },
    membershipStatus: {
        fontSize: THEME.fontSize.md,
        color: THEME.colors.onSurfaceVariant,
        fontWeight: '500'
    },

    // --- Settings List ---
    settingsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: THEME.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: THEME.colors.surfaceContainerHigh
    },
    itemTitle: {
        fontWeight: '700',
        color: THEME.colors.onSurface,
        fontSize: THEME.fontSize.md
    },
    itemSub: {
        fontSize: THEME.fontSize.xs,
        color: THEME.colors.onSurfaceVariant
    },

    // --- Header Section ---

    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    iconButton: {
        width: 40,
        height: 40,
        borderRadius: THEME.radius.full,
        backgroundColor: THEME.colors.surfaceContainerHigh,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // --- Hero Section ---
    heroSection: {
        alignItems: 'center',
        marginBottom: THEME.spacing.xl,
        marginTop: THEME.spacing.lg
    },
    avatarContainer: {
        position: 'relative'
    },
    miniAvatar: { width: 36, height: 36, borderRadius: 18, marginRight: 12 },
    mainAvatar: {
        width: 120,
        height: 120,
        borderRadius: THEME.radius.lg,
        backgroundColor: THEME.colors.surfaceContainerHigh
    },
    editBadge: {
        position: 'absolute',
        bottom: -8,
        right: -8,
        backgroundColor: THEME.colors.primaryContainer,
        padding: THEME.spacing.sm,
        borderRadius: THEME.radius.full,
        borderWidth: 4,
        borderColor: THEME.colors.background
    },

    // --- Card Components (Bento) ---
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    cardTitle: {
        fontWeight: '700',
        color: THEME.colors.secondary,
        fontSize: THEME.fontSize.md
    },
    statusLabel: {
        fontSize: 10,
        fontWeight: '800',
        color: THEME.colors.primary,
        letterSpacing: 1
    },

    // --- Settings List Section ---
    settingsSection: {
        marginTop: THEME.spacing.lg
    },
    sectionHeader: {
        fontSize: 12,
        fontWeight: '800',
        color: THEME.colors.secondary,
        letterSpacing: 1.5,
        marginBottom: THEME.spacing.md,
        paddingHorizontal: THEME.spacing.sm
    },
    settingsList: {
        backgroundColor: THEME.colors.surfaceContainerLow,
        borderRadius: THEME.radius.lg,
        overflow: 'hidden'
    },
    settingsItemLeft: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: THEME.radius.full,
        backgroundColor: THEME.colors.surfaceContainerHigh,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: THEME.spacing.md
    },

    // --- Action Buttons ---
    signOutButton: {
        marginTop: THEME.spacing.xl,
        padding: THEME.spacing.md,
        borderRadius: THEME.radius.md,
        backgroundColor: 'rgba(186, 26, 26, 0.08)', // Faded error background
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signOutText: {
        color: THEME.colors.error,
        fontWeight: '700',
        fontSize: THEME.fontSize.md
    },

    // --- Bottom Navigation ---
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 85,
        backgroundColor: 'rgba(249, 250, 246, 0.95)', // Backdrop effect
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: Platform.OS === 'ios' ? 20 : 0,
        borderTopLeftRadius: THEME.radius.xl,
        borderTopRightRadius: THEME.radius.xl,
        ...THEME.shadows.editorial, // Use the shadow we defined
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: THEME.spacing.xs,
        paddingHorizontal: THEME.spacing.md,
    },
    navItemActive: {
        backgroundColor: 'rgba(139, 168, 136, 0.15)',
        borderRadius: THEME.radius.full,
        paddingVertical: THEME.spacing.sm,
    },
    navLabel: {
        fontSize: 11,
        marginTop: 4,
        fontWeight: '600',
        color: THEME.colors.secondary
    },

});

export default SettingsScreen;