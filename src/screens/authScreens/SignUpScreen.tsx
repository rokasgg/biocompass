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
import { useStore } from '../../store/useStore';
import HomeIcon from '../../../assets/icons/home.svg';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../../backend/supabase';
import PasswordField from '../../compoments/PasswordField'
import PrimaryInput from '../../compoments/PrimaryInput';
import { CustomButton } from '../../compoments/CustomButton';
import MainInput from '../../compoments/MainInput';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpFormData, signUpSchema } from '../../utils/validators';


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


    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();
    const login = useStore((s) => s.login);
    const setIsInitialLoading = useStore(s => s.setIsInitialLoading);


    const [loading, setLoading] = useState(false)

    const { control, handleSubmit, formState: { errors } } = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            password: '',
            email: '',
            confirmPassword: '',
        },
        mode: 'onBlur'
    });

    const signInWithGoogle = async () => {
        setIsLoading(true);
        try {
            login();
        } catch (e) { }
        finally {
            setIsLoading(false);
        }
    }

    async function signUpWithEmail({ email, password }: SignUpFormData) {


        setLoading(true);
        setIsInitialLoading(true)
        try {
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
            });

            if (error) throw error;

        } catch (error: any) {
            Alert.alert('Login Failed', error.message);
            setIsInitialLoading(false);
        } finally {
            setLoading(false);
        }
    }



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
                            <Controller
                                control={control}
                                name="email"
                                render={({ field: { onChange, value, onBlur } }) => (
                                    <MainInput label="Email Address" placeHolder="name@example.com" onChangeText={onChange} value={value} error={errors.email?.message} onBlur={onBlur}
                                    />
                                )}
                            />
                            <Controller
                                control={control}
                                name="password"
                                render={({ field: { onChange, value, onBlur } }) => (
                                    <MainInput label="Password" placeHolder="••••••••" onChangeText={onChange} value={value} error={errors.password?.message} onBlur={onBlur} secureTextEntry
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="confirmPassword"
                                render={({ field: { onChange, value, onBlur } }) => (
                                    <MainInput label="Confirm New Password" placeHolder="••••••••" onChangeText={onChange} value={value} error={errors.confirmPassword?.message} onBlur={onBlur} secureTextEntry
                                    />
                                )}
                            />
                        </View>

                        <View style={styles.form}>

                            {/* --- Sign In Button --- */}
                            <CustomButton title='Register' onPress={handleSubmit(signUpWithEmail)} variant='login' loading={loading} />

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
    strengthRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8, marginLeft: 16, marginBottom: 8 },
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