import React, { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { THEME } from '../theme';
// import { InputField } from '../compoments/InputField';     
import { useNavigation } from '@react-navigation/native';

import InputField from '../compoments/InputField';


const ResetPasswordScreen = () => {
    const navigation = useNavigation();
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Create a New Password</Text>
                <Text style={styles.subtitle}>Your new password must be different from your previously used passwords.</Text>

                <View style={styles.form}>
                    <InputField label="New Password" placeholder="••••••••" secure />
                    <InputField label="Confirm New Password" placeholder="••••••••" secure />

                    <View style={styles.chipRow}>
                        <RequirementChip label="8+ Characters" met />
                        <RequirementChip label="Upper & lowercase" />
                        <RequirementChip label="One number" />
                    </View>
                </View>

                <TouchableOpacity onPress={() => navigation.navigate('Auth')}>
                    <LinearGradient colors={[THEME.colors.primary, THEME.colors.primaryContainer]} style={styles.primaryBtn}>
                        <Text style={styles.btnText}>Reset Password</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const RequirementChip = ({ label, met }) => (
    <View style={[styles.chip, met && { backgroundColor: THEME.colors.primary + '10' }]}>
        <Text style={[styles.chipText, met && { color: THEME.colors.primary }]}>{met ? '✓ ' : '○ '}{label}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: THEME.colors.background },
    header: { height: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
    headerTitle: { fontSize: 18, fontWeight: '700', color: THEME.colors.primary },
    content: { flex: 1, paddingHorizontal: 30, paddingTop: 40, alignItems: 'center' },

    heroIconWrapper: { marginBottom: 32 },
    heroCircle: { width: 96, height: 96, backgroundColor: THEME.colors.surfaceContainerLow, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
    badge: { position: 'absolute', top: -5, right: -5, width: 28, height: 28, backgroundColor: THEME.colors.primaryContainer, borderRadius: 14, borderMoving: 4, borderColor: 'white', justifyContent: 'center', alignItems: 'center' },
    badgeText: { color: 'white', fontWeight: 'bold', fontSize: 12 },

    title: { fontSize: 28, fontWeight: '800', textAlign: 'center', color: THEME.colors.onSurface, marginBottom: 12 },
    subtitle: { fontSize: 16, textAlign: 'center', color: THEME.colors.onSurfaceVariant, lineHeight: 24, marginBottom: 40 },

    inputGroup: { width: '100%', marginBottom: 32 },
    label: { fontSize: 14, fontWeight: '700', color: THEME.colors.primary, marginBottom: 8, paddingLeft: 4 },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: THEME.colors.surfaceContainerLow, borderRadius: 16 },
    mailIcon: { marginLeft: 16 },
    input: { flex: 1, height: 56, paddingHorizontal: 12, fontSize: 16, color: THEME.colors.onSurface },

    primaryBtn: { width: '100%', height: 56, borderRadius: 28, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, ...THEME.shadows.editorial },
    btnText: { color: 'white', fontSize: 18, fontWeight: '800' },

    otpGrid: { flexDirection: 'row', gap: 10, marginBottom: 40 },
    otpBox: { width: 45, height: 55, backgroundColor: THEME.colors.surfaceContainerLow, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    otpText: { fontSize: 22, fontWeight: 'bold', color: THEME.colors.primary },
    hiddenInput: { position: 'absolute', opacity: 0, width: 0, height: 0 },

    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 },
    chip: { backgroundColor: THEME.colors.surfaceContainer, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    chipText: { fontSize: 12, fontWeight: '600', color: THEME.colors.secondary },

    footerLink: { marginTop: 32, borderBottomWidth: 1, borderBottomColor: THEME.colors.primaryContainer },
    footerText: { fontSize: 14, fontWeight: '700', color: THEME.colors.secondary },
    btnContent: { flexDirection: 'row', alignItems: 'center', gap: 10 },
});

export default ResetPasswordScreen;