import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME } from '../theme';
import { NutritionIcon } from '../../assets/icons';

const CHART_HEIGHT = 120;
const MAX_SCORE = 225;
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getCurrentWeekDates(): string[] {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sun
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        return d.toISOString().split('T')[0];
    });
}

interface ChartDataPoint { date: string; dayName: string; score: number; }

export const WeeklyChart = ({ weeklyScores, statusMessage }: { weeklyScores: ChartDataPoint[]; statusMessage: string }) => {
    const todayDate = new Date().toISOString().split('T')[0];
    const weekDates = getCurrentWeekDates();

    const scoreByDate = new Map(weeklyScores.map(d => [d.date, d.score]));

    const weekDays = weekDates.map(date => {
        const score = scoreByDate.get(date) ?? null;
        const dayIndex = new Date(date + 'T12:00:00').getDay();
        return { date, dayName: DAY_NAMES[dayIndex], score };
    });

    const scale = MAX_SCORE;

    const getBarColor = (score: number) => {
        const pct = (score / MAX_SCORE) * 100;
        if (pct >= 70) return THEME.colors.primary;
        if (pct >= 40) return '#EAB308';
        return THEME.colors.error;
    };

    return (
        <View style={styles.card}>
            <View style={styles.cardTop}>
                <View>
                    <Text style={styles.overline}>CONSISTENCY</Text>
                    <Text style={styles.cardHeading}>Balance</Text>
                </View>
                <NutritionIcon width={24} height={24} fill={THEME.colors.primary} />
            </View>

            {statusMessage ? (
                <View style={styles.statusPill}>
                    <Text style={styles.statusText}>{statusMessage}</Text>
                </View>
            ) : null}

            <View style={styles.chartRow}>
                {/* Y-axis */}
                <View style={styles.yAxis}>
                    <Text style={styles.yLabel}>{scale}</Text>
                    <Text style={styles.yLabel}>{Math.round(scale / 2)}</Text>
                    <Text style={styles.yLabel}>0</Text>
                </View>

                {/* Bars */}
                <View style={[styles.chartArea, { flex: 1 }]}>
                    {weekDays.map((item) => {
                        const isToday = item.date === todayDate;
                        const isFuture = item.date > todayDate;
                        const hasData = item.score !== null && item.score > 0;
                        const barHeight = hasData
                            ? Math.max((item.score! / scale) * CHART_HEIGHT, 6)
                            : 6;

                        return (
                            <View key={item.date} style={styles.barColumn}>
                                {hasData && (
                                    <Text style={[styles.scoreLabel, isToday && styles.scoreLabelToday]}>
                                        {item.score}
                                    </Text>
                                )}
                                <View style={styles.barTrack}>
                                    <View
                                        style={[
                                            styles.bar,
                                            { height: barHeight },
                                            hasData ? { backgroundColor: getBarColor(item.score!) } :
                                                isFuture ? styles.barFuture :
                                                    styles.barMissed,
                                        ]}
                                    />
                                </View>
                                <Text style={[styles.dayLabel, isToday && styles.dayLabelToday]}>
                                    {item.dayName}
                                </Text>
                            </View>
                        );
                    })}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: THEME.colors.surfaceContainerLow,
        borderRadius: THEME.radius.lg,
        padding: THEME.spacing.lg,
        marginBottom: THEME.spacing.md,
        // ...THEME.shadows.editorial,
    },
    loadingCard: {
        height: 160,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        marginBottom: THEME.spacing.lg,
        gap: THEME.spacing.sm,
    },
    title: {
        fontSize: THEME.fontSize.sm,
        fontWeight: '700',
        color: THEME.colors.onSurfaceVariant,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    statusPill: {
        alignSelf: 'flex-end',
        backgroundColor: THEME.colors.surfaceContainerLow,
        borderRadius: THEME.radius.full,
        paddingHorizontal: THEME.spacing.md,
        paddingVertical: THEME.spacing.xs,
    },
    statusText: {
        fontSize: THEME.fontSize.xs,
        fontWeight: '600',
        color: THEME.colors.onSurface,
    },
    chartArea: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: CHART_HEIGHT + 48,
    },
    barColumn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 4,
    },
    scoreLabel: {
        fontSize: 10,
        fontWeight: '600',
        color: THEME.colors.onSurfaceVariant,
    },
    scoreLabelToday: {
        color: THEME.colors.primary,
    },
    barTrack: {
        width: '60%',
        height: CHART_HEIGHT,
        justifyContent: 'flex-end',
    },
    bar: {
        borderRadius: 6,
        width: '100%',
    },
    barDefault: {
        backgroundColor: THEME.colors.primary,
    },
    barToday: {
        backgroundColor: THEME.colors.primary,
    },
    barMissed: {
        backgroundColor: THEME.colors.surfaceContainerHigh,
    },
    barFuture: {
        backgroundColor: THEME.colors.outlineVariant,
        opacity: 0.4,
    },
    dayLabel: {
        fontSize: 10,
        fontWeight: '500',
        color: THEME.colors.onSurfaceVariant,
        marginTop: 2,
    },
    dayLabelToday: {
        fontWeight: '700',
        color: THEME.colors.primary,
    },
    emptyState: {
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: THEME.fontSize.sm,
        color: THEME.colors.onSurfaceVariant,
        textAlign: 'center',
    },
    chartRow: { flexDirection: 'row', alignItems: 'flex-end' },
    yAxis: { height: CHART_HEIGHT, justifyContent: 'space-between', alignItems: 'flex-end', paddingRight: 6, paddingBottom: 0 },
    yLabel: { fontSize: 9, fontWeight: '500', color: THEME.colors.onSurfaceVariant },
    cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    overline: { fontSize: 10, fontWeight: '600', color: THEME.colors.primary, letterSpacing: 1 },
    cardHeading: { fontSize: 24, fontWeight: '600', color: THEME.colors.onSurface, marginTop: 4 },
    cardFooterText: { fontSize: 14, color: THEME.colors.secondary, textAlign: 'center', marginTop: 16 },
});
