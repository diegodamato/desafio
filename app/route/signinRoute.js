module.exports = app =>{

    let controlador = app.beans.factory.signinController;

    app.route("/v1/signin")
        .post(controlador.entrar.bind(controlador));

}

