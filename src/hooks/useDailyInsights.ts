import { useQuery } from '@tanstack/react-query';
import { fetchDailyMetrics, buildInsightPrompt } from '../../backend/services/insights';
import { useEffect, useState } from 'react';
// import { getDailyInsight } from '@/services/ai';

function getYesterdayDate() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0]; // "YYYY-MM-DD"
}

function getSevenDaysAgoDate() {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split('T')[0];
}
export function useDailyInsight(userId: string) {
    const [insight, setInsight] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function load() {
            try {
                setIsLoading(true);
                const yesterdayDate = getYesterdayDate();
                const sevenDaysAgoDate = getSevenDaysAgoDate();

                const metrics = await fetchDailyMetrics(userId, sevenDaysAgoDate);
                const prompt = buildInsightPrompt(metrics, yesterdayDate);
                // const result = await getDailyInsight(prompt);

                if (isMounted) setInsight(prompt);
            } catch (err) {
                if (isMounted) setError(err as Error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        load();
        return () => { isMounted = false; };
    }, [userId]);

    return { insight, isLoading, error };
}