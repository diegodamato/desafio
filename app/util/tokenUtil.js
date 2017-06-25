module.exports = () =>{
    return{
        tratarToken(token){
            let tokenTratado = token.split(" ");
            return tokenTratado[1];
        }
    }
}
        