import { COLORS } from './colors';
import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const THEME = {
    colors: COLORS,

    // Spacing System (Multiples of 4 or 8 is standard)
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 40,
    },

    // Typography
    fontSize: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 20,
        xl: 24,
        xxl: 32,
    },

    // Common Border Radii
    radius: {
        sm: 8,
        md: 12,
        lg: 20,
        xl: 32,
        full: 9999,
    },

    // Reusable Shadows (Elevation for Android, Shadows for iOS)
    shadows: {
        editorial: {
            ...Platform.select({
                ios: {
                    shadowColor: COLORS.primary,
                    shadowOffset: { width: 0, height: 20 },
                    shadowOpacity: 0.08,
                    shadowRadius: 40,
                },
                android: {
                    elevation: 8,
                },
            }),
        },
    },

    // Helper for Responsive Layouts
    screen: {
        width,
        height,
        isSmallDevice: width < 375,
    }
};