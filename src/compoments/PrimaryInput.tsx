import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput, StyleSheet
} from 'react-native';

import { THEME } from '../theme';

type InputProps = {
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    secureTextEntry?: boolean,
    placeHolder?: string,
    numersOnly?: boolean,
}

const PrimaryInput = ({ label, value, onChangeText, secureTextEntry, placeHolder, numersOnly }: InputProps) => (
    <View style={styles.inputGroup}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.inputWrapper}>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholderTextColor={THEME.colors.outlineVariant}
                secureTextEntry={secureTextEntry}
                autoCapitalize="none"
                placeholder={placeHolder ?? 'name@example.com'}
                numberOfLines={1}
                keyboardType={numersOnly ? 'numeric' : 'default'}
            />
        </View>
    </View>
);

const styles = StyleSheet.create({
    form: { gap: 24 },
    inputGroup: { gap: 8 },
    label: { fontSize: 14, fontWeight: '700', color: THEME.colors.onSurfaceVariant, marginLeft: 8 },
    inputWrapper: { justifyContent: 'center' },
    input: {
        height: 56,
        backgroundColor: THEME.colors.surfaceContainerLow,
        borderRadius: THEME.radius.md,
        paddingHorizontal: 24,
        fontSize: 16,
        color: THEME.colors.onSurface,
    },
    eyeBtn: { position: 'absolute', right: 20 },
});


export default PrimaryInput