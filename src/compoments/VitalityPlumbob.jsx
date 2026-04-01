import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { THEME } from '../theme';

const VitalityPlumbob = ({ score = 0, isLoading = false }) => {
    // 1. Create a "Value" that we can animate (0 to 1)
    const spinValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isLoading) {
            // 2. Start a continuous spinning animation
            Animated.loop(
                Animated.timing(spinValue, {
                    toValue: 1,
                    duration: 2000,
                    easing: Easing.linear,
                    useNativeDriver: true, // This makes it smooth and fast
                })
            ).start();
        } else {
            // 3. Stop spinning and settle at a slight tilt
            Animated.timing(spinValue, {
                toValue: 0.125, // This represents 45 degrees
                duration: 800,
                useNativeDriver: true,
            }).start();
        }
    }, [isLoading]);

    // 4. Map the 0-1 value to degrees (0 to 360)
    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const getVibeColor = () => {
        if (isLoading) return THEME.colors.outlineVariant;
        if (score >= 80) return THEME.colors.primary;
        if (score >= 50) return '#EAB308';
        return THEME.colors.error;
    };

    const activeColor = getVibeColor();

    return (
        <View style={styles.container}>
            {/* 5. Use Animated.View instead of MotiView */}
            <Animated.View style={{ transform: [{ rotateY: spin }] }}>
                <Svg width="80" height="170" viewBox="0 0 120 200">
                    <Defs>
                        <LinearGradient id="plumbobGrad" x1="0" y1="0" x2="1" y2="1">
                            <Stop offset="0" stopColor={activeColor} stopOpacity={1} />
                            <Stop offset="1" stopColor={activeColor} stopOpacity={0.6} />
                        </LinearGradient>
                    </Defs>
                    <Path d="M60 0 L120 100 L60 120 L0 100 Z" fill="url(#plumbobGrad)" />
                    <Path d="M60 200 L120 100 L60 120 L0 100 Z" fill={activeColor} opacity={0.8} />
                    <Path d="M60 0 L60 120 L120 100 Z" fill="black" opacity={0.1} />
                </Svg>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { height: 300, alignItems: 'center', justifyContent: 'center' }
});

export default VitalityPlumbob;