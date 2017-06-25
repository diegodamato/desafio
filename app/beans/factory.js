module.exports = app =>{
    return {
        get usuario(){
            return app.model.usuarioModel;
        },

        get usuarioRepository(){
            return new app.repository.usuarioRepository();
        },

        get usuarioService(){
            return new app.service.usuarioService(this.usuarioRepository);
        },

        get usuarioController(){
            return new app.controller.usuarioController(this.usuarioRepository, this.usuarioService);
        },

        get signinService(){
            return new app.service.signinService(this.usuarioRepository);
        },

        get signinController(){
            return new app.controller.signinController(this.signinService);
        },


    }
}