import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { THEME } from '../theme';
import { AnalyticsIcon, LeafFilledIcon, SparkleIcon } from '../../assets/icons';

const { width } = Dimensions.get('window');

const FEATURES = [
    {
        icon: AnalyticsIcon,
        title: 'Advanced Analytics',
        body: 'Uncover hidden patterns in your health with AI-driven sleep quality scoring and metabolic trend mapping.',
        hasScreenshot: false,
    },
    {
        icon: LeafFilledIcon,
        title: 'Unlimited Rituals',
        body: 'No limits on daily manifestations, guided journaling, or deep breathing sessions. Your growth is unbounded.',
        hasScreenshot: true,
    },
    {
        icon: SparkleIcon,
        title: 'Exclusive Content',
        body: 'Access our full library of masterclass breathwork and soundscapes curated by world-leading wellness experts.',
        hasScreenshot: false,
    },
];

const PLANS = [
    {
        id: 'yearly' as const,
        name: 'Yearly Ritual',
        sub: 'Billed annually at $59.88',
        price: '$4.99',
        period: '/mo',
        badge: 'BEST VALUE',
    },
    {
        id: 'monthly' as const,
        name: 'Monthly Access',
        sub: 'Cancel anytime',
        price: '$7.99',
        period: '/mo',
        badge: null,
    },
];

