import React, { useEffect, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Animated,
    Image,
    Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { THEME } from '../theme';
import { NotimeIcon } from '../../assets/icons';


const { width, height } = Dimensions.get('window');

type ModalProps = {
    title: string,
    description: string,
    secondaryButtonDetails?: {
        text: string,
        onPress: () => void,
    },
    primaryButtonDetails?: {
        text: string,
        onPress: () => void,
    },
    optionalStyle?: object,
}

const ModalInformation = ({ secondaryButtonDetails, primaryButtonDetails, title, description, optionalStyle }: ModalProps) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(height)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 450, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 450, useNativeDriver: true }),
        ]).start();
    }, []);

    return (
        <Animated.View style={[styles.readyOverlay, optionalStyle]}>
            <Text style={styles.readyTitle}>{title}</Text>
            <Text style={styles.readySub}>
                {description}
            </Text>
            <TouchableOpacity style={styles.startCheckInBtn} onPress={primaryButtonDetails?.onPress}>
                <Text style={styles.startCheckInBtnText}>{primaryButtonDetails?.text || 'Begin Breathing Session'}</Text>
            </TouchableOpacity>


            {secondaryButtonDetails && <TouchableOpacity style={{ marginTop: 20 }} onPress={secondaryButtonDetails.onPress}>
                <Text style={{ color: THEME.colors.primary, fontWeight: '700' }}>{secondaryButtonDetails?.text || 'Skip for now'}</Text>
            </TouchableOpacity>}
        </Animated.View>
    );
};


const styles = StyleSheet.create({
    // Modal Styles
    readyOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: THEME.colors.background, justifyContent: 'center', alignItems: 'center', padding: 32, zIndex: 999 },
    readyTitle: { fontSize: 28, fontWeight: '900', fontStyle: 'italic', color: THEME.colors.onSurface, marginBottom: 12, textAlign: 'center' },
    readySub: { fontSize: 15, color: THEME.colors.onSurfaceVariant, textAlign: 'center', marginBottom: 36, lineHeight: 24 },
    startCheckInBtn: { backgroundColor: THEME.colors.primary, paddingVertical: 16, paddingHorizontal: 36, borderRadius: 28, ...THEME.shadows.editorial },
    startCheckInBtnText: { color: 'white', fontWeight: '800', fontSize: 16 },

});

export default ModalInformation;