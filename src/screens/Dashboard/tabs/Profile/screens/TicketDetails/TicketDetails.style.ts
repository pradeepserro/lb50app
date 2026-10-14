import { StyleSheet } from 'react-native';
import { Colors } from '@/theme/colors';
import { Fonts } from '@/utils/fonts';

const STATUS_ORANGE = '#F59E0B';

export const styles = StyleSheet.create({
  rootContent: {
    flex: 1,
    minHeight: 0,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 4,
  },
  headerSideRight: {
    justifyContent: 'flex-end',
  },
  notificationIcon: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ticketCard: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  ticketNumber: {
    flex: 1,
    color: Colors.green,
    fontSize: 13,
    fontFamily: Fonts.MontserratSemiBold,
  },
  statusBadge: {
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusBadgeInProgress: {
    backgroundColor: STATUS_ORANGE,
  },
  statusBadgeClosed: {
    backgroundColor: Colors.green,
  },
  statusText: {
    fontSize: 11,
    fontFamily: Fonts.MontserratSemiBold,
  },
  statusTextInProgress: {
    color: Colors.white,
  },
  statusTextClosed: {
    color: Colors.white,
  },
  issueCard: {
    marginBottom: 12,
    padding: 14,
    borderRadius: 16,
    backgroundColor: Colors.green,
    shadowColor: Colors.black,
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  issueHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  issueLabel: {
    color: Colors.darkBlue,
    fontSize: 10,
    fontFamily: Fonts.MontserratSemiBold,
  },
  ticketTitle: {
    marginTop: 6,
    color: Colors.darkBlue,
    fontSize: 16,
    lineHeight: 22,
    fontFamily: Fonts.PoppinsSemiBold,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexShrink: 1,
    gap: 8,
  },
  ticketDate: {
    flexShrink: 1,
    color: Colors.darkBlue,
    fontSize: 10,
    fontFamily: Fonts.MontserratRegular,
    textAlign: 'right',
  },
  messageRow: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  messageCard: {
    width: '100%',
    borderRadius: 16,
    padding: 14,
    shadowColor: Colors.black,
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  userMessageCard: {
    backgroundColor: Colors.white,
  },
  supportMessageCard: {
    backgroundColor: Colors.green,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  messageAuthor: {
    flexShrink: 1,
    color: Colors.darkBlue,
    fontSize: 11,
    fontFamily: Fonts.MontserratBold,
  },
  supportMessageAuthor: {
    color: Colors.darkBlue,
  },
  messageDate: {
    alignSelf: 'flex-end',
    marginTop: 10,
    color: Colors.titleTextColorGray,
    fontSize: 10,
    fontFamily: Fonts.MontserratRegular,
  },
  supportMessageDate: {
    color: Colors.darkBlue,
  },
  messageText: {
    marginTop: 9,
    color: Colors.darkBlue,
    fontSize: 13,
    lineHeight: 19,
    fontFamily: Fonts.MontserratRegular,
  },
  supportMessageText: {
    color: Colors.darkBlue,
  },
  attachmentGrid: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  attachmentCell: {
    width: '31%',
    aspectRatio: 1.15,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: Colors.gray,
  },
  attachmentImage: {
    width: '100%',
    height: '100%',
  },
  attachmentVideo: {
    width: '100%',
    height: '100%',
  },
  videoPlayCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  videoPlayTriangle: {
    borderTopWidth: 7,
    borderBottomWidth: 7,
    borderLeftWidth: 11,
  },
  videoProgressTrack: {
    height: 3,
  },
  unknownAttachment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  unknownAttachmentText: {
    color: Colors.darkBlue,
    fontSize: 11,
    fontFamily: Fonts.MontserratMedium,
    textAlign: 'center',
  },
  emptyCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: Colors.titleTextColorGray,
    fontSize: 13,
    lineHeight: 19,
    fontFamily: Fonts.MontserratRegular,
    textAlign: 'center',
  },
  actionsFooter: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  previewRoot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: Colors.black,
    opacity: 0.92,
  },
  previewImageFrame: {
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewMediaPressable: {
    width: '100%',
    height: '100%',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewVideoFrame: {
    width: '100%',
    zIndex: 1,
    paddingHorizontal: 12,
  },
  previewVideo: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: Colors.black,
  },
  previewVideoProgressTrack: {
    height: 4,
  },
  previewCloseButton: {
    position: 'absolute',
    right: 12,
    zIndex: 2,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.darkBlue,
    elevation: 6,
  },
});
