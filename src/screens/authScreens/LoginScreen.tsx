import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Image,
    Linking,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { THEME } from '../../theme';
import LeafIcon from '../../../assets/icons/leaf.svg';

import { useStore } from '../../store/useStore';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../../backend/supabase';

import { CustomButton } from '../../compoments/CustomButton';
import MainInput from '../../compoments/MainInput';


import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormData, loginSchema } from '../../utils/validators';

const LoginScreen = () => {

    const [loading, setLoading] = useState(false);
    const errorMessage = useStore(s => s.errorMessage);
    const setErrorMessage = useStore(s => s.setErrorMessage);
    const clearError = useStore(s => s.clearError);
    const setIsInitialLoading = useStore(s => s.setIsInitialLoading);
    const navigation = useNavigation();

    const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            password: '',
            email: '',
        },
        mode: 'onBlur'
    });


    async function signInWithEmail({ email, password }: LoginFormData) {
        setLoading(true);
        setIsInitialLoading(true)
        try {

            const { error: authError } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (authError) throw authError;
        } catch (error: any) {

            setErrorMessage(error.message);
            setIsInitialLoading(false);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!errorMessage) return;

        const timer = setTimeout(() => {
            clearError();
        }, 5000);

        return () => {
            clearTimeout(timer);
            clearError();
        };
    }, [errorMessage]);

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
                    {/* --- Welcome Text --- */}
                    <View style={styles.welcomeSection}>
                        <View style={styles.iconCircle}>
                            <LeafIcon width={28} height={28} fill={THEME.colors.primary} />
                        </View>
                        <Text style={styles.title}>Welcome Back</Text>
                        <Text style={styles.subtitle}>Continue your journey to mindful living.</Text>
                    </View>

                    {/* --- Error Display Card --- */}
                    {errorMessage &&

                        <View style={styles.errorSection}>
                            <Text style={styles.errorTitle}>{errorMessage}</ Text>
                        </View>}

                    {/* --- Form Card --- */}
                    <View style={styles.formCard}>


                        <Controller
                            control={control}
                            name="email"
                            render={({ field: { onChange, value, onBlur } }) => (
                                <MainInput label="Email Address" placeHolder="name@example.com" onChangeText={onChange} value={value} error={errors.email?.message} onBlur={onBlur}
                                />
                            )}
                        />



                        <View style={styles.inputGroup}>
                            <View style={styles.labelRow}>
                                <Text style={styles.label}>Password</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                                    <Text style={styles.forgotText}>Forgot Password?</Text>
                                </TouchableOpacity>
                            </View>
                            <Controller
                                control={control}
                                name="password"
                                render={({ field: { onChange, value, onBlur } }) => (
                                    <MainInput label="" placeHolder="••••••••" onChangeText={onChange} value={value} error={errors.password?.message} onBlur={onBlur} secureTextEntry
                                    />
                                )}
                            />
                        </View>

                        {/* --- Sign In Button --- */}

                        <CustomButton title='Sign In' onPress={handleSubmit(signInWithEmail)} loading={loading} variant='login' />

                        {/* --- Divider --- */}
                        <View style={styles.dividerRow}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>OR</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        {/* --- Social Buttons --- */}
                        <View style={styles.socialRow}>
                            <TouchableOpacity style={styles.socialButton} >
                                <FontAwesome name="google" size={18} color="#000" />
                                <Text style={styles.socialButtonText}>Google</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.socialButton} >
                                <FontAwesome name="apple" size={18} color="#000" />
                                <Text style={styles.socialButtonText}>Apple</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* --- Footer --- */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>New to Sage?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                            <Text style={styles.createAccountText}>Create Account</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    errorSection: {
        backgroundColor: THEME.colors.errorContainer,
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        alignItems: 'center',
        borderColor: THEME.colors.error,
        borderWidth: 1,
    },
    errorTitle: {
        fontWeight: '600',
        fontSize: 18,
    },
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
    label: { fontSize: 14, fontWeight: '500', color: THEME.colors.onSurfaceVariant, marginLeft: 4, marginBottom: 8 },
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
});

export default LoginScreen;