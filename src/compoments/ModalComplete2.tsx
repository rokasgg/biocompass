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


const { width, height } = Dimensions.get('window');

const ModalComplete2Screen = ({ onClose, title, sub }: { onClose?: () => void; title: string; sub: string }) => {
    const navigation = useNavigation();

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
                        {/* Modal Header Image */}
                        <View style={styles.modalImageContainer}>
                            <Image
                                source={{ uri: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc' }}
                                style={styles.modalImage}
                            />
                        </View>

                        {/* Modal Content */}
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>{title || "Data Gathered!"}</Text>
                            <Text style={styles.modalSub}>{sub || "First step is done, now it's time to relax!"}</Text>
                            {/* 
                            <View style={styles.scoreBreakdown}>
                                <View>
                                    <Text style={styles.scoreLabelSmall}>DAILY SCORE</Text>
                                    <Text style={styles.scoreValueBig}>2,450 pts</Text>
                                </View>
                                <View style={styles.pointsEarnedBadge}>
                                    <Text style={styles.pointsEarnedText}>+50 Points</Text>
                                </View>
                            </View> */}

                            <TouchableOpacity onPress={() => {
                                // play a slower exit animation, then call onClose/navigation
                                Animated.parallel([
                                    Animated.timing(fadeAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
                                    Animated.timing(slideAnim, { toValue: height, duration: 800, useNativeDriver: true }),
                                ]).start(() => {
                                    if (onClose) return onClose();
                                    (navigation as any).navigate('MainTabs', { screen: 'Home' });
                                });
                            }}>
                                <LinearGradient colors={[THEME.colors.primary, THEME.colors.primaryContainer]} style={styles.finishBtn}>
                                    <Text style={styles.finishBtnText}>Finish</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </View>
            </BlurView>
        </Animated.View>
    );
};


const styles = StyleSheet.create({
    // Modal Styles
    modalCentered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    modalCard: { width: '100%', backgroundColor: 'white', borderRadius: 32, overflow: 'hidden', ...THEME.shadows.editorial },
    overlay: { ...StyleSheet.absoluteFillObject, position: 'absolute', zIndex: 999, backgroundColor: 'rgba(0, 0, 0, 0.6)' },
    modalImageContainer: { height: 100, width: '100%', backgroundColor: THEME.colors.surfaceContainerLow },
    modalImage: { width: '100%', height: '100%', opacity: 0.8 },

    modalContent: { padding: 24, alignItems: 'center' },
    modalTitle: { fontSize: 28, fontWeight: '800', color: THEME.colors.onSurface, marginBottom: 8 },
    modalSub: { fontSize: 16, color: THEME.colors.onSurfaceVariant, textAlign: 'center', marginBottom: 16, lineHeight: 22 },

    scoreBreakdown: { width: '100%', backgroundColor: THEME.colors.surfaceContainerLow, borderRadius: 16, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    scoreLabelSmall: { fontSize: 10, fontWeight: '800', color: THEME.colors.onSurfaceVariant, letterSpacing: 1 },
    scoreValueBig: { fontSize: 24, fontWeight: '800', color: THEME.colors.secondary },
    pointsEarnedBadge: { backgroundColor: THEME.colors.primary + '15', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    pointsEarnedText: { color: THEME.colors.primary, fontWeight: '800', fontSize: 12 },

    finishBtn: { width: width - 112, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
    finishBtnText: { color: 'white', fontSize: 18, fontWeight: '800' },
});

export default ModalComplete2Screen;