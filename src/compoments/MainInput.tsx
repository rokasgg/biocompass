import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput, StyleSheet
} from 'react-native';

import { THEME } from '../theme';
import { EyeIcon } from '../../assets/icons';

type InputProps = {
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    secureTextEntry?: boolean,
    placeHolder?: string,
    numersOnly?: boolean,
    inputType?: 'email-address' | 'decimal-pad' | 'phone-pad' | 'default',
    error?: string,
    onBlur?: () => void
}

const MainInput = ({ label, value, onChangeText, secureTextEntry, placeHolder, inputType = 'default', error, ...props }: InputProps) => {

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const shouldHideText = secureTextEntry && !isPasswordVisible;

    return (
        <View style={styles.inputGroup}>
            {label && <Text style={styles.label}>{label}</Text>}

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder={placeHolder}
                    placeholderTextColor={THEME.colors.outlineVariant}
                    keyboardType={inputType}
                    autoCapitalize="none"
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={shouldHideText}
                    {...props}
                />
                {secureTextEntry && (
                    <TouchableOpacity
                        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                        style={styles.eyeIcon}
                        activeOpacity={0.7}
                    >
                        <EyeIcon
                            width={18}
                            height={18}
                            fill={isPasswordVisible ? THEME.colors.onSurface : THEME.colors.outlineVariant}
                        />
                    </TouchableOpacity>
                )}
            </View>

            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    )
};

const styles = StyleSheet.create({
    inputGroup: {
        marginBottom: 24,
    },
    label: { fontSize: 14, fontWeight: '500', color: THEME.colors.onSurfaceVariant, marginLeft: 4, marginBottom: 8 },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: THEME.colors.surfaceContainerLow,
        borderRadius: 12,
    },
    input: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: THEME.colors.onSurface,
    },
    eyeIcon: {
        paddingHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    error: { color: THEME.colors.error, fontSize: 12, marginTop: 4, marginLeft: 4 },
});

export default MainInput