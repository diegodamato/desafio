let mongoose = require('mongoose');
let logger = require('../util/log');

module.exports = () =>
    class usuarioRepository{
        constructor(){
            this._usuarioModel = mongoose.model('Usuario');
        }

        consultarEmail(email){
            
            logger.info(`usuarioRepository - consultarEmail  - email: ${email}`);
            
            return new Promise((resolve, reject) =>{
                this._usuarioModel.find({"email": email},(erro, result) =>{
                    if(erro)
                        reject(erro)

                    if(result.length){
                        resolve(email);
                    }else{
                        resolve(null);
                    }
                })
            })
                
        }

        salvar(usuario){

            let dataAtual = new Date();
            let usu = new this._usuarioModel();

            usu.id = usuario.id;
            usu.nome = usuario.nome;
            usu.email = usuario.email;
            usu.senha = usuario.senha;
            usu.token = usuario.token;
            usu.telefones = usuario.telefones;
            usu.data_criacao = dataAtual;
            usu.data_atualizacao = dataAtual;
            usu.ultimo_login = dataAtual;
            
            logger.info(`usuarioRepository - salvar - usuario: ${usu}`);

            return new Promise((resolve, reject) => {
                usu.save((erro, result) =>{
                    if (erro){
                        reject(erro);
                    }else{
                        let user = Object.assign({}, result._doc);
                        delete user._id;
                        resolve(user);
                    }
                })
            })
        }

        validarDadosEntrada(dadosUsuario){

            logger.info(`usuarioRepository - validarDadosEntrada  - Dados do usuario: ${dadosUsuario}`);

            return this._usuarioModel.findOne({"email": dadosUsuario.email}, {"_id": 0})
                .then(usuario => usuario ? usuario._doc : {});
        }

        buscarUsuarioPorId(id){
            
            logger.info(`usuarioRepository - buscarUsuarioPorId  - id: ${id}`);

            return this._usuarioModel.findOne({"id":id}, {"_id": 0})
                .then(usuario => usuario ? usuario._doc : {});
        }
    }