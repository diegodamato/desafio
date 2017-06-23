let mongoose = require('mongoose');
let log = require('../util/log');
var config = require('../bootstrap/config-bootstrap')();

if(mongoose.connection.readyState)
    return;

mongoose.Promise = global.Promise;

function connect(){
    mongoose.connect(config.mongodb.url,{server:{
        socketOptions:{
            connectTimeoutMS:30000 ,
            socketTimeoutMS:15000,
            keepAlive: 30000
        },
        reconnectInterval: 2000,
        reconnectTries: Number.MAX_VALUE
    }});
}

mongoose.connection.on('connecting',() => {
    log.info('conectando ao mongodb');
});

mongoose.connection.on('connected',() => {
    log.info('conectado ao mongodb');
});

mongoose.connection.on('error',() => {
    log.error('Erro ao conectar com o mongodb');
    setTimeout(connect,2000);
});

mongoose.connection.on('reconnected',() => {
    log.info('reconectado ao mongodb');
});

mongoose.connection.on('disconnected',() => {
    log.info('finalizando conexão com o mongodb');
});

process.on('SIGINT',() => {
    log.info('encerrando o Desafio');
    mongoose.connection.close(() => process.exit(0));
});

connect();
