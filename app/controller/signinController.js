let md5 = require('md5');
let logger = require('../util/log');
let statusMensagens = require('../util/statusMensagens');

module.exports = () => 
    class signinController{
        constructor(signinService){
            this._signinService = signinService;
        }

        entrar(req, res){
            let dadosUsuario = {};
            dadosUsuario.email = req.body.email;
            dadosUsuario.senha = md5(req.body.senha);

            logger.info(`signinController - entrar  - email: ${dadosUsuario.email} - senha: ${dadosUsuario.senha}`);

            this._signinService.validaEntrada(dadosUsuario)
                .then(result =>{
                    if(result){
                        if(result == statusMensagens.EMAIL_NAO_EXISTE){
                            res.status(403)
                               .json({"mensagem" : statusMensagens.EMAIL_NAO_EXISTE});
                        }else if(result == statusMensagens.SENHA_INVALIDA){
                            res.status(401)
                               .json({"mensagem" : statusMensagens.SENHA_INVALIDA});
                        }else{
                            res.status(200)
                               .json(result);
                        }
                    }
                }).catch(error => res.json({"mensagem" : error}));
            

        }
    }
