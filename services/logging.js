const winston = require('winston');

const dateFormat = () =>
    new Date(Date.now()).toUTCString();


class LoggerService {

    constructor(route, appType, appLaunch) {
        this.logData = null;
        this.route = route;
        this.appType = appType;
        this.appLaunch = appLaunch;

        const logger = winston.createLogger({
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({
                    filename: `./logs/${appType}/${route}.log`,
                }),
            ],
            format: winston.format.printf((info) => {

                if ((this.appLaunch === false) && (info.level === 'info')) {
                    let message = `\n${dateFormat()} | ${info.level.toUpperCase()} | ${route}.log | ${
                        info.message
                        } | `;
                    message = info.obj ?
                        message + `data:${JSON.stringify(info.obj)} | ` :
                        message;
                    message = this.logData ?
                        message + `log_data:${JSON.stringify(this.logData)} | ` :
                        message;
                    return message;
                } else {
                    let message = `${dateFormat()} | ${info.level.toUpperCase()} | ${route}.log | ${
                        info.message
                        } | `;
                    message = info.obj ?
                        message + `data:${JSON.stringify(info.obj)} | ` :
                        message;
                    message = this.logData ?
                        message + `log_data:${JSON.stringify(this.logData)} | ` :
                        message;
                    return message;
                }

            }),
        });
        this.logger = logger;
    }

    setLogData(logData) {
        this.logData = logData;
    }

    async info(message) {
        this.logger.log('info', message);
    }

    async info(message, obj) {
        this.logger.log('info', message, {
            obj,
        });
    }

    async debug(message) {
        this.logger.log('debug', message);
    }

    async debug(message, obj) {
        this.logger.log('debug', message, {
            obj,
        });
    }

    async error(message) {
        this.logger.log('error', message);
    }

    async error(message, obj) {
        this.logger.log('error', message, {
            obj,
        });
    }
}

module.exports = {
    LoggerService: LoggerService,
    appType: {
        admin: 'admin',
        user: 'user',
        craftman: 'craftman',
        common: 'common'
    }
};