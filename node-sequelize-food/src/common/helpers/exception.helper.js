// src/common/helpers/exception.helper.js
import { statusCodes } from "./status-code.helper.js"; // Đảm bảo có .js nếu cần

// Lớp lỗi cơ sở để kế thừa (tùy chọn nhưng tốt)
export class BaseApiException extends Error {
  constructor(message, statusCode) {
    super(message); // Gọi constructor của lớp Error cha
    this.statusCode = statusCode; // Thêm thuộc tính statusCode
    // Đảm bảo tên lỗi đúng với tên class
    this.name = this.constructor.name;
    // Ghi lại stack trace (tùy chọn, hoạt động tốt trên V8/Node)
    Error.captureStackTrace(this, this.constructor);
  }
}

// Định nghĩa các lớp Exception cụ thể kế thừa từ BaseApiException
export class BadRequestException extends BaseApiException {
  constructor(message = `Bad Request`) {
    // Đặt message mặc định rõ ràng hơn
    super(message, statusCodes.BAD_REQUEST);
  }
}

export class UnAuthorizedException extends BaseApiException {
  constructor(message = `Unauthorized`) {
    // Đặt message mặc định rõ ràng hơn
    super(message, statusCodes.UNAUTHORIZED);
  }
}

export class ForbiddenException extends BaseApiException {
  constructor(message = `Forbidden`) {
    // Đặt message mặc định rõ ràng hơn
    super(message, statusCodes.FORBIDDEN);
  }
}

// !!! THÊM CLASS BỊ THIẾU VÀO ĐÂY !!!
export class NotFoundException extends BaseApiException {
  constructor(message = `Not Found`) {
    // Đặt message mặc định rõ ràng hơn
    super(message, statusCodes.NOT_FOUND);
  }
}

// Bạn có thể thêm các lớp Exception khác ở đây nếu cần
// export class ConflictException extends BaseApiException {
//     constructor(message = `Conflict`) {
//       super(message, statusCodes.CONFLICT);
//     }
// }
