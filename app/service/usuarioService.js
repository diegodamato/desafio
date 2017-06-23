let moment = require("moment");

module.exports = () => 
    class usuarioService{
        constructor(usuarioRepository){
            this._usuarioRepository = usuarioRepository;
        }

        salvarUsuario(usuario){
            return new Promise((resolve, reject) =>{
                this._usuarioRepository.consultarEmail(usuario.email)
                    .then(email =>{
                        if(email)
                            reject("Email já existente");
                        else
                            this._usuarioRepository.salvar(usuario)
                                .then(usu =>{
                                    resolve(usu);
                                })
                    }).catch(erro => console.log(erro));
            })

        }

        validaEntrada(dadosUsuario){
            return new Promise((resolve, reject) =>{
                this._usuarioRepository.validarDadosEntrada(dadosUsuario)
                    .then(usuario =>{
                        if(usuario && usuario.email){
                            if(usuario.senha == dadosUsuario.senha)
                                resolve(usuario);
                            else
                                resolve("Senha inválida");
                        }else{
                            resolve("401");
                        }
            
                        
                    });
            });
        }

        validaBuscaUsuario(id, token){
            return new Promise((resolve, reject) =>{
                this._usuarioRepository.buscarUsuarioPorId(id, token)
                    .then(usuario =>{
                        if (usuario.token != token){
                            resolve("Não autorizado")
                        }else{
                            let ultimoLogin = moment(usuario.ultimo_login);
                            let dataAtual = moment();
                            let diferenca = dataAtual.diff(ultimoLogin);
                            let diferencaDatas = moment.duration(diferenca).asMinutes();

                            if(diferencaDatas > 30 ){
                                console.log("Expirou a sessão");
                            }else{
                                console.log("retornar usuario");
                            }
                        }
                        

                            
                    });
            })
        }
        
    }