let md5 = require('md5');
let guid = require('guid');
let jwt = require('jsonwebtoken');
let logger = require('../util/log');
let statusMensagens = require('../util/statusMensagens');
let tokenUtil = require('../util/tokenUtil')();

module.exports = () => 
    class usuarioController{
        constructor(usuarioRepository, usuarioService){
            this._usuarioRepository = usuarioRepository;
            this._usuarioService = usuarioService;
            this._guid = guid.create();
        }

        cadastrar(req, res){
            let usuario = {};
            usuario.nome = req.body.nome;
            usuario.email = req.body.email;
            usuario.senha = md5(req.body.senha);
            usuario.telefones = req.body.telefones;
            usuario.id = this._guid.value;
            
            let token = jwt.sign(usuario, "secreto");
            
            usuario.token = md5(token); 

            logger.info(`usuarioController - cadastrar  - usuario: ${usuario}`);

            this._usuarioService.validaCadastro(usuario)
                .then(result => {
                    if(result == statusMensagens.EMAIL_EXISTENTE)
                        res.status(403)
                            .json({"mensagem":statusMensagens.EMAIL_EXISTENTE});
                    else
                        res.status(200)
                        .json(result);
                }).catch(error => res.json({"mensagem" : error}));

        }

        consultar(req, res){
            let idUsuario = req.params.id;
            let token = req.headers.authorization; 
            
            logger.info(`usuarioController - consultar  - id: ${idUsuario} - token: ${token}`);

            if (!token){
                res.status(401)
                   .json({"mensagem": statusMensagens.NAO_AUTORIZADO});
            }else{
                token = tokenUtil.tratarToken(token);
                this._usuarioService.validaBuscaUsuario(idUsuario, token)
                    .then(result =>{
                        if(result == statusMensagens.NAO_AUTORIZADO){
                            res.status(401)
                               .json({"mensagem": statusMensagens.NAO_AUTORIZADO});
                        }else if(result == statusMensagens.SESSAO_INVALIDA){
                            res.status(401)
                               .json({"mensagem": statusMensagens.SESSAO_INVALIDA});
                        }else{
                            res.status(200)
                               .json(result);
                        }

                }).catch(error => res.json({"mensagem" : error}));
            }
        }

        
    };
