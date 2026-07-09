import { useState, useEffect } from 'react';
import { supabase } from '../../backend/supabase'; // Įsitikink, kad turi supabaseClient.ts su savo Supabase konfigūracija

interface ChartDataPoint {
    date: string;
    dayName: string;
    score: number;
}

export const useWeeklyFeedback = (userId: string) => {
    const [weeklyScores, setWeeklyScores] = useState<ChartDataPoint[]>([]);
    const [statusMessage, setStatusMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchWeeklyData = async () => {
            try {
                setIsLoading(true);
                console.log('FIRE7')
                // 1. Pasiimam pastarųjų 7 dienų įrašus, surūšiuotus nuo seniausio iki naujausio
                const { data, error } = await supabase
                    .from('daily_metrics')
                    .select('date, daily_score')
                    .eq('user_id', userId)
                    .order('date', { ascending: false }) // Pirmiausia imam naujausius
                    .limit(7);
                console.log('Fetched weekly data:', data); // Debug logas

                if (error) throw error;

                if (!data || data.length === 0) {
                    console.log('FIRE6')
                    setStatusMessage('⏳ Start your check-in rituals to see trends!');
                    setWeeklyScores([]);
                    return;
                }

                // Kadangi paėmėm DESC limit 7, juos reikia apversti atgal (chronologine tvarka grafikui: nuo seniausio iki šiandienos)
                const sortedData = data.reverse();

                // Savaitės dienų pavadinimų masyvas (grafiko ašiai)
                const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

                const formattedData: ChartDataPoint[] = sortedData.map((item) => {
                    const d = new Date(item.date);
                    return {
                        date: item.date,
                        dayName: daysOfWeek[d.getDay()], // Gaunam "Pr", "An" ir t.t.
                        score: item.daily_score || 0,
                    };
                });

                setWeeklyScores(formattedData);

                // 2. TENDENCIJOS SKAIČIAVIMO LOGIKA (Ar kreivė kyla, ar krenta?)
                if (formattedData.length >= 3) {
                    console.log('FIRE1')
                    // Paimam paskutines 3 turimas dienas analizei
                    const len = formattedData.length;
                    const scoreToday = formattedData[len - 1].score;
                    const scoreYesterday = formattedData[len - 2].score;
                    const scoreTwoDaysAgo = formattedData[len - 3].score;

                    // Jeigu dvi dienas iš eilės rezultatas krito žemyn
                    if (scoreToday < scoreYesterday && scoreYesterday < scoreTwoDaysAgo) {
                        setStatusMessage('⚠️ Overdrive Mode (Pay attention to sleep and reduce screen time)');
                    }
                    // Jeigu šiandien score yra geresnis arba lygus vakarykščiam (ir bendrai auga)
                    else if (scoreToday > scoreYesterday) {
                        setStatusMessage('🚀 In the Zone');
                    }
                    // Default variantas, jei tiesiog banguoja
                    else {
                        setStatusMessage('⚖️ Steady Balance');
                    }
                } else {
                    console.log('FIRE2')
                    setStatusMessage('📈 Gathering data on your weekly trends...');
                }

            } catch (err) {
                console.log('FIRE3')
                console.error('Klaida kraunant feedback duomenis:', err);
            } finally {
                console.log('FIRE4')
                setIsLoading(false);
            }
        };

        if (userId) {
            console.log('FIRE5')
            fetchWeeklyData();
        }
    }, [userId]);

    return { weeklyScores, statusMessage, isLoading };
};