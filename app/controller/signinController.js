
module.exports = () => 
    class signinController{
        constructor(usuarioService){
            this._usuarioService = usuarioService;
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
