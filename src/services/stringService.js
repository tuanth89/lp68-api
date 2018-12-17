"use strict";
const ObjectId = require('mongoose').Types.ObjectId;

/**
 * convert vietnamese to english, case-sensitive
 * @param str
 * @returns {XML|string|*}
 */
function convertViToEn(str) {
    str = str.toLowerCase();
    str = str.replace("\u0065\u0309", "\u1EBB"); //ẻ
    str = str.replace("\u0065\u0301", "\u00E9"); //é
    str = str.replace("\u0065\u0300", "\u00E8"); //è
    str = str.replace("\u0065\u0323", "\u1EB9"); //ẹ
    str = str.replace("\u0065\u0303", "\u1EBD"); //ẽ
    str = str.replace("\u00EA\u0309", "\u1EC3"); //ể
    str = str.replace("\u00EA\u0301", "\u1EBF"); //ế
    str = str.replace("\u00EA\u0300", "\u1EC1"); //ề
    str = str.replace("\u00EA\u0323", "\u1EC7"); //ệ
    str = str.replace("\u00EA\u0303", "\u1EC5"); //ễ
    str = str.replace("\u0079\u0309", "\u1EF7"); //ỷ
    str = str.replace("\u0079\u0301", "\u00FD"); //ý
    str = str.replace("\u0079\u0300", "\u1EF3"); //ỳ
    str = str.replace("\u0079\u0323", "\u1EF5"); //ỵ
    str = str.replace("\u0079\u0303", "\u1EF9"); //ỹ
    str = str.replace("\u0075\u0309", "\u1EE7"); //ủ
    str = str.replace("\u0075\u0301", "\u00FA"); //ú
    str = str.replace("\u0075\u0300", "\u00F9"); //ù
    str = str.replace("\u0075\u0323", "\u1EE5"); //ụ
    str = str.replace("\u0075\u0303", "\u0169"); //ũ
    str = str.replace("\u01B0\u0309", "\u1EED"); //ử
    str = str.replace("\u01B0\u0301", "\u1EE9"); //ứ
    str = str.replace("\u01B0\u0300", "\u1EEB"); //ừ
    str = str.replace("\u01B0\u0323", "\u1EF1"); //ự
    str = str.replace("\u01B0\u0303", "\u1EEF"); //ữ
    str = str.replace("\u0069\u0309", "\u1EC9"); //ỉ
    str = str.replace("\u0069\u0301", "\u00ED"); //í
    str = str.replace("\u0069\u0300", "\u00EC"); //ì
    str = str.replace("\u0069\u0323", "\u1ECB"); //ị
    str = str.replace("\u0069\u0303", "\u0129"); //ĩ
    str = str.replace("\u006F\u0309", "\u1ECF"); //ỏ
    str = str.replace("\u006F\u0301", "\u00F3"); //ó
    str = str.replace("\u006F\u0300", "\u00F2"); //ò
    str = str.replace("\u006F\u0323", "\u1ECD"); //ọ
    str = str.replace("\u006F\u0303", "\u00F5"); //õ
    str = str.replace("\u01A1\u0309", "\u1EDF"); //ở
    str = str.replace("\u01A1\u0301", "\u1EDB"); //ớ
    str = str.replace("\u01A1\u0300", "\u1EDD"); //ờ
    str = str.replace("\u01A1\u0323", "\u1EE3"); //ợ
    str = str.replace("\u01A1\u0303", "\u1EE1"); //ỡ
    str = str.replace("\u00F4\u0309", "\u1ED5"); //ổ
    str = str.replace("\u00F4\u0301", "\u1ED1"); //ố
    str = str.replace("\u00F4\u0300", "\u1ED3"); //ồ
    str = str.replace("\u00F4\u0323", "\u1ED9"); //ộ
    str = str.replace("\u00F4\u0303", "\u1ED7"); //ỗ
    str = str.replace("\u0061\u0309", "\u1EA3"); //ả
    str = str.replace("\u0061\u0301", "\u00E1"); //á
    str = str.replace("\u0061\u0300", "\u00E0"); //à
    str = str.replace("\u0061\u0323", "\u1EA1"); //ạ
    str = str.replace("\u0061\u0303", "\u00E3"); //ã
    str = str.replace("\u0103\u0309", "\u1EB3"); //ẳ
    str = str.replace("\u0103\u0301", "\u1EAF"); //ắ
    str = str.replace("\u0103\u0300", "\u1EB1"); //ằ
    str = str.replace("\u0103\u0323", "\u1EB7"); //ặ
    str = str.replace("\u0103\u0303", "\u1EB5"); //ẵ
    str = str.replace("\u00E2\u0309", "\u1EA9"); //ẩ
    str = str.replace("\u00E2\u0301", "\u1EA5"); //ấ
    str = str.replace("\u00E2\u0300", "\u1EA7"); //ầ
    str = str.replace("\u00E2\u0323", "\u1EAD"); //ậ
    str = str.replace("\u00E2\u0303", "\u1EAB"); //ẫ

    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
    str = str.replace(/ + /g, " ");
    str = str.trim();

    return str;
}

