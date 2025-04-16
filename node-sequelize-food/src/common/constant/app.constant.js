// src/common/constant/app.constant.js
import "dotenv/config";

export const DATABASE_URL = process.env.DATABASE_URL;
// Không cần các hằng số JWT nữa

if (!DATABASE_URL) {
  console.error("FATAL ERROR: DATABASE_URL environment variable is missing.");
  process.exit(1);
}

// Có thể thêm các hằng số khác nếu cần
export const NODE_ENV = process.env.NODE_ENV || "development";
export const PORT = process.env.PORT || 8080;
