import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const COLORS = ['#4a6549', '#a8d5a2', '#f9a825', '#ef5350', '#42a5f5', '#ab47bc', '#ffffff'];
const PARTICLE_COUNT = 30;

function randomBetween(a: number, b: number) { return a + Math.random() * (b - a); }

const ConfettiBurst = () => {
    const particles = useRef(
        Array.from({ length: PARTICLE_COUNT }, () => ({
            x: new Animated.Value(0),
            y: new Animated.Value(0),
            opacity: new Animated.Value(1),
            rotate: new Animated.Value(0),
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            targetX: randomBetween(-width * 0.6, width * 0.6),
            targetY: randomBetween(-height * 0.5, height * 0.2),
            size: randomBetween(6, 14),
            duration: randomBetween(1800, 2800),
        }))
    ).current;

    useEffect(() => {
        particles.forEach((p) => {
            Animated.parallel([
                Animated.timing(p.x, { toValue: p.targetX, duration: p.duration, easing: Easing.out(Easing.quad), useNativeDriver: true }),
                Animated.timing(p.y, { toValue: p.targetY, duration: p.duration, easing: Easing.out(Easing.quad), useNativeDriver: true }),
                Animated.timing(p.opacity, { toValue: 0, duration: p.duration * 0.6, delay: p.duration * 0.4, useNativeDriver: true }),
                Animated.timing(p.rotate, { toValue: randomBetween(2, 6), duration: p.duration, useNativeDriver: true }),
            ]).start();
        });
    }, []);

    return (
        <View style={[StyleSheet.absoluteFill, styles.container]} pointerEvents="none">
            {particles.map((p, i) => {
                const rotate = p.rotate.interpolate({ inputRange: [0, 6], outputRange: ['0deg', '1080deg'] });
                return (
                    <Animated.View
                        key={i}
                        style={{
                            position: 'absolute',
                            left: width / 2,
                            top: height * 0.4,
                            width: p.size,
                            height: p.size * 0.5,
                            borderRadius: 2,
                            backgroundColor: p.color,
                            opacity: p.opacity,
                            transform: [
                                { translateX: p.x },
                                { translateY: p.y },
                                { rotate },
                            ],
                        }}
                    />
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { zIndex: 1000 },
});

export default ConfettiBurst;
