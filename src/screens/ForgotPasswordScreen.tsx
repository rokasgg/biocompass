import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { THEME } from '../theme';
import { MailIcon, Lock3Icon, SendIcon, BackIcon } from '../../assets/icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordFormData, forgotPasswordSchema } from '../utils/validators';

import MainInput from '../compoments/MainInput';
import { supabase } from '../../backend/supabase';


const ForgotPasswordScreen = () => {
    const [email, setEmail] = useState('');

    const navigation = useNavigation();

    const { control, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        },
        mode: 'onBlur'
    });

    const handleSendResetLink = async () => {
        // Here you would typically call your backend API to send the reset link
        // For this mockup, we'll just navigate to the VerifyCode screen
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'habitra://reset-password', // Tavo Deep Link
        });

        // navigation.navigate('VerifyCode', { email: email });
    }

    // const handleResetPassword = async (email: string) => {
    //     // Sukuria dinaminį linką (Expo Go jis bus exp://..., o išleistame appse habtra://)
    //     const resetLink = Linking.createURL('reset-password');

    //     const { error } = await supabase.auth.resetPasswordForEmail(email, {
    //         redirectTo: resetLink,
    //     });

    //     if (error) {
    //         console.error('Error sending reset password email:', error);
    //     } else {
    //         alert("Check your email!");
    //     }
    // };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <BackIcon width={24} fill={THEME.colors.primary} />
                </TouchableOpacity>

                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.heroIconWrapper}>
                    <View style={styles.heroCircle}>
                        <Lock3Icon width={48} height={48} fill={THEME.colors.primary} />
                        <View style={styles.badge}><Text style={styles.badgeText}>!</Text></View>
                    </View>
                </View>

                <Text style={styles.title}>Reset Your Password</Text>
                <Text style={styles.subtitle}>
                    Enter the email address associated with your account and we'll send you a link to reset your password.
                </Text>

                <View style={styles.inputGroup}>

                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { onChange, value, onBlur } }) => (
                            <MainInput label="Email Address" placeHolder="name@example.com" onChangeText={onChange} value={value} error={errors.email?.message} onBlur={onBlur}
                            />
                        )}
                    />
                </View>

                <TouchableOpacity onPress={handleSubmit(handleSendResetLink)} activeOpacity={0.8} style={styles.primaryBtnTouchable}>
                    <LinearGradient colors={[THEME.colors.primary, THEME.colors.primaryContainer]} style={styles.primaryBtn}>
                        <View style={styles.btnContent}>
                            <Text style={styles.btnText}>Send Reset Link</Text>
                            <SendIcon width={18} height={18} fill="white" />
                        </View>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.footerLink}>
                    <Text style={styles.footerText}>Back to Sign In</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: THEME.colors.background },
    header: { height: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
    headerTitle: { fontSize: 18, fontWeight: '700', color: THEME.colors.primary },
    content: { flex: 1, paddingHorizontal: 30, paddingTop: 40, alignItems: 'center' },

    heroIconWrapper: { marginBottom: 32 },
    heroCircle: { width: 96, height: 96, backgroundColor: THEME.colors.surfaceContainerLow, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
    badge: { position: 'absolute', top: -5, right: -5, width: 28, height: 28, backgroundColor: THEME.colors.primaryContainer, borderRadius: 14, borderColor: 'white', justifyContent: 'center', alignItems: 'center' },
    badgeText: { color: 'white', fontWeight: 'bold', fontSize: 12 },

    title: { fontSize: 28, fontWeight: '800', textAlign: 'center', color: THEME.colors.onSurface, marginBottom: 12 },
    subtitle: { fontSize: 16, textAlign: 'center', color: THEME.colors.onSurfaceVariant, lineHeight: 24, marginBottom: 40 },

    inputGroup: { width: '100%', marginBottom: 32 },
    label: { fontSize: 14, fontWeight: '700', color: THEME.colors.primary, marginBottom: 8, paddingLeft: 4 },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: THEME.colors.surfaceContainerLow, borderRadius: 16 },
    mailIcon: { marginLeft: 16 },
    input: { flex: 1, height: 56, paddingHorizontal: 12, fontSize: 16, color: THEME.colors.onSurface },

    primaryBtnTouchable: { width: '100%' },
    primaryBtn: { height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', ...THEME.shadows.editorial },
    btnContent: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    btnText: { color: 'white', fontSize: 18, fontWeight: '800', textAlign: 'center' },

    otpGrid: { flexDirection: 'row', gap: 10, marginBottom: 40 },
    otpBox: { width: 45, height: 55, backgroundColor: THEME.colors.surfaceContainerLow, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    otpText: { fontSize: 22, fontWeight: 'bold', color: THEME.colors.primary },
    hiddenInput: { position: 'absolute', opacity: 0, width: 0, height: 0 },

    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 },
    chip: { backgroundColor: THEME.colors.surfaceContainer, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    chipText: { fontSize: 12, fontWeight: '600', color: THEME.colors.secondary },

    footerLink: { marginTop: 32, borderBottomWidth: 1, borderBottomColor: THEME.colors.primaryContainer },
    footerText: { fontSize: 14, fontWeight: '700', color: THEME.colors.secondary },
    backButton: { padding: 8 },
});

export default ForgotPasswordScreen;