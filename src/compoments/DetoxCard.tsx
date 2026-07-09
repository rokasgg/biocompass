import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useWeeklyFeedback } from '../hooks/useWeeklyFeedback';
import { THEME } from '../theme';
import DeviceIcon from '../../assets/icons/LEAFS.svg'; // Pasitikslink kelią iki savo DeviceIcon

export const DetoxCard = ({ userId }: { userId: string }) => {
    // Pasiimam duomenis ir krovimosi būseną tiesiai iš tavo hook'o
    const { detoxCard, yesterdayScreenTime, isLoading } = useWeeklyFeedback(userId);

    if (isLoading) {
        return (
            <View style={[styles.card, styles.loadingCard]}>
                <ActivityIndicator size="small" color={THEME.colors.primary} />
            </View>
        );
    }

    return (
        <View>
            {detoxCard && detoxCard.show && (
                <View style={[styles.card, styles.fullCard]}>
                    <View style={styles.cardTop}>
                        <View>
                            <Text style={styles.overline}>VIGILANCE</Text>
                            <Text style={styles.cardHeading}>{detoxCard.title}</Text>
                            {/* 🔥 NAUJAS ELEMENTAS: Vakar dienos ekrano laikas */}
                            {yesterdayScreenTime !== null && yesterdayScreenTime > 0 && (
                                <Text style={styles.yesterdayText}>
                                    Yesterday: <Text style={styles.yesterdayValue}>{yesterdayScreenTime.toFixed(1)} hrs</Text>
                                </Text>
                            )}
                        </View>
                        <DeviceIcon
                            width={24}
                            height={24}
                            fill={detoxCard.count > 2 ? (THEME.colors.error || '#ff4b4b') : THEME.colors.primary}
                        />
                    </View>

                    {/* Badge alert for fatigue warning if they crossed it 3+ days */}
                    {detoxCard.count >= 3 && (
                        <View style={styles.streakBadgeWrapper}>
                            <View style={styles.streakBadge}>
                                <Text style={styles.streakText}>⚠️ HIGH FATIGUE RISK</Text>
                            </View>
                        </View>
                    )}

                    {/* Standardized typography layout */}
                    <Text style={[styles.cardFooterText, styles.leftAlignedText]}>
                        {detoxCard.text}
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: THEME.colors.surfaceContainerLow,
        borderRadius: THEME.radius.lg,
        padding: THEME.spacing.lg,
        marginBottom: THEME.spacing.md,
    },
    loadingCard: {
        height: 160,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullCard: {
        width: '100%',
    },
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    overline: {
        fontSize: 10,
        fontWeight: '600',
        color: THEME.colors.primary,
        letterSpacing: 1
    },
    cardHeading: {
        fontSize: 24,
        fontWeight: '600',
        color: THEME.colors.onSurface,
        marginTop: 4
    },
    cardFooterText: {
        fontSize: 14,
        color: THEME.colors.secondary,
        textAlign: 'center',
        marginTop: 16
    },
    // Pridėti papildomi stiliai tvarkingam lygiavimui kairėje ir tarpams
    leftAlignedText: {
        textAlign: 'left',
        marginTop: 12,
        lineHeight: 20
    },
    streakBadgeWrapper: {
        flexDirection: 'row',
        marginTop: 12
    },
    streakBadge: {
        backgroundColor: 'rgba(220, 95, 95, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20
    },
    streakText: {
        color: THEME.colors.error || '#ff4b4b',
        fontWeight: '700',
        fontSize: 12
    },
    yesterdayText: {
        fontSize: 13,
        color: THEME.colors.onSurfaceVariant || '#888',
        marginTop: 4,
        fontWeight: '500',
    },
    yesterdayValue: {
        color: THEME.colors.onSurface || '#fff', // kad pats skaičius geriau išsiskirtų
        fontWeight: '700',
    }
});