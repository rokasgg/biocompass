import { View, Text, StyleSheet } from 'react-native';
import { THEME } from '../theme';
import { FeetIcon, SleepIcon, NutritionIcon, HeartIcon } from '../../assets/icons';


// The "Source of Truth" inside the component
const VIBE_CONFIG = {
    steps: {
        Icon: FeetIcon,
        color: THEME.colors.pastelGreen,
        label: 'Daily Steps',
    },
    sleep: {
        Icon: SleepIcon,
        color: THEME.colors.pastelBlue,
        label: 'Hours of Sleep',
    },
    calories: {
        Icon: NutritionIcon,
        color: THEME.colors.strongAccent,
        label: 'Calorie Count',
    },
    heart: {
        Icon: HeartIcon,
        color: '#ba1a1a',
        label: 'Heart Rate',
    }
};

const MetricCard = ({ vibe, value, badge, progress }) => {
    // Get the specs based on the "vibe" string
    const spec = VIBE_CONFIG[vibe];
    console.log('Rendering MetricCard with vibe:', vibe, 'and spec:', spec);

    // Fallback if a wrong string is passed
    if (!spec) return null;

    const { Icon, color, label } = spec;

    return (
        <View style={styles.metricCard}>
            <View style={styles.cardHeader}>
                <View style={[styles.iconBox, { backgroundColor: color + '40' }]}>
                    <Icon width={24} height={24} fill={color} />
                </View>
                <View style={[styles.badge, { backgroundColor: color }]}>
                    <Text style={[styles.badgeText, { color: color + '100' }]}>{badge}</Text>
                </View>
            </View>

            <View style={styles.cardBottom}>
                <Text style={styles.metricValue}>{value}</Text>
                <Text style={styles.metricLabel}>{label}</Text>
                <View style={styles.miniProgressBar}>
                    <View style={[styles.miniProgressFill, { width: `${progress * 100}%`, backgroundColor: color }]} />
                </View>
            </View>
        </View>
    );
};



const styles = StyleSheet.create({
    metricCard: {
        backgroundColor: THEME.colors.white,
        borderRadius: THEME.radius.lg,
        padding: THEME.spacing.lg,
        marginBottom: THEME.spacing.md,
        minHeight: 200,
        justifyContent: 'space-between',
        ...THEME.shadows.editorial,
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between' },
    iconBox: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
    badge: { paddingHorizontal: 12, paddingVertical: 12, borderRadius: 20, width: 100, alignItems: 'center', justifyContent: 'center' },
    badgeText: { fontSize: THEME.fontSize.xs, fontWeight: '600' },
    metricValue: { fontSize: 36, fontWeight: '800', color: THEME.colors.onSurface },
    metricLabel: { fontSize: 14, color: THEME.colors.onSurfaceVariant },
    miniProgressBar: {
        height: 6, backgroundColor: THEME.colors.surfaceContainerHigh,
        borderRadius: 3, marginTop: THEME.spacing.md, overflow: 'hidden'
    },
    miniProgressFill: { height: '100%', borderRadius: 3 },
    cardBottom: {
        marginTop: THEME.spacing.lg,
        gap: THEME.spacing.xs,

    },
});

export default MetricCard;
