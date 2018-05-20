const fs                        = require("fs"),
      Discord                   = require("discord.js"),
      mongoose                  = require("mongoose"),
      Tickets                   = require("./models/tickets"),
      { prefix, token, dbPass } = require("./config.json");
const bot                       = new Discord.Client();

mongoose.Promise = global.Promise;

bot.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands');
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    console.log(`${file} is loaded!`);
    bot.commands.set(command.name, command);
}

bot.ticket = new Discord.Collection();
const ticketFuncFiles = fs.readdirSync('./commands/ticket');
for (const file of ticketFuncFiles) {
    const func = require(`./commands/ticket/${file}`);
    console.log(`Ticket: ${file} is loaded!`);
    bot.ticket.set(func.name, func);
}

bot.on('ready', () => {
    console.log(`[BOT] ${bot.user.tag} is ready!`);
    mongoose.connect(`mongodb+srv://jyln:${dbPass}@jyln-6bxtx.mongodb.net/tickets`);
    console.log(`[GUILD COUNT] Currently being served on ${bot.guilds.size} servers.`);
});

// ADD SERVER
bot.on('guildCreate', guild => {
    console.log(`[GUILD JOIN] Bot added to: ${guild.name} | ${guild.id}`);
});

// REMOVED SERVER
bot.on('guildRemoved', guild => {
    console.log(`[GUILD REMOVE] Bot removed from: ${guild.name} | ${guild.id}`);
});

bot.on('message', message => {

    if ( !message.content.startsWith(prefix) || message.author.bot || message.channel.type === 'dm') return;

    let messageArray = message.content.slice(prefix.length).split(/ +/);
    let cmd = messageArray[0];
    let args = messageArray.splice(1);

    try {
        bot.commands.get(cmd).run(bot, message, args);
    }
    catch (err) {
        const infoEmbed = new Discord.RichEmbed()
            .setTitle('Incorrect Command')
            .setDescription('**ERROR:** The command you tried to use does not exist. Check your syntax or contact a developer for help.');

        message.channel.send(infoEmbed);
        return;
    }
    
});

bot.login(token);

