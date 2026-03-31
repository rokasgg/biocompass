import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Animated
} from 'react-native';
import { THEME } from '../theme';

const InputField = ({
    label,
    icon: Icon,
    secure,
    rightIcon: RightIcon,
    onRightIconPress,
    error,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(!secure);

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}

            <View style={[
                styles.inputWrapper,
                isFocused && styles.inputWrapperFocused,
                error && styles.inputWrapperError
            ]}>
                {Icon && (
                    <View style={styles.leftIcon}>
                        <Icon
                            width={20}
                            height={20}
                            fill={isFocused ? THEME.colors.primary : THEME.colors.onSurfaceVariant}
                            opacity={isFocused ? 1 : 0.5}
                        />
                    </View>
                )}

                <TextInput
                    style={styles.input}
                    placeholderTextColor={THEME.colors.outlineVariant}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    secureTextEntry={secure && !passwordVisible}
                    {...props}
                />

                {secure ? (
                    <TouchableOpacity
                        style={styles.rightIcon}
                        onPress={() => setPasswordVisible(!passwordVisible)}
                    >
                        <Text style={{ fontSize: 18 }}>{passwordVisible ? '👁️' : '🙈'}</Text>
                    </TouchableOpacity>
                ) : RightIcon ? (
                    <TouchableOpacity style={styles.rightIcon} onPress={onRightIconPress}>
                        <RightIcon width={20} height={20} fill={THEME.colors.onSurfaceVariant} />
                    </TouchableOpacity>
                ) : null}
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 20,
    },
    label: {
        fontFamily: 'Plus Jakarta Sans', // Ensure this is loaded in your project
        fontSize: 13,
        fontWeight: '700',
        color: THEME.colors.primary,
        marginBottom: 8,
        marginLeft: 4,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: THEME.colors.surfaceContainerLow,
        borderRadius: 16, // Matching your "lg" border radius
        height: 56,
        paddingHorizontal: 16,
        borderWidth: 1.5,
        borderColor: 'transparent',
        // transition: 'all 0.3s ease',
    },
    inputWrapperFocused: {
        backgroundColor: THEME.colors.onSurface,
        borderColor: THEME.colors.primary + '30', // Subtle green glow
        shadowColor: THEME.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    inputWrapperError: {
        borderColor: THEME.colors.error,
        backgroundColor: THEME.colors.errorContainer + '20',
    },
    leftIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontFamily: 'Manrope',
        fontSize: 16,
        color: THEME.colors.onSurface,
        height: '100%',
    },
    rightIcon: {
        padding: 4,
    },
    errorText: {
        color: THEME.colors.error,
        fontSize: 12,
        fontWeight: '600',
        marginTop: 4,
        marginLeft: 8,
    }
});

export default InputField;