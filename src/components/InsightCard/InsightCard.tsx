import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Text, View } from 'react-native';
import CardContainerIcon from '@assets/icons/card-container.svg';
import { styles } from '@/components/InsightCard/InsightCard.styles';

type InsightCardProps = {
  singleTitle?: string;
  title?: string;
  description?: string;
  leftIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function InsightCard({ singleTitle, title, description, leftIcon, style }: InsightCardProps) {
  return (
    <View style={[styles.container, style]}>
      <CardContainerIcon width={54} height={54} style={styles.decoration} />
      {leftIcon ? <View style={styles.leftIconWrap}>{leftIcon}</View> : null}
      <View style={styles.content}>
        {singleTitle ? <Text style={styles.singleTitle}>{singleTitle}</Text> : null}
        {title ? <Text style={styles.title}>{title}</Text> : null}
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
    </View>
  );
}

