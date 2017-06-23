module.exports = app =>{

    let controlador = app.beans.factory.usuarioController;

    app.route("/v1/usuario")
        .post(controlador.cadastrar.bind(controlador));
    
    app.route("/v1/usuario/:id")
        .get(controlador.consultar.bind(controlador));
    
}