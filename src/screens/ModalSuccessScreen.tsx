import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { THEME } from '../theme';
import { BackIcon } from '../../assets/icons';

const { width, height } = Dimensions.get('window');

const ModalSuccessScreen = () => {
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(height)).current;

  // Simulate session end
  useEffect(() => {
    const timer = setTimeout(() => {
      triggerSuccess();
    }, 3000); // Show modal after 3 seconds for demo
    return () => clearTimeout(timer);
  }, []);

  const triggerSuccess = () => {
    setShowModal(true);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true }),
    ]).start();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* --- Header --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon width={24} fill={THEME.colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerBrand}>Sage Wellness</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* --- Active Breathing Canvas --- */}
      <View style={styles.mainCanvas}>
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>1:00</Text>
          <Text style={styles.timerLabel}>REMAINING</Text>
        </View>

        <View style={styles.breathContainer}>
          <Svg style={styles.absProgress} width={288} height={288} viewBox="0 0 288 288">
            <Circle cx="144" cy="144" r="130" stroke={THEME.colors.primaryContainer} strokeWidth="8" fill="none" />
            <Circle cx="144" cy="144" r="130" stroke={THEME.colors.primary} strokeWidth="8" fill="none"
              strokeDasharray="816" strokeDashoffset="204" strokeLinecap="round" transform="rotate(-90 144 144)"
            />
          </Svg>
          <LinearGradient colors={[THEME.colors.primary, THEME.colors.primaryContainer]} style={styles.breathIndicator}>
            <Text style={styles.inhaleText}>Inhale</Text>
            <Text style={styles.inhaleSub}>Deeply & Slowly</Text>
          </LinearGradient>
        </View>

        <View style={styles.guidanceSection}>
          <View style={styles.phaseDots}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
          <Text style={styles.guidanceText}>Focus on the center. Let your shoulders drop as the circle expands.</Text>
        </View>
      </View>

      {/* --- SUCCESS MODAL OVERLAY --- */}
      {showModal && (
        <Animated.View style={[StyleSheet.absoluteFill, { opacity: fadeAnim }]}>
          <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill}>
            <View style={styles.modalCentered}>
              <Animated.View style={[styles.modalCard, { transform: [{ translateY: slideAnim }] }]}>
                {/* Modal Header Image */}
                <View style={styles.modalImageContainer}>
                  <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc' }}
                    style={styles.modalImage}
                  />
                  <View style={styles.checkWrapper}>
                    <View style={styles.checkIcon} />
                  </View>
                </View>

                {/* Modal Content */}
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Ritual Complete!</Text>
                  <Text style={styles.modalSub}>Your nervous system is now in a restorative state.</Text>

                  <View style={styles.scoreBreakdown}>
                    <View>
                      <Text style={styles.scoreLabelSmall}>DAILY SCORE</Text>
                      <Text style={styles.scoreValueBig}>2,450 pts</Text>
                    </View>
                    <View style={styles.pointsEarnedBadge}>
                      <Text style={styles.pointsEarnedText}>+50 Points</Text>
                    </View>
                  </View>

                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <LinearGradient colors={[THEME.colors.primary, THEME.colors.primaryContainer]} style={styles.finishBtn}>
                      <Text style={styles.finishBtnText}>Finish</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </View>
          </BlurView>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.colors.background },
  header: { height: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24 },
  headerBrand: { fontSize: 18, fontWeight: '700', color: THEME.colors.primary, fontFamily: 'Plus Jakarta Sans' },

  mainCanvas: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 60 },
  timerContainer: { marginBottom: 48, alignItems: 'center' },
  timerText: { fontSize: 48, fontWeight: '800', color: THEME.colors.secondary, fontFamily: 'Plus Jakarta Sans' },
  timerLabel: { fontSize: 12, fontWeight: '700', color: THEME.colors.onSurfaceVariant, letterSpacing: 2 },

  breathContainer: { width: 288, height: 288, justifyContent: 'center', alignItems: 'center' },
  absProgress: { position: 'absolute' },
  breathIndicator: { width: 224, height: 224, borderRadius: 112, justifyContent: 'center', alignItems: 'center', ...THEME.shadows.editorial },
  inhaleText: { fontSize: 32, fontWeight: '800', color: 'white' },
  inhaleSub: { fontSize: 10, color: 'white', opacity: 0.8, fontWeight: '700', letterSpacing: 1, marginTop: 4 },

  guidanceSection: { marginTop: 64, alignItems: 'center' },
  phaseDots: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  dot: { width: 48, height: 6, borderRadius: 3, backgroundColor: THEME.colors.surfaceContainerHigh },
  dotActive: { backgroundColor: THEME.colors.primary },
  guidanceText: { textAlign: 'center', maxWidth: 260, color: THEME.colors.onSurfaceVariant, fontWeight: '500', lineHeight: 22 },

  // Modal Styles
  modalCentered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalCard: { width: '100%', backgroundColor: 'white', borderRadius: 32, overflow: 'hidden', ...THEME.shadows.editorial },
  modalImageContainer: { height: 190, width: '100%', backgroundColor: THEME.colors.surfaceContainerLow },
  modalImage: { width: '100%', height: '100%', opacity: 0.6 },
  checkWrapper: { position: 'absolute', alignSelf: 'center', top: 75, width: 80, height: 80, borderRadius: 40, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', elevation: 10 },
  checkIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: THEME.colors.primary },

  modalContent: { padding: 32, alignItems: 'center' },
  modalTitle: { fontSize: 28, fontWeight: '800', color: THEME.colors.onSurface, marginBottom: 8 },
  modalSub: { fontSize: 16, color: THEME.colors.onSurfaceVariant, textAlign: 'center', marginBottom: 32, lineHeight: 22 },

  scoreBreakdown: { width: '100%', backgroundColor: THEME.colors.surfaceContainerLow, borderRadius: 16, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  scoreLabelSmall: { fontSize: 10, fontWeight: '800', color: THEME.colors.onSurfaceVariant, letterSpacing: 1 },
  scoreValueBig: { fontSize: 24, fontWeight: '800', color: THEME.colors.secondary },
  pointsEarnedBadge: { backgroundColor: THEME.colors.primary + '15', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  pointsEarnedText: { color: THEME.colors.primary, fontWeight: '800', fontSize: 12 },

  finishBtn: { width: width - 112, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  finishBtnText: { color: 'white', fontSize: 18, fontWeight: '800' },
});

export default ModalSuccessScreen;