const ytsr = require("ytsr");
const ytdl = require("ytdl-core");

module.exports = {
  name: "play",
  aliases: [],
  description: "Toca uma música do youtube",
  args: true,
  guildOnly: true,
  usage: " <youtube link>",
  cooldown: 5,
  execute(message, args) {
    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) {
      return message.reply(
        "Você precisa estar em um canal de voz para usar este comando!",
      );
    }

    voiceChannel.join().then((connection) => {
      const url = args[0] || "https://www.youtube.com/watch?v=qlzE1Z_D8Kg";
      const stream = ytdl(
        url,
        { filter: "audioonly" },
      );
      const dispatcher = connection.play(stream);

      dispatcher.on("finish", () => voiceChannel.leave());
    });
  },
};
