import { z } from 'zod';
import { 
  insertUserSchema, users, 
  insertRequestSchema, requests, 
  insertMissionSchema, missions, 
  insertFaqSchema, faqs, 
  insertNotificationSchema, notifications,
  insertQuestionSchema, questions
} from './schema';

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
};

export const api = {
  users: {
    list: {
      method: 'GET' as const,
      path: '/api/users' as const,
      responses: {
        200: z.array(z.custom<typeof users.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/users/:id' as const,
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/users' as const,
      input: insertUserSchema,
      responses: {
        201: z.custom<typeof users.$inferSelect>(),
        400: errorSchemas.validation,
      },
    }
  },
  requests: {
    list: {
      method: 'GET' as const,
      path: '/api/requests' as const,
      responses: {
        200: z.array(z.custom<typeof requests.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/requests' as const,
      input: insertRequestSchema,
      responses: {
        201: z.custom<typeof requests.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    updateStatus: {
      method: 'PATCH' as const,
      path: '/api/requests/:id/status' as const,
      input: z.object({ status: z.string(), reason: z.string().optional() }),
      responses: {
        200: z.custom<typeof requests.$inferSelect>(),
        404: errorSchemas.notFound,
      }
    }
  },
  missions: {
    list: {
      method: 'GET' as const,
      path: '/api/missions' as const,
      responses: {
        200: z.array(z.custom<typeof missions.$inferSelect>()),
      },
    },
    updateReport: {
      method: 'PATCH' as const,
      path: '/api/missions/:id/report' as const,
      input: z.object({ reportText: z.string() }),
      responses: {
        200: z.custom<typeof missions.$inferSelect>(),
        404: errorSchemas.notFound,
      }
    }
  },
  faqs: {
    list: {
      method: 'GET' as const,
      path: '/api/faqs' as const,
      responses: {
        200: z.array(z.custom<typeof faqs.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/faqs' as const,
      input: insertFaqSchema,
      responses: {
        201: z.custom<typeof faqs.$inferSelect>(),
        400: errorSchemas.validation,
      }
    }
  },
  notifications: {
    list: {
      method: 'GET' as const,
      path: '/api/notifications' as const,
      responses: {
        200: z.array(z.custom<typeof notifications.$inferSelect>()),
      },
    },
    markRead: {
      method: 'PATCH' as const,
      path: '/api/notifications/:id/read' as const,
      responses: {
        200: z.custom<typeof notifications.$inferSelect>(),
        404: errorSchemas.notFound,
      }
    }
  },
  questions: {
    list: {
      method: 'GET' as const,
      path: '/api/questions' as const,
      responses: {
        200: z.array(z.custom<typeof questions.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/questions' as const,
      input: insertQuestionSchema,
      responses: {
        201: z.custom<typeof questions.$inferSelect>(),
        400: errorSchemas.validation,
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
