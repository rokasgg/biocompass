import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, AppState, AppStateStatus, Animated, TouchableWithoutFeedback } from 'react-native';
import { THEME } from '../theme';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../backend/supabase';
import { useStore } from '../store/useStore';

const FOCUS_DURATION = 25 * 60; // 25 minutės sekundėmis

const FocusTimerScreen = () => {
    const navigation = useNavigation();
    const user = useStore(state => state.user);

    const [secondsLeft, setSecondsLeft] = useState(FOCUS_DURATION);
    const [isActive, setIsActive] = useState(true);

    const appState = useRef(AppState.currentState);
    const isCheated = useRef(false);

    const dimOpacity = useRef(new Animated.Value(0)).current;
    const dimTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const scheduleDim = () => {
        if (dimTimeout.current) clearTimeout(dimTimeout.current);
        dimTimeout.current = setTimeout(() => {
            Animated.timing(dimOpacity, {
                toValue: 0.92,
                duration: 2000,
                useNativeDriver: true,
            }).start();
        }, 60_000);
    };

    const wakeScreen = () => {
        Animated.timing(dimOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
        scheduleDim();
    };

    useEffect(() => {
        scheduleDim();
        return () => { if (dimTimeout.current) clearTimeout(dimTimeout.current); };
    }, []);

    useEffect(() => {
        // 1. LIKUSIO LAIKO INTERVALAS
        let interval: any = null;
        if (isActive && secondsLeft > 0 && !isCheated.current) {
            interval = setInterval(() => {
                setSecondsLeft((seconds) => seconds - 1);
            }, 1000);
        } else if (secondsLeft === 0) {
            clearInterval(interval);
            handleFocusSuccess();
        }
        return () => clearInterval(interval);
    }, [isActive, secondsLeft]);

    useEffect(() => {
        // 2. APSAUGA NUO SUKČIAVIMO (AppState sekimas)
        const handleAppStateChange = (nextAppState: AppStateStatus) => {
            // Jei appsas nueina į foną (vartotojas išėjo į home screen ar kitą appsą)
            if (appState.current === 'active' && nextAppState.match(/inactive|background/)) {
                isCheated.current = true;
                setIsActive(false);

                Alert.alert(
                    "Focus Broken! 🚫",
                    "You left the application. Deep Work mode requires absolute focus. No points were awarded this time.",
                    [{ text: "Understood", onPress: () => navigation.goBack() }]
                );
            }
            appState.current = nextAppState;
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);
        return () => subscription.remove();
    }, []);

    // SĖKMINGOS SESIJOS APDOROJIMAS
    const handleFocusSuccess = async () => {
        if (isCheated.current || !user?.userId) return;

        setIsActive(false);
        const today = new Date().toISOString().split('T')[0];

        try {
            // Atnaujinam focus minutes šios dienos metrics eilutėje
            const { error } = await supabase.rpc('increment_focus_minutes', {
                user_id_param: user.userId,
                date_param: today,
                minutes_to_add: 25
            });

            // Jei rpc dar nepasirašei, paprastas saugus būdas fone:
            // Pasiimam esamas minutes ir pridedam 25 (arba tavo trigeris pats viską suskaičiuos)

            Alert.alert(
                "Focus Complete! 🏆",
                "Phenomenal! You stayed offline for 25 minutes. +25 Mindful Focus minutes and bonus points added to your Daily Score.",
                [{ text: "Let's Go!", onPress: () => navigation.goBack() }]
            );
        } catch (err) {
            console.error("Error saving focus session:", err);
            navigation.goBack();
        }
    };

    const handleGiveUp = () => {
        Alert.alert(
            "Give Up?",
            "Are you sure you want to quit? Your current focus streak will be lost.",
            [
                { text: "Keep Pushing", style: "cancel" },
                { text: "Yes, Quit", style: "destructive", onPress: () => navigation.goBack() }
            ]
        );
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
    const testButton = () => {
        Alert.alert(
            "Test Button Pressed",
            "This is a test button. In a real scenario, this could be used to simulate user interaction or for debugging purposes.",
            [{ text: "OK" }]
        );
        handleFocusSuccess(); // Simulate successful focus completion for testing
    };

    return (
        <TouchableWithoutFeedback onPress={wakeScreen}>
            <View style={styles.container}>
                <Text style={styles.overline}>DEEP WORK INTEGRITY</Text>
                <Text style={styles.statusText}>Phone Locked to Sage</Text>

                <TouchableOpacity onPress={testButton}><Text style={styles.timerText}>{formatTime(secondsLeft)}</Text></TouchableOpacity>

                <Text style={styles.subtitle}>
                    Do not lock your screen or leave the app. Leaving Sage to check notifications will instantly fail the session.
                </Text>

                <TouchableOpacity style={styles.abortButton} onPress={handleGiveUp}>
                    <Text style={styles.abortText}>End Session</Text>
                </TouchableOpacity>

                <Animated.View pointerEvents="none" style={[styles.dimOverlay, { opacity: dimOpacity }]} />
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1C2E24', justifyContent: 'center', alignItems: 'center', padding: 30 },
    overline: { fontSize: 11, fontWeight: '800', color: '#8BA888', letterSpacing: 2, marginBottom: 8 },
    statusText: { fontSize: 18, color: '#fff', fontWeight: '600', opacity: 0.9, marginBottom: 50 },
    timerText: { fontSize: 84, fontWeight: '800', color: '#fff', letterSpacing: -2, marginBottom: 40 },
    subtitle: { fontSize: 14, color: '#A3B8A1', textAlign: 'center', lineHeight: 22, paddingHorizontal: 25, marginBottom: 60 },
    abortButton: { paddingVertical: 14, paddingHorizontal: 32, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.08)' },
    abortText: { color: '#ffb4ab', fontWeight: '700', fontSize: 14 },
    dimOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#000' },
});

export default FocusTimerScreen;