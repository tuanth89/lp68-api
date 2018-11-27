"use strict";

module.exports = {
    list: '_id fullName username roles gender photo enabled email createdAt phone',
    summary: '_id fullName username roles gender photo email phone enabled',
    profile: 'phone addressname username photo email',
    detail: `_id fullName username roles photo address email enabled dob gender phone salt`,
    findByUsername: `_id fullName username roles photo address email enabled dob gender phone`,
    register: '_id fullName username email enabled roles'
};