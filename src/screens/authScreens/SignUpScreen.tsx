import React, { use, useEffect, useState } from 'react';
import {
    StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert
} from 'react-native';
import { BackIcon } from '../../../assets/icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import { THEME } from '../../theme';
import LeafIcon from '../../../assets/icons/leaf.svg';
import { EyeIcon } from '../../../assets/icons';
import { useStore } from '../../store/useStore';
import HomeIcon from '../../../assets/icons/home.svg';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../../backend/supabase';
import PasswordField from '../../compoments/PasswordField'
import PrimaryInput from '../../compoments/PrimaryInput';


// import { useAuthStore } from '../../store/useAuthStore';

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

const SignUpScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();
    const login = useStore((s) => s.login);

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const passwordStrength = getPasswordStrength(newPassword);
    const setIsInitialLoading = useStore(s => s.setIsInitialLoading);

    const syncFromDB = useStore((s) => s.syncFromDB);

    // Visibility states for 3 separate fields
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showMismatchError, setShowMismatchError] = useState(false);


    const [loading, setLoading] = useState(false)

    const signInWithGoogle = async () => {
        setIsLoading(true);
        try {
            login();
        } catch (e) { }
        finally {
            setIsLoading(false);
        }
    }

    async function signUpWithEmail() {
        if (!email || !newPassword || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        setLoading(true);
        setIsInitialLoading(true)
        try {
            // 1. Supabase Auth
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: newPassword,
            });

            if (error) throw error;

        } catch (error: any) {
            Alert.alert('Login Failed', error.message);
            setIsInitialLoading(false);
        } finally {
            setLoading(false);
        }
    }


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
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <BackIcon width={24} fill={THEME.colors.primary} />
                        </TouchableOpacity>
                    </View>
                    {/* --- Welcome Text --- */}
                    <View style={styles.welcomeSection}>
                        <View style={styles.iconCircle}>
                            <LeafIcon width={28} height={28} fill={THEME.colors.primary} />
                        </View>
                        <Text style={styles.title}>New to the app?</Text>
                        <Text style={styles.subtitle}>Register yoursefl and start your journey to mindful living.</Text>
                    </View>

                    {/* --- Form Card --- */}
                    <View style={styles.formCard}>
                        <View style={styles.inputGroup}>
                            <PrimaryInput
                                label='Email Address'
                                placeHolder='email@address.com'
                                onChangeText={e => setEmail(e)}
                                value={email}
                            />
                        </View>

                        <View style={styles.form}>

                            {/* Current Password */}

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

                            {/* --- Sign In Button --- */}
                            <TouchableOpacity activeOpacity={0.8} onPress={signUpWithEmail}>
                                <LinearGradient
                                    colors={[THEME.colors.primary, THEME.colors.primaryContainer]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.signInButton}
                                >
                                    {!isLoading ? <Text style={styles.signInButtonText}>Register</Text> : <HomeIcon />}
                                    <Text style={{ color: 'white', marginLeft: 8 }}>→</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            {/* --- Divider --- */}
                            <View style={styles.dividerRow}>
                                <View style={styles.dividerLine} />
                                <Text style={styles.dividerText}>OR</Text>
                                <View style={styles.dividerLine} />
                            </View>

                            {/* --- Social Buttons --- */}
                            <View style={styles.socialRow}>
                                <TouchableOpacity style={styles.socialButton} onPress={signInWithGoogle}>
                                    <FontAwesome name="google" size={18} color="#000" />
                                    <Text style={styles.socialButtonText}>Google</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.socialButton} >
                                    <FontAwesome name="apple" size={18} color="#000" />
                                    <Text style={styles.socialButtonText}>Apple</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: THEME.colors.surfaceContainerLow,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    brandText: {
        fontFamily: Platform.OS === 'ios' ? 'Plus Jakarta Sans' : 'sans-serif-condensed',
        fontWeight: '700',
        fontStyle: 'italic',
        fontSize: 18,
        color: THEME.colors.primary,
    },
    welcomeSection: {
        marginTop: 40,
        marginBottom: 48,
        alignItems: 'center',
    },
    iconCircle: {
        width: 64,
        height: 64,
        backgroundColor: THEME.colors.tabBackground,
        borderRadius: 90,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: THEME.colors.onSurface,
        letterSpacing: -0.5,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        color: THEME.colors.onSurfaceVariant,
    },
    formCard: {
        backgroundColor: THEME.colors.background,
        borderRadius: 24,
        padding: 24,
        ...THEME.shadows.editorial,
    },
    inputGroup: {
        marginBottom: 24,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: THEME.colors.primary,
        marginLeft: 4,
    },
    input: {
        backgroundColor: THEME.colors.surfaceContainerLow,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: THEME.colors.onSurface,
    },
    passwordWrapper: {
        flexDirection: 'row',
        backgroundColor: THEME.colors.surfaceContainerLow,
        borderRadius: 12,
        alignItems: 'center',
    },
    eyeIcon: {
        paddingHorizontal: 16,
    },
    forgotText: {
        fontSize: 12,
        fontWeight: '500',
        color: THEME.colors.secondary,
    },
    signInButton: {
        flexDirection: 'row',
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
    },
    signInButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: THEME.colors.outlineVariant,
        opacity: 0.3,
    },
    dividerText: {
        marginHorizontal: 16,
        fontSize: 10,
        fontWeight: '800',
        color: THEME.colors.outlineVariant,
    },
    socialRow: {
        flexDirection: 'row',
        gap: 12,
    },
    socialButton: {
        flex: 1,
        backgroundColor: THEME.colors.surfaceContainerHigh,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    socialButtonText: {
        fontWeight: '400',
        color: THEME.colors.onSurface,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 32,
    },
    footerText: {
        color: THEME.colors.onSurfaceVariant,
    },
    createAccountText: {
        color: THEME.colors.primary,
        fontWeight: '600',
        marginLeft: 4,
    },
    form: { gap: 24 },
    strengthRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12, marginLeft: 16 },
    strengthBar: { width: 48, height: 4, borderRadius: 2 },
    strengthLabel: { fontSize: 10, fontWeight: '800', color: THEME.colors.primary, letterSpacing: 1, marginLeft: 4 },
    errorMessage: {
        fontSize: 13,
        fontWeight: '600',
        color: THEME.colors.error,
        marginLeft: 8,
        marginTop: 4,
    },
    header: { position: 'absolute', height: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
    headerTitle: { fontSize: 18, fontWeight: '700', color: THEME.colors.primary },
    content: { flex: 1, paddingHorizontal: 30, paddingTop: 40, alignItems: 'center' },
    backButton: { padding: 8 },
});

export default SignUpScreen;