let moment = require("moment");
let logger = require('../util/log');
let dataUtil = require('../util/dataUtil')();
let statusMensagens = require('../util/statusMensagens');


module.exports = () => 
    class usuarioService{
        constructor(usuarioRepository){
            this._usuarioRepository = usuarioRepository;
        }

        validaCadastro(usuario){
            
            logger.info(`usuarioService - validaCadastro - usuario: ${usuario}`);
            
            return new Promise((resolve, reject) =>{
                this._usuarioRepository.consultarEmail(usuario.email)
                    .then(email =>{
                        if(email)
                            resolve(statusMensagens.EMAIL_EXISTENTE);
                        else
                            this._usuarioRepository.salvar(usuario)
                                .then(usu =>{
                                    resolve(usu);
                                })
                    }).catch(erro => console.log(erro));
            });
        }

        validaBuscaUsuario(id, token){
            
            logger.info(`usuarioService - validaBuscaUsuario  - id: ${id} - token: ${token}`);
            
            return new Promise((resolve, reject) =>{
                this._usuarioRepository.buscarUsuarioPorId(id, token)
                    .then(usuario =>{
                        if (usuario.token != token){
                            resolve(statusMensagens.NAO_AUTORIZADO)
                        }else{
                            let diferencaDatas = dataUtil.calculaPeriodoEmMinutos(usuario.ultimo_login);

                            if(diferencaDatas > 30 ){
                                resolve(statusMensagens.SESSAO_INVALIDA);
                            }else{
                                resolve(usuario);
                            }
                        }
                    });
            });
        }        
    }