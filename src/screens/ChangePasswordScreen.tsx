import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { THEME } from '../theme';
import { LockIcon, EyeIcon } from '../../assets/icons';
import { useNavigation } from '@react-navigation/native';
import PasswordField from '../compoments/PasswordField';

type PasswordFieldProps = {
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    secureTextEntry: boolean,
    toggleVisible: () => void,
    isVisible: boolean
}

type PasswordStrength = 'Weak' | 'Medium' | 'Strong';

const getPasswordStrength = (password: string): PasswordStrength => {
    if (password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
        return 'Strong';
    }
    if (password.length >= 8 && (/[A-Z]/.test(password) || /[0-9]/.test(password))) {
        return 'Medium';
    }
    return 'Weak';
};

const getStrengthColor = (strength: PasswordStrength) => {
    switch (strength) {
        case 'Strong':
            return THEME.colors.primary;
        case 'Medium':
            return '#FFB000';
        default:
            return '#D00000';
    }
};

const ChangePasswordScreen = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Visibility states for 3 separate fields
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showMismatchError, setShowMismatchError] = useState(false);

    const navigation = useNavigation();
    const passwordStrength = getPasswordStrength(newPassword);

    // Delay error message to avoid showing while user is typing
    useEffect(() => {
        const timer = setTimeout(() => {
            if (newPassword && confirmPassword && newPassword !== confirmPassword) {
                setShowMismatchError(true);
            } else {
                setShowMismatchError(false);
            }
        }, 500); // 500ms delay

        return () => clearTimeout(timer);
    }, [newPassword, confirmPassword]);

    return (
        <SafeAreaView style={styles.container}>
            {/* --- Top App Bar --- */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backArrow}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Change Password</Text>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <View
                    style={styles.scrollContent}
                // showsVerticalScrollIndicator={false}
                >
                    {/* --- Hero Section --- */}
                    <View style={styles.heroSection}>
                        <View style={styles.iconCircle}>
                            <LockIcon width={40} height={40} fill={THEME.colors.primary} />
                        </View>
                        <Text style={styles.heroText}>
                            Keep your account secure by choosing a strong password.
                        </Text>
                    </View>

                    {/* --- Form Section --- */}
                    <View style={styles.form}>

                        {/* Current Password */}
                        <PasswordField
                            label="Current Password"
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                            secureTextEntry={!showCurrent}
                            toggleVisible={() => setShowCurrent(!showCurrent)}
                            isVisible={showCurrent}
                        />

                        {/* New Password + Strength Meter */}
                        <View>
                            <PasswordField
                                label="New Password"
                                value={newPassword}
                                onChangeText={setNewPassword}
                                secureTextEntry={!showNew}
                                toggleVisible={() => setShowNew(!showNew)}
                                isVisible={showNew}
                            />
                            <View style={styles.strengthRow}>
                                <View style={[styles.strengthBar, { backgroundColor: passwordStrength === 'Weak' ? '#D00000' : passwordStrength === 'Medium' ? '#FFB000' : THEME.colors.primary }]} />
                                <View style={[styles.strengthBar, { backgroundColor: passwordStrength === 'Strong' || passwordStrength === 'Medium' ? (passwordStrength === 'Medium' ? '#FFB000' : THEME.colors.primary) : '#E5E5E5' }]} />
                                <View style={[styles.strengthBar, { backgroundColor: passwordStrength === 'Strong' ? THEME.colors.primary : '#E5E5E5' }]} />
                                <Text style={[styles.strengthLabel, { color: getStrengthColor(passwordStrength) }]}>{passwordStrength.toUpperCase()}</Text>
                            </View>
                        </View>

                        {/* Confirm Password */}
                        <View>
                            <PasswordField
                                label="Confirm New Password"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showConfirm}
                                toggleVisible={() => setShowConfirm(!showConfirm)}
                                isVisible={showConfirm}
                            />
                            {showMismatchError && (
                                <Text style={styles.errorMessage}>Passwords do not match</Text>
                            )}
                        </View>

                        {/* Action Buttons */}
                        <View style={styles.actionArea}>
                            <TouchableOpacity activeOpacity={0.8} style={[styles.updateWrapper, showMismatchError && styles.updateBtnDisabled]} disabled={!!showMismatchError}>
                                <LinearGradient
                                    colors={showMismatchError ? [THEME.colors.outline, THEME.colors.outline] : [THEME.colors.primary, THEME.colors.primaryContainer]}
                                    style={styles.updateBtn}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                >
                                    <Text style={[styles.updateBtnText, showMismatchError && { color: THEME.colors.outlineVariant }]}>Update Password</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity>
                                <Text style={styles.forgotBtn}>Forgot Password?</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* --- Security Tip Card --- */}
                    <View style={styles.tipCard}>
                        <Text style={styles.tipTitle}>Security Tip</Text>
                        <Text style={styles.tipBody}>
                            Avoid using common words or personal information like your birthdate. Use a mix of letters, numbers, and symbols.
                        </Text>
                        <View style={styles.tipDecor} />
                    </View>

                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: THEME.colors.background },
    header: {
        height: 64,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    headerTitle: { fontSize: 18, fontWeight: '700', color: THEME.colors.primary, fontFamily: 'Plus Jakarta Sans' },
    backBtn: { padding: 8 },

    scrollContent: { paddingHorizontal: 24, paddingTop: 32, paddingBottom: 60 },

    heroSection: { alignItems: 'center', marginBottom: 40 },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 24,
        backgroundColor: THEME.colors.surfaceContainer,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    heroText: {
        fontSize: 16,
        color: THEME.colors.secondary,
        textAlign: 'center',
        lineHeight: 24,
        fontWeight: '500',
        maxWidth: 280,
    },

    form: { gap: 24 },

    label: { fontSize: 14, fontWeight: '700', color: THEME.colors.onSurfaceVariant, marginLeft: 8 },



    strengthRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12, marginLeft: 16 },
    strengthBar: { width: 48, height: 4, borderRadius: 2 },
    strengthLabel: { fontSize: 10, fontWeight: '800', color: THEME.colors.primary, letterSpacing: 1, marginLeft: 4 },

    actionArea: { alignItems: 'center', gap: 24, marginTop: 16 },
    updateWrapper: { width: '100%', ...THEME.shadows.editorial },
    updateBtn: { height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
    updateBtnText: { color: 'white', fontSize: 18, fontWeight: '800' },
    updateBtnDisabled: { opacity: 0.6 },
    errorMessage: {
        fontSize: 13,
        fontWeight: '600',
        color: THEME.colors.error,
        marginLeft: 8,
        marginTop: 4,
    },
    forgotBtn: {
        fontSize: 14,
        fontWeight: '700',
        color: THEME.colors.secondary,
        borderBottomWidth: 2,
        borderBottomColor: THEME.colors.primary + '30'
    },

    tipCard: {
        backgroundColor: THEME.colors.surfaceContainerLow,
        borderRadius: 24,
        padding: 24,
        marginTop: 60,
        overflow: 'hidden'
    },
    tipTitle: { fontSize: 16, fontWeight: '800', color: THEME.colors.primary, marginBottom: 8 },
    tipBody: { fontSize: 13, lineHeight: 20, color: THEME.colors.onSurfaceVariant },
    tipDecor: {
        position: 'absolute',
        bottom: -20,
        right: -20,
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: THEME.colors.primary,
        opacity: 0.05
    },
    backButton: { padding: 8 },
    backArrow: { fontSize: 24, color: THEME.colors.primary },
});

export default ChangePasswordScreen;