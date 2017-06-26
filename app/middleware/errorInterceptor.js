let logger = require('../util/log');

module.exports = () =>
    class ErrorInterceptor {
        constructor() {
        }

        static intercept(error, req, res, next) {
            if (error.status) {
                res.status(error.status)
                    .send({'mensagem': error.message});
                return;
            }

            logger.error(`ErrorInterceptor - intercept - errorStatus: ${error.status} - errorMessage: ${error.message}`);

            res.status(500)
                .send({'mensagem': 'Ocorreu um erro ao processar a requisição solicitada, tente novamente mais tarde'});
        }
    };
