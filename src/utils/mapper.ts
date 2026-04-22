// 1. Iš Supabase (snake_case) -> Į tavo Zustand/Frontend (camelCase)
export const mapProfileFromDB = (dbProfile: any) => {
  if (!dbProfile) return null;
  console.log('Mapping DB profile to frontend format:', dbProfile);
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
  };
};

// 2. Iš Frontend (camelCase) -> Atgal į Supabase (snake_case)
// Naudosi, kai darysi .update() arba .upsert()
export const mapProfileToDB = (user: any) => {
  return {
    // Čia rašome DB stulpelių pavadinimus kairėje
    username: user.username,
    first_name: user.firstName,
    last_name: user.lastName,
    email: user.email,
    subscribed: user.subscribed,
    phone: user.phone,
    avatar_url: user.avatarUrl,
    updated_at: new Date().toISOString(),
  };
};