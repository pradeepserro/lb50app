export const API_URL = "https://lb50.com/api";
export const MEDIA_BASE_URL = API_URL.replace(/\/api\/?$/, '');

export function resolveMediaUrl(url: string): string {
    if (!url || /^https?:\/\//i.test(url)) {
        return url;
    }

    const path = url.startsWith('/') ? url : `/${url}`;
    return `${MEDIA_BASE_URL}${path}`;
}

export const API_ENDPOINTS = {
    LOGIN: '/auth/login',
    LOGIN_VERIFY: '/auth/login-verify',
    REGISTER: '/auth/register',
    QUESTIONS: '/questions',
    HOME: '/home',
    FAST: '/fast',
    EAT: '/eat',
    LEARN: '/learn',
    LEARNSTATUS: '/learnstatus',
    QUIZ: '/quiz',
    RELAX: '/relax',
    PROFILE: '/profile',
    LOG_HISTORY: '/loghistory',
    LOG_6_PILLARS: '/log6pillars',
    LOG_OTHERS: '/logothers',
    ANALYZE: '/analyze',
};

export const QUESTIONNAIRE_FROM_LOCALE = 2;

/** Sent when exiting via Safety First Notice so the survey restarts on next open. */
export const QUESTIONNAIRE_RESET_SURVEY = 1;

export const QUESTIONNAIRE_PREVIOUS_NEXT = {
    NONE: 0,
    PREVIOUS: -1,
    NEXT: 1,
    FINISH: 2,
} as const;