const SubscriptionScreen = () => {
    const navigation = useNavigation();
    const [selectedPlan, setSelectedPlan] = useState<'yearly' | 'monthly'>('yearly');

    const handleGoPremium = () => {
        console.log('Go Premium tapped, plan:', selectedPlan);
        // IAP handler goes here
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.closeX}>✕</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>BioCompass</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero */}
                <View style={styles.hero}>
                    <Text style={styles.heroHeadline}>Unlock the Full{'\n'}BioCompass Experience</Text>
                    <Text style={styles.heroSub}>
                        Step into a world of restorative rituals and deep analytical insights designed to nurture your personal evolution.
                    </Text>
                </View>

                {/* Feature Cards */}
                {FEATURES.map((f) => {
                    const Icon = f.icon;
                    return (
                        <View key={f.title} style={styles.featureCard}>
                            <View style={styles.featureTop}>
                                <View style={styles.iconCircle}>
                                    <Icon width={24} height={24} fill={THEME.colors.primary} />
                                </View>
                                <View style={styles.featureText}>
                                    <Text style={styles.featureTitle}>{f.title}</Text>
                                    <Text style={styles.featureBody}>{f.body}</Text>
                                </View>
                            </View>
                            {f.hasScreenshot && (
                                <View style={styles.screenshotPlaceholder}>
                                    <View style={styles.screenshotInner}>
                                        <View style={styles.fakeBar} />
                                        <View style={[styles.fakeBar, { width: '60%', opacity: 0.5 }]} />
                                        <View style={styles.fakeChart}>
                                            {[40, 65, 50, 80, 60, 90, 70].map((h, i) => (
                                                <View
                                                    key={i}
                                                    style={[styles.fakeChartBar, { height: h * 0.7 }]}
                                                />
                                            ))}
                                        </View>
                                    </View>
                                </View>
                            )}
                        </View>
                    );
                })}

                {/* Plan Selector */}
                <Text style={styles.planOverline}>SELECT YOUR JOURNEY</Text>
                {PLANS.map((plan) => {
                    const isSelected = selectedPlan === plan.id;
                    return (
                        <TouchableOpacity
                            key={plan.id}
                            style={[styles.planRow, isSelected && styles.planRowSelected]}
                            onPress={() => setSelectedPlan(plan.id)}
                            activeOpacity={0.8}
                        >
                            <View style={styles.planLeft}>
                                <View style={styles.planNameRow}>
                                    <Text style={[styles.planName, isSelected && styles.planNameSelected]}>
                                        {plan.name}
                                    </Text>
                                    {plan.badge && (
                                        <View style={styles.bestValueBadge}>
                                            <Text style={styles.bestValueText}>{plan.badge}</Text>
                                        </View>
                                    )}
                                </View>
                                <Text style={styles.planSub}>{plan.sub}</Text>
                            </View>
                            <View style={styles.planPriceBlock}>
                                <Text style={[styles.planPrice, isSelected && styles.planPriceSelected]}>
                                    {plan.price}
                                </Text>
                                <Text style={styles.planPeriod}>{plan.period}</Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}

                {/* CTA */}
                <TouchableOpacity style={styles.ctaButton} onPress={handleGoPremium} activeOpacity={0.85}>
                    <Text style={styles.ctaText}>Go Premium</Text>
                </TouchableOpacity>

                {/* Maybe Later */}
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.maybeLaterWrap}>
                    <Text style={styles.maybeLaterText}>Maybe Later</Text>
                </TouchableOpacity>


            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: THEME.colors.background },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: THEME.spacing.lg,
        paddingVertical: THEME.spacing.sm,
    },
    closeButton: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
    closeX: { fontSize: 18, color: THEME.colors.onSurfaceVariant, fontWeight: '400' },
    headerTitle: { flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '700', color: THEME.colors.primary },
    headerSpacer: { width: 36 },

    scrollContent: { paddingHorizontal: THEME.spacing.lg, paddingBottom: 48 },

    // Hero
    hero: { alignItems: 'center', paddingVertical: THEME.spacing.lg, marginBottom: THEME.spacing.md },
    heroHeadline: { fontSize: 22, fontWeight: '800', color: THEME.colors.onSurface, textAlign: 'center', lineHeight: 30, marginBottom: 12 },
    heroSub: { fontSize: 14, color: THEME.colors.onSurfaceVariant, textAlign: 'center', lineHeight: 21 },

    // Feature Cards
    featureCard: {
        backgroundColor: THEME.colors.surfaceContainerLow,
        borderRadius: THEME.radius.lg,
        padding: THEME.spacing.lg,
        marginBottom: THEME.spacing.md,
    },
    featureTop: { flexDirection: 'row', gap: 14 },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: THEME.colors.primary + '18',
        justifyContent: 'center',
        alignItems: 'center',
        flexShrink: 0,
    },
    featureText: { flex: 1 },
    featureTitle: { fontSize: 15, fontWeight: '700', color: THEME.colors.onSurface, marginBottom: 6 },
    featureBody: { fontSize: 13, color: THEME.colors.onSurfaceVariant, lineHeight: 19 },

    // Screenshot placeholder
    screenshotPlaceholder: {
        marginTop: THEME.spacing.md,
        height: 130,
        backgroundColor: THEME.colors.surfaceContainerHigh,
        borderRadius: THEME.radius.md,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    screenshotInner: { width: '90%', gap: 10 },
    fakeBar: { height: 10, backgroundColor: THEME.colors.primary + '30', borderRadius: 5, width: '80%' },
    fakeChart: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, height: 63, marginTop: 4 },
    fakeChartBar: { flex: 1, backgroundColor: THEME.colors.primary + '40', borderRadius: 4 },

    // Plan Selector
    planOverline: {
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 1.5,
        color: THEME.colors.onSurfaceVariant,
        textAlign: 'center',
        marginTop: THEME.spacing.lg,
        marginBottom: THEME.spacing.md,
    },
    planRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1.5,
        borderColor: THEME.colors.outlineVariant,
        borderRadius: THEME.radius.lg,
        padding: THEME.spacing.md,
        marginBottom: THEME.spacing.sm,
        backgroundColor: THEME.colors.background,
    },
    planRowSelected: {
        borderWidth: 2,
        borderColor: THEME.colors.primary,
        backgroundColor: THEME.colors.primary + '08',
    },
    planLeft: { flex: 1, gap: 4 },
    planNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    planName: { fontSize: 15, fontWeight: '600', color: THEME.colors.onSurface },
    planNameSelected: { color: THEME.colors.primary },
    planSub: { fontSize: 12, color: THEME.colors.onSurfaceVariant },
    bestValueBadge: {
        backgroundColor: THEME.colors.primary,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: THEME.radius.full,
    },
    bestValueText: { fontSize: 10, fontWeight: '700', color: THEME.colors.white },
    planPriceBlock: { flexDirection: 'row', alignItems: 'baseline', gap: 1 },
    planPrice: { fontSize: 22, fontWeight: '800', color: THEME.colors.onSurface },
    planPriceSelected: { color: THEME.colors.primary },
    planPeriod: { fontSize: 13, color: THEME.colors.onSurfaceVariant },

    // CTA
    ctaButton: {
        backgroundColor: THEME.colors.primary,
        height: 56,
        borderRadius: THEME.radius.full,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: THEME.spacing.lg,
    },
    ctaText: { fontSize: 16, fontWeight: '800', color: THEME.colors.white },

    // Maybe Later
    maybeLaterWrap: { alignItems: 'center', paddingVertical: THEME.spacing.md },
    maybeLaterText: { fontSize: 14, color: THEME.colors.onSurfaceVariant },

    // Trust Strip
    trustStrip: { alignItems: 'center', paddingTop: THEME.spacing.lg, gap: 12 },
    trustOverline: { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, color: THEME.colors.onSurfaceVariant },
    logoRow: { flexDirection: 'row', gap: 16, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' },
    logoVogue: { fontSize: 13, fontWeight: '800', color: THEME.colors.onSurfaceVariant, letterSpacing: 1 },
    logoSelf: { fontSize: 13, fontWeight: '700', color: THEME.colors.onSurfaceVariant, fontStyle: 'italic' },
    logoForbes: { fontSize: 15, fontWeight: '400', color: THEME.colors.onSurfaceVariant, fontStyle: 'italic' },
    logoHype: { fontSize: 11, fontWeight: '800', color: THEME.colors.onSurfaceVariant, letterSpacing: 0.5 },
});

export default SubscriptionScreen;
