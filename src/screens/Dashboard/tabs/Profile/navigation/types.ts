export type ProfileStackParamList = {
  ProfileMain: undefined;
  Tickets: undefined;
  TicketDetails: {
    ticketId: number;
  };
  CreateTicket: { ticketTypeGroupId?: number } | undefined;
  DescribeIssue:
    | {
        ticketId?: number;
        ticketTypeId?: number;
        ticketTypeGroupId?: number;
        ticketTypeName?: string;
        title?: string;
      }
    | undefined;
};
