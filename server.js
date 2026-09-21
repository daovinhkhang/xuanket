const express = require('express');
const path = require('path');
const app = express();

// Lấy Port từ môi trường của Railway, nếu không có thì dùng port 3000
const PORT = process.env.PORT || 3000;

// Cung cấp các tệp tĩnh từ thư mục hiện tại (chứa index.html, css, js, assets)
app.use(express.static(path.join(__dirname, '/')));

// Khởi chạy máy chủ, luôn lắng nghe trên 0.0.0.0 để tương thích với Railway
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Railway web server is running on port ${PORT}`);
});
