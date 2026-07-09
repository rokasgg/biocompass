import { useState, useEffect } from 'react';
import { supabase } from '../../backend/supabase';

interface ChartDataPoint {
    date: string;
    dayName: string;
    score: number;
}

interface DetoxCardData {
    show: boolean;
    title: string;
    text: string;
    count: number;
}

export const useWeeklyFeedback = (userId: string) => {
    const [weeklyScores, setWeeklyScores] = useState<ChartDataPoint[]>([]);
    const [statusMessage, setStatusMessage] = useState('');
    const [detoxCard, setDetoxCard] = useState<DetoxCardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [yesterdayScreenTime, setYesterdayScreenTime] = useState<number | null>(null);

    useEffect(() => {
        const fetchWeeklyData = async () => {
            if (!userId) return;
            try {
                setIsLoading(true);

                const { data, error } = await supabase
                    .from('daily_metrics')
                    .select('date, daily_score, screen_hours, sleep_hours')
                    .eq('user_id', userId)
                    .order('date', { ascending: false })
                    .limit(7);

                if (error) throw error;

                if (!data || data.length === 0) {
                    setStatusMessage('⏳ Start your check-in rituals to unlock trends!');
                    setWeeklyScores([]);
                    setDetoxCard(null);
                    return;
                }

                const sortedData = [...data].reverse();
                const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

                const formattedData: ChartDataPoint[] = sortedData.map((item) => {
                    const d = new Date(item.date);
                    return {
                        date: item.date,
                        dayName: daysOfWeek[d.getDay()],
                        score: item.daily_score || 0,
                    };
                });

                setWeeklyScores(formattedData);

                // --- 1. GRAFIKO STATUSO LOGIKA ---
                if (formattedData.length >= 3) {
                    const len = formattedData.length;
                    const scoreToday = formattedData[len - 1].score;
                    const scoreYesterday = formattedData[len - 2].score;
                    const scoreTwoDaysAgo = formattedData[len - 3].score;

                    if (scoreToday < scoreYesterday && scoreYesterday < scoreTwoDaysAgo) {
                        setStatusMessage('⚠️ Overdrive Mode (Focus on sleep and reduce screen time)');
                    } else if (scoreToday > scoreYesterday) {
                        setStatusMessage('🚀 In the Zone (Your balance is improving)');
                    } else {
                        setStatusMessage('⚖️ Steady Balance (You are maintaining a solid rhythm)');
                    }
                } else {
                    setStatusMessage('📈 Gathering data for your weekly insights...');
                }

                // --- 2. DETOX KORTELĖS LOGIKA ---
                const highScreenDays = data.filter(day => parseFloat(day.screen_hours || '0') > 5);
                const count = highScreenDays.length;

                if (count === 0) {
                    setDetoxCard({
                        show: true,
                        title: "Digital Detox Focus",
                        text: "Great job! You stayed within the safe screen time limit all week. Your eyes and sleep quality thank you. 👁️",
                        count: 0
                    });
                } else {
                    const lowScreenDays = data.filter(day => parseFloat(day.screen_hours || '0') <= 5);
                    const avgSleepLow = lowScreenDays.length > 0
                        ? lowScreenDays.reduce((sum, d) => sum + (d.sleep_hours || 0), 0) / lowScreenDays.length
                        : 0;
                    const avgSleepHigh = highScreenDays.reduce((sum, d) => sum + (d.sleep_hours || 0), 0) / count;
                    const isSleepingWorse = avgSleepLow > 0 && avgSleepHigh < avgSleepLow;

                    let text = `You exceeded the safe screen time limit on ${count} days this week.`;
                    if (isSleepingWorse) {
                        text += ` This directly correlates with poorer sleep quality on those nights.`;
                    } else {
                        text += ` Try putting your device away 2 hours before bed to rest your mind.`;
                    }

                    setDetoxCard({ show: true, title: "Digital Detox Focus", text, count });
                }
                if (data && data.length > 0) {
                    const yesterdayData = data[0];
                    const hours = parseFloat(yesterdayData.screen_hours || '0');
                    setYesterdayScreenTime(hours);
                }

            } catch (err) {
                console.error('Error loading feedback data:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchWeeklyData();
    }, [userId]);

    return { weeklyScores, statusMessage, detoxCard, yesterdayScreenTime, isLoading };
};