/**
 * return friendly url
 * @param str
 * @returns {string}
 */
function getUrlFriendlyString(str) {
    str = convertViToEn(str);
    str = str
        .replace(/^\s+|\s+$/g, "") // trim leading and trailing spaces
        .replace(/[_|\s]+/g, "-") // change all spaces and underscores to a hyphen
        .replace(/[^a-zA-z\u0400-\u04FF0-9-]+/g, "") // remove almoust all characters except hyphen
        .replace(/[-]+/g, "-") // replace multiple hyphens
        .replace(/^-+|-+$/g, ""); // trim leading and trailing hyphen

    return str.toLowerCase();
}

/**
 * Xóa bỏ dấu, giữ nguyên các ký tự đặc biệt : !@#$%^&*(),.?":{}|<>
 * @param {} str 
 */
function removeSignInString(str) {
    str = str.toLowerCase();
    str = str.replace("\u0065\u0309", "\u1EBB"); //ẻ
    str = str.replace("\u0065\u0301", "\u00E9"); //é
    str = str.replace("\u0065\u0300", "\u00E8"); //è
    str = str.replace("\u0065\u0323", "\u1EB9"); //ẹ
    str = str.replace("\u0065\u0303", "\u1EBD"); //ẽ
    str = str.replace("\u00EA\u0309", "\u1EC3"); //ể
    str = str.replace("\u00EA\u0301", "\u1EBF"); //ế
    str = str.replace("\u00EA\u0300", "\u1EC1"); //ề
    str = str.replace("\u00EA\u0323", "\u1EC7"); //ệ
    str = str.replace("\u00EA\u0303", "\u1EC5"); //ễ
    str = str.replace("\u0079\u0309", "\u1EF7"); //ỷ
    str = str.replace("\u0079\u0301", "\u00FD"); //ý
    str = str.replace("\u0079\u0300", "\u1EF3"); //ỳ
    str = str.replace("\u0079\u0323", "\u1EF5"); //ỵ
    str = str.replace("\u0079\u0303", "\u1EF9"); //ỹ
    str = str.replace("\u0075\u0309", "\u1EE7"); //ủ
    str = str.replace("\u0075\u0301", "\u00FA"); //ú
    str = str.replace("\u0075\u0300", "\u00F9"); //ù
    str = str.replace("\u0075\u0323", "\u1EE5"); //ụ
    str = str.replace("\u0075\u0303", "\u0169"); //ũ
    str = str.replace("\u01B0\u0309", "\u1EED"); //ử
    str = str.replace("\u01B0\u0301", "\u1EE9"); //ứ
    str = str.replace("\u01B0\u0300", "\u1EEB"); //ừ
    str = str.replace("\u01B0\u0323", "\u1EF1"); //ự
    str = str.replace("\u01B0\u0303", "\u1EEF"); //ữ
    str = str.replace("\u0069\u0309", "\u1EC9"); //ỉ
    str = str.replace("\u0069\u0301", "\u00ED"); //í
    str = str.replace("\u0069\u0300", "\u00EC"); //ì
    str = str.replace("\u0069\u0323", "\u1ECB"); //ị
    str = str.replace("\u0069\u0303", "\u0129"); //ĩ
    str = str.replace("\u006F\u0309", "\u1ECF"); //ỏ
    str = str.replace("\u006F\u0301", "\u00F3"); //ó
    str = str.replace("\u006F\u0300", "\u00F2"); //ò
    str = str.replace("\u006F\u0323", "\u1ECD"); //ọ
    str = str.replace("\u006F\u0303", "\u00F5"); //õ
    str = str.replace("\u01A1\u0309", "\u1EDF"); //ở
    str = str.replace("\u01A1\u0301", "\u1EDB"); //ớ
    str = str.replace("\u01A1\u0300", "\u1EDD"); //ờ
    str = str.replace("\u01A1\u0323", "\u1EE3"); //ợ
    str = str.replace("\u01A1\u0303", "\u1EE1"); //ỡ
    str = str.replace("\u00F4\u0309", "\u1ED5"); //ổ
    str = str.replace("\u00F4\u0301", "\u1ED1"); //ố
    str = str.replace("\u00F4\u0300", "\u1ED3"); //ồ
    str = str.replace("\u00F4\u0323", "\u1ED9"); //ộ
    str = str.replace("\u00F4\u0303", "\u1ED7"); //ỗ
    str = str.replace("\u0061\u0309", "\u1EA3"); //ả
    str = str.replace("\u0061\u0301", "\u00E1"); //á
    str = str.replace("\u0061\u0300", "\u00E0"); //à
    str = str.replace("\u0061\u0323", "\u1EA1"); //ạ
    str = str.replace("\u0061\u0303", "\u00E3"); //ã
    str = str.replace("\u0103\u0309", "\u1EB3"); //ẳ
    str = str.replace("\u0103\u0301", "\u1EAF"); //ắ
    str = str.replace("\u0103\u0300", "\u1EB1"); //ằ
    str = str.replace("\u0103\u0323", "\u1EB7"); //ặ
    str = str.replace("\u0103\u0303", "\u1EB5"); //ẵ
    str = str.replace("\u00E2\u0309", "\u1EA9"); //ẩ
    str = str.replace("\u00E2\u0301", "\u1EA5"); //ấ
    str = str.replace("\u00E2\u0300", "\u1EA7"); //ầ
    str = str.replace("\u00E2\u0323", "\u1EAD"); //ậ
    str = str.replace("\u00E2\u0303", "\u1EAB"); //ẫ

    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    // str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
    str = str.replace(/ + /g, " ");
    str = str.trim();
    return str;
}

