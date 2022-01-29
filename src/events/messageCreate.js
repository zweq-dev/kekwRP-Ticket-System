const moment = require("moment")
const Discord = require("discord.js")
moment.locale("tr")
module.exports = class {
  constructor(client) {
    this.client = client;
  }
  async run(message) {
    const data = {};
    if (message.author.bot) return;

    if (message.guild && !message.channel.permissionsFor(message.guild.me).missing("SEND_MESSAGES"))
      return;

    let prefikslerim = this.client.bot.PREFIXES;
    let zweqBot = false;
    for (const içindeki of prefikslerim) {
      if (message.content.startsWith(içindeki)) zweqBot = içindeki;
    }
    if (!zweqBot) return;
    const args = message.content
      .slice(zweqBot.length)
      .trim()
      .split(/ +/g);
    const command = args.shift().toLowerCase();

    if (message.guild && !message.member)
      await message.guild.fetchMember(message.author);

    const client = this.client
    const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));
    if (!cmd) return;
    if (cmd && !message.guild && cmd.conf.guildOnly) return;
    message.flags = [];
    while (args[0] && args[0][0] === "-") {
      message.flags.push(args.shift().slice(1));
    }
    cmd.run(message, args, data);
    }
};