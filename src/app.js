const fs = require("fs");
const getDollarToday = require("./libs/dollar-today");
const { client, cooldowns, collection, distube } = require("./bot");
const { token, prefix } = require("../config");

console.log("Initializing...");

const app = {
  dolar_hoje: {},
  client: client,
  distube: distube,
  update: async function () {
    console.log("Fetching...");
    try {
      this.dolar_hoje = await getDollarToday();
    } catch (e) {
      console.error(e);
    }
  },
  setup: async function () {
    console.log("Setting up...");
    console.log("Loading files...");
    const commandFiles = fs.readdirSync(__dirname + "/commands").filter((
      file,
    ) => file.endsWith(".js"));
    console.log("Loading commands...");
    for (const file of commandFiles) {
      const command = require(`./commands/${file}`);
      client.commands.set(command.name, command);
    }
    console.log("Updating state...");
    await this.update();
  },
  run: async function () {
    this.client.once("ready", () => {
      console.log(`Logged in as ${client.user.tag}!`);
    });

    this.client.on("message", (msg) => {
      if (!msg.content.startsWith(prefix) || msg.author.bot) return;

      const args = msg.content.slice(prefix.length).trim().split(/ +/);
      const commandName = args.shift().toLowerCase();

      const command = client.commands.get(commandName) ||
        client.commands.find((cmd) =>
          cmd.aliases && cmd.aliases.includes(commandName)
        );

      if (!command) return;

      if (command.guildOnly && msg.channel.type === "dm") {
        return msg.reply("Não posso executar esse comando nas DMs!");
      }

      if (command.args && !args.length) {
        let reply = `Você não forneceu argumentos, ${msg.author}!`;

        if (command.usage) {
          reply +=
            `\nO uso correto do comando é: \`${prefix}${command.name} ${command.usage}\``;
        }

        return msg.channel.send(reply);
      }

      if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new collection());
      }

      const now = Date.now();
      const timestamps = cooldowns.get(command.name);
      const cooldownAmount = (command.cooldown || 3) * 1000;

      if (timestamps.has(msg.author.id)) {
        const expirationTime = timestamps.get(msg.author.id) +
          cooldownAmount;

        if (now < expirationTime) {
          const timeLeft = (expirationTime - now) / 1000;
          return msg.reply(
            `Espere ${
              timeLeft.toFixed(1)
            } segundo(s) antes de reusar o comando \`${command.name}\``,
          );
        }
      }

      timestamps.set(msg.author.id, now);
      setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);

      try {
        if (command.name === "dolarhoje") {
          command.execute(msg, args, this.dolar_hoje);
          this.update();
        } else if (command.name === "play") {
          command.execute(msg, args, this.distube);
        } else if (
          command.name === "pause" || command.name === "resume" ||
          command.name === "stop"
        ) {
          command.execute(msg, this.distube);
        } else {
          command.execute(msg, args);
        }
      } catch (err) {
        console.error(err);
        msg.reply("Houve um erro ao executar este comando");
      }
    });

    this.distube
      .on("playSong", (message, queue, song) => {
        message.channel.send(
          `Tocando \`${song.name}\` - \`${song.formattedDuration}\`\nRequerido por: ${song.user}\n`,
        );
      });

    this.distube.on("addSong", (message, queue, song) => {
      message.channel.send(
        `Adicionado ${song.name} - \`${song.formattedDuration}\` a fila por ${song.user}`,
      );
    });

    this.distube.on(
      "empty",
      (message) => message.channel.send("Canal vazio. Pegando a foda fora"),
    );

    this.distube.on("error", (message, err) =>
      message.channel.send(
        "Houve um erro: " + err,
      ));

    this.distube.on(
      "finish",
      (message) => message.channel.send("Sem músicas na fila"),
    );

    this.client.login(token);
  },
};

app.setup().then(app.run());
