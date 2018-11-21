const uuid = require("uuid");
const path = require("path");
const config = require("../../config");
const {
    log
} = require("../../logger");

/**
 * Convert seconds to "hh:mm:ss"
 * @param seconds
 * @returns {string}
 */
function elapsed(seconds) {
    let result = "";

    let hour = Math.floor(seconds / 3600);
    if (hour > 0 && hour < 10) {
        result = result.concat("0", hour.toString(), ":");
    } else if (hour > 10) {
        result = result.concat(hour.toString(), ":");
    } else {
        result = result.concat("00", ":");
    }

    let minute = Math.floor((seconds - hour * 3600) / 60);

    if (minute > 10) {
        result = result.concat(minute.toString(), ":");
    } else if (minute > 0 && minute < 10) {
        result = result.concat("0", minute.toString(), ":");
    } else {
        result = result.concat("00", ":");
    }

    let second = seconds - 3600 * hour - 60 * minute;
    if (second >= 10) {
        result = result.concat(second.toString());
    } else {
        result = result.concat("0", second.toString());
    }

    return result;
}


module.exports = {
    elapsed
};