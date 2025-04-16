// src/common/helpers/error.helper.js
import { responseError } from "./reponse.helper.js";
import {
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  UnAuthorizedException, // Vẫn giữ lại phòng khi cần phân quyền đơn giản sau này
} from "./exception.helper.js";
// Không import lỗi JWT nữa

export const handleError = (err, req, res, next) => {
  const requestInfo = `ERROR [${req.method} ${req.originalUrl}]`;
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Log the basic error info
  console.error(`${requestInfo} ${statusCode}: ${message}`);

  // Log stack trace only in development for debugging
  if (process.env.NODE_ENV === "development" && err.stack) {
    console.error(err.stack);
  }

  // Handle Specific Custom Application Errors
  if (
    err instanceof BadRequestException ||
    err instanceof NotFoundException ||
    err instanceof ForbiddenException ||
    err instanceof UnAuthorizedException
    // Thêm các lỗi khác nếu cần
  ) {
    statusCode = err.statusCode;
    message = err.message;
  }
  // Không cần xử lý lỗi JWT nữa

  // Handle Sequelize Validation Errors (Example)
  else if (err.name === "SequelizeValidationError") {
    statusCode = 400; // Bad Request
    message = err.errors.map((e) => e.message).join(", "); // Combine validation messages
  }
  // Handle Sequelize Unique Constraint Errors (Example)
  else if (err.name === "SequelizeUniqueConstraintError") {
    statusCode = 409; // Conflict
    // Cung cấp thông tin cụ thể hơn nếu có thể và an toàn
    message = `Conflict: ${err.errors
      .map((e) => `${e.path} '${e.value}' already exists`)
      .join(", ")}`;
    // Hoặc một thông báo chung chung hơn cho production
    // message = (process.env.NODE_ENV === 'production') ? 'Resource already exists.' : `Conflict: ${err.errors.map(e => `${e.path} '${e.value}'`).join(', ')}`;
  }
  // Fallback for other errors (keeps original status if available, else 500)
  else {
    // Keep the original status code if it's a known HTTP error, otherwise default to 500
    statusCode = typeof err.statusCode === "number" ? err.statusCode : 500;
    // Avoid exposing sensitive internal error messages in production
    message =
      statusCode === 500 && process.env.NODE_ENV !== "development"
        ? "Internal Server Error"
        : err.message;
  }

  // Không gửi stack trace cho client
  const errorResponse = responseError(message, statusCode, null); // Pass null for stack
  res.status(statusCode).json(errorResponse);
};
