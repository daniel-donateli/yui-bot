const fs = require("fs");
const getDollarToday = require("./libs/dollar-today");
const { client, cooldowns, collection } = require("./bot");
const { token, prefix } = require("../config");

const app = {
  dolar_hoje: {},
  client: client,
  update: async function () {
    try {
      this.dolar_hoje = await getDollarToday();
    } catch (e) {
      console.error(e);
    }
  },
  setup: async function () {
    const commandFiles = fs.readdirSync(__dirname + "/commands").filter((
      file,
    ) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const command = require(`./commands/${file}`);
      client.commands.set(command.name, command);
    }

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
        } else {
          command.execute(msg, args);
        }
      } catch (err) {
        console.error(err);
        msg.reply("Houve um erro ao executar este comando");
      }
    });
    this.client.login(token);
  },
};

app.setup().then(app.run());
