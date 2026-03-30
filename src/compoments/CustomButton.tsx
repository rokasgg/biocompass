import { TouchableOpacity, Text, StyleSheet, Platform, View } from 'react-native';

import React from 'react';

interface Props {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary';
    icon?: React.ReactNode;
}

export const CustomButton = ({ title, onPress, variant = 'primary', icon }: Props) => (
    <TouchableOpacity
        style={[styles.button, variant === 'secondary' && styles.secondary]}
        onPress={onPress}
        activeOpacity={0.85}
        {...(Platform.OS === 'android' ? { android_ripple: { color: 'rgba(255,255,255,0.15)' } } : {})}
    >
        {icon ? <View style={styles.iconContainer}>{icon}</View> : null}
        <Text style={[styles.text, variant === 'secondary' && styles.textSecondary]}>{title}</Text>
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
});