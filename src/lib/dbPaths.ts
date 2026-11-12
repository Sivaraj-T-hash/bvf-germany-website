export const DB_PATHS = {
  leads: 'leads',
  bookings: 'bookings',
  webinars: 'webinars',
  webinarRegistrations: 'webinarRegistrations',
  orders: 'orders',
  blogs: 'blogPosts',
  resourcePackages: 'resourcePackages',
  studentDeadlines: 'studentDeadlines',
  notifications: 'notifications',
  auditLogs: 'auditLogs',
} as const;

export type DbPath = (typeof DB_PATHS)[keyof typeof DB_PATHS];
