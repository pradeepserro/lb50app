export type UploadFile = {
  uri: string;
  name: string;
  type: string;
};

export interface ProfileResponse {
  name: string;
  email: string;
  age: number;
  gender: number;
  phone: string;
  address: string | null;
  profile_photo_url: string | null;
}

export interface UpdateProfileParams {
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: number;
  address: string;
  avatar?: UploadFile;
}

export const GENDER_LABELS = ['Male', 'Female', 'Other'] as const;
export type GenderLabel = (typeof GENDER_LABELS)[number];

export function genderFromApiValue(value: number): GenderLabel | '' {
  switch (value) {
    case 1:
      return 'Male';
    case 2:
      return 'Female';
    case 3:
      return 'Other';
    default:
      return '';
  }
}

export function genderToApiValue(label: string): number {
  switch (label) {
    case 'Male':
      return 1;
    case 'Female':
      return 2;
    case 'Other':
      return 3;
    default:
      return 0;
  }
}
