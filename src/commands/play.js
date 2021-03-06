module.exports = {
  name: "play",
  aliases: [],
  description: "Toca uma música do youtube",
  args: true,
  guildOnly: true,
  usage: " <Youtube link or Song name>",
  cooldown: 5,
  execute(message, args, distube) {
    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) {
      return message.reply(
        "Você precisa estar em um canal de voz para usar este comando!",
      );
    }

    distube.play(message, args.join(" ")).catch((err) => {
      console.error(err);
    });
  },
};
