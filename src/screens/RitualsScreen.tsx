import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,

  Animated,
  Dimensions,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { MailIcon, LockIcon, SendIcon, BackIcon, LeafIcon } from '../../assets/icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { THEME } from '../theme';
import { BreatheInIcon, SparkleIcon, OpenArrow, SleepIcon } from '../../assets/icons';
import HeaderBar from '../compoments/HeaderBar';
import { useNavigation } from '@react-navigation/native';
import { useStore } from 'src/store/useStore';

const { width } = Dimensions.get('window');

const RitualsScreen = () => {
  const animatedScore = useRef(new Animated.Value(0)).current;
  const score = 850;
  const goal = 1000;
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const navigation = useNavigation();
  const hasCompletedMorningCheckIn = useStore(state => (state as any).hasCompletedMorningCheckIn);

  const currentHour = new Date().getHours();
  const isMorningPhase = currentHour >= 6 && currentHour < 17;


  useEffect(() => {
    Animated.timing(animatedScore, {
      toValue: score / goal,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, []);

  const strokeDashoffset = animatedScore.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });



  return (
    <SafeAreaView style={styles.container}>
      {/* --- Top App Bar --- */}


      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>



        {/* --- Bento Grid: Rituals --- */}
        <View style={styles.bentoGrid}>
          {/* Guided Breathing */}
          <View style={styles.ritualCard}>
            <View style={styles.cardHeader}>
              <View style={styles.iconBox}>
                <BreatheInIcon width={28} height={28} fill={THEME.colors.primary} />
              </View>
              <View style={styles.pointsBadge}>
                {/* <Text style={styles.pointsText}>+50 PTS</Text> */}
              </View>
            </View>
            <Text style={styles.cardTitle}>Guided Breathing</Text>
            <Text style={styles.cardBody}>Find your center with a rhythmic 5-minute session designed to lower cortisol levels.</Text>
            <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate('BreathworkGallery')}>
              <LinearGradient
                colors={[THEME.colors.primary, THEME.colors.primaryContainer]}
                style={styles.primaryActionBtn}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              >
                <Text style={styles.primaryActionText}>Begin Ritual</Text>
                <OpenArrow width={14} fill="white" />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Daily Manifestation */}
          <View style={styles.ritualCard}>
            <View style={styles.cardHeader}>
              <View style={styles.iconBox}>
                <SparkleIcon width={28} height={28} fill={THEME.colors.tertiary} />
              </View>
              <View style={[styles.pointsBadge, { backgroundColor: THEME.colors.tertiaryFixed }]}>
                {/* <Text style={[styles.pointsText, { color: THEME.colors.onTertiaryFixedVariant }]}>+50 PTS</Text> */}
              </View>
            </View>
            <Text style={styles.cardTitle}>Daily Manifestation</Text>
            <Text style={styles.cardBody}>Align your intentions for the day ahead. Visualize success and document goals.</Text>
            {!hasCompletedMorningCheckIn ? (
              <TouchableOpacity style={styles.secondaryActionBtn} onPress={() => (navigation as any).navigate('DailyCheckInEntry', { phase: isMorningPhase ? 'morning' : 'evening' })}>
                <Text style={styles.secondaryActionText}>Set Intentions</Text>
                <OpenArrow width={18} fill={THEME.colors.primary} />
              </TouchableOpacity>
            ) : <View style={styles.secondaryActionBtn}>
              <LockIcon width={24} height={24} color={THEME.colors.onSurfaceVariant} />
            </View>}

          </View>

          <LinearGradient
            colors={[THEME.colors.primaryContainer, THEME.colors.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.focusCard}
          >
            <View style={styles.focusContent}>
              <LeafIcon width={32} height={32} fill="white" />
              <Text style={styles.focusTitle}>Deep Work Mode</Text>
              <Text style={styles.focusSubtitle}>
                Activate Focus mode to automatically silence all notifications during your scheduled meditation or deep-work hours.
              </Text>
              <TouchableOpacity style={styles.focusButton} onPress={() => navigation.navigate('FocusTimer')}>
                <Text style={styles.focusButtonText}>Enable Focus Mode</Text>
              </TouchableOpacity>
            </View>
            {/* Subtle background glow effect */}
            <View style={styles.cardGlow} />
          </LinearGradient>

        </View>

        {/* --- Insights Section --- */}
        <View style={styles.insightSection}>
          <View style={styles.insightTextWrapper}>
            <Text style={styles.insightOverline}>WELLNESS INSIGHTS</Text>
            <Text style={styles.insightTitle}>Your streak is glowing.</Text>
            <Text style={styles.insightBody}>
              Consistency is the heartbeat of habit. You've completed your morning rituals for 12 consecutive days.
            </Text>
          </View>

        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.colors.background },

  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerAvatar: { width: 40, height: 40, borderRadius: 20 },
  headerBrand: { fontSize: 24, fontWeight: '800', color: THEME.colors.primary, fontFamily: 'Plus Jakarta Sans' },
  tokenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    ...THEME.shadows.editorial
  },
  tokenText: { fontSize: 14, fontWeight: '700', color: '#333' },

  scrollContent: { paddingBottom: 120 },

  heroSection: { alignItems: 'center', marginTop: 40, marginBottom: 60 },
  scoreCircleContainer: { width: 264, height: 264, justifyContent: 'center', alignItems: 'center' },
  svgRotate: { transform: [{ rotate: '-90deg' }] },
  scoreInnerContent: { position: 'absolute', alignItems: 'center' },
  scoreLabel: { fontSize: 10, fontWeight: '800', color: THEME.colors.secondary, letterSpacing: 2 },
  scoreValue: { fontSize: 64, fontWeight: '900', color: THEME.colors.onSurface, marginVertical: -4 },
  scoreDivider: { width: 48, height: 4, backgroundColor: THEME.colors.primaryFixedDim, borderRadius: 2, marginVertical: 8 },
  scoreGoal: { fontSize: 16, fontWeight: '600', color: THEME.colors.primary },
  heroSummary: { fontSize: 16, color: THEME.colors.secondary, textAlign: 'center', maxWidth: 280, marginTop: 32, fontWeight: '500' },

  bentoGrid: { paddingHorizontal: 24, gap: 24 },

  ritualCard: { backgroundColor: THEME.colors.surfaceContainerLow, borderRadius: 24, padding: 32 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  iconBox: { width: 56, height: 56, backgroundColor: 'white', borderRadius: 45, justifyContent: 'center', alignItems: 'center' },
  pointsBadge: { backgroundColor: THEME.colors.primaryFixed, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  pointsText: { fontSize: 10, fontWeight: '800', color: THEME.colors.onPrimaryFixedVariant },
  cardTitle: { fontSize: 24, fontWeight: '800', color: THEME.colors.onSurface, marginBottom: 12 },
  cardBody: { fontSize: 15, color: THEME.colors.onSurfaceVariant, lineHeight: 22, marginBottom: 32 },
  primaryActionBtn: { height: 56, borderRadius: 28, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12 },
  primaryActionText: { color: 'white', fontSize: 16, fontWeight: '800' },
  secondaryActionBtn: { height: 56, borderRadius: 28, backgroundColor: THEME.colors.surfaceContainerHigh, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12 },
  secondaryActionText: { color: THEME.colors.primary, fontSize: 16, fontWeight: '800' },

  insightSection: { marginTop: 80, paddingHorizontal: 24, flexDirection: 'row', gap: 24, alignItems: 'center' },
  insightTextWrapper: { flex: 1.5, gap: 12 },
  insightOverline: { fontSize: 12, fontWeight: '800', color: THEME.colors.secondary, letterSpacing: 1.5 },
  insightTitle: { fontSize: 32, fontWeight: '800', color: THEME.colors.onSurface, lineHeight: 38 },
  insightBody: { fontSize: 16, color: THEME.colors.onSurfaceVariant, lineHeight: 24 },
  insightImageWrapper: { flex: 1, height: 200, borderRadius: 24, overflow: 'hidden' },
  insightImage: { width: '100%', height: '100%' },

  focusCard: {
    marginTop: 48,
    borderRadius: 24,
    padding: 32,
    overflow: 'hidden',
    ...THEME.shadows.editorial,
  },
  focusContent: { zIndex: 10 },
  focusTitle: { color: 'white', fontSize: 24, fontWeight: '800', marginTop: 16, marginBottom: 8 },
  focusSubtitle: { color: 'white', opacity: 0.8, fontSize: 14, lineHeight: 22, fontWeight: '500' },
  focusButton: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 100,
    alignSelf: 'flex-start',
    marginTop: 24,
  },
  focusButtonText: { color: 'white', fontWeight: '800', fontSize: 14 },
  cardGlow: {
    position: 'absolute',
    bottom: -60,
    right: -60,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
});

export default RitualsScreen;