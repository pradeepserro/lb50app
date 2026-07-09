import type { HomeResponse } from '@/api/home/home';

export type UploadFile = {
    uri: string;
    name: string;
    type: string;
};

export interface SaveEatParams {
    start_datetime: string;
    meal_type: number;
    addon_type: number;
    carb_level: number;
    photo?: UploadFile;
}
export type EatResponse = HomeResponse;
