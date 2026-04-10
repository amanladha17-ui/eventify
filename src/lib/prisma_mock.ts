// Mock Prisma Client for UI Demo
const prisma = {
  event: {
    count: async () => 0,
    findMany: async () => [],
    findUnique: async () => null,
  },
  booking: {
    count: async () => 0,
    findMany: async () => [],
  },
  user: {
    count: async () => 0,
  },
  wishlist: {
    findMany: async () => [],
  }
} as any

export default prisma
