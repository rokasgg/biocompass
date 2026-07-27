import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, RadialGradient, Stop } from 'react-native-svg';
import { THEME } from '../theme';

const VitalityPlumbob = ({ score = 0, isLoading = false }) => {
    const spinValue = useRef(new Animated.Value(0)).current;
    const [isDecided, setIsDecided] = useState(false);

    useEffect(() => {
        if (isLoading) {
            setIsDecided(false);
            Animated.loop(
                Animated.timing(spinValue, {
                    toValue: 1,
                    duration: 2500,
                    easing: Easing.linear,
                    useNativeDriver: true,
                })
            ).start();
        } else {
            Animated.timing(spinValue, {
                toValue: 2.125,
                duration: 3000,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }).start();

            const timer = setTimeout(() => setIsDecided(true), 400);
            return () => clearTimeout(timer);
        }
    }, [isLoading]);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '270deg'],
    });

    const getVibeColor = () => {
        if (isLoading || !isDecided) return THEME.colors.outlineVariant;
        if (score >= 70) return THEME.colors.primary;
        if (score >= 40) return '#EAB308';
        return THEME.colors.error;
    };

    const activeColor = getVibeColor();

    // Derived tones for subtle 3D shading
    const lighten = (hex, amt = 22) => {
        const n = parseInt(hex.replace('#', ''), 16);
        const r = Math.min(255, (n >> 16) + amt);
        const g = Math.min(255, ((n >> 8) & 0xff) + amt);
        const b = Math.min(255, (n & 0xff) + amt);
        return `rgb(${r},${g},${b})`;
    };
    const darken = (hex, amt = 25) => {
        const n = parseInt(hex.replace('#', ''), 16);
        const r = Math.max(0, (n >> 16) - amt);
        const g = Math.max(0, ((n >> 8) & 0xff) - amt);
        const b = Math.max(0, (n & 0xff) - amt);
        return `rgb(${r},${g},${b})`;
    };

    const lightColor = lighten(activeColor);
    const darkColor  = darken(activeColor);
    const midColor   = darken(activeColor, 12);

    const uid = activeColor.replace(/[^a-z0-9]/gi, '');

    return (
        <View style={styles.container}>
            <View style={styles.shadowEllipse} />
            <Animated.View style={{ transform: [{ rotateY: spin }] }}>
                <Svg width="110" height="190" viewBox="0 0 120 200">
                    <Defs>
                        {/* Top pyramid — left face (lit) */}
                        <LinearGradient id={`topLeft-${uid}`} x1="0" y1="0" x2="1" y2="1">
                            <Stop offset="0" stopColor={lightColor} stopOpacity={1} />
                            <Stop offset="1" stopColor={activeColor} stopOpacity={1} />
                        </LinearGradient>
                        {/* Top pyramid — right face (darker) */}
                        <LinearGradient id={`topRight-${uid}`} x1="1" y1="0" x2="0" y2="1">
                            <Stop offset="0" stopColor={activeColor} stopOpacity={1} />
                            <Stop offset="1" stopColor={darkColor} stopOpacity={1} />
                        </LinearGradient>
                        {/* Bottom pyramid — left face */}
                        <LinearGradient id={`botLeft-${uid}`} x1="0" y1="0" x2="1" y2="1">
                            <Stop offset="0" stopColor={midColor} stopOpacity={1} />
                            <Stop offset="1" stopColor={darkColor} stopOpacity={1} />
                        </LinearGradient>
                        {/* Bottom pyramid — right face (darkest) */}
                        <LinearGradient id={`botRight-${uid}`} x1="1" y1="0" x2="0" y2="1">
                            <Stop offset="0" stopColor={darkColor} stopOpacity={1} />
                            <Stop offset="1" stopColor={darken(activeColor, 38)} stopOpacity={1} />
                        </LinearGradient>
                        {/* Specular highlight */}
                        <RadialGradient id={`spec-${uid}`} cx="38%" cy="28%" r="35%">
                            <Stop offset="0" stopColor="#ffffff" stopOpacity={0.18} />
                            <Stop offset="1" stopColor="#ffffff" stopOpacity={0} />
                        </RadialGradient>
                    </Defs>

                    {/* ── TOP DIAMOND (upper pyramid) ── */}
                    {/* Left face: apex → left → center */}
                    <Path
                        d="M60 2 L2 100 L60 122 Z"
                        fill={`url(#topLeft-${uid})`}
                    />
                    {/* Right face: apex → right → center */}
                    <Path
                        d="M60 2 L118 100 L60 122 Z"
                        fill={`url(#topRight-${uid})`}
                    />

                    {/* ── BOTTOM DIAMOND (lower pyramid) ── */}
                    {/* Left face: center → left → nadir */}
                    <Path
                        d="M60 122 L2 100 L60 198 Z"
                        fill={`url(#botLeft-${uid})`}
                    />
                    {/* Right face: center → right → nadir */}
                    <Path
                        d="M60 122 L118 100 L60 198 Z"
                        fill={`url(#botRight-${uid})`}
                    />

                    {/* Edge outlines for facet definition */}
                    <Path
                        d="M60 2 L2 100 L60 122 L118 100 Z"
                        fill="none"
                        stroke={lightColor}
                        strokeWidth={0.8}
                        strokeOpacity={0.5}
                    />
                    <Path
                        d="M60 122 L2 100 L60 198 L118 100 Z"
                        fill="none"
                        stroke={darkColor}
                        strokeWidth={0.8}
                        strokeOpacity={0.4}
                    />
                    {/* Center equator line */}
                    <Path
                        d="M2 100 L118 100"
                        stroke={lightColor}
                        strokeWidth={0.6}
                        strokeOpacity={0.35}
                    />

                    {/* Specular overlay on top-left face */}
                    <Path
                        d="M60 2 L2 100 L60 122 Z"
                        fill={`url(#spec-${uid})`}
                    />
                </Svg>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 250,
        alignItems: 'center',
        justifyContent: 'center',
    },
    shadowEllipse: {
        position: 'absolute',
        bottom: 10,
        width: 55,
        height: 12,
        borderRadius: 30,
        backgroundColor: 'rgba(0,0,0,0.13)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 8,
        elevation: 4,
    },
});

export default VitalityPlumbob;