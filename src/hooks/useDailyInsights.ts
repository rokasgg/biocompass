import { fetchDailyMetrics, buildInsightPrompt, getCachedInsight, saveInsight, } from '../../backend/services/insights';
import { useEffect, useState } from 'react';
import { getDailyInsight, } from '../../backend/services/ai';

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

function getTodayDate() {
    const d = new Date();
    return d.toISOString().split('T')[0];
}
export function useDailyInsight(userId: string) {
    const [insight, setInsight] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!userId) {
            setIsLoading(false);
            return;
        }

        let isMounted = true;

        async function load() {
            try {
                setIsLoading(true);
                const today = getTodayDate(); // pridėk šitą funkciją
                const yesterdayDate = getYesterdayDate();
                const sevenDaysAgoDate = getSevenDaysAgoDate();

                // 1. Pirma tikrini cache
                const cached = await getCachedInsight(userId, today);
                if (cached) {
                    if (isMounted) setInsight(cached);
                    return; // NEŠAUDOM į AI, jei jau yra
                }

                // 2. Jei nėra - generuojam ir išsaugom
                const metrics = await fetchDailyMetrics(userId, sevenDaysAgoDate);
                const prompt = buildInsightPrompt(metrics, yesterdayDate);
                const result = await getDailyInsight(prompt);

                await saveInsight(userId, today, result);

                if (isMounted) setInsight(result);
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