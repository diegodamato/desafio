let moment = require("moment");

module.exports = () =>{
    return{
        calculaPeriodoEmMinutos(data){
            let dataPeriodo = moment(data);
            let dataAtual = moment(new Date());
            let diferenca = dataAtual.diff(dataPeriodo);
            return moment.duration(diferenca).asMinutes();
        }
    }
}