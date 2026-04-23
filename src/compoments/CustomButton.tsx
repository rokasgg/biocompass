import { TouchableOpacity, Text, StyleSheet, Platform, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import BioLoader from './BioLoader';
import { THEME } from '../theme';

interface Props {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'login';
    icon?: React.ReactNode;
    loading?: boolean;
}

export const CustomButton = ({ title, onPress, variant = 'primary', icon, loading }: Props) => (
    //style={[styles.button, variant === 'secondary' && styles.secondary]}
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} >
        <LinearGradient
            colors={[THEME.colors.primary, THEME.colors.primaryContainer]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.signInButton}
        >
            {!loading ?
                <>
                    <Text style={styles.signInButtonText}>{title}</Text>
                    {variant === 'login' && <Text style={{ color: 'white', marginLeft: 8 }}>→</Text>}
                </>
                :
                <View style={{ justifyContent: 'center', alignContent: 'center', paddingBottom: 4 }}>
                    <BioLoader size={'small'} color='white' />
                </View>
            }
        </LinearGradient>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    button: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: '#007AFF',
        // iOS shadow
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        // Android elevation
        elevation: 4,
    },
    secondary: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#6c757d',
    },
    text: {
        color: 'white',
        textAlign: 'center',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.6,
    },
    textSecondary: {
        color: '#6c757d',
    },
    iconContainer: { marginRight: 10 },
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
});