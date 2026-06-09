import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
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

    // 🎨 GRĄŽINTA: Klasikinė raudona/geltona/žalia sistema, pritaikyta procentams
    const getVibeColor = () => {
        if (isLoading || !isDecided) return THEME.colors.outlineVariant; // Pilka, kol kraunasi

        if (score >= 70) return THEME.colors.primary; // 🟢 ŽALIA (Tavo pagrindinė spalva, kai viskas super)
        if (score >= 40) return '#EAB308';           // 🟡 GELTONA (Vidutiniokas, reikia pasitempti)
        return THEME.colors.error;                   // 🔴 RAUDONA (Šlykšti diena, ekrano laikas per didelis)
    };

    const activeColor = getVibeColor();

    return (
        <View style={styles.container}>
            <Animated.View style={{ transform: [{ rotateY: spin }] }}>
                <Svg width="100" height="180" viewBox="0 0 120 200">
                    <Defs>
                        <LinearGradient id={`plumbobGrad-${activeColor}`} x1="0" y1="0" x2="1" y2="1">
                            <Stop offset="0" stopColor={activeColor} stopOpacity={1} />
                            <Stop offset="1" stopColor={activeColor} stopOpacity={0.6} />
                        </LinearGradient>
                    </Defs>

                    <Path
                        d="M60 0 L120 100 L60 125 L0 100 Z"
                        fill={`url(#plumbobGrad-${activeColor})`}
                    />

                    <Path
                        d="M60 200 L120 100 L60 125 L0 100 Z"
                        fill={activeColor}
                        opacity={0.8}
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
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
    }
});

export default VitalityPlumbob;