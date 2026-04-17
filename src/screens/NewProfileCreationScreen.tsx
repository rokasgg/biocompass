import React, { useEffect, useState, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { THEME } from '../theme';
import LeafIcon from '../../assets/icons/LEAFS.svg';
import { useStore } from '../store/useStore';
import { supabase } from '../../backend/supabase';
import PrimaryInput from '../compoments/PrimaryInput';
import BioLoader from '../compoments/BioLoader';
import { mapProfileFromDB } from '../utils/mapper';
import PrimaryDatePicker from '../compoments/PrimaryDatePicker';

const NewProfileCreationScreen = () => {
    const scrollViewRef = useRef<ScrollView>(null); // Reikalingas sklandžiam scroll'ui
    const [isLoading, setIsLoading] = useState(false);
    const registeredEmail = useStore(s => s.email);
    const userId = useStore(s => s.userId);
    const syncFromDB = useStore(s => s.syncFromDB);
    const setUserCompletedReg = useStore(s => s.setUserCompletedReg);

    const [birthDate, setBirthDate] = useState<Date>(new Date());
    const [phone, setPhone] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const updateProfileDB = async () => {
        setIsLoading(true);
        try {
            const { data: profileData, error } = await supabase.from('profiles').update([{
                username: `${firstName.toLowerCase()}_${lastName.toLowerCase()}`,
                first_name: firstName,
                last_name: lastName,
                email: registeredEmail,
                subscribed: true,
                phone: phone,
                updated_at: new Date(),
                birth_date: birthDate.toISOString(), // Pataisytas lauko pavadinimas į birth_date
            }]).eq('id', userId).select();

            if (error) throw error;

            const formattedProfile = mapProfileFromDB(profileData[0]);
            syncFromDB({
                profile: formattedProfile,
                currentScore: profileData[0].score || 0,
                breathingStats: profileData[0].stats || { totalSessions: 0, byType: {}, history: [] }
            });
            setUserCompletedReg(true);
        } catch (e) {
            console.log('Error integrating in DB:', e);
        } finally {
            setIsLoading(false);
        }
    };

    // Funkcija, kurią iškviečiame, kai atidaromas DatePicker
    const handleDatePickerPress = () => {
        // Skiriame šiek tiek laiko komponentui išsiplėsti, tada scroll'inam į apačią
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                // Svarbu: offset'as padeda išvengti persidengimo su status bar / headeriu
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView
                    ref={scrollViewRef}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    // Šis prop'as automatiškai pakelia inputą virš klaviatūros
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.welcomeSection}>
                        <View style={styles.iconCircle}>
                            <LeafIcon width={28} height={28} fill={THEME.colors.primary} />
                        </View>
                        <Text style={styles.title}>Fill out the form</Text>
                        <Text style={styles.subtitle}>We want to know a little bit about you...</Text>
                    </View>

                    <View style={styles.formCard}>
                        <View style={styles.form}>
                            <PrimaryInput
                                label='First Name'
                                placeHolder='First name'
                                onChangeText={setFirstName}
                                value={firstName}
                            />

                            <PrimaryInput
                                label='Last Name'
                                placeHolder='Last name'
                                onChangeText={setLastName}
                                value={lastName}
                            />

                            <PrimaryInput
                                label='Phone'
                                placeHolder='+1 123 231 1234'
                                onChangeText={setPhone}
                                value={phone}
                                numersOnly
                            />

                            <PrimaryDatePicker
                                label='Birth Date'
                                placeHolder='YYYY-MM-DD'
                                onChange={(date: Date) => setBirthDate(date)}
                                value={birthDate}
                                // Perduodame funkciją, kad ekranas suprastų, jog reikia pasislinkti
                                onOpen={handleDatePickerPress}
                            />

                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={updateProfileDB}
                                disabled={isLoading}
                            >
                                <LinearGradient
                                    colors={[THEME.colors.primary, THEME.colors.primaryContainer]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.signInButton}
                                >
                                    {isLoading ? (
                                        <BioLoader size="small" color="white" />
                                    ) : (
                                        <>
                                            <Text style={styles.signInButtonText}>Begin your Journey</Text>
                                            <Text style={{ color: 'white', marginLeft: 8 }}>→</Text>
                                        </>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

// ... stiliai lieka tokie patys

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
});

export default NewProfileCreationScreen;