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
    message?: string,
    onCancel: () => void,
    onConfirm: () => void
}

const ModalConfirmation = ({ onCancel, onConfirm }: ModalProps) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(height)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 450, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 450, useNativeDriver: true }),
        ]).start();
    }, []);

    return (
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
            <BlurView intensity={10} tint="dark" style={StyleSheet.absoluteFill}>
                <View style={styles.modalCentered}>
                    <Animated.View style={[styles.modalCard, { transform: [{ translateY: slideAnim }] }]}>
                        {/* Modal Content */}
                        <View style={styles.modalContent}>

                            <View style={{ marginBottom: 24, backgroundColor: THEME.colors.surfaceContainer, padding: 16, borderRadius: 90 }}>
                                <NotimeIcon width={45} height={45} color={THEME.colors.primary} style={{ margin: 10 }} />
                            </View>
                            <Text style={styles.modalTitle}>Cancel session?</Text>
                            <Text style={styles.modalSub}>Your progress for this ritual will be
                                lost. Are you sure you want to end it
                                now?</Text>

                            <View style={styles.buttonContainer}>
                                <TouchableOpacity onPress={onCancel}>
                                    <LinearGradient colors={[THEME.colors.primary, THEME.colors.primaryContainer]} style={styles.finishBtn}>
                                        <Text style={styles.finishBtnText}>Keep Going</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={onConfirm}>
                                    <View style={[styles.finishBtn, { backgroundColor: THEME.colors.surfaceContainer }]}>
                                        <Text style={[styles.finishBtnText, { color: THEME.colors.onSurfaceVariant }]}>End Session</Text>
                                    </View>
                                </TouchableOpacity>

                            </View>
                        </View>
                    </Animated.View>
                </View >
            </BlurView >
        </Animated.View >
    );
};


const styles = StyleSheet.create({
    // Modal Styles
    modalCentered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    modalCard: { width: '100%', backgroundColor: 'white', borderRadius: 32, overflow: 'hidden', ...THEME.shadows.editorial },
    overlay: { ...StyleSheet.absoluteFillObject, position: 'absolute', zIndex: 999, backgroundColor: 'rgba(0, 0, 0, 0.6)' },

    modalContent: { padding: 24, alignItems: 'center' },
    modalTitle: { fontSize: 28, fontWeight: '800', color: THEME.colors.onSurface, marginBottom: 8, textAlign: 'center' },
    modalSub: { fontSize: 16, color: THEME.colors.onSurfaceVariant, textAlign: 'center', marginBottom: 16, lineHeight: 22 },

    buttonContainer: { flexDirection: 'column', alignContent: 'center', width: '100%', justifyContent: 'space-between', gap: 16 },
    finishBtn: { width: width - 112, height: 50, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
    finishBtnText: { color: 'white', fontSize: 18, fontWeight: '700' },

});

export default ModalConfirmation;