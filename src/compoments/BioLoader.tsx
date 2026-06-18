import React from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { THEME } from '../theme';

type BioLoaderProps = {
  message?: string;
  color?: string;
  size?: 'small' | 'large';
};

const BioLoader = ({ message, color = THEME.colors.primary, size = "large" }: BioLoaderProps) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // padding: 20,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  message: {
    marginTop: 12,
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.onSurfaceVariant,
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontFamily: 'Plus Jakarta Sans',
  },
});

export default BioLoader;