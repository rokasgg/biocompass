import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME } from '../theme';

const WEEKLY_GOAL_MINUTES = 300; // 5 hours

const fmt = (mins: number): string => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0) return m > 0 ? `${h}h ${m}m` : `${h}h`;
    return `${m}m`;
};

const getMondayAndSunday = () => {
    const today = new Date();
    const day = today.getDay(); // 0 = Sun
    const diffToMon = (day === 0 ? -6 : 1 - day);
    const mon = new Date(today);
    mon.setDate(today.getDate() + diffToMon);
    const sun = new Date(mon);
    sun.setDate(mon.getDate() + 6);
    const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return `${mon.toLocaleDateString('en-US', opts)} – ${sun.toLocaleDateString('en-US', opts)}`;
};

interface Props {
    weeklyFocusMinutes: number;
}

export const FocusTimeTracker = ({ weeklyFocusMinutes }: Props) => {
    const progress = Math.min(weeklyFocusMinutes / WEEKLY_GOAL_MINUTES, 1);
    const pct = Math.round(progress * 100);

    return (
        <View style={styles.card}>
            <Text style={styles.overline}>FOCUS</Text>
            <Text style={styles.cardHeading}>Deep Work</Text>


            <Text style={styles.stat}>{fmt(weeklyFocusMinutes)}</Text>
            <Text style={styles.subLabel}>of {fmt(WEEKLY_GOAL_MINUTES)} goal this week</Text>

            <View style={styles.track}>
                <View style={[styles.fill, { width: `${pct}%` }]} />
            </View>

            <View style={styles.footer}>
                <Text style={styles.dateRange}>{getMondayAndSunday()}</Text>
                <Text style={styles.pctBadge}>{pct}%</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: THEME.colors.surfaceContainerLow,
        borderRadius: 20,
        padding: 20,
        marginBottom: 12,
        // ...THEME.shadows.editorial,
    },
    // overline: {
    //     fontSize: 11,
    //     fontWeight: '800',
    //     color: THEME.colors.primary,
    //     letterSpacing: 2,
    //     marginBottom: 12,
    // },
    stat: {
        fontSize: 40,
        fontWeight: '800',
        color: THEME.colors.onSurface,
        letterSpacing: -1,
    },
    subLabel: {
        fontSize: 13,
        color: THEME.colors.onSurfaceVariant,
        marginTop: 2,
        marginBottom: 16,
    },
    track: {
        height: 8,
        backgroundColor: THEME.colors.outlineVariant,
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 12,
    },
    fill: {
        height: '100%',
        backgroundColor: THEME.colors.primary,
        borderRadius: 4,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dateRange: {
        fontSize: 12,
        color: THEME.colors.onSurfaceVariant,
        fontWeight: '600',
    },
    pctBadge: {
        fontSize: 12,
        fontWeight: '800',
        color: THEME.colors.onSurfaceVariant,
    },
    // overline: {
    //     fontSize: 10,
    //     fontWeight: '600',
    //     color: THEME.colors.primary,
    //     letterSpacing: 1
    // },
    // cardHeading: {
    //     fontSize: 24,
    //     fontWeight: '600',
    //     color: THEME.colors.onSurface,
    //     marginTop: 4
    // },
    overline: { fontSize: 10, fontWeight: '600', color: THEME.colors.primary, letterSpacing: 1 },
    cardHeading: { fontSize: 24, fontWeight: '600', color: THEME.colors.onSurface, marginTop: 4 },
});
