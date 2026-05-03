import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native'; // Pataisiau importus
import { SafeAreaView } from 'react-native-safe-area-context';
import { THEME } from '../theme';
import { useNavigation } from '@react-navigation/native';
import MainInput from '../compoments/MainInput';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordSchema, PasswordFormData } from "../utils/validators";
import { CustomButton } from '../compoments/CustomButton';
import { supabase } from '../../backend/supabase';

const ResetPasswordScreen = () => {
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const { control, handleSubmit, formState: { errors } } = useForm<PasswordFormData>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
        mode: 'onBlur'
    });

    // TIKROJI slaptažodžio atnaujinimo funkcija
    const onSubmit = async (data: PasswordFormData) => {
        setLoading(true);
        try {
            // Kadangi vartotojas atėjo iš Deep Link, Supabase jį laiko "prijungtu"
            // Mes tiesiog atnaujinam jo duomenis
            const { error } = await supabase.auth.updateUser({
                password: data.password
            });

            if (error) throw error;

            Alert.alert(
                "Success!",
                "Your password has been updated. You can now use the app.",
                [{ text: "Great!", onPress: () => navigation.navigate('MainTabs') }]
            );

        } catch (error: any) {
            console.error('Update password error:', error);
            Alert.alert("Error", error.message || "Failed to update password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Create a New Password</Text>
                <Text style={styles.subtitle}>
                    Your new password must be different from your previously used passwords.
                </Text>

                <View style={styles.form}>
                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange, value, onBlur } }) => (
                            <MainInput
                                label="New Password"
                                placeHolder="••••••••"
                                onChangeText={onChange}
                                value={value}
                                error={errors.password?.message}
                                onBlur={onBlur}
                                secureTextEntry // Nepamiršk paslėpti simbolių!
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="confirmPassword"
                        render={({ field: { onChange, value, onBlur } }) => (
                            <MainInput
                                label="Confirm New Password"
                                placeHolder="••••••••"
                                onChangeText={onChange}
                                value={value}
                                error={errors.confirmPassword?.message}
                                onBlur={onBlur}
                                secureTextEntry
                            />
                        )}
                    />
                </View>

                <View style={{ width: '100%' }}>
                    <CustomButton
                        title='Reset Password'
                        onPress={handleSubmit(onSubmit)}
                        loading={loading}
                        variant='primary'
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: THEME.colors.background },
    content: { paddingHorizontal: 30, paddingTop: 40, alignItems: 'center', width: '100%' },
    form: { width: '100%', gap: 12, marginBottom: 40 },

    title: { fontSize: 28, fontWeight: '800', textAlign: 'center', color: THEME.colors.onSurface, marginBottom: 12 },
    subtitle: { fontSize: 16, textAlign: 'center', color: THEME.colors.onSurfaceVariant, lineHeight: 24, marginBottom: 40 },





});

export default ResetPasswordScreen;