import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_TOKEN_KEY = 'auth_token';
const HAS_ONBOARDED_KEY = 'has_onboarded';
const QUESTIONNAIRE_COMPLETED_KEY = 'questionnaire_completed';
const QUESTIONNAIRE_RESTART_PENDING_KEY = 'questionnaire_restart_pending';
const PROFILE_PHOTO_URI_KEY = 'profile_photo_uri';

export const setAuthToken = async (token: string) => {
  try {
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
  } catch (e) {
    console.error('Error storing token', e);
  }
};

export const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  } catch (e) {
    console.error('Error getting token', e);
    return null;
  }
};

export const removeAuthToken = async () => {
  try {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
  } catch (e) {
    console.error('Error removing token', e);
  }
};

const setBoolean = async (key: string, value: boolean) => {
  try {
    await AsyncStorage.setItem(key, value ? '1' : '0');
  } catch (e) {
    console.error(`Error storing ${key}`, e);
  }
};

const getBoolean = async (key: string): Promise<boolean> => {
  try {
    return (await AsyncStorage.getItem(key)) === '1';
  } catch (e) {
    console.error(`Error reading ${key}`, e);
    return false;
  }
};

export const setHasOnboarded = async (value: boolean) => setBoolean(HAS_ONBOARDED_KEY, value);
export const getHasOnboarded = async () => getBoolean(HAS_ONBOARDED_KEY);

export const setQuestionnaireCompleted = async (value: boolean) =>
  setBoolean(QUESTIONNAIRE_COMPLETED_KEY, value);
export const getQuestionnaireCompleted = async () => getBoolean(QUESTIONNAIRE_COMPLETED_KEY);

export const setQuestionnaireRestartPending = async (value: boolean) =>
  setBoolean(QUESTIONNAIRE_RESTART_PENDING_KEY, value);
export const getQuestionnaireRestartPending = async () =>
  getBoolean(QUESTIONNAIRE_RESTART_PENDING_KEY);

export const setProfilePhotoUri = async (uri: string) => {
  try {
    await AsyncStorage.setItem(PROFILE_PHOTO_URI_KEY, uri);
  } catch (e) {
    console.error('Error storing profile photo', e);
  }
};

export const getProfilePhotoUri = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(PROFILE_PHOTO_URI_KEY);
  } catch (e) {
    console.error('Error reading profile photo', e);
    return null;
  }
};

export const removeProfilePhotoUri = async () => {
  try {
    await AsyncStorage.removeItem(PROFILE_PHOTO_URI_KEY);
  } catch (e) {
    console.error('Error removing profile photo', e);
  }
};
