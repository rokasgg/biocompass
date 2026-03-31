import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { THEME } from '../theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackIcon, EmailIcon, SendIcon } from '../../assets/icons';
import { useNavigation } from '@react-navigation/native';

const width = Dimensions.get('window').width;

const VerifyCodeScreen = () => {
    const [code, setCode] = useState('');
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}><BackIcon width={24} fill={THEME.colors.primary} /></TouchableOpacity>
                <Text style={styles.headerTitle}>Verification</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.otpIllustration}>
                    <EmailIcon width={48} height={48} fill={THEME.colors.primary} />
                </View>

                <Text style={styles.title}>Check Your Email</Text>
                <Text style={styles.subtitle}>We've sent a 6-digit code to your email. Enter it below to continue.</Text>

                <View style={styles.otpGrid}>
                    {[...Array(6)].map((_, i) => (
                        <View key={i} style={styles.otpBox}>
                            <Text style={styles.otpText}>{code[i] || '·'}</Text>
                        </View>
                    ))}
                </View>

                {/* Hidden Input to trigger keyboard */}
                <TextInput
                    value={code}
                    onChangeText={(val) => val.length <= 6 && setCode(val)}
                    keyboardType="number-pad"
                    style={styles.hiddenInput}
                    autoFocus
                />

                <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')}>
                    <LinearGradient colors={[THEME.colors.primary, THEME.colors.primaryContainer]} style={styles.primaryBtn}>
                        <Text style={styles.btnText}>Verify Code</Text>
                    </LinearGradient>
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: THEME.colors.background
    },
    header: {
        height: 64,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: THEME.colors.primary,
        fontFamily: 'Plus Jakarta Sans'
    },
    content: {
        flex: 1,
        paddingHorizontal: 30,
        paddingTop: 40,
        alignItems: 'center'
    },

    // --- Illustration ---
    otpIllustration: {
        width: 120,
        height: 120,
        backgroundColor: THEME.colors.surfaceContainerLow,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
        overflow: 'hidden'
    },
    illustrationGradient: {
        position: 'absolute',
        inset: 0,
        opacity: 0.2
    },

    // --- Text ---
    title: {
        fontSize: 32,
        fontWeight: '800',
        textAlign: 'center',
        color: THEME.colors.onSurface,
        marginBottom: 16,
        fontFamily: 'Plus Jakarta Sans'
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: THEME.colors.onSurfaceVariant,
        lineHeight: 24,
        marginBottom: 48,
        maxWidth: 280
    },

    // --- OTP Grid ---
    otpGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 48
    },
    otpBox: {
        width: (width - 100) / 6, // Dynamically fits 6 boxes with spacing
        aspectRatio: 0.85,
        backgroundColor: THEME.colors.surfaceContainerLow,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: 'transparent'
    },
    otpBoxActive: {
        borderColor: THEME.colors.primary,
        backgroundColor: THEME.colors.surfaceContainerLowest,
    },
    otpText: {
        fontSize: 24,
        fontWeight: '800',
        color: THEME.colors.primary,
        fontFamily: 'Plus Jakarta Sans'
    },
    hiddenInput: {
        position: 'absolute',
        opacity: 0,
        width: 1,
        height: 1
    },

    // --- Action Button ---
    primaryBtn: {
        width: width - 60,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        ...THEME.shadows.editorial
    },
    btnText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '800'
    },

    // --- Resend Section ---
    resendContainer: {
        marginTop: 32,
        alignItems: 'center',
        gap: 8
    },
    resendLabel: {
        fontSize: 14,
        color: THEME.colors.onSurfaceVariant,
        fontWeight: '500'
    },
    resendBtnText: {
        fontSize: 14,
        fontWeight: '800',
        color: THEME.colors.secondary,
        textDecorationLine: 'underline',
        textDecorationColor: THEME.colors.primary + '50'
    },

    // --- Security Badge (Bottom) ---
    footerBadge: {
        marginTop: 'auto',
        width: '100%',
        backgroundColor: THEME.colors.surfaceContainerLow,
        padding: 20,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16
    },
    badgeIconBg: {
        padding: 8,
        backgroundColor: 'white',
        borderRadius: 10,
        ...THEME.shadows.editorial
    },
    badgeTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: THEME.colors.onSurface,
        marginBottom: 2
    },
    badgeSub: {
        fontSize: 12,
        color: THEME.colors.onSurfaceVariant,
        lineHeight: 18
    }
});

export default VerifyCodeScreen;