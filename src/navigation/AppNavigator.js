import React from "react";
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

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const isLoggedIn = useStore((s) => s.isLoggedIn);
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {isLoggedIn ?
                    <Stack.Group>
                        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
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
                            options={{
                                animation: 'slide_from_right'
                            }}
                        />
                        <Stack.Screen
                            name="BreathworkGallery"
                            component={BreathworkGalleryScreen}
                            options={{
                                animation: 'slide_from_right',
                                headerBackVisible: true,
                            }}
                        />


                    </Stack.Group>
                    :
                    (
                        <Stack.Group name='Auth'>
                            <Stack.Screen name="Login" component={LoginScreen} />
                            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                            <Stack.Screen name="VerifyCode" component={VerifyCodeScreen} />
                            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />

                        </Stack.Group>
                    )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}