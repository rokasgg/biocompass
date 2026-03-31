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
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { THEME } from '../theme';
import { BreatheInIcon, SparkleIcon, OpenArrow, SleepIcon } from '../../assets/icons';
import HeaderBar from '../compoments/HeaderBar';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const RitualsScreen = () => {
  const animatedScore = useRef(new Animated.Value(0)).current;
  const score = 850;
  const goal = 1000;
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const navigation = useNavigation();

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
      <HeaderBar
        title="Rituals"
        rightComponent={
          <View style={styles.tokenBadge}>
            <SleepIcon width={14} height={14} fill={THEME.colors.primary} />
            <Text style={styles.tokenText}>{score}</Text>
          </View>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* --- Hero: Sage Score --- */}
        <View style={styles.heroSection}>
          <View style={styles.scoreCircleContainer}>
            <Svg width={264} height={264} viewBox="0 0 264 264" style={styles.svgRotate}>
              <Circle
                cx="132" cy="132" r={radius}
                stroke={THEME.colors.primaryContainer}
                strokeWidth="8" fill="transparent"
              />
              <AnimatedCircle
                cx="132" cy="132" r={radius}
                stroke={THEME.colors.primary}
                strokeWidth="12" fill="transparent"
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </Svg>
            <View style={styles.scoreInnerContent}>
              <Text style={styles.scoreLabel}>CURRENT SCORE</Text>
              <Text style={styles.scoreValue}>{score}</Text>
              <View style={styles.scoreDivider} />
              <Text style={styles.scoreGoal}>{goal} Daily Goal</Text>
            </View>
          </View>
          <Text style={styles.heroSummary}>
            You're 150 points away from your mindfulness peak today.
          </Text>
        </View>

        {/* --- Bento Grid: Rituals --- */}
        <View style={styles.bentoGrid}>
          {/* Guided Breathing */}
          <View style={styles.ritualCard}>
            <View style={styles.cardHeader}>
              <View style={styles.iconBox}>
                <BreatheInIcon width={28} height={28} fill={THEME.colors.primary} />
              </View>
              <View style={styles.pointsBadge}>
                <Text style={styles.pointsText}>+50 PTS</Text>
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
                <Text style={[styles.pointsText, { color: THEME.colors.onTertiaryFixedVariant }]}>+50 PTS</Text>
              </View>
            </View>
            <Text style={styles.cardTitle}>Daily Manifestation</Text>
            <Text style={styles.cardBody}>Align your intentions for the day ahead. Visualize success and document goals.</Text>
            <TouchableOpacity style={styles.secondaryActionBtn}>
              <Text style={styles.secondaryActionText}>Set Intentions</Text>
              <OpenArrow width={18} fill={THEME.colors.primary} />
            </TouchableOpacity>
          </View>
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
          <View style={styles.insightImageWrapper}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773' }}
              style={styles.insightImage}
            />
            <LinearGradient
              colors={['transparent', THEME.colors.primary + '60']}
              style={StyleSheet.absoluteFill}
            />
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.colors.background },
  header: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    backgroundColor: THEME.colors.surfaceContainerLow
  },
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
  insightImage: { width: '100%', height: '100%' }
});

export default RitualsScreen;