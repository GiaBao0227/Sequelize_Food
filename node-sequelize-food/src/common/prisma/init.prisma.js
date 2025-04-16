// src/common/prisma/init.prisma.js
import { PrismaClient } from "@prisma/client";
// import logger from "../winston/init.winston"; // Import logger

// Khởi tạo Prisma Client
// Thêm cấu hình log nếu cần thiết cho việc debug
const prisma = new PrismaClient({
  log: [
    { emit: "event", level: "query" }, // Ghi log query
    { emit: "stdout", level: "info" },
    { emit: "stdout", level: "warn" },
    { emit: "stdout", level: "error" },
  ],
  // errorFormat: 'pretty' // Định dạng lỗi dễ đọc hơn (tùy chọn)
});

// Bắt sự kiện query để log qua Winston (tùy chọn)
prisma.$on("query", (e) => {
  logger.debug(`Prisma Query: ${e.query}`, {
    params: e.params,
    duration: e.duration,
    tag: "PRISMA_QUERY",
  });
});

logger.info("Prisma Client Initialized.", { tag: "PRISMA" }); // Log khi khởi tạo thành công

export default prisma;
