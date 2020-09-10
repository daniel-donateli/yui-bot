const Discord = require("discord.js");
const Distube = require("distube");

const client = new Discord.Client();
const distube = new Distube(
  client,
  { emitNewSongOnly: true, leaveOnEmpty: true, leaveOnEmpty: true },
);

client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();

module.exports = {
  client,
  cooldowns,
  collection: Discord.Collection,
  distube,
};
