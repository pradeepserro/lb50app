import React, { useCallback } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import CheckWhiteIcon from '@assets/icons/check_white.svg';
import { PrimaryButton } from '@/components/PrimaryButton';
import { DashboardScreenLayout } from '@/components/screenLayout/DashboardScreenLayout';
import { ScreenHeaderBackButton } from '@/components/screenLayout/ScreenHeaderBackButton';
import { useDashboardTabBarInset } from '@/components/screenLayout/dashboardLayout';
import { screenHeaderStyles } from '@/components/screenLayout/screenHeader.styles';
import { styles as profileStyles } from '@/screens/Dashboard/tabs/Profile/ProfileTab.styles';
import { styles } from '@/screens/Dashboard/tabs/Profile/screens/ReviewRequest/ReviewRequest.style';
import { Colors } from '@/theme/colors';

type Props = {
  navigation: any;
};

function NotificationIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z"
        stroke={Colors.darkBlue}
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10 21h4"
        stroke={Colors.darkBlue}
        strokeWidth={1.7}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function CopyIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Rect
        x={8}
        y={8}
        width={11}
        height={11}
        rx={2}
        stroke={Colors.darkBlue}
        strokeWidth={1.8}
      />
      <Path
        d="M16 8V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h1"
        stroke={Colors.darkBlue}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function ReviewRequest({ navigation }: Props) {
  const tabBarInset = useDashboardTabBarInset();

  const goToMyTickets = useCallback(() => {
    navigation.navigate('MyTickets');
  }, [navigation]);

  return (
    <DashboardScreenLayout
      header={
        <View style={[screenHeaderStyles.bar, screenHeaderStyles.header]}>
          <View style={screenHeaderStyles.headerSide}>
            <ScreenHeaderBackButton onPress={goToMyTickets} />
          </View>

          <View style={screenHeaderStyles.headerCenter}>
            <Text style={screenHeaderStyles.headerTitle}>
              Review Your Request
            </Text>
          </View>

          <View style={[screenHeaderStyles.headerSide, styles.headerSideRight]}>
            <View style={styles.notificationIcon}>
              <NotificationIcon />
            </View>
          </View>
        </View>
      }
    >
      <View style={[styles.rootContent, { paddingBottom: tabBarInset }]}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.cardWrap}>
            <View style={styles.successRing}>
              <View style={styles.successCircle}>
                <CheckWhiteIcon width={28} height={28} />
              </View>
            </View>

            <View style={[profileStyles.card, styles.reviewCard]}>
              <Text style={styles.title}>Request Submitted!</Text>
              <Text style={styles.subtitle}>
                We&apos;ve received your request and our support team will get
                back to you soon.
              </Text>

              <View style={styles.ticketBox}>
                <View style={styles.ticketTextWrap}>
                  <Text style={styles.ticketLabel}>Ticket ID</Text>
                  <Text style={styles.ticketValue}>LB50-TECH-2024-0567</Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Copy ticket ID"
                  onPress={undefined}
                  hitSlop={8}
                  style={styles.copyIcon}
                >
                  <CopyIcon />
                </Pressable>
              </View>

              <View style={styles.nextSection}>
                <Text style={styles.sectionTitle}>What happens next?</Text>

                <View style={styles.bulletRow}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>
                    We will review your issue.
                  </Text>
                </View>
                <View style={styles.bulletRow}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>
                    Our team will contact you within 24 hours.
                  </Text>
                </View>
                <View style={styles.bulletRow}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>
                    You can track your request in My Tickets.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={[profileStyles.saveWrap, styles.buttonWrap]}>
          <PrimaryButton
            title="Go To My Tickets"
            onPress={goToMyTickets}
            style={profileStyles.saveBtn}
            titleStyle={profileStyles.saveTitle}
          />
        </View>
      </View>
    </DashboardScreenLayout>
  );
}
