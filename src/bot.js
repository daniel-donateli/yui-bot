const Discord = require("discord.js");
const client = new Discord.Client();

client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();

module.exports = {
  client,
  cooldowns,
  collection: Discord.Collection,
};
