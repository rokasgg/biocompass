import { supabase } from '../supabase';

export const checkInService = {
    async submitDailyMetrics(userId: string, data: any) {
        const today = new Date().toISOString().split('T')[0];
        console.log("Submitting daily metrics for user:", userId, "on date:", today, "with data:", data);
        // Naudojame upsert, kad įrašytų arba atnaujintų egzistuojantį tos dienos įrašą
        const { data: result, error } = await supabase
            .from('daily_metrics')
            .upsert(
                {
                    user_id: userId,
                    date: today,
                    ...data,
                },
                { onConflict: 'user_id,date' }
            )
            .select()
            .single();

        if (error) {
            console.error('Klaida įrašant check-in:', error);
            throw error;
        }
        return result;
    },

    async getTodayMetrics(userId: string) {
        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
            .from('daily_metrics')
            .select('*')
            .eq('user_id', userId)
            .eq('date', today)
            .single();

        return data; // Grąžina esamą įrašą arba null
    },

    async getUserDashboardData(userId: string) {
        console.log("KVIEČIU DB DAŠBORDUI");
        const today = new Date().toISOString().split('T')[0];

        // 1. Gaunam šios dienos metrikas
        const { data: todayMetrics } = await supabase
            .from('daily_metrics')
            .select('*')
            .eq('user_id', userId)
            .eq('date', today)
            .single();

        // 2. Suskaičiuojam TOTAL score tik iš daily_metrics lentelės
        const { data: allMetrics } = await supabase
            .from('daily_metrics')
            .select('daily_score')
            .eq('user_id', userId);

        // Susumuojam visų dienų rezultatus
        const totalScore = allMetrics?.reduce((sum, item) => sum + (item.daily_score || 0), 0) || 0;

        return {
            totalScore,
            todayMetrics
        };
    }

};