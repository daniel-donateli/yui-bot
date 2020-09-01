module.exports = {
  name: "dolarhoje",
  aliases: [
    "dollarhoje",
    "dollar-hoje",
    "dollar_hoje",
    "dólarhoje",
    "dólar-hoje",
    "dólar_hoje",
  ],
  description: "Cotação do dólar!",
  args: false,
  guildOnly: false,
  usage: " ",
  cooldown: 5,
  execute(message, args, dolar) {
    message.channel.send(
      `Valor do dólar:\nCompra: R$${dolar.compra}\nVenda: R$${dolar.venda}\nAtualizado em: ${dolar.dataCotacao}`,
    );
  },
};
