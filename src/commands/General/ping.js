const Discord = require("discord.js");
const Command = require("../../base/Command.js");

class ping extends Command {
    constructor(client) {
        super(client, {
            name: "ping",
            aliases: ["ping"]
        });
    }

    async run(message, args, perm) {
        message.reply("pong!")
    }
}

module.exports = ping;