let mongoose = require('mongoose');

module.exports = () =>
    class usuarioRepository{
        constructor(){
            this._usuarioModel = mongoose.model('Usuario');
        }

        consultarEmail(email){
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
            return this._usuarioModel.find({"email": dadosUsuario.email});
        }

        buscarUsuarioPorId(id){
            return this._usuarioModel.findOne({"id":id})
                .then(usuario => usuario ? usuario._doc : {});
        }
    }

