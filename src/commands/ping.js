module.exports = {
  name: "ping",
  aliases: [],
  description: "Ping!",
  args: false,
  guildOnly: false,
  usage: " ",
  cooldown: 5,
  execute(message, args) {
    message.channel.send("Pong.");
  },
};
