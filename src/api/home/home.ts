export interface HomeResponse {
  start_datetime: string | null;
  end_datetime: string | null;
  type_id: 0 | 1 | 2 | null;
  text: string | null;
  health_insight: string | null;
}
