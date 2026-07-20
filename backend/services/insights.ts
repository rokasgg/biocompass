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