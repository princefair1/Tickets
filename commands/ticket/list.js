const Discord = require("discord.js");
const Tickets = require("../../models/tickets");

module.exports = {
    name: 'list'
}

module.exports.run = async (bot, message, args, color, staffChannel, supportRole) => {

    const number = parseInt(args[1]);
    
    if (!message.member.roles.find('name', 'Support Team')) {
        let infoEmbed = new Discord.RichEmbed()
            .setColor(color)
            .setTitle('Incorrect Command')
            .setDescription(`Only ${supportRole} members can run this command`);

        message.channel.send(infoEmbed);
        return;
    } else if (message.channel != staffChannel) {
        let infoEmbed = new Discord.RichEmbed()
            .setColor(color)
            .setTitle('Incorrect Command')
            .setDescription(`Only run this command in the ${staffChannel}`);

        message.channel.send(infoEmbed);
        return;
    } else if (!args[1] && message.channel == staffChannel) {
        Tickets.find({"guild.id": message.guild.id}).where('open').equals('true').exec( (err, tickets) => {
            if (err) {
                console.log(err);
            } else {
                var ticketNumbers = [];
                tickets.forEach( t => {
                    ticketNumbers.push(t.ticketNumber);
                });
                let infoEmbed = new Discord.RichEmbed()
                    .setColor(color)
                    .setDescription('There are currently `' + tickets.length + ' tickets` open. \n`' + ticketNumbers.join('`, `') + '`');

                message.channel.send(infoEmbed);
            }
        });
    } else if (!isNaN(number)) {
        Tickets.findOne({"guild.id": message.guild.id, "ticketNumber": number}, (err, ticket) => {
            if (err) {
                console.log(err);
            } else {
                let ticketChannel = message.guild.channels.find('name', `ticket-${ticket.ticketNumber}`);
                let createdAt = new Date(ticket.created).toISOString();
                let ticketEmbed = new Discord.RichEmbed()
                    .setColor(color)
                    .setTitle(`Ticket #${ticket.ticketNumber}`)
                    .addField('Created By:', `<@${ticket.author.id}>`, true)
                    .addField('Channel:', ticketChannel, true)
                    .addField('Description:', `${ticket.desc}`)
                    .setFooter('Ticket Created')
                    .setTimestamp(createdAt);

                message.channel.send(ticketEmbed);
            }
        });
    };
}