class validadorAmbiente{

    validar(){
        if(process.env['NODE_ENV'] != 'test')
            throw new Error('Os testes automatizados devem ser executados em ambiente de test. Defina a variável de ambiente NODE_ENV=test');
    }
}

module.exports = () => validadorAmbiente;