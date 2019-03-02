"use strict";

module.exports = {
    STATUS: {
        NORMAL: 0,
        COMPLETED: 1
    },
    LOG_FOR: {
        LuuThong: 0
    },
    LIMIT_MONEY: {
        CMT_SOHK_PHOTO: 0,              // Chứng minh photo + hộ khẩu : 3tr
        CMT_REAL: 1,                    // Chứng mình gốc : 5-> 7tr5
        CMT_SOHK_REAL: 2,               // Sổ hộ khẩu gốc + cmt gốc : 7tr5--> 10tr
        CMT_SOHK_DRIVE_LICENSE_REAL: 3   // CMT gốc + hộ khẩu gốc + bằng lái xe: 15tr--> 17tr5
    },
    TYPE_CODE: {
        XUAT_MOI: "XM",
        XUAT_DAO: "XĐ"
    }
};