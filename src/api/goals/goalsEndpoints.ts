import client from '@/api/client';

export type UserGoal = { id: number; goal: string };
export type GoalInput = { id: number | null; goal: string };
export type GoalsResponse = { goals: UserGoal[] };
export type CompletedGoalResponse = { id: number; goal: string; status_id: number };

// The existing API client handles authentication and uses the same base URL as Learn.
export const fetchGoalsApi = async (): Promise<GoalsResponse> => {
  const response = await client.get<GoalsResponse>('/goals');
  return response.data;
};

export const saveGoalsApi = async (goals: GoalInput[]): Promise<GoalsResponse> => {
  const response = await client.post<GoalsResponse>('/goals', { goals });
  return response.data;
};

export const completeGoalApi = async (id: number): Promise<CompletedGoalResponse> => {
  const response = await client.post<CompletedGoalResponse>('/goals/complete', { id });
  return response.data;
};
