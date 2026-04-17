import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { THEME } from '../theme';

type DatePickerProps = {
    label: string,
    value: Date,
    onChange: (date: Date) => void,
    placeHolder?: string,
}

const PrimaryDatePicker = ({ label, value, onChange, placeHolder }: DatePickerProps) => {
    const [show, setShow] = useState(false);

    const handleDateChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            setShow(false);
        }
        if (selectedDate) {
            onChange(selectedDate);
        }
    };

    const formatDate = (date: Date) => {
        if (!date) return '';
        const d = new Date(date);
        return d.toISOString().split('T')[0];
    };

    return (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>{label}</Text>

            {/* Viršutinė dalis (Data) */}
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setShow(!show)} // Toggle funkcija
                style={[
                    styles.inputWrapper,
                    show && Platform.OS === 'ios' && styles.inputWrapperActive // Sujungimo magija
                ]}
            >
                <Text style={[
                    styles.inputText,
                    !value && { color: THEME.colors.outlineVariant }
                ]}>
                    {value ? formatDate(value) : (placeHolder ?? 'YYYY-MM-DD')}
                </Text>
            </TouchableOpacity>

            {/* IOS Spinneris sujungtas su viršumi */}
            {show && Platform.OS === 'ios' && (
                <View style={styles.iosModalWrapper}>
                    <View style={styles.iosHeader}>
                        <TouchableOpacity onPress={() => setShow(false)}>
                            <Text style={styles.doneText}>Done</Text>
                        </TouchableOpacity>
                    </View>
                    <DateTimePicker
                        value={value || new Date()}
                        mode="date"
                        display="spinner"
                        onChange={handleDateChange}
                        maximumDate={new Date()}
                        textColor={THEME.colors.onSurface}
                        style={styles.picker}
                    />
                </View>
            )}

            {/* Android lieka toks pat, nes jis atsidaro per vidurį ekrano */}
            {show && Platform.OS === 'android' && (
                <DateTimePicker
                    value={value || new Date()}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    maximumDate={new Date()}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    inputGroup: { marginBottom: 16 },
    label: {
        fontSize: 14,
        fontWeight: '700',
        color: THEME.colors.onSurfaceVariant,
        marginLeft: 8,
        marginBottom: 8
    },
    inputWrapper: {
        height: 56,
        backgroundColor: THEME.colors.surfaceContainerLow,
        borderRadius: 16,
        paddingHorizontal: 24,
        justifyContent: 'center',
        zIndex: 2,
    },
    // Kai atidarytas - nuimame apatinius kampus, kad "suliptų"
    inputWrapperActive: {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        backgroundColor: THEME.colors.surfaceContainerLow,
        borderBottomWidth: 1,
        borderBottomColor: THEME.colors.outlineVariant + '20',
    },
    inputText: { fontSize: 16, color: THEME.colors.onSurface },

    iosModalWrapper: {
        backgroundColor: THEME.colors.surfaceContainerLow,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        marginTop: 0, // Panaikiname tarpą!
        paddingBottom: 10,
        zIndex: 1,
    },
    iosHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 12,
    },
    doneText: {
        color: THEME.colors.primary,
        fontWeight: '700',
        fontSize: 16
    },
    picker: {
        height: 200,
    }
});

export default PrimaryDatePicker;