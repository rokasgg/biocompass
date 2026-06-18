import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME } from 'src/theme';


interface CheckInTimerProps {
    hasCompletedMorningCheckIn: boolean;
    hasCompletedEveningCheckIn: boolean;
}

const CheckInTimer = ({ hasCompletedMorningCheckIn, hasCompletedEveningCheckIn }: CheckInTimerProps) => {
    // This state is now isolated here. Only this small component will re-render every second!
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    const currentHour = now.getHours();
    const isMorningPhase = currentHour >= 6 && currentHour < 17;
    const isEveningPhase = currentHour >= 17 && currentHour < 24;
    const isNightPhase = currentHour >= 0 && currentHour < 6;

    const nextCheckinTargetDate = useMemo(() => {
        const target = new Date(now);
        if (isMorningPhase && hasCompletedMorningCheckIn) {
            target.setHours(17, 0, 0, 0);
        } else if ((isEveningPhase && hasCompletedEveningCheckIn) || isNightPhase) {
            if (isEveningPhase) target.setDate(target.getDate() + 1);
            target.setHours(6, 0, 0, 0);
        }
        return target;
    }, [now, isMorningPhase, isEveningPhase, isNightPhase, hasCompletedMorningCheckIn, hasCompletedEveningCheckIn]);

    const lockedRemainingMs = Math.max(nextCheckinTargetDate.getTime() - now.getTime(), 0);

    const progressToNext = useMemo(() => {
        const target = nextCheckinTargetDate;
        const targetHour = target.getHours();

        let previousBoundary = new Date(target);
        if (targetHour === 17) {
            previousBoundary.setHours(6, 0, 0, 0);
        } else if (targetHour === 6) {
            previousBoundary.setDate(previousBoundary.getDate() - 1);
            previousBoundary.setHours(17, 0, 0, 0);
        } else {
            previousBoundary = new Date(now);
            previousBoundary.setHours(0, 0, 0, 0);
        }

        const total = Math.max(target.getTime() - previousBoundary.getTime(), 1);
        const elapsed = Math.max(now.getTime() - previousBoundary.getTime(), 0);
        return Math.max(0, Math.min(1, elapsed / total));
    }, [nextCheckinTargetDate, now]);

    const lockedMessageText = useMemo(() => {
        if (isMorningPhase && hasCompletedMorningCheckIn) return "Evening check-in unlocks in";
        if (isEveningPhase && hasCompletedEveningCheckIn) return "Morning check-in unlocks in";
        if (isNightPhase) return "Morning check-in unlocks in";
        return "Check-in unlocks in";
    }, [isMorningPhase, isEveningPhase, isNightPhase, hasCompletedMorningCheckIn, hasCompletedEveningCheckIn]);

    return (
        <View style={styles.checkinLocked}>
            <View style={styles.checkinLockedTextRow}>
                <Text style={styles.checkinLockedText}>{lockedMessageText}</Text>
                <Text style={styles.checkinLockedTimer}>
                    {new Date(lockedRemainingMs).toISOString().substr(11, 8)}
                </Text>
            </View>
            <View style={styles.progressBarBackground}>
                <View style={[styles.progressBarFill, { width: `${Math.round(progressToNext * 100)}%` }]} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    checkinLocked: { width: '100%', alignItems: 'center', backgroundColor: '#eef0eb', padding: 16, borderRadius: 20 },
    checkinLockedTextRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 8 },
    checkinLockedText: { color: THEME.colors.onSurfaceVariant, fontWeight: '600' },
    checkinLockedTimer: { color: THEME.colors.primary, fontWeight: '800' },


    progressBarBackground: {
        width: '100%',
        height: 8,
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        marginTop: 10,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: THEME.colors.primary,
        borderRadius: 4,
    },
});

export default CheckInTimer;       