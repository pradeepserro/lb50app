import type { HomeResponse } from '@/api/home/home';

export type UploadFile = {
    uri: string;
    name: string;
    type: string;
};

export interface SaveEatParams {
    id: string | number | null;
    start_datetime: string;
    current_datetime: string;
    meal_type: number;
    addon_type: string;
    carb_level: number;
    meal_feedback: 0 | 1;
    photo?: UploadFile;
}
export type EatResponse = HomeResponse;
