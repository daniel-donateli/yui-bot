require("isomorphic-fetch");
const date = require("./date");

const getDollarToday = () => {
  return new Promise((resolve, reject) => {
    fetch(
      `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao='${date.lastWorkDay()}'&$top=100&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao`,
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
