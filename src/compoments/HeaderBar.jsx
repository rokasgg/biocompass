import { TouchableOpacity, Text, StyleSheet, Platform, View } from 'react-native';
import Bell from '../../assets/icons/bell.svg';
import React from 'react';

import { THEME } from '../theme';

const HeaderBar = ({ title, onPress = () => { }, rightComponent = null }) => (
    <View style={styles.header}>
        <View style={styles.headerLeft}>
            {/* <Image
                source={{ uri: 'https://avatar.iran.liara.run/public/woman' }}
                style={styles.miniAvatar}
            /> */}
            <Text style={styles.headerTitle}>{title}</Text>
        </View>
        {rightComponent ? (
            rightComponent
        ) : (
            <TouchableOpacity style={styles.iconButton} onPress={onPress}>
                <Bell width={24} height={24} fill={THEME.colors.onSurface} />
            </TouchableOpacity>
        )}

    </View>
);

const styles = StyleSheet.create({
    header: {
        height: 64,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: THEME.spacing.lg,
        backgroundColor: THEME.colors.surfaceContainerLow,
    },
    headerTitle: {
        fontSize: THEME.fontSize.lg,
        fontWeight: '700',
        color: THEME.colors.onSurface
    },
});

HeaderBar.defaultProps = {
    onPress: () => { },
    rightComponent: null,
};

export default HeaderBar;