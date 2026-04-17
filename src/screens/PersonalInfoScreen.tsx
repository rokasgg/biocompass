import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { THEME } from '../theme';
import { OpenArrow, CalendarIcon, } from '../../assets/icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../store/useStore';

const width = Dimensions.get('window').width
const PersonalInfoScreen = ({ navigation }) => {
    const user = useStore(s => s.user ?? null);
    const setUser = useStore(s => s.setUser);
    console.log('email', user)
    const [form, setForm] = useState({
        fullName: `${user?.firstName} ${user?.lastName}`,
        email: user?.email,
        phone: user?.phone,
        birthDate: user?.birthDate || 'March 12, 1994',
        height: '172',
        weight: '64',
    });

    const saveSettings = () => {
        const userData = {
            ...user, ...form
        }
        setUser(userData)
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* --- Top App Bar --- */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backArrow}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Personal Info</Text>
                <TouchableOpacity style={styles.headerBtn}>
                    {/* <MoreIcon width={24} height={24} fill={THEME.colors.primary} /> */}
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* --- Profile Header --- */}
                    <View style={styles.profileHeader}>
                        <View style={styles.avatarWrapper}>
                            <Image
                                source={{ uri: 'https://avatar.iran.liara.run/public/woman' }}
                                style={styles.avatarImage}
                            />
                            <TouchableOpacity style={styles.editBadge}>
                                {/* <EditIcon width={14} height={14} fill="white" /> */}
                                <Text style={{ fontSize: 12, color: THEME.colors.onPrimaryContainer }}>✎</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.userName}>{form.fullName}</Text>
                        <Text style={styles.memberSince}>Member since June 2023</Text>
                    </View>

                    {/* --- Identity Form --- */}
                    <View style={styles.formSection}>
                        <InputField
                            label="Full Name"
                            value={form.fullName}
                            onChangeText={(val) => setForm({ ...form, fullName: val })}
                        />
                        <InputField
                            label="Email Address"
                            value={form.email}
                            keyboardType="email-address"
                            onChangeText={(val) => setForm({ ...form, email: val })}
                        />
                        <InputField
                            label="Phone Number"
                            value={form.phone}
                            keyboardType="phone-pad"
                            onChangeText={(val) => setForm({ ...form, phone: val })}
                        />
                    </View>

                    {/* --- Metrics Bento Grid --- */}
                    <View style={styles.bentoContainer}>
                        <View style={styles.fullWidthInput}>
                            <Text style={styles.label}>Birth Date</Text>
                            <View style={styles.inputWithIcon}>
                                <TextInput
                                    style={styles.input}
                                    value={form.birthDate}
                                    onChangeText={(val) => setForm({ ...form, birthDate: val })}
                                />
                                <CalendarIcon width={20} fill={THEME.colors.onSurfaceVariant} style={styles.rightIcon} />
                            </View>
                        </View>


                    </View>

                    {/* --- Information Card --- */}
                    <View style={styles.infoCard}>
                        <View style={{ maxWidth: '70%' }}>
                            <Text style={styles.infoTitle}>Restorative Pulse</Text>
                            <Text style={styles.infoSubtitle}>
                                Your metrics help us curate a wellness journey that respects your body's unique rhythm. All data is encrypted and private.
                            </Text>
                        </View>
                        {/* <SpaIcon width={80} height={80} fill={THEME.colors.primary} opacity={0.1} style={styles.infoBgIcon} /> */}
                    </View>

                    {/* --- Save Button --- */}
                    <View style={styles.actionSection}>
                        <TouchableOpacity activeOpacity={0.8} onPress={saveSettings}>
                            <LinearGradient
                                colors={[THEME.colors.primary, THEME.colors.primaryContainer]}
                                style={styles.saveBtn}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Text style={styles.saveBtnText}>Save Changes</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <Text style={styles.lastUpdated}>LAST UPDATED: 2 DAYS AGO</Text>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

// --- Reusable Sub-components ---

const InputField = ({ label, value, ...props }) => (
    <View style={styles.inputWrapper}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
            style={styles.input}
            value={value}
            placeholderTextColor={THEME.colors.outlineVariant}
            {...props}
        />
    </View>
);

const MetricBox = ({ label, value, unit }) => (
    <View style={styles.metricBox}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.metricValueRow}>
            <Text style={styles.metricValue}>{value}</Text>
            <Text style={styles.metricUnit}>{unit}</Text>
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
    headerTitle: { fontSize: 18, fontWeight: '700', color: THEME.colors.primary, fontFamily: 'Plus Jakarta Sans' },
    headerBtn: { padding: 8 },
    scrollContent: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 },

    profileHeader: { alignItems: 'center', marginBottom: 40 },
    avatarWrapper: { marginBottom: 16 },
    avatarImage: { width: 112, height: 112, borderRadius: 24 },
    editBadge: {
        position: 'absolute',
        bottom: -8,
        right: -8,
        backgroundColor: THEME.colors.primary,
        padding: 8,
        borderRadius: 20,
        ...THEME.shadows.editorial,
    },
    userName: { fontSize: 24, fontWeight: '800', color: THEME.colors.onSurface },
    memberSince: { fontSize: 14, color: THEME.colors.onSurfaceVariant, marginTop: 4 },

    formSection: { gap: 24, marginBottom: 24 },
    inputWrapper: { gap: 8, flexDirection: 'column' },
    label: { fontSize: 10, fontWeight: '800', color: THEME.colors.secondary, letterSpacing: 1.5, textTransform: 'uppercase', marginLeft: 4 },
    input: {
        backgroundColor: THEME.colors.surfaceContainerLow,
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderRadius: 16,
        fontSize: 16,
        color: THEME.colors.onSurface,
        fontWeight: '500',
    },

    bentoContainer: { gap: 16, marginBottom: 24 },
    fullWidthInput: { gap: 8 },
    inputWithIcon: { justifyContent: 'center' },
    rightIcon: { position: 'absolute', right: 20 },
    row: { flexDirection: 'row', gap: 16 },
    metricBox: { flex: 1, backgroundColor: THEME.colors.surfaceContainer, borderRadius: 20, padding: 24, justifyContent: 'space-between' },
    metricValueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4, marginTop: 12 },
    metricValue: { fontSize: 28, fontWeight: '800', color: THEME.colors.onSurface },
    metricUnit: { fontSize: 14, color: THEME.colors.onSurfaceVariant, fontWeight: '600' },

    infoCard: { backgroundColor: 'rgba(213, 227, 252, 0.3)', borderRadius: 24, padding: 32, overflow: 'hidden', marginBottom: 40 },
    infoTitle: { fontSize: 18, fontWeight: '800', color: THEME.colors.onSecondaryContainer, marginBottom: 8 },
    infoSubtitle: { fontSize: 14, lineHeight: 22, color: THEME.colors.onSecondaryContainer, opacity: 0.8 },
    infoBgIcon: { position: 'absolute', bottom: -20, right: -20 },

    actionSection: { alignItems: 'center' },
    saveBtn: {
        width: width - 48,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        ...THEME.shadows.editorial,
    },
    saveBtnText: { color: 'white', fontSize: 18, fontWeight: '800' },
    lastUpdated: { fontSize: 10, fontWeight: '700', color: THEME.colors.onSurfaceVariant, marginTop: 24, letterSpacing: 1 },
    backButton: { padding: 8 },
    backArrow: { fontSize: 24, color: THEME.colors.primary }
});

export default PersonalInfoScreen;