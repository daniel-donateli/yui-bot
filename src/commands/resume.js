module.exports = {
  name: "resume",
  aliases: [],
  description: "Resume a execução de música",
  args: false,
  guildOnly: true,
  usage: " ",
  cooldown: 5,
  execute(message, distube) {
    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) {
      return message.reply(
        "Você precisa estar em um canal de voz para usar este comando!",
      );
    }

    try {
      distube.resume(message);
    } catch (e) {
      console.error(e);
    }
  },
};
