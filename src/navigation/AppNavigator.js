import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import MainTabNavigator from "./TabNavigator";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/authScreens/LoginScreen";
import PrivacyScreen from "../screens/PrivacyScreen";
import PersonalInfoScreen from "../screens/PersonalInfoScreen";
import NotificationSettingsScreen from "../screens/NotificationScreen";
import ChangePasswordScreen from "../screens/ChangePasswordScreen";
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import VerifyCodeScreen from '../screens/VerifyCodeScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import { useStore } from '../store/useStore';
import BreathingSessionScreen from "../screens/BreathingSessionScreen";
import BreathworkGalleryScreen from "../screens/BreathworkGalleryScreen";
import SignUpScreen from "../screens/authScreens/SignUpScreen";
import { supabase } from "../../backend/supabase";
import BioLoader from "../compoments/BioLoader";
import NewProfileCreationScreen from "../screens/NewProfileCreationScreen";
import { mapProfileFromDB } from "../utils/mapper";

import { useNavigation } from '@react-navigation/native';
import ManifestationSelectionScreen from "../screens/ManifestationSelectionScreen";


const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const isLoggedIn = useStore((s) => s.isLoggedIn);
    const login = useStore(s => s.login);
    const logout = useStore(s => s.logout);
    const setUserCompletedReg = useStore(s => s.setUserCompletedReg);
    const userCompletedReg = useStore(s => s.userCompletedReg);
    // const isInitialLoading = useStore(s => s.isLoading);
    // const setIsInitialLoading = useStore(s => s.setIsInitialLoading);
    const [isInitialLoading, setIsInitialLoading] = useState(true);


    const syncFromDB = useStore((s) => s.syncFromDB);
    const loadFullUserData = async (supabaseUser) => {
        try {
            // Traukiame papildomą info iš 'profiles' lentelės
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', supabaseUser.id)
                .single();

            if (error) {
                console.log("Profilis dar nesukurtas arba klaida:", error.message);
                setUserCompletedReg(false);
                // Jei profilio nėra, perduodame bent bazinę info iš auth
                return {
                    profile: { email: supabaseUser.email, id: supabaseUser.id },
                    currentScore: 0,
                    breathingStats: { totalSessions: 0, byType: {}, history: [] }
                };
            }
            console.log("Pilni duomenys iš DB:", profile);
            // navigation.navigate('NewProfile');
            const formattedProfile = mapProfileFromDB(profile);
            console.log("Profilio duomenys iš DB:", formattedProfile);
            // Suformuojame objektą, kurio tikisi tavo Zustand syncFromDB
            // Nustatome, kad vartotojas baigė registraciją
            return {
                profile: formattedProfile, // Čia bus tavo first_name, last_name ir t.t.
                currentScore: profile.score || 0,
                breathingStats: profile.stats || { totalSessions: 0, byType: {}, history: [] }
            };
        } catch (e) {
            console.error("Klaida kraunant pilnus duomenis:", e);
            return null;
        }
    };

    useEffect(() => {
        // 1. Check existing session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) handleUserFlow(session.user);
            setIsInitialLoading(false);
        });

        // 2. Listen for auth changes
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session) {
                handleUserFlow(session.user);
            } else {
                logout();
            }
        });

        async function handleUserFlow(supabaseUser) {
            setIsInitialLoading(true);
            login(supabaseUser); // Save email/ID to Zustand
            console.log('User logged in, ID:', supabaseUser.id, 'Email:', supabaseUser.email);
            const fullData = await loadFullUserData(supabaseUser);
            console.log('Full user data loaded:', fullData);
            if (fullData) {
                syncFromDB(fullData);
                // Flip the switch based on actual DB data
                console.log('User completed reg:', !!fullData.profile.firstName);
                setUserCompletedReg(!!fullData.profile.firstName);
            }
            setIsInitialLoading(false);
        }

        return () => authListener.subscription.unsubscribe();
    }, []);

    if (isInitialLoading) {
        return <BioLoader />; // Rodyk splash screen, kol tikrina sesiją
    }
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {isLoggedIn ?
                    <Stack.Group>
                        {!userCompletedReg ? (
                            <Stack.Screen name="NewProfile" component={NewProfileCreationScreen} />
                        ) : (
                            <Stack.Screen name="MainTabs" component={MainTabNavigator} />
                        )}
                        <Stack.Screen
                            name="Privacy"
                            component={PrivacyScreen}
                            options={{
                                animation: 'slide_from_right'
                            }}
                        />
                        <Stack.Screen
                            name="PersonalInfo"
                            component={PersonalInfoScreen}
                            options={{
                                animation: 'slide_from_right'
                            }}
                        />
                        <Stack.Screen
                            name="Notifications"
                            component={NotificationSettingsScreen}
                            options={{
                                animation: 'slide_from_right'
                            }}
                        />
                        <Stack.Screen
                            name="ChangePassword"
                            component={ChangePasswordScreen}
                            options={{
                                animation: 'slide_from_right'
                            }}
                        />
                        <Stack.Screen
                            name="BreathingSession"
                            component={BreathingSessionScreen}

                        />
                        <Stack.Screen
                            name="BreathworkGallery"
                            component={BreathworkGalleryScreen}
                            options={{
                                animation: 'slide_from_right',

                            }}
                        />
                        <Stack.Screen
                            name="ManifestationSelection"
                            component={ManifestationSelectionScreen}
                            options={{
                                animation: 'slide_from_left',

                            }}
                        />
                    </Stack.Group>
                    :
                    (
                        <Stack.Group name='Auth'>
                            <Stack.Screen name="Login" component={LoginScreen} />
                            <Stack.Screen name="SignUp" component={SignUpScreen} />
                            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                            <Stack.Screen name="VerifyCode" component={VerifyCodeScreen} />
                            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
                        </Stack.Group>
                    )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}