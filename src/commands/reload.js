module.exports = {
  name: "reload",
  aliases: [],
  description: "Recarrega um comando",
  args: true,
  guildOnly: false,
  usage: "[command]",
  cooldown: 5,
  execute(message, args) {
    const commandName = args[0].toLowerCase();
    const command = message.client.commands.get(commandName) ||
      message.client.commands.find((cmd) =>
        cmd.aliases && cmd.aliases.includes(commandName)
      );

    if (!command) {
      return message.channel.send(
        `Não há nenhum comando com nome ou alias \`${commandName}\`, ${message.author}!`,
      );
    }

    delete require.cache[require.resolve(`./${command.name}.js`)];

    try {
      const newCommand = require(`./${command.name}.js`);
      message.client.commands.set(newCommand.name, newCommand);
      message.channel.send(`Comando \`${command.name}\` foi recarregado!`);
    } catch (error) {
      console.log(error);
      message.channel.send(
        `Houve um erro ao recarregar o comando \`${command.name}\`:\n\`${error.message}\``,
      );
    }
  },
};
