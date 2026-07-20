import { supabase } from '../supabase';

export async function fetchDailyMetrics(userId: string, sevenDaysAgoDate: string) {
    const { data, error } = await supabase
        .from('daily_metrics')
        .select('*')
        .eq('user_id', userId)
        .gte('date', sevenDaysAgoDate)
        .order('date', { ascending: false });

    if (error) throw error;
    return data;
}

export function buildInsightPrompt(metrics: any[] | null, yesterdayDate: string) {
    const hasYesterday = metrics?.some(m => m.date === yesterdayDate);
    const hasWeeklyData = metrics && metrics.length > 0;

    if (hasYesterday) {
        return `Analyze the user's data from YESTERDAY (${JSON.stringify(metrics![0])}). Give a concise 1-2 sentence daily insight.`;
    }
    if (hasWeeklyData) {
        return `The user missed yesterday's check-in, but here is their available data from the past week: ${JSON.stringify(metrics)}. Give a welcoming, 1-2 sentence weekly trend reflection.`;
    }
    return `The user has no recent data logged. Give a calm, encouraging 1-2 sentence prompt to complete their check-in today. Do not mention missing data.`;
}


export async function getCachedInsight(userId: string, today: string) {
    const { data, error } = await supabase
        .from('daily_insights')
        .select('insight_text')
        .eq('user_id', userId)
        .eq('date', today)
        .maybeSingle();

    if (error) throw error;
    return data?.insight_text ?? null;
}

export async function saveInsight(userId: string, today: string, text: string) {
    const { error } = await supabase
        .from('daily_insights')
        .upsert({ user_id: userId, date: today, insight_text: text });

    if (error) throw error;
}