let winston = require('winston');
let config = require('../bootstrap/config-bootstrap')();
let mkdirp = require('mkdirp');

mkdirp(config.log.path,err => {
    if (err) 
        console.error(err);
});

winston.emitErrs = true;

let logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            name: 'info-file',
            level: 'info',
            filename: `${config.log.path}/${config.log.files.info}`,
            handleExceptions: true,
            json: true,
            maxsize: config.log.maxSize,
            maxFiles: config.log.maxFiles,
            colorize: false
        }),
        new winston.transports.Console({
            name: 'info-console',
            level: 'info',
            handleExceptions: true,
            json: false,
            colorize: true
        }),
        new winston.transports.File({
            name: 'erro-file',
            level: 'error',
            filename: `${config.log.path}/${config.log.files.erro}`,
            handleExceptions: true,
            json: true,
            maxsize: config.log.maxSize,
            maxFiles: config.log.maxFiles,
            colorize: false
        }),
         new winston.transports.Console({
            name: 'erro-console',
            level: 'error',
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
});

module.exports = logger;
