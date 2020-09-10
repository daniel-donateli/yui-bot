require("isomorphic-fetch");
const moment = require("moment");

const now = moment();
if (now.day() === 0) {
  now.subtract(2, "days");
} else if (now.day() === 6) {
  console.log("entrou no if 2");
  now.subtract(1, "days");
}
const date = `${now.month() + 1}-${now.date()}-${now.year()}`;

const getDollarToday = () => {
  return new Promise((resolve, reject) => {
    fetch(
      `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao='${date}'&$top=100&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao`,
    )
      .then((response) => response.json())
      .then((data) => {
        resolve({
          venda: data.value[0].cotacaoVenda,
          compra: data.value[0].cotacaoCompra,
          dataCotacao: data.value[0].dataHoraCotacao,
        });
      })
      .catch((err) => reject(new Error(err)));
  });
};

/*
{
    cotacaoCompra: number,
    cotacaoVenda: number,
    dataHoraCotacao: string 'year-month-day hour-min-sec-ms'
}
*/
module.exports = getDollarToday;
