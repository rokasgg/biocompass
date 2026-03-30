import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import MainTabNavigator from "./TabNavigator";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/authScreens/LoginScreen";
import PrivacyScreen from "../screens/PrivacyScreen";
import PersonalInfoScreen from "../screens/PersonalInfoScreen";
import NotificationSettingsScreen from "../screens/NotificationScreen";
import { useStore } from '../store/useStore';

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
                    </Stack.Group>
                    :
                    (<Stack.Screen name="Auth" component={LoginScreen} />)}
            </Stack.Navigator>
        </NavigationContainer>
    );
}