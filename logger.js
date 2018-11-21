const bunyan = require('bunyan');
let obj = {};

if( !obj.log ) {
    obj.log = bunyan.createLogger({
        name: 'elearning-api',
        streams: [
            {
                level: 'info',
                stream: process.stdout
            },
            {
                level: 'error',
                type: 'rotating-file',
                path: 'logs/error.log',
                period: '1d',
                count: 30
            }
        ]
    });
}

module.exports = obj;
