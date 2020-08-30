const { prefix } = require("../../config");

module.exports = {
  name: "help",
  aliases: ["commands"],
  description:
    "Lista todos os comandos ou informação sobre um comando específico",
  guildOnly: false,
  usage: "[command name]",
  cooldown: 5,
  execute(message, args) {
    const data = [];
    const { commands } = message.client;

    if (!args.length) {
      data.push("Aqui está uma lista dos meus comandos:");
      data.push(commands.map((command) => command.name).join(", "));
      data.push(
        `\nVocê pode enviar \`${prefix}help [command name]\` para ter informações sobre um comando específico!`,
      );

      return message.author.send(data, { split: true })
        .then(() => {
          if (message.channel.type === "dm") return;
          message.reply("Eu te enviei um DM com todos os meus comandos!");
        })
        .catch((error) => {
          console.error(
            `Não consegui mandar um DM de help para ${message.author.tag}.\n`,
            error,
          );
          message.reply(
            "Parece que não posso te enviar um DM, você está com DMs desabilitados?",
          );
        });
    }

    const name = args[0].toLowerCase();
    const command = commands.get(name) ||
      commands.find((c) => c.aliases && c.aliases.includes(name));

    if (!command) {
      return message.reply("Comando inválido!");
    }

    data.push(`**Nome:** ${command.name}`);

    if (command.aliases) {
      data.push(`**Aliases:** ${command.aliases.join(", ")}`);
    }
    if (command.description) {
      data.push(`**Descrição:** ${command.description}`);
    }
    if (command.usage) {
      data.push(`**Como usar:** ${prefix}${command.name} ${command.usage}`);
    }

    data.push(`**Cooldown:** ${command.cooldown || 3} segundo(s)`);

    message.channel.send(data, { split: true });
  },
};
