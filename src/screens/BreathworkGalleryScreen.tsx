import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { THEME } from '../theme';
import {
    BackIcon,
} from '../../assets/icons';
import BioLoader from '../compoments/BioLoader';
import HeaderBar from '../compoments/HeaderBar';

const { width } = Dimensions.get('window');

interface BreathworkCardProps {
    imageUri: string;
    headerLeft: React.ReactNode;
    headerRight: React.ReactNode;
    title: string;
    description: string;
    backgroundColor?: string;
    hasButton?: boolean;
    onPress?: () => void;
    style?: any;
}

const BreathworkCard: React.FC<BreathworkCardProps> = ({
    imageUri,
    headerLeft,
    headerRight,
    title,
    description,
    backgroundColor = THEME.colors.surfaceContainerLow,
    hasButton = false,
    onPress,
    style
}) => (
    <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        style={[styles.gridCard, { backgroundColor }, style]}
    >
        <View style={styles.gridImageContainer}>
            <Image source={{ uri: imageUri }} style={styles.gridImage} />
        </View>
        <View style={styles.gridCardContent}>
            <View style={styles.gridCardHeaderRow}>
                {headerLeft}
                {headerRight}
            </View>
            <Text style={styles.gridCardTitle}>{title}</Text>
            <Text style={styles.gridCardDescription}>{description}</Text>
        </View>
        {hasButton && (
            <TouchableOpacity style={styles.miniBeginBtn}>
                <Text style={styles.miniBeginBtnText}>begin this journey →</Text>
            </TouchableOpacity>
        )}
    </TouchableOpacity>
);

