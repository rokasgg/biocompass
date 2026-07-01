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
    onImageLoad?: () => void;
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
    style,
    onImageLoad
}) => (
    <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        style={[styles.gridCard, { backgroundColor }, style]}
    >
        <View style={styles.gridImageContainer}>
            <Image source={{ uri: imageUri }} style={styles.gridImage} onLoadEnd={onImageLoad} />
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

    const [isTimerDone, setIsTimerDone] = useState(false);
    const [loadedImagesCount, setLoadedImagesCount] = useState(0);

    const TOTAL_IMAGES = 3; // Total number of images in the gallery
    useEffect(() => {
        // Minimalus laikas, kiek norim rodyti loaderį (dėl UX grožio)
        const timer = setTimeout(() => {
            setIsTimerDone(true);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    // Funkcija, kurią kvies kiekviena korta, kai jos nuotrauka bus paruošta
    const handleImageLoad = () => {
        setLoadedImagesCount((prev) => prev + 1);
    };

    // Loaderis rodomas, KOL nepasibaigė laikmatis ARBA kol nepasikrovė visos nuotraukos
    const showLoader = !isTimerDone || loadedImagesCount < TOTAL_IMAGES;


    return (
        // 1. Šis root View užrakina vaizdą tiksliai pagal telefono ekrano rėmus
        <View style={styles.rootContainer}>

            {/* Turinio sluoksnis */}
            <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Text style={styles.backArrow}>←</Text>
                    </TouchableOpacity>

                    <View style={styles.heroHeader}>
                        <Text style={styles.overline}>DAILY RITUAL</Text>
                        <Text style={styles.title}>Breathwork Gallery</Text>
                        <Text style={styles.subtitle}>
                            Select a practice to reset your nervous system and find your center.
                        </Text>
                    </View>

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
                            onPress={() => navigation.navigate('BreathingSession', { breathingType: 'box' })}
                            onImageLoad={handleImageLoad}
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
                            onPress={() => navigation.navigate('BreathingSession', { breathingType: 'sleep' })}
                            onImageLoad={handleImageLoad}
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
                            onPress={() => navigation.navigate('BreathingSession', { breathingType: 'equal' })}
                            onImageLoad={handleImageLoad}
                        />
                    </View>

                    <Text style={styles.quote}>"Breath is the bridge which connects life to consciousness."</Text>
                </ScrollView>
            </SafeAreaView>

            {/* 2. Loaderio sluoksnis – dabar jis lygiuojasi pagal rootContainer, t.y. pagal realų ekraną */}
            {showLoader && (
                <View style={styles.globalLoaderOverlay}>
                    <BioLoader />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        backgroundColor: THEME.colors.background
    },

    container: {
        flex: 1
    },

    globalLoaderOverlay: {
        ...StyleSheet.absoluteFill, // Dabar idealiai uždengs rootContainer (visą ekraną)
        backgroundColor: THEME.colors.background,
        justifyContent: 'center', // Centruoja idealiai per vidurį vertikaliai
        alignItems: 'center',     // Centruoja idealiai per vidurį horizontaliai
        zIndex: 999,              // Užkloja viską absoliučiai viršuje
    },


    scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
    heroHeader: { marginBottom: 40 },
    overline: { fontSize: 10, fontWeight: '800', color: THEME.colors.primary, letterSpacing: 2, marginBottom: 8 },
    title: { fontSize: 36, fontWeight: '800', color: THEME.colors.onSurface, fontFamily: 'Plus Jakarta Sans' },
    subtitle: { fontSize: 16, color: THEME.colors.onSurfaceVariant, lineHeight: 24, marginTop: 8 },
    cardsGrid: { flexDirection: 'column', gap: 12, marginBottom: 40 },
    gridCard: { width: '100%', height: 300, backgroundColor: THEME.colors.surfaceContainerLow, borderRadius: 24, overflow: 'hidden' },
    gridImageContainer: { width: '100%', height: 100 },
    gridImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    gridCardContent: { padding: 12, flex: 1, justifyContent: 'flex-start' },
    gridCardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    gridCardTitle: { fontSize: 16, fontWeight: '800', color: THEME.colors.onSurface },
    gridCardDescription: { fontSize: 14, color: THEME.colors.onSurfaceVariant, lineHeight: 20, marginTop: 8 },
    gridCardMetaRight: { alignItems: 'flex-end' },
    tag: { backgroundColor: THEME.colors.primary + '15', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
    tagText: { color: THEME.colors.primary, fontSize: 10, fontWeight: '800' },
    metaSub: { fontSize: 10, color: THEME.colors.onSurfaceVariant, fontWeight: '600' },
    miniBeginBtn: { marginTop: 16, flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-end', marginRight: 20, marginBottom: 12 },
    miniBeginBtnText: { color: THEME.colors.primary, fontSize: 10, fontWeight: '700' },
    quote: { textAlign: 'center', fontSize: 18, fontStyle: 'italic', color: '#CBD5E1', fontFamily: 'Plus Jakarta Sans', marginTop: 20 },
    backButton: { padding: 8 },
    backArrow: { fontSize: 24, color: THEME.colors.primary },
});

export default BreathworkGalleryScreen;