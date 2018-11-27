"use strict";

module.exports = {
    /**
     * Trạng thái hợp đồng
     * 0 : mới tạo
     * 1 : đáo -> chốt và đóng hợp đồng cũ + mở hợp đồng mới.
     * 2 : chốt -> hẹn ngày cụ thể đóng nốt số còn lại
     * 3 : kết thúc
     */
    NEW: 0,
    MATURITY: 1,
    CLOSE_DEAL: 2,
    END: 3
};