const BreathworkGalleryScreen = () => {
    const navigation = useNavigation();


    const [isLoading, setIsLoading] = useState(true);



    useEffect(() => {
        // Simulate loading time
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <BioLoader />;
    }
    //     if (!users.length) {
    //   return <Text>No users found</Text>;
    // }

    // if (error) {
    //     return <Text>Something went wrong</Text>;
    // }

    return (
        <SafeAreaView style={styles.container}>
            {/* --- Top App Bar --- */}
            {/* <HeaderBar /> */}

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* --- Hero Header --- */}
                <View style={styles.heroHeader}>
                    <Text style={styles.overline}>DAILY RITUAL</Text>
                    <Text style={styles.title}>Breathwork Gallery</Text>
                    <Text style={styles.subtitle}>
                        Select a practice to reset your nervous system and find your center.
                    </Text>
                </View>

                {/* --- Cards Grid --- */}
                <View style={styles.cardsGrid}>
                    <BreathworkCard
                        imageUri="https://images.unsplash.com/photo-1518199266791-5375a83190b7"
                        headerLeft={
                            <View style={styles.tag}>
                                <Text style={styles.tagText}>FOR FOCUS</Text>
                            </View>
                        }
                        headerRight={
                            <View style={styles.gridCardMetaRight}>
                                <Text style={styles.metaSub}>4 mins</Text>
                            </View>
                        }
                        title="Box Breathing"
                        description="A structured breathing technique that promotes focus and calm by inhaling, holding, exhaling, and holding for equal durations."
                        hasButton={true}
                        onPress={() => navigation.navigate('BreathingSession')}
                    />
                    <BreathworkCard
                        imageUri="https://images.unsplash.com/photo-1506905925346-21bda4d32df4"
                        headerLeft={
                            <View style={styles.tag}>
                                <Text style={styles.tagText}>FOR SLEEP</Text>
                            </View>
                        }
                        headerRight={
                            <View style={styles.gridCardMetaRight}>
                                <Text style={styles.metaSub}>2-5 mins</Text>
                            </View>
                        }
                        title="4-7-8 Technique"
                        description="A relaxing technique to fall asleep faster by inhaling for 4 seconds, holding for 7, and exhaling for 8."
                        backgroundColor={THEME.colors.surfaceContainerHigh}
                        hasButton={true}
                        onPress={() => navigation.navigate('BreathingSession')}

                    />
                    <BreathworkCard
                        imageUri="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b"
                        headerLeft={
                            <View style={styles.tag}>
                                <Text style={styles.tagText}>FOR BALANCE</Text>
                            </View>
                        }
                        headerRight={
                            <View style={styles.gridCardMetaRight}>
                                <Text style={styles.metaSub}>3 mins</Text>
                            </View>
                        }
                        title="Equal Breath"
                        description="A balancing practice where inhalation and exhalation are of equal length, fostering harmony and presence."
                        backgroundColor={THEME.colors.surfaceContainerLow}
                        style={{ borderWidth: 1, borderColor: THEME.colors.primary + '10' }}
                        hasButton={true}
                        onPress={() => navigation.navigate('BreathingSession')}

                    />
                </View>

                <Text style={styles.quote}>"Breath is the bridge which connects life to consciousness."</Text>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: THEME.colors.background },
    header: {
        height: 64,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        backgroundColor: 'rgba(249, 250, 246, 0.7)',
    },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    headerTitle: { fontSize: 18, fontWeight: '700', color: THEME.colors.onSurface, fontFamily: 'Plus Jakarta Sans' },
    iconBtn: { padding: 4 },
    profileCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: THEME.colors.surfaceContainer, justifyContent: 'center', alignItems: 'center' },
    profileIcon: { width: 20, height: 20, borderRadius: 10, backgroundColor: THEME.colors.primary },

    scrollContent: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 100 },
    heroHeader: { marginBottom: 40 },
    overline: { fontSize: 10, fontWeight: '800', color: THEME.colors.primary, letterSpacing: 2, marginBottom: 8 },
    title: { fontSize: 36, fontWeight: '800', color: THEME.colors.onSurface, fontFamily: 'Plus Jakarta Sans' },
    subtitle: { fontSize: 16, color: THEME.colors.onSurfaceVariant, lineHeight: 24, marginTop: 8 },

    // Featured Card
    featuredCard: { backgroundColor: THEME.colors.surfaceContainerLow, borderRadius: 24, overflow: 'hidden', ...THEME.shadows.editorial, marginBottom: 32 },
    featuredImageContainer: { width: '100%', height: 200 },
    featuredImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    featuredContent: { padding: 24 },

    // Grid Cards
    cardsGrid: { flexDirection: 'column', gap: 12, marginBottom: 40 },
    gridCard: { width: '100%', height: 300, backgroundColor: THEME.colors.surfaceContainerLow, borderRadius: 24, overflow: 'hidden', ...THEME.shadows.editorial },
    gridImageContainer: { width: '100%', height: 100 },
    gridImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    gridCardContent: { padding: 12, flex: 1, justifyContent: 'flex-start' },
    gridCardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    gridCardTitle: { fontSize: 16, fontWeight: '800', color: THEME.colors.onSurface },
    gridCardDescription: { fontSize: 14, color: THEME.colors.onSurfaceVariant, lineHeight: 20, marginTop: 8 },
    gridCardMetaRight: { alignItems: 'flex-end' },

    cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    tag: { backgroundColor: THEME.colors.primary + '15', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
    tagText: { color: THEME.colors.primary, fontSize: 10, fontWeight: '800' },
    durationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    scheduleIcon: { width: 14, height: 14, borderRadius: 2, backgroundColor: THEME.colors.onSurfaceVariant },
    durationText: { fontSize: 12, color: THEME.colors.onSurfaceVariant, fontWeight: '600' },
    cardTitleLarge: { fontSize: 28, fontWeight: '800', color: THEME.colors.onSurface, marginBottom: 8 },
    cardDescription: { fontSize: 15, color: THEME.colors.onSurfaceVariant, lineHeight: 22, marginBottom: 24 },
    beginBtn: { height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
    beginBtnText: { color: 'white', fontSize: 16, fontWeight: '800' },

    // Secondary Row
    secondaryRow: { flexDirection: 'row', gap: 16, marginBottom: 40 },
    subCard: { flex: 1, padding: 20, borderRadius: 24, minHeight: 240, justifyContent: 'space-between' },
    iconCircleWhite: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', ...THEME.shadows.editorial },
    cardMetaRight: { alignItems: 'flex-end' },
    metaOverline: { fontSize: 8, fontWeight: '800', color: THEME.colors.primary, letterSpacing: 1 },
    metaSub: { fontSize: 10, color: THEME.colors.onSurfaceVariant, fontWeight: '600' },
    bedtimeIcon: { width: 24, height: 24, borderRadius: 12, backgroundColor: THEME.colors.primary },
    balanceIcon: { width: 24, height: 24, borderRadius: 12, backgroundColor: 'white' },
    cardTitleSmall: { fontSize: 18, fontWeight: '800', color: THEME.colors.onSurface, marginTop: 12 },
    cardDescriptionSmall: { fontSize: 12, color: THEME.colors.onSurfaceVariant, lineHeight: 18, marginTop: 8 },
    miniBeginBtn: { marginTop: 16, flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-end', marginRight: 20, marginBottom: 12 },
    miniBeginBtnText: { color: THEME.colors.primary, fontSize: 10, fontWeight: '700' },

    quote: { textAlign: 'center', fontSize: 18, fontStyle: 'italic', color: '#CBD5E1', fontFamily: 'Plus Jakarta Sans', marginTop: 20 }
});

export default BreathworkGalleryScreen;