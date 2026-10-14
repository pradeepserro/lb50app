export const TICKET_STATUS_IDS = {
  ALL: 0,
  IN_PROGRESS: 1,
  CLOSED: 2,
} as const;

export type TicketStatusId =
  (typeof TICKET_STATUS_IDS)[keyof typeof TICKET_STATUS_IDS];

export interface TicketListItem {
  id: number;
  title: string;
  status_id: TicketStatusId;
  created_at: string;
}

export interface TicketListResponse {
  status_id: TicketStatusId;
  tickets: TicketListItem[];
}

export interface TicketType {
  id: number;
  name: string;
  description: string;
}

export interface TicketTypesResponse {
  ticket_types: TicketType[];
}

export interface TicketAttachmentFile {
  uri: string;
  name: string;
  type: string;
  size: number;
}

export interface SaveTicketParams {
  ticket_id: number;
  title?: string;
  comments: string;
  type_id?: number;
  attachments: TicketAttachmentFile[];
}

export interface TicketSaveResponse {
  status_id?: TicketStatusId;
  tickets: TicketListItem[];
  message?: string;
}

export interface TicketDetailAttachment {
  id: number;
  attachment_url: string;
}

export interface TicketDetail {
  id: number;
  comments: string;
  user_id: number;
  created_at: string;
  attachments: TicketDetailAttachment[];
}

export interface TicketDetails {
  id: number;
  type_id: number;
  title: string;
  status_id: TicketStatusId;
  created_at: string;
  details: TicketDetail[];
}

export interface TicketDetailsResponse {
  ticket: TicketDetails;
}
