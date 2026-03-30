import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomButton } from '../compoments/CustomButton';
import { useStore } from '../store/useStore';

const SignInScreen: React.FC = () => {
    const login = useStore((s) => s.login);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignIn = async () => {
        if (!email.trim() || !password) {
            Alert.alert('Validation', 'Please enter email and password.');
            return;
        }
        setLoading(true);
        try {
            // TODO: Replace with real auth call
            await new Promise((r) => setTimeout(r, 600));
            login();
        } catch (e) {
            Alert.alert('Sign in failed', 'Unexpected error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inner}>
                <Text style={styles.title}>Sign In</Text>

                <View style={styles.form}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" style={styles.input} />

                    <Text style={styles.label}>Password</Text>
                    <TextInput value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />

                    <CustomButton title={loading ? 'Signing in...' : 'Sign In'} onPress={handleSignIn} />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    inner: { flex: 1, justifyContent: 'center' },
    title: { fontSize: 28, fontWeight: '700', marginBottom: 24, textAlign: 'center' },
    form: { width: '100%' },
    label: { fontSize: 12, color: '#666', marginBottom: 6 },
    input: {
        borderWidth: 1,
        borderColor: '#e6e6e6',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 16,
        backgroundColor: 'white',
    },
});

export default SignInScreen;
