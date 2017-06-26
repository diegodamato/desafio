const app = require('./app/bootstrap/express-bootstrap')();
const config = require('./app/bootstrap/config-bootstrap')();
let log = require('./app/util/log');

let processPort = process.env.PORT || config.server.port;

app.listen(processPort, function () {
    log.info(`Servidor rodando na porta ${processPort}`);
});











