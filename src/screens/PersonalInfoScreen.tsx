import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
    Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from '@react-navigation/native';

import { THEME } from '../theme';
import { useStore } from '../store/useStore';
import { AuthProfileFormData, authProfileSchema } from '../utils/validators';
import MainInput from '../compoments/MainInput';
import PrimaryDatePicker from '../compoments/PrimaryDatePicker';
import { supabase } from '../../backend/supabase';
import { mapProfileToDB } from '../utils/mapper';

const { width } = Dimensions.get('window');

const PersonalInfoScreen = () => {
    const navigation = useNavigation();
    const user = useStore(s => s.user ?? null);
    const setUser = useStore(s => s.setUser);

    // 1. Setup Form with default values directly from store
    const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<AuthProfileFormData>({
        resolver: zodResolver(authProfileSchema),
        defaultValues: {
            fullName: user ? `${user.firstName} ${user.lastName}` : '',
            email: user?.email || '',
            phone: user?.phone || '',
            birthDate: user?.birthDate || '1994-03-12', // Use ISO format for better compatibility
        },
        mode: 'onBlur'
    });

    // 2. Optimized Save Logic
    const saveSettings = async (data: AuthProfileFormData) => {
        try {
            console.log("Saving validated data:", data);

            // Update local store first for optimistic UI or just to keep sync
            const [firstName, ...lastNameParts] = data.fullName.split(' ');
            const updatedUser = {
                ...user,
                firstName,
                lastName: lastNameParts.join(' '),
                email: data.email,
                phone: data.phone,
                birthDate: data.birthDate
            };

            const dbProfile = mapProfileToDB(updatedUser);

            const { error } = await supabase
                .from('profiles')
                .update(dbProfile)
                .eq('id', user?.userId);

            if (error) throw error;

            setUser(updatedUser);
            Alert.alert("Success", "Profile updated successfully!");
        } catch (error: any) {
            console.error('Error updating user:', error);
            Alert.alert("Error", error.message || "Failed to update profile.");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backArrow}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Personal Info</Text>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    <View style={styles.profileHeader}>
                        <View style={styles.avatarWrapper}>
                            <Image
                                source={{ uri: 'https://avatar.iran.liara.run/public/woman' }}
                                style={styles.avatarImage}
                            />
                            <TouchableOpacity style={styles.editBadge}>
                                <Text style={{ fontSize: 12, color: 'white' }}>✎</Text>
                            </TouchableOpacity>
                        </View>
                        {/* We can use watch() from useForm if you want this text to update live */}
                        <Text style={styles.userName}>{user?.firstName} {user?.lastName}</Text>
                        <Text style={styles.memberSince}>Member since June 2023</Text>
                    </View>

                    <View style={styles.formSection}>
                        <Controller
                            control={control}
                            name="fullName"
                            render={({ field: { onChange, value, onBlur } }) => (
                                <MainInput
                                    label="Full Name"
                                    onChangeText={onChange}
                                    value={value}
                                    error={errors.fullName?.message}
                                    onBlur={onBlur}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="email"
                            render={({ field: { onChange, value, onBlur } }) => (
                                <MainInput
                                    label="Email Address"
                                    inputType="email-address"
                                    onChangeText={onChange}
                                    value={value}
                                    error={errors.email?.message}
                                    onBlur={onBlur}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="phone"
                            render={({ field: { onChange, value, onBlur } }) => (
                                <MainInput
                                    label="Phone Number"
                                    inputType="phone-pad"
                                    onChangeText={onChange}
                                    value={value}
                                    error={errors.phone?.message}
                                    onBlur={onBlur}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="birthDate"
                            render={({ field: { onChange, value } }) => (
                                <PrimaryDatePicker
                                    label="Birth Date"
                                    value={value ? new Date(value) : new Date()}
                                    onChange={(selectedDate) => {
                                        // Convert Date object back to string for the form state
                                        onChange(selectedDate.toISOString().split('T')[0]);
                                    }}
                                    error={errors.birthDate?.message}
                                />
                            )}
                        />
                    </View>

                    <View style={styles.infoCard}>
                        <View style={{ maxWidth: '70%' }}>
                            <Text style={styles.infoTitle}>Restorative Pulse</Text>
                            <Text style={styles.infoSubtitle}>
                                Your metrics help us curate a wellness journey that respects your body's unique rhythm.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.actionSection}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={handleSubmit(saveSettings)}
                            disabled={isSubmitting}
                        >
                            <LinearGradient
                                colors={[THEME.colors.primary, THEME.colors.primaryContainer]}
                                style={[styles.saveBtn, isSubmitting && { opacity: 0.7 }]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Text style={styles.saveBtnText}>
                                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <Text style={styles.lastUpdated}>LAST UPDATED: 2 DAYS AGO</Text>
                    </View>

                </ScrollView>
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

    formSection: { gap: 4, marginBottom: 24 },
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