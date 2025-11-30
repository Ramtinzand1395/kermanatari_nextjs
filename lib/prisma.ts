// // // // src/lib/prisma.ts
// // // import { PrismaClient } from "@prisma/client";

// // // // جلوگیری از چند instance هنگام development (Hot Reload)
// // // const globalForPrisma = global as unknown as { prisma: PrismaClient };

// // // export const prisma =
// // //   globalForPrisma.prisma ||
// // //   new PrismaClient({ log: ["query", "info", "warn", "error"] });

// // // if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// // // src/lib/prisma.ts
// // // import pkg from "@prisma/client";
// // // const { PrismaClient } = pkg;

// // // // جلوگیری از چند instance هنگام development (Hot Reload)
// // // declare global {
// // //   // globalForPrisma را به نوع PrismaClient یا undefined مشخص می‌کنیم
// // //   var prisma: PrismaClient | undefined;
// // // }

// // // export const prisma = global.prisma || new PrismaClient({ log: ["query", "info", "warn", "error"] });

// // // if (process.env.NODE_ENV !== "production") global.prisma = prisma;

// // // src/lib/prisma.ts
// // // import pkg from "@prisma/client";
// // // const { PrismaClient } = pkg;

// // // // نوع PrismaClient
// // // type PrismaClientType = typeof PrismaClient extends new (...args: any) => infer R ? R : never;

// // // // جلوگیری از چند instance هنگام development (Hot Reload)
// // // declare global {
// // //   var prisma: PrismaClientType | undefined;
// // // }

// // // export const prisma = global.prisma || new PrismaClient({ log: ["query", "info", "warn", "error"] });

// // // if (process.env.NODE_ENV !== "production") global.prisma = prisma;

// // // src/lib/prisma.ts
// // // import pkg from "@prisma/client";
// // // const { PrismaClient } = pkg;

// // // // نوع instance واقعی PrismaClient
// // // type PrismaClientType = InstanceType<typeof PrismaClient>;

// // // // جلوگیری از چند instance هنگام development (Hot Reload)
// // // declare global {
// // //   // @ts-ignore
// // //   var prisma: PrismaClientType | undefined;
// // // }

// // // export const prisma = global.prisma || new PrismaClient({ log: ["query", "info", "warn", "error"] });

// // // if (process.env.NODE_ENV !== "production") global.prisma = prisma;

// // // src/lib/prisma.ts
// // import pkg from "@prisma/client";
// // const { PrismaClient } = pkg;

// // // نوع instance واقعی PrismaClient
// // type PrismaClientType = InstanceType<typeof PrismaClient>;

// // // جلوگیری از چند instance هنگام development (Hot Reload)
// // declare global {
// //   // @ts-expect-error
// //   var prisma: PrismaClientType | undefined;
// // }

// // export const prisma = global.prisma || new PrismaClient({ log: ["query", "info", "warn", "error"] });

// // if (process.env.NODE_ENV !== "production") global.prisma = prisma;

// // src/lib/prisma.ts
// import pkg from "@prisma/client";
// const { PrismaClient } = pkg;

// // نوع instance واقعی PrismaClient
// type PrismaClientType = InstanceType<typeof PrismaClient>;

// // جلوگیری از چند instance هنگام development (Hot Reload)
// declare global {
//   // @ts-expect-error Global Prisma instance type mismatch
//   var prisma: PrismaClientType | undefined;
// }

// export const prisma = global.prisma || new PrismaClient({ log: ["query", "info", "warn", "error"] });

// if (process.env.NODE_ENV !== "production") global.prisma = prisma;

// src/lib/prisma.ts
import pkg from "@prisma/client";
const { PrismaClient } = pkg;

// نوع instance واقعی PrismaClient
type PrismaClientType = InstanceType<typeof PrismaClient>;

// جلوگیری از چند instance هنگام development (Hot Reload)
declare global {
  var prisma: PrismaClientType | undefined;
}

export const prisma = global.prisma || new PrismaClient({ log: ["query", "info", "warn", "error"] });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
