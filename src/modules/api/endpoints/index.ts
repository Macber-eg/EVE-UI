export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh'
  },
  COMPANY: {
    BASE: '/companies',
    DETAIL: (id: string) => `/companies/${id}`,
    EVES: (id: string) => `/companies/${id}/eves`,
    ANALYTICS: (id: string) => `/companies/${id}/analytics`
  },
  EVE: {
    BASE: '/eves',
    DETAIL: (id: string) => `/eves/${id}`,
    MESSAGES: (id: string) => `/eves/${id}/messages`,
    TASKS: (id: string) => `/eves/${id}/tasks`
  },
  TASKS: {
    BASE: '/tasks',
    DETAIL: (id: string) => `/tasks/${id}`,
    QUEUE: '/tasks/queue'
  }
} as const;