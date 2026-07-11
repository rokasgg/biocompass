import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
    Modal,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { THEME } from '../theme';
import { Animated, Easing } from 'react-native';
import { Keyboard } from 'react-native';

type DatePickerProps = {
    label: string;
    value: Date;
    onChange: (date: Date) => void;
    placeHolder?: string;
    error?: string;
};

const PrimaryDatePicker = ({ label, value, onChange, placeHolder, error }: DatePickerProps) => {
    console.log('PrimaryDatePicker render, value:', value);
    const [show, setShow] = useState(false);
    const [tempDate, setTempDate] = useState(value || new Date());

    useEffect(() => {
        if (value) setTempDate(value);
    }, [value]);

    const slideAnim = useState(new Animated.Value(300))[0];


    const handleConfirm = () => {
        onChange(tempDate);
        setShow(false);
    };

    const handleCancel = () => {
        setTempDate(value || new Date());
        setShow(false);
    };

    const formatDate = (date: Date) => {
        if (!date) return '';

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        if (show) {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 250,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }).start();
        } else {
            slideAnim.setValue(300);
        }
    }, [show]);

    return (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>{label}</Text>

            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                    setShow(true);
                    Keyboard.dismiss();
                }}
                style={styles.inputWrapper}
            >
                <Text
                    style={[
                        styles.inputText,
                        !value && { color: THEME.colors.outlineVariant },
                    ]}
                >
                    {value
                        ? formatDate(value)
                        : placeHolder ?? 'YYYY-MM-DD'}
                </Text>
            </TouchableOpacity>


            {Platform.OS === 'ios' && (
                <Modal visible={show} transparent animationType="none">
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        activeOpacity={1}
                        onPress={handleCancel}
                    >
                        <View style={styles.modalOverlay}>
                            <Animated.View
                                style={[
                                    styles.modalContent,
                                    { transform: [{ translateY: slideAnim }] },
                                ]}
                            >

                                <View style={styles.header}>
                                    <TouchableOpacity onPress={handleCancel}>
                                        <Text style={styles.cancel}>Cancel</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={handleConfirm}>
                                        <Text style={styles.done}>Done</Text>
                                    </TouchableOpacity>
                                </View>


                                <View style={styles.pickerContainer}>
                                    <DateTimePicker
                                        value={tempDate}
                                        mode="date"
                                        display="spinner"
                                        onChange={(e, d) => d && setTempDate(d)}
                                        maximumDate={new Date()}
                                        style={styles.picker}
                                        textColor={THEME.colors.onSurface}
                                    />
                                </View>

                            </Animated.View>
                        </View>
                    </TouchableOpacity>
                </Modal>
            )}


            {Platform.OS === 'android' && show && (
                <DateTimePicker
                    value={value || new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                        setShow(false);
                        if (selectedDate) onChange(selectedDate);
                    }}
                    maximumDate={new Date()}
                />
            )}
            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    inputGroup: { marginBottom: 16 },

    label: {
        fontSize: 14,
        fontWeight: '600',
        color: THEME.colors.onSurfaceVariant,
        marginBottom: 6,
        marginLeft: 4,
    },

    inputWrapper: {
        height: 56,
        borderRadius: 14,
        paddingHorizontal: 16,
        justifyContent: 'center',
        backgroundColor: THEME.colors.surfaceContainerLow,
    },

    inputText: {
        fontSize: 16,
        color: THEME.colors.onSurface,
    },

    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.12)',
    },

    modalContent: {
        backgroundColor: THEME.colors.surface,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 20,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
    },

    cancel: {
        fontSize: 16,
        color: THEME.colors.outline,
    },

    done: {
        fontSize: 16,
        fontWeight: '600',
        color: THEME.colors.primary,
    },

    pickerContainer: {
        overflow: 'hidden',
        marginHorizontal: -32,
    },

    picker: {
        width: '120%',
        height: 200,
        alignSelf: 'center',
    },
    error: { color: THEME.colors.error, fontSize: 12, marginTop: 4, marginLeft: 4 },
});

export default PrimaryDatePicker;