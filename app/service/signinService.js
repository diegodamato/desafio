let logger = require('../util/log');
let statusMensagens = require('../util/statusMensagens');

module.exports = () => 
    class usuarioService{
        constructor(usuarioRepository){
            this._usuarioRepository = usuarioRepository;
        }

    validaEntrada(dadosUsuario){
        
        logger.info(`signinService - validaEntrada  - Dados do usuario: ${dadosUsuario}`);
        
        return new Promise((resolve, reject) =>{
            this._usuarioRepository.validarDadosEntrada(dadosUsuario)
                .then(usuario =>{
                    if(usuario && usuario.email){
                        if(usuario.senha == dadosUsuario.senha)
                            resolve(usuario);
                        else
                            resolve(statusMensagens.SENHA_INVALIDA);
                    }else{
                        resolve(statusMensagens.EMAIL_NAO_EXISTE);
                    }
                });
        }); 

    }
}