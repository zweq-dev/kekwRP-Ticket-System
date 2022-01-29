const Discord = require("discord.js");
const Command = require("../../base/Command.js");
const { MessageActionRow, MessageButton } = require('discord.js');

class tbut extends Command {
    constructor(client) {
        super(client, {
            name: "tbut",
            aliases: ["ticketbutton", "ticketb"]
        });
    }

    async run(message, args, perm) {
        const embed = new Discord.MessageEmbed()
            .setTitle(`${message.guild.name} Destek`)
            .setColor("BLUE")
            .setDescription("Destek talebi oluşturmak için \`🎫 Ticket Oluştur\` butonuna tıkla!")
            .setFooter({ text: this.client.user.username })
            .setTimestamp()
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("NormalTicket")
                    .setLabel("🎫 Ticket Oluştur")
                    .setStyle("PRIMARY")
            );
        await message.channel.send({ embeds: [embed], components: [row] });

    }
}

module.exports = tbut;