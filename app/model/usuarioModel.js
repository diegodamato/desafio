let mongoose = require('mongoose');

let usuarioSchema = mongoose.Schema({
    nome: String,
    email: String,
    senha: String,
    data_criacao: Date,
    data_atualizacao: Date,
    ultimo_login: Date,
    id: String,
    token: String,
    telefones: []
}, {versionKey:false});

mongoose.model('Usuario', usuarioSchema, 'Usuario');