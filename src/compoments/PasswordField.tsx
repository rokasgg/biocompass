import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput, StyleSheet
} from 'react-native';

import { THEME } from '../theme';
import { EyeIcon } from '../../assets/icons';


type PasswordFieldProps = {
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    secureTextEntry: boolean,
    toggleVisible: () => void,
    isVisible?: boolean,
}


const PasswordField = ({ label, value, onChangeText, secureTextEntry, toggleVisible, isVisible }: PasswordFieldProps) => (
    <View style={styles.inputGroup}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.inputWrapper}>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder="••••••••"
                placeholderTextColor={THEME.colors.outlineVariant}
                secureTextEntry={secureTextEntry}
                autoCapitalize="none"
            />
            <TouchableOpacity onPress={toggleVisible} style={styles.eyeBtn}>
                <EyeIcon width={20} height={20} fill={isVisible ? THEME.colors.outline : THEME.colors.outlineVariant} />
            </TouchableOpacity>
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
        borderRadius: 28,
        paddingHorizontal: 24,
        fontSize: 16,
        color: THEME.colors.onSurface,
    },
    eyeBtn: { position: 'absolute', right: 20 },
});


export default PasswordField