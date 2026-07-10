import { useState, useEffect } from 'react';
import { supabase } from '../../backend/supabase';
import { useStore } from '../store/useStore';

const ONE_HOUR = 60 * 60 * 1000;

export const useWeeklyFeedback = (userId: string) => {
    const weeklyScores = useStore((s: any) => s.weeklyScores);
    const statusMessage = useStore((s: any) => s.statusMessage);
    const detoxCard = useStore((s: any) => s.detoxCard);
    const yesterdayScreenTime = useStore((s: any) => s.yesterdayScreenTime);
    const weeklyFeedbackFetchedAt = useStore((s: any) => s.weeklyFeedbackFetchedAt);
    const setWeeklyFeedback = useStore((s: any) => s.setWeeklyFeedback);

    const [isLoading, setIsLoading] = useState(false);

    const fetchWeeklyData = async (showGlobalLoader = false) => {
        if (!userId) return;
        try {
            if (showGlobalLoader) setIsLoading(true);

            const { data, error } = await supabase
                .from('daily_metrics')
                .select('date, daily_score, screen_hours, sleep_hours')
                .eq('user_id', userId)
                .order('date', { ascending: false })
                .limit(7);

            if (error) throw error;

            if (!data || data.length === 0) {
                setWeeklyFeedback({
                    weeklyScores: [],
                    statusMessage: '⏳ Start your check-in rituals to unlock trends!',
                    detoxCard: null,
                    yesterdayScreenTime: null,
                });
                return;
            }

            const sortedData = [...data].reverse();
            const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

            const formattedScores = sortedData.map((item) => ({
                date: item.date,
                dayName: daysOfWeek[new Date(item.date).getDay()],
                score: item.daily_score || 0,
            }));

            let newStatusMessage = '📈 Gathering data for your weekly insights...';
            if (formattedScores.length >= 3) {
                const len = formattedScores.length;
                const scoreToday = formattedScores[len - 1].score;
                const scoreYesterday = formattedScores[len - 2].score;
                const scoreTwoDaysAgo = formattedScores[len - 3].score;

                if (scoreToday < scoreYesterday && scoreYesterday < scoreTwoDaysAgo) {
                    newStatusMessage = '⚠️ Overdrive Mode (Focus on sleep and reduce screen time)';
                } else if (scoreToday > scoreYesterday) {
                    newStatusMessage = '🚀 In the Zone (Your balance is improving)';
                } else {
                    newStatusMessage = '⚖️ Steady Balance (You are maintaining a solid rhythm)';
                }
            }

            const highScreenDays = data.filter(day => parseFloat(day.screen_hours || '0') > 5);
            const count = highScreenDays.length;
            let newDetoxCard;

            if (count === 0) {
                newDetoxCard = {
                    show: true,
                    title: 'Digital Detox Focus',
                    text: 'Great job! You stayed within the safe screen time limit all week. Your eyes and sleep quality thank you. 👁️',
                    count: 0,
                };
            } else {
                const lowScreenDays = data.filter(day => parseFloat(day.screen_hours || '0') <= 5);
                const avgSleepLow = lowScreenDays.length > 0
                    ? lowScreenDays.reduce((sum, d) => sum + (d.sleep_hours || 0), 0) / lowScreenDays.length
                    : 0;
                const avgSleepHigh = highScreenDays.reduce((sum, d) => sum + (d.sleep_hours || 0), 0) / count;
                const isSleepingWorse = avgSleepLow > 0 && avgSleepHigh < avgSleepLow;

                let text = `You exceeded the safe screen time limit on ${count} days this week.`;
                text += isSleepingWorse
                    ? ' This directly correlates with poorer sleep quality on those nights.'
                    : ' Try putting your device away 2 hours before bed to rest your mind.';

                newDetoxCard = { show: true, title: 'Digital Detox Focus', text, count };
            }

            setWeeklyFeedback({
                weeklyScores: formattedScores,
                statusMessage: newStatusMessage,
                detoxCard: newDetoxCard,
                yesterdayScreenTime: data.length > 0 ? parseFloat(data[0].screen_hours || '0') : null,
            });

        } catch (err) {
            console.error('Error loading feedback data:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!userId) return;
        const isStale = !weeklyFeedbackFetchedAt || Date.now() - weeklyFeedbackFetchedAt > ONE_HOUR;
        if (!isStale) return;
        // Show global spinner only on first-ever load (no cached data yet)
        const isFirstLoad = weeklyScores.length === 0;
        fetchWeeklyData(isFirstLoad);
    }, [userId]);

    return { weeklyScores, statusMessage, detoxCard, yesterdayScreenTime, isLoading, refresh: fetchWeeklyData };
};
