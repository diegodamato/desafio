const app = require('./app/bootstrap/express-bootstrap')();
const config = require('./app/bootstrap/config-bootstrap')();
let log = require('./app/util/log');

app.listen(config.server.port, function () {
    log.info(`Servidor rodando na porta ${config.server.port}`);
});