/**
 * Lấy về chuỗi tìm kiếm regex, áp dụng cho cả các ký tự đặc biệt
 */
function getRegexSearchString(str) {
    str = removeSignInString(str);
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

/**
 *
 * @param total
 * @returns {string}
 */
function generateCertificateCodeNumber(total) {
    let number = total + 1;
    if (number < 10) {
        number = `00${number}`
    } else if (number < 100) {
        number = `0${number}`
    }

    let today = new Date();
    let day = today.getUTCDate();
    day = day > 9 ? day.toString() : `0${day}`;

    let month = today.getUTCMonth() + 1;
    month = month > 9 ? month.toString() : `0${month}`;

    let year = today.getUTCFullYear().toString();

    return `MD${day}${month}${year}${number}`
}

function stripHtmlTag(str) {
    if (typeof str === 'string' || str instanceof String) {
        str = str.replace(/\(/g, '&#40;');
        str = str.replace(/\)/g, '&#41;');
        str = str.replace(/</g, '&lt;');
        str = str.replace(/>/g, '&gt;');
        str = str.replace(/{/g, '&#123;');
        str = str.replace(/}/g, '&#125;');
        str = str.replace(/"/g, '&quot;');
        // str = str.replace(/&/g, '&amp;');
        str = str.replace(/\[/g, '&#91;');
        str = str.replace(/]/g, '&#93;');
        return str;
    }

    if (Array.isArray(str)) {
        return str.map(item => {
            return stripHtmlTag(item);
        })
    }

    return '';
}

/**
 *
 * @param request
 * @returns {*}
 */
function getClientIpV4(request) {
    let ipParts = request.connection.remoteAddress.split(':');
    return ipParts[ipParts.length - 1];
}

function randomString() {
    return Math.random().toString(36).slice(-6);
}


function isObjectId(value) {
    try {
        const asString = value.toString();
        const asObjectId = new ObjectId(asString);
        const asStringifiedObjectId = asObjectId.toString();
        return asString === asStringifiedObjectId;
    } catch (error) {
        return false;
    }
}

function formatNumeric(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports = {
    getUrlFriendlyString: getUrlFriendlyString,
    generateCertificateCodeNumber: generateCertificateCodeNumber,
    stripHtmlTag: stripHtmlTag,
    convertViToEn: convertViToEn,
    getClientIpV4: getClientIpV4,
    randomString: randomString,
    removeSignInString,
    getRegexSearchString,
    isObjectId: isObjectId,
    formatNumeric: formatNumeric
};