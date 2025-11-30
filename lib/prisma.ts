// // // // // // // src/lib/prisma.ts
// // // // // // import { PrismaClient } from "@prisma/client";

// // // // // // // جلوگیری از چند instance هنگام development (Hot Reload)
// // // // // // const globalForPrisma = global as unknown as { prisma: PrismaClient };

// // // // // // export const prisma =
// // // // // //   globalForPrisma.prisma ||
// // // // // //   new PrismaClient({ log: ["query", "info", "warn", "error"] });

// // // // // // if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// // // // // // src/lib/prisma.ts
// // // // // // import pkg from "@prisma/client";
// // // // // // const { PrismaClient } = pkg;

// // // // // // // جلوگیری از چند instance هنگام development (Hot Reload)
// // // // // // declare global {
// // // // // //   // globalForPrisma را به نوع PrismaClient یا undefined مشخص می‌کنیم
// // // // // //   var prisma: PrismaClient | undefined;
// // // // // // }

// // // // // // export const prisma = global.prisma || new PrismaClient({ log: ["query", "info", "warn", "error"] });

// // // // // // if (process.env.NODE_ENV !== "production") global.prisma = prisma;

// // // // // // src/lib/prisma.ts
// // // // // // import pkg from "@prisma/client";
// // // // // // const { PrismaClient } = pkg;

// // // // // // // نوع PrismaClient
// // // // // // type PrismaClientType = typeof PrismaClient extends new (...args: any) => infer R ? R : never;

// // // // // // // جلوگیری از چند instance هنگام development (Hot Reload)
// // // // // // declare global {
// // // // // //   var prisma: PrismaClientType | undefined;
// // // // // // }

// // // // // // export const prisma = global.prisma || new PrismaClient({ log: ["query", "info", "warn", "error"] });

// // // // // // if (process.env.NODE_ENV !== "production") global.prisma = prisma;

// // // // // // src/lib/prisma.ts
// // // // // // import pkg from "@prisma/client";
// // // // // // const { PrismaClient } = pkg;

// // // // // // // نوع instance واقعی PrismaClient
// // // // // // type PrismaClientType = InstanceType<typeof PrismaClient>;

// // // // // // // جلوگیری از چند instance هنگام development (Hot Reload)
// // // // // // declare global {
// // // // // //   // @ts-ignore
// // // // // //   var prisma: PrismaClientType | undefined;
// // // // // // }

// // // // // // export const prisma = global.prisma || new PrismaClient({ log: ["query", "info", "warn", "error"] });

// // // // // // if (process.env.NODE_ENV !== "production") global.prisma = prisma;

// // // // // // src/lib/prisma.ts
// // // // // import pkg from "@prisma/client";
// // // // // const { PrismaClient } = pkg;

// // // // // // نوع instance واقعی PrismaClient
// // // // // type PrismaClientType = InstanceType<typeof PrismaClient>;

// // // // // // جلوگیری از چند instance هنگام development (Hot Reload)
// // // // // declare global {
// // // // //   // @ts-expect-error
// // // // //   var prisma: PrismaClientType | undefined;
// // // // // }

// // // // // export const prisma = global.prisma || new PrismaClient({ log: ["query", "info", "warn", "error"] });

// // // // // if (process.env.NODE_ENV !== "production") global.prisma = prisma;

// // // // // src/lib/prisma.ts
// // // // import pkg from "@prisma/client";
// // // // const { PrismaClient } = pkg;

// // // // // نوع instance واقعی PrismaClient
// // // // type PrismaClientType = InstanceType<typeof PrismaClient>;

// // // // // جلوگیری از چند instance هنگام development (Hot Reload)
// // // // declare global {
// // // //   // @ts-expect-error Global Prisma instance type mismatch
// // // //   var prisma: PrismaClientType | undefined;
// // // // }

// // // // export const prisma = global.prisma || new PrismaClient({ log: ["query", "info", "warn", "error"] });

// // // // if (process.env.NODE_ENV !== "production") global.prisma = prisma;

// // // // src/lib/prisma.ts
// // // import pkg from "@prisma/client";
// // // const { PrismaClient } = pkg;

// // // // نوع instance واقعی PrismaClient
// // // type PrismaClientType = InstanceType<typeof PrismaClient>;

// // // // جلوگیری از چند instance هنگام development (Hot Reload)
// // // declare global {
// // //   var prisma: PrismaClientType | undefined;
// // // }

// // // export const prisma = global.prisma || new PrismaClient({ log: ["query", "info", "warn", "error"] });

// // // if (process.env.NODE_ENV !== "production") global.prisma = prisma;

// // // src/lib/prisma.ts
// // import PrismaClient from "@prisma/client";

// // // Type of the Prisma client instance
// // type PrismaClientType = InstanceType<typeof PrismaClient>;

// // // Prevent multiple instances during development (Hot Reload)
// // declare global {
// //   var prisma: PrismaClientType | undefined;
// // }

// // export const prisma = global.prisma || new PrismaClient({ log: ["query", "info", "warn", "error"] });

// // if (process.env.NODE_ENV !== "production") global.prisma = prisma;

// // src/lib/prisma.ts
// import { PrismaClient as PrismaClientClass } from "@prisma/client";

// // Prevent multiple instances during development (Hot Reload)
// declare global {
//   // eslint-disable-next-line no-var
//   var prisma: PrismaClientClass | undefined;
// }

// export const prisma =
//   global.prisma ||
//   new PrismaClientClass({ log: ["query", "info", "warn", "error"] });

// if (process.env.NODE_ENV !== "production") global.prisma = prisma;

// src/lib/prisma.ts
// @ts-expect-error TypeScript can't detect PrismaClient in this setup
import pkg from "@prisma/client";
const PrismaClient = pkg.PrismaClient;

// Prevent multiple instances during development (Hot Reload)
declare global {
  // eslint-disable-next-line no-var
  var prisma: typeof PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({ log: ["query", "info", "warn", "error"] });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
