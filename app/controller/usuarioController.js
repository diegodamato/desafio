let guid = require('guid');
let jwt = require('jsonwebtoken');

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
            usuario.senha = req.body.senha;
            usuario.telefones = req.body.telefones;
            usuario.id = this._guid.value;
            
            let token = jwt.sign(usuario, "secreto");
            
            usuario.token = token; 

            this._usuarioService.salvarUsuario(usuario)
                .then(result => {
                    if(result)
                        res.status(200)
                           .json(result);
                }).catch(error => res.json({"mensagem" : error}));

        }

        consultar(req, res){
            let idUsuario = req.params.id;
            let token = this._tratarToken(req.headers.authorization);

            if (!token){
                res.status(401);
            }else{
                this._usuarioService.validaBuscaUsuario(idUsuario, token)
                    .then(usuario =>{

                }).catch(error => res.json({"mensagem" : error}));
            }

            
        }

        _tratarToken(token){
            let tokenTratado = token.split(" ");
            return tokenTratado[1];
        }
        
        entrar(req, res){
            let dadosUsuario = {};
            dadosUsuario.email = req.body.email;
            dadosUsuario.senha = req.body.senha;

            this._usuarioService.validaEntrada(dadosUsuario)
                .then(result =>{
                    if(result){
                        if(result == "Senha inválida"){
                            res.sendStatus(403)
                               //.json({"mensagem" : "Usuário e/ou senha inválidos - Senha Inválida"});
                        }else if(result == "401"){
                            res.sendStatus(401)
                               //.json({"mensagem" : "Usuário e/ou senha inválidos - Não encontrou nada"});
                        }else{
                            res.json(result)
                        }
                    }
                }).catch(error => res.json({"mensagem" : error}));
            

        }
    }
