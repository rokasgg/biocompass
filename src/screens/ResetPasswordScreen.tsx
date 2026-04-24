import React, { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { THEME } from '../theme';
// import { InputField } from '../compoments/InputField';     
import { useNavigation } from '@react-navigation/native';

import InputField from '../compoments/InputField';
import MainInput from '../compoments/MainInput';
import { useState } from 'react';


import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordSchema, PasswordFormData } from "../utils/validators";
import { CustomButton } from '../compoments/CustomButton';


const ResetPasswordScreen = () => {
    const [loading, isLoading] = useState(false);

    const { control, handleSubmit, formState: { errors } } = useForm<PasswordFormData>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
        mode: 'onBlur'
    });

    const onSubmit = (data: PasswordFormData, errors: any) => {
        console.log('data:', data);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Create a New Password</Text>
                <Text style={styles.subtitle}>Your new password must be different from your previously used passwords.</Text>

                <View style={styles.form}>
                    <Controller
                        control={control}
                        name="password"

                        render={({ field: { onChange, value, onBlur } }) => (
                            <MainInput label="New Password" placeHolder="••••••••" onChangeText={onChange} value={value} error={errors.password?.message}
                                onBlur={onBlur}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="confirmPassword"
                        render={({ field: { onChange, value, onBlur } }) => (
                            <MainInput label="Confirm New Password" placeHolder="••••••••" onChangeText={onChange} value={value} error={errors.confirmPassword?.message} onBlur={onBlur}
                            />
                        )}
                    />

                </View>
                <View style={{ width: '100%' }}>
                    <CustomButton title='Reset Password' onPress={handleSubmit(onSubmit)} loading={loading} variant='primary' />
                </View>

            </View>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: THEME.colors.background },
    header: { height: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
    headerTitle: { fontSize: 18, fontWeight: '700', color: THEME.colors.primary },
    content: { paddingHorizontal: 30, paddingTop: 40, alignItems: 'center', width: '100%' },
    form: { width: '100%', gap: 12, marginBottom: 40 },

    title: { fontSize: 28, fontWeight: '800', textAlign: 'center', color: THEME.colors.onSurface, marginBottom: 12 },
    subtitle: { fontSize: 16, textAlign: 'center', color: THEME.colors.onSurfaceVariant, lineHeight: 24, marginBottom: 40 },


    label: { fontSize: 14, fontWeight: '700', color: THEME.colors.primary, marginBottom: 8, paddingLeft: 4 },


    primaryBtn: { width: '100%', height: 56, borderRadius: 28, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, ...THEME.shadows.editorial },
    btnText: { color: 'white', fontSize: 18, fontWeight: '800' },


    chip: { backgroundColor: THEME.colors.surfaceContainer, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    chipText: { fontSize: 12, fontWeight: '600', color: THEME.colors.secondary },
});

export default ResetPasswordScreen;