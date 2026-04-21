import React from 'react';
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { THEME } from '../theme';
import LeafFilledIcon from '../../assets/icons/LEAFS.svg'

const SplashScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <View style={styles.brandSection}>
                    <View style={styles.iconCircle}>
                        <LeafFilledIcon width={48} height={48} fill={THEME.colors.primary} />
                    </View>
                    <Text style={styles.title}>BioCompass</Text>
                    <Text style={styles.subtitle}>Continue your journey to mindful living.</Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: THEME.colors.tabBackground,
    },

    brandSection: {
        marginBottom: 48,
        alignItems: 'center',
    },
    iconCircle: {
        width: 100,
        height: 100,
        backgroundColor: THEME.colors.white,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 48,
        fontWeight: '700',
        color: THEME.colors.onSurface,
        letterSpacing: -0.5,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: THEME.colors.onSurfaceVariant,
    },


});

export default SplashScreen;