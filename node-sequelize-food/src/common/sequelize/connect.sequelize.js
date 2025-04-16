// src/common/sequelize/connect.sequelize.js
import { Sequelize } from "sequelize";
import initModels from "../../models/init-models.js"; // Sẽ được tạo/cập nhật
import { DATABASE_URL } from "../constant/app.constant.js"; // Đảm bảo có .js

if (!DATABASE_URL) {
  console.error(
    "FATAL ERROR: DATABASE_URL is not defined in environment variables."
  );
  process.exit(1);
}

const sequelize = new Sequelize(DATABASE_URL, {
  logging: process.env.NODE_ENV === "development" ? console.log : false, // Log SQL chỉ trong dev
  dialect: "mysql",
  pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
  define: {
    timestamps: false, // Mặc định không timestamps
    underscored: true, // Dùng snake_case cho các thuộc tính tự sinh (VD: khóa ngoại)
    // freezeTableName: true // Không tự động đổi tên bảng thành số nhiều
  },
  dialectOptions: {
    // Tùy chọn SSL nếu cần cho cloud DB
    // ssl: {
    //   require: true,
    //   rejectUnauthorized: false
    // }
  },
});

let models = {};
try {
  // Khởi tạo models bằng cách gọi initModels
  models = initModels(sequelize);
  console.log("Sequelize models initialized and associated successfully.");
} catch (error) {
  console.error("Failed to initialize or associate Sequelize models:", error);
  // Không nên exit ở đây, lỗi kết nối có thể xảy ra sau
}

// Định nghĩa hàm kết nối DB
const connectSequelizeDB = async () => {
  try {
    await sequelize.authenticate(); // Kiểm tra kết nối
    console.log("Sequelize connection to database established successfully.");
    // Đồng bộ model (chỉ nên dùng trong development, CẨN THẬN PRODUCTION)
    // if (process.env.NODE_ENV === 'development') {
    //    await sequelize.sync({ alter: true }); // { force: true } sẽ xóa bảng! { alter: true } cố gắng cập nhật
    //    console.log("Database synchronized");
    // }
  } catch (error) {
    console.error("Unable to connect to the Sequelize database:", error);
    process.exit(1); // Thoát nếu không kết nối được khi khởi động
  }
};

// !!! ĐẢM BẢO CÁC DÒNG EXPORT NÀY ĐÚNG VÀ KHÔNG BỊ COMMENT !!!
export { models, connectSequelizeDB }; // Export models VÀ hàm connect
export default sequelize; // Export instance sequelize làm default
