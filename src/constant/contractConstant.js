"use strict";

module.exports = {
    /**
     * Trạng thái hợp đồng
     * 0 : mới tạo
     * 1 : đáo -> chốt và đóng hợp đồng cũ + mở hợp đồng mới.
     * 2 : thu về -> hẹn ngày cụ thể đóng nốt số còn lại
     * 3 : chốt -> hẹn ngày cụ thể đóng nốt số còn lại
     * 4 : bễ -> hẹn ngày cụ thể đóng nốt số còn lại
     * 5 : kết thúc
     */
    NEW: 0,
    MATURITY: 1,
    COLLECT: 2,
    CLOSE_DEAL: 3,
    ESCAPE: 4,
    END: 5
};