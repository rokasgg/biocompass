import React, { use, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Dimensions,
    Platform,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { THEME } from '../theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeartIcon, SleepIcon, NutritionIcon, ScaleIcon, BrainIcon, SparkleIcon } from '../../assets/icons';
import Header from '../compoments/HeaderBar';
import { WeeklyChart } from 'src/compoments/WeeklyChart';
import { useStore } from 'src/store/useStore';
import { DetoxCard } from 'src/compoments/DetoxCard';
import { useWeeklyFeedback } from 'src/hooks/useWeeklyFeedback';
import { FocusTimeTracker } from 'src/compoments/FocusTimeTracker';
import { useDailyInsight } from 'src/hooks/useDailyInsights';
const { width } = Dimensions.get('window');

const FeedbackScreen = () => {

    const user = useStore(state => state.user);
    const { weeklyScores, statusMessage, detoxCard, yesterdayScreenTime, weeklyFocusMinutes, isLoading, refresh } = useWeeklyFeedback(user?.userId ?? '');
    const [isRefreshing, setIsRefreshing] = React.useState(false);

    const { insight, error } = useDailyInsight(user?.userId ?? '');

    const onRefresh = async () => {
        setIsRefreshing(true);
        await refresh();
        setIsRefreshing(false);
    };


    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.globalLoader}>
                    <ActivityIndicator size="large" color={THEME.colors.primary} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={THEME.colors.primary} />}
            >

                {/* --- Hero Section --- */}
                {/* <View style={styles.heroSection}>

                    <View style={styles.header}>
                        <View style={styles.titleRow}>
                            <SparkleIcon width={20} height={20} fill={THEME.colors.primary} />
                            <Text style={styles.title}>Weekly resonance</Text>
                        </View>
                        <View style={styles.aiPill}>
                            <SparkleIcon width={11} height={11} fill={THEME.colors.primary} />
                            <Text style={styles.aiPillText}>AI insight</Text>
                        </View>
                    </View>

                    <Text style={styles.heroSubtitle}>
                        {insight ? insight : "Loading your personalized insight..."}
                    </Text>
                </View> */}

                <View style={styles.quoteChip}>
                    <View style={styles.header}>
                        <View style={styles.titleRow}>
                            <SparkleIcon width={20} height={20} fill={THEME.colors.primary} />
                            <Text style={styles.title}>Weekly resonance</Text>
                        </View>
                        <View style={styles.aiPill}>
                            <SparkleIcon width={11} height={11} fill={THEME.colors.primary} />
                            <Text style={styles.aiPillText}>AI insight</Text>
                        </View>
                    </View>
                    <Text style={styles.quoteText}>
                        {insight ? insight : "Loading your personalized insight..."}
                    </Text>
                </View>










                {/* --- Bento Grid --- */}
                <View style={styles.bentoGrid}>
                    <View style={styles.row}>
                        {/* Sleep Quality Card */}

                        <WeeklyChart weeklyScores={weeklyScores} statusMessage={statusMessage} />
                        <DetoxCard detoxCard={detoxCard} yesterdayScreenTime={yesterdayScreenTime} />

                        <FocusTimeTracker weeklyFocusMinutes={weeklyFocusMinutes} />
                    </View>

                    {/* Activity Chart Card (Full Width) */}
                    {/* <View style={[styles.card, styles.fullCard]}>
                        <View style={styles.cardTop}>
                            <View>
                                <Text style={styles.overline}>VITALITY</Text>
                                <Text style={styles.cardHeading}>Physical Activity</Text>
                            </View>
                            <View style={styles.streakBadge}>
                                <Text style={styles.streakText}>Active Streak: 12 Days</Text>
                            </View>
                        </View>

                        <View style={styles.chartContainer}>
                            {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day, i) => (
                                <Bar key={day} label={day} height={Math.random() * 100} active={day === 'THU'} />
                            ))}
                        </View>
                    </View> */}
                </View>

                {/* --- Historical Insight List --- */}
                {/* <View style={styles.historySection}>
                    <View style={styles.historyHeader}>
                        <Text style={styles.historyTitle}>Historical Insight</Text>
                        <TouchableOpacity><Text style={styles.exportBtn}>Export Data</Text></TouchableOpacity>
                    </View>

                    <TrendRow icon={ScaleIcon} title="Metabolic Rate" sub="Stabilized at 1,840 kcal/day" trend="+2.4%" color={THEME.colors.tertiary} />
                    <TrendRow icon={HeartIcon} title="Resting Heart Rate" sub="Average 58 BPM" trend="-1.2%" color={THEME.colors.secondary} />
                    <TrendRow icon={BrainIcon} title="Cognitive Focus" sub="Peak focus at 10:15 AM" trend="+8.0%" color={THEME.colors.primary} />
                </View> */}

                {/* --- Quote Chip --- */}


            </ScrollView>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: THEME.colors.background },
    globalLoader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
    headerLeft: { flexDirection: 'row', alignItems: 'center' },
    avatarMiniContainer: { width: 32, height: 32, borderRadius: 16, overflow: 'hidden', backgroundColor: THEME.colors.surfaceContainerHighest },
    miniAvatar: { width: '100%', height: '100%' },
    headerTitle: { fontSize: 18, fontWeight: '800', color: THEME.colors.primary, marginLeft: 12 },
    iconButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
    scrollContent: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 100 },

    heroSection: { marginBottom: 32 },
    heroTitleSection: { flexDirection: 'row', marginBottom: 16, gap: 8 },
    titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    title: { fontSize: 20, fontWeight: '600', color: THEME.colors.primary },
    aiPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: THEME.colors.pastelGreen, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
    aiPillText: { fontSize: 10, fontWeight: '600', color: THEME.colors.primary, marginLeft: 4 },
    heroTitle: { fontSize: 16, fontWeight: '800', color: THEME.colors.secondary, marginBottom: 8 },
    heroSubtitle: { fontSize: 16, color: THEME.colors.onSurfaceVariant, lineHeight: 22, marginBottom: 16, paddingHorizontal: 20 },

    bentoGrid: { marginBottom: 32 },
    row: { flexDirection: 'column', justifyContent: 'space-between', marginBottom: 20 },
    card: { backgroundColor: THEME.colors.surfaceContainerLow, borderRadius: 24, padding: 24, marginBottom: 24 },
    halfCard: { width: (width - 60) / 2 },
    fullCard: { width: '100%' },
    cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    overline: { fontSize: 10, fontWeight: '600', color: THEME.colors.primary, letterSpacing: 1 },
    cardHeading: { fontSize: 24, fontWeight: '600', color: THEME.colors.onSurface, marginTop: 4 },
    cardFooterText: { fontSize: 14, color: THEME.colors.secondary, textAlign: 'center', marginTop: 16 },

    progressCircleContainer: { alignItems: 'center', marginTop: 20 },
    circleInternal: { position: 'absolute', alignItems: 'center' },
    circlePercent: { fontSize: 20, fontWeight: '800', color: THEME.colors.onSurface },
    circleLabel: { fontSize: 8, fontWeight: '800', color: THEME.colors.onSurfaceVariant },

    nutritionBars: { marginTop: 20, gap: 12 },
    hBarContainer: { gap: 6 },
    hBarHeader: { flexDirection: 'row', justifyContent: 'space-between' },
    hBarLabel: { fontSize: 12, fontWeight: '500', color: THEME.colors.secondary },
    hBarBg: { height: 10, backgroundColor: THEME.colors.primaryContainer, borderRadius: 5, overflow: 'hidden' },
    hBarFill: { height: '100%', backgroundColor: THEME.colors.primary },

    streakBadge: { backgroundColor: 'rgba(74, 101, 73, 0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    streakText: { color: THEME.colors.primary, fontWeight: '700', fontSize: 12 },
    chartContainer: { height: 180, flexDirection: 'row', alignItems: 'end', justifyContent: 'space-between', marginTop: 24 },
    barWrapper: { width: '12%', height: '100%', justifyContent: 'flex-end', alignItems: 'center' },
    barFill: { width: '100%', borderRadius: 8 },
    barLabel: { fontSize: 10, fontWeight: '700', color: THEME.colors.onSurfaceVariant, marginTop: 8 },

    historySection: { marginBottom: 32 },
    historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    historyTitle: { fontSize: 20, fontWeight: '600', color: THEME.colors.secondary },
    exportBtn: { fontSize: 14, fontWeight: '600', color: THEME.colors.primary },
    trendRow: { flexDirection: 'row', alignItems: 'center', padding: 12, marginBottom: 8 },
    trendIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
    trendTitle: { fontWeight: '600', color: THEME.colors.onSurface },
    trendSub: { fontSize: 12, color: THEME.colors.onSurfaceVariant },
    trendValue: { fontWeight: '600' },
    trendTag: { fontSize: 10, fontWeight: '600', color: THEME.colors.outline },

    quoteChip: { backgroundColor: 'rgba(125, 82, 95, 0.08)', padding: 24, borderRadius: 16, marginBottom: 32 },
    quoteText: { fontStyle: 'italic', textAlign: 'auto', color: THEME.colors.tertiary, fontSize: 14, lineHeight: 20, }
});

export default FeedbackScreen;