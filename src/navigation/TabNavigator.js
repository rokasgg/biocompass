import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import HomeScreen from "../screens/HomeScreen";
import RitualsScreen from "../screens/RitualsScreen";
import FeedScreen from "../screens/FeedBackScreen";
import SettingsScreen from "../screens/SettingsScreen";
import HomeIcon from '../../assets/icons/home.svg';
import MedidatingIcon from '../../assets/icons/medidating.svg';
import StatsIcon from '../../assets/icons/stats.svg';
import ProfileIcon from '../../assets/icons/profile.svg';
import { THEME } from '../theme';
import { View, Text, Dimensions } from 'react-native';
const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
    const SCREEN_WIDTH = Dimensions.get('window').width;

    const TAB_WIDTH = Math.floor(SCREEN_WIDTH / 5);
    return (
        <Tab.Navigator screenOptions={({ route }) => ({
            headerShown: false,
            tabBarShowLabel: false,
            tabBarActiveTintColor: THEME.colors.primary,
            tabBarInactiveTintColor: THEME.colors.onSurfaceVariant,
            tabBarStyle: { height: 78, alignItems: 'center', paddingTop: 16, paddingBottom: 8, borderTopStartRadius: 35, borderTopEndRadius: 35, position: 'absolute', left: 16, right: 16, bottom: 0 },
            tabBarIcon: ({ focused, color, size }) => {
                const iconSize = 16
                const props = { width: iconSize, height: iconSize, fill: color };
                let IconComp = null;
                if (route.name === 'Home') IconComp = HomeIcon;
                if (route.name === 'Rituals') IconComp = MedidatingIcon;
                if (route.name === 'Feedback') IconComp = StatsIcon;
                if (route.name === 'Settings') IconComp = ProfileIcon;
                if (!IconComp) return null;

                const label = route.name === 'Settings' ? 'Profile' : route.name;

                // Estimate minimal width for focused pill so label fits; when vertical layout it's modest
                const labelApproxWidth = Math.max(0, label.length * 8);
                const minWidth = focused ? Math.max(72, Math.min(160, labelApproxWidth + 24)) : undefined;

                const PILL_HEIGHT = 52;
                // calculate a sensible max width for the label so it doesn't wrap
                const labelMaxWidth = focused
                    ? minWidth
                        ? Math.max(48, (minWidth) - iconSize - 20)
                        : 120
                    : Math.max(60, TAB_WIDTH - iconSize - 16);

                const wrapperStyle = {
                    backgroundColor: focused ? THEME.colors.tabBackground : 'transparent',
                    paddingHorizontal: focused ? 12 : 6,
                    height: PILL_HEIGHT,
                    borderRadius: 999,
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth,
                    width: TAB_WIDTH,
                };

                return (
                    <View style={wrapperStyle}>
                        <IconComp {...props} />
                        <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            allowFontScaling={false}
                            style={{
                                color,
                                marginTop: 4,
                                fontSize: 10,
                                fontWeight: focused ? '700' : '600',
                                maxWidth: labelMaxWidth,
                                textAlign: 'center',
                            }}
                        >
                            {label}
                        </Text>
                    </View>
                );
            },
        })}>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Rituals" component={RitualsScreen} />
            <Tab.Screen name="Feedback" component={FeedScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
}






