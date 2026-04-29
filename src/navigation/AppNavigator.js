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

import NewProfileCreationScreen from "../screens/NewProfileCreationScreen";
import { mapProfileFromDB } from "../utils/mapper";

import ManifestationSelectionScreen from "../screens/ManifestationSelectionScreen";
import SplashScreen from "../screens/SplashScreen";


const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const isLoggedIn = useStore((s) => s.isLoggedIn);
    const login = useStore(s => s.login);
    const logout = useStore(s => s.logout);
    const isLoading = useStore(s => s.isLoading);

    const userCompletedReg = useStore(s => s.userCompletedReg);
    const setIsInitialLoading = useStore(s => s.setIsInitialLoading);



    const syncFromDB = useStore((s) => s.syncFromDB);
    const loadFullUserData = async (supabaseUser) => {
        try {
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', supabaseUser.id)
                .single();

            if (error || !profile?.email) {
                return {
                    profile: { email: supabaseUser.email, userId: supabaseUser.id },
                    currentScore: 0,
                    breathingStats: { totalSessions: 0, byType: {}, history: [] }
                };
            }

            const formattedProfile = mapProfileFromDB(profile);

            return {
                profile: formattedProfile,
                currentScore: profile.score || 0,
                breathingStats: profile.stats || { totalSessions: 0, byType: {}, history: [] }
            };
        } catch (e) {
            console.error("Klaida kraunant pilnus duomenis:", e);
            return null;
        }
    };

    async function handleUserFlow(supabaseUser) {
        const delay = new Promise(resolve => setTimeout(resolve, 2000));
        login(supabaseUser);

        const fullData = await loadFullUserData(supabaseUser);
        if (fullData) {
            syncFromDB(fullData);
        }

        await delay;
    }


    const initializeAuth = async () => {
        setIsInitialLoading(true);


        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            await handleUserFlow(session.user);
        }
        setIsInitialLoading(false);
    }

    useEffect(() => {

        initializeAuth();

        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth event:', event);

            if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session) {

                if (event === 'SIGNED_IN') {
                    setIsInitialLoading(true);
                    await handleUserFlow(session.user);
                    setIsInitialLoading(false);
                }
            } else if (event === 'SIGNED_OUT') {
                logout();
                // Papildomai galime išvalyti storage, jei norime gilaus valymo
                // useStore.persist.clearStorage(); 
            }
        });

        return () => authListener.subscription.unsubscribe();

    }, []);

    if (isLoading) {
        return <SplashScreen />;
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
                    )
                }
            </Stack.Navigator>
        </NavigationContainer>
    );
}