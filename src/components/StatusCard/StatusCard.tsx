import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ClockIcon from '@assets/icons/clock.svg';
import HomeTimeDeviderIcon from '@assets/icons/home_time_devider.svg';
import { Colors } from '@/theme/colors';
import { Fonts } from '@/utils/fonts';

export type StatusCardProps = {
    title: string;
    leftLabel: string;
    leftValue: React.ReactNode;
    rightLabel: string;
    rightValue: React.ReactNode;
};

export function StatusCard({
    title,
    leftLabel,
    leftValue,
    rightLabel,
    rightValue,
}: StatusCardProps) {
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <ClockIcon width={14} height={16} />
                <Text style={styles.headerText}>{title}</Text>
            </View>

            <View style={styles.body}>
                <View style={styles.column}>
                    <Text style={styles.label}>{leftLabel}</Text>
                    {typeof leftValue === 'string' || typeof leftValue === 'number' ? (
                        <Text style={styles.value}>{String(leftValue)}</Text>
                    ) : (
                        leftValue
                    )}
                </View>

                <HomeTimeDeviderIcon />

                <View style={styles.column}>
                    <Text style={styles.label}>{rightLabel}</Text>
                    {typeof rightValue === 'string' || typeof rightValue === 'number' ? (
                        <Text style={styles.value}>{String(rightValue)}</Text>
                    ) : (
                        rightValue
                    )}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.white,
        borderRadius: 18,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: 8,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.gray,
        paddingVertical: 10,
        gap: 8,
    },
    headerText: {
        fontSize: 14,
        color: Colors.darkBlue,
        fontFamily: Fonts.MontserratSemiBold,
        letterSpacing: 0.4,
        textTransform: 'uppercase',
    },
    body: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 12,
    },
    column: {
        flex: 1,
        alignItems: 'center',
    },
    label: {
        fontSize: 12,
        color: Colors.red,
        fontFamily: Fonts.MontserratMedium,
        textAlign: 'center',
    },
    value: {
        marginTop: 6,
        fontSize: 22,
        color: Colors.darkBlue,
        fontFamily: Fonts.MontserratBold,
        textAlign: 'center',
    },
});
