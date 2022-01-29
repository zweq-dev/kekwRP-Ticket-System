const moment = require("moment")
const Discord = require("discord.js")
moment.locale("tr")
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(interaction) {
        if(!interaction.isButton()) return;

        if(interaction.customId === "TicketKapat") {
            const ticketChannel = interaction.guild.channels.cache.get(interaction.channel.id)
            interaction.reply(":white_check_mark: Bu ticket sona erdiriliyor... **:)**")
            setTimeout(function() {
                ticketChannel.delete();
            }, 3000)
        }

        if(interaction.customId === "NormalTicket") {
            const ticketChannel = interaction.guild.channels.cache.find(c => c.name === `kekw-ticket-${interaction.user.id}`)
            if (ticketChannel) return interaction.reply({ content:`⚠️ Zaten açık durumda bir ticketin var. <#${ticketChannel.id}>`, ephemeral: true});
            
            let stuff = interaction.guild.roles.cache.find(role => role.name === this.client.ticket.Stuff)
            if (!stuff) return message.reply({ content: `Bu Sunucuda '**${this.client.ticket.Stuff}**' rolünü bulamadım bu yüzden ticket açamıyorum!`, ephemeral: true});

            let Management = interaction.guild.roles.cache.find(role => role.name === this.client.ticket.Manager)
            if (!Management) return interaction.reply({ content: `Bu Sunucuda '**${this.client.ticket.Manager}**' rolünü bulamadım bu yüzden ticket açamıyorum!`, ephemeral: true });

            let ever = interaction.guild.roles.cache.find(role => role.name === "@everyone");

            interaction.guild.channels.create(`kekw-ticket-${interaction.user.id}`, {
                type: "GUILD_TEXT",
            }).then(c=> {
                c.setParent(this.client.ticket.TicketCategoryID).catch(err=> { })
                c.permissionOverwrites.set([{
                    id: stuff,
                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                }]);
                c.permissionOverwrites.set([{
                    id: Management,
                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                }]);
                c.permissionOverwrites.set([{
                    id: ever,
                    deny: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                }]);
                c.permissionOverwrites.set([{
                    id: interaction.user,
                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                }]);
                interaction.reply({content: `:white_check_mark: Ticket kanalın başarılı bir şekilde oluşturuldu, <#${c.id}>!`, ephemeral: true});
                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId("TicketKapat")
                            .setLabel("🎫 Ticket Kapat")
                            .setStyle("DANGER")
                    );
                const embed = new Discord.MessageEmbed()
                    .setColor("BLUE")
                    .setTitle(`KEKWRP TICKET SUPPORT`)
                    .setDescription(`Selamlar <@${interaction.user.id}>, müsait bir yetkili en kısa sürede sizinle ilgilenecektir. Bu sırada sabırlı olmanız ve yetkili etiketlemeniz gerekmektedir.`)
                    .setTimestamp()
                c.send({ content: `<@&${stuff.id}> sizinle en kısa sürede ilgilenecektir.`, embeds:[embed], components: [row] });
            }).catch(err=> { })
      }
    }
};