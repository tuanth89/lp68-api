"use strict";

module.exports = {
    /**
     * Trạng thái hợp đồng
     * 0 : mới tạo
     * 1 : đáo -> chốt và đóng hợp đồng cũ + mở hợp đồng mới.
     * 2 : Lãi đứng
     * 3 : thu về -> hẹn ngày cụ thể đóng nốt số còn lại
     * 4 : chốt -> hẹn ngày cụ thể đóng nốt số còn lại
     * 5 : bễ -> hẹn ngày cụ thể đóng nốt số còn lại
     * 6 : kết thúc chờ kế toán duyệt
     * 7 : Kế toán đã kết thúc hợp đồng.
     */
    NEW: 0,
    MATURITY: 1,
    STAND: 2,
    COLLECT: 3,
    CLOSE_DEAL: 4,
    ESCAPE: 5,
    END: 6,
    ACCOUNTANT_END: 7
};