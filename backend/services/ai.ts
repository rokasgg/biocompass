// ai.ts
import { supabase } from '../../backend/supabase'; // pritaikyk pagal savo tikrą kelią

export async function getDailyInsight(userPrompt: string) {
    const { data, error } = await supabase.functions.invoke('get-insight', {
        body: {
            systemPrompt: "You are Sage, a minimalist bio-hacking coach...",
            userPrompt,
        },
    });

    if (error) throw error;
    return data.text;
}