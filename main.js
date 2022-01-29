const Discord = require("discord.js");
const { Client, Collection, DiscordAPIError } = require("discord.js");
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const klaw = require("klaw");
const path = require("path");
const mongoose = require("mongoose")
const pms = require("pretty-ms");

class ZweqBot extends Client {
    constructor(options) {
        super(options);

        this.blockedFromCommand = []
        this.commandBlock = new Map()
        this.commands = new Collection();
        this.aliases = new Collection();
        
        this.logger = require("./src/modules/Logger");
        this.bot = require("./src/settings/Bot.json")
        this.ticket = require("./src/settings/Ticket.json")
    }

    loadCommand(commandPath, commandName) {
        try {
          const props = new (require(`${commandPath}${path.sep}${commandName}`))(
            this
          );
          this.logger.log(`Yüklenen Komut: ${props.help.name}.js`, "log");
          props.conf.location = commandPath;
          if (props.init) {
            props.init(this);
          }
          this.commands.set(props.help.name, props);
          props.conf.aliases.forEach(alias => {
            this.aliases.set(alias, props.help.name);
          });
          return false;
        } catch (e) {
          return `Komut yüklenirken hata oluştu: ${commandName}: ${e}`;
        }
    }

    async yolla(mesaj, msg, kanal) {
        if (!mesaj || typeof mesaj !== "string") return
        const embd = new Discord.MessageEmbed()
            .setAuthor({ text: msg.tag, iconURL: msg.displayAvatarURL({dynamic: true})})
            .setColor("BLURPLE")
            .setDescription(mesaj)
        kanal.send({embeds: [embd]}).then(msg => {
            setTimeout(() => msg.delete(), 10000);
        }).catch(console.error);
    }
    
    async clean(text) {
      if(typeof(text) === "string")
        return text.replace(/` /g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
      else
        return text;
    }
}

const client = new ZweqBot({ intents: 32767 });
const init = async () => {
    klaw("./src/commands").on("data", item => {
        const cmdFile = path.parse(item.path);
        if (!cmdFile.ext || cmdFile.ext !== ".js") return;
        const response = client.loadCommand(
          cmdFile.dir,
          `${cmdFile.name}${cmdFile.ext}`
        );
        if (response) client.logger.error(response);
    });
    
    const evtFiles = await readdir("./src/events/");
    evtFiles.forEach(file => {
        const eventName = file.split(".")[0];
        client.logger.log(`Yüklenen Event: ${eventName}.js`);
        const event = new (require(`./src/events/${file}`))(client);
        client.on(eventName, (...args) => event.run(...args));
        delete require.cache[require.resolve(`./src/events/${file}`)];
    });

    client.login(client.bot.TOKEN).catch(Err=> { client.logger.error("Invalid Token!") })
    mongoose.connect(client.bot.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(client.logger.log("Mongo Bağlantısı Kuruldu", "log"));
}
init();

client
  .on("disconnect", () => client.logger.warn("Bot is disconnecting..."))
  .on("reconnecting", () => client.logger.log("Bot reconnecting...", "log"))
  .on("error", e => client.logger.error(e))
  .on("warn", info => client.logger.warn(info));

process.on("uncaughtException", err => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
    console.error("Beklenmedik yakalanamayan hata: ", errorMsg);
    process.exit(1);
});
  
process.on("unhandledRejection", err => {
    console.error("Promise Hatası: ", err);
});