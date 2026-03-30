import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { THEME } from '../theme';
import { useAuthStore } from '../store/useAuthStore';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Pull the login function from your Zustand store
    const login = useAuthStore((state) => state.login);

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
                    {/* --- Header / Brand --- */}
                    <View style={styles.brandHeader}>
                        <Text style={styles.brandText}>Sage Wellness</Text>
                    </View>

                    {/* --- Welcome Text --- */}
                    <View style={styles.welcomeSection}>
                        <View style={styles.iconCircle}>
                            <Text style={{ fontSize: 32 }}>🌿</Text>
                        </View>
                        <Text style={styles.title}>Welcome Back</Text>
                        <Text style={styles.subtitle}>Continue your journey to mindful living.</Text>
                    </View>

                    {/* --- Form Card --- */}
                    <View style={styles.formCard}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email Address</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="name@example.com"
                                placeholderTextColor={THEME.colors.outlineVariant}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <View style={styles.labelRow}>
                                <Text style={styles.label}>Password</Text>
                                <TouchableOpacity>
                                    <Text style={styles.forgotText}>Forgot Password?</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.passwordWrapper}>
                                <TextInput
                                    style={[styles.input, { flex: 1 }]}
                                    placeholder="••••••••"
                                    placeholderTextColor={THEME.colors.outlineVariant}
                                    secureTextEntry={!showPassword}
                                    value={password}
                                    onChangeText={setPassword}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    style={styles.eyeIcon}
                                >
                                    <Text>{showPassword ? '👁️' : '🙈'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* --- Sign In Button --- */}
                        <TouchableOpacity onPress={login} activeOpacity={0.8}>
                            <LinearGradient
                                colors={[THEME.colors.primary, THEME.colors.primaryContainer]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.signInButton}
                            >
                                <Text style={styles.signInButtonText}>Sign In</Text>
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
                            <TouchableOpacity style={styles.socialButton}>
                                <FontAwesome name="google" size={18} color="#fff" />
                                <Text style={styles.socialButtonText}>Google</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.socialButton}>
                                <FontAwesome name="apple" size={18} color="#fff" />
                                <Text style={styles.socialButtonText}>Apple</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* --- Footer --- */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>New to Sage?</Text>
                        <TouchableOpacity>
                            <Text style={styles.createAccountText}>Create Account</Text>
                        </TouchableOpacity>
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
    brandHeader: {
        paddingVertical: 16,
        alignItems: 'flex-start',
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
    },
    iconCircle: {
        width: 64,
        height: 64,
        backgroundColor: THEME.colors.primaryFixedDim,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: THEME.colors.onSurface,
        letterSpacing: -0.5,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        color: THEME.colors.onSurfaceVariant,
    },
    formCard: {
        backgroundColor: THEME.colors.surfaceContainerLowest,
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
        fontWeight: '700',
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
        fontWeight: '700',
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
        fontWeight: '800',
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
        fontWeight: '700',
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
        fontWeight: '800',
        marginLeft: 4,
    },
});

export default LoginScreen;