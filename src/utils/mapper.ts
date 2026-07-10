// 1. Iš Supabase (snake_case) -> Į tavo Zustand/Frontend (camelCase)
export const mapProfileFromDB = (dbProfile: any) => {
  if (!dbProfile) return null;
  return {
    userId: dbProfile.id,
    username: dbProfile.username || '',
    firstName: dbProfile.first_name || '',
    lastName: dbProfile.last_name || '',
    email: dbProfile.email || '',
    subscribed: dbProfile.subscribed || false,
    phone: dbProfile.phone || '',
    avatarUrl: dbProfile.avatar_url || '',
    birthDate: dbProfile.birth_date || null,
    shareResearch: dbProfile.share_research ?? false,
    leaderboardEnabled: dbProfile.leaderboard_enabled ?? true,
  };
};

// 2. Iš Frontend (camelCase) -> Atgal į Supabase (snake_case)
// Naudosi, kai darysi .update() arba .upsert()
export const mapProfileToDB = (user: any) => {
  return {
    username: user.username,
    first_name: user.firstName,
    last_name: user.lastName,
    email: user.email,
    subscribed: user.subscribed,
    phone: user.phone,
    avatar_url: user.avatarUrl,
    updated_at: new Date().toISOString(),
    birth_date: user.birthDate,
  };
};