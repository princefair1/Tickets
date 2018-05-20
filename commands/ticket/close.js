const Discord = require("discord.js");
const mongoose = require("mongoose");
const Tickets = require("../../models/tickets");

module.exports = {
    name: 'close'
}

module.exports.run = async (bot, message, args, color, staffChannel, supportRole) => {
    let number = args[1];
    let reason = args.slice(2).join(' ');
    
    if (!supportRole) return;
    
    if (!number || !reason) {
        let infoEmbed = new Discord.RichEmbed()
            .setColor(color)
            .setTitle('Incorrect Command')
            .setDescription('**Usage:** `;ticket close [ticket number] [reason]`');
            
        message.channel.send(infoEmbed);
        return;
    };

    Tickets.findOneAndRemove({ 'ticketNumber' : number }, (err, closedTicket) => {
        if (err) {
            console.log(err);
        } else {
            let ticketChannel = message.guild.channels.find('name', `ticket-${closedTicket.ticketNumber}`);
            ticketChannel.delete();

            staffChannel.fetchWebhooks().then( webhook => {
                let foundHook = webhook.find('name', 'Tickets');

                let infoEmbed = new Discord.RichEmbed()
                    .setColor(color)
                    .setDescription(`<@${message.author.id}> closed Ticket **\#${closedTicket.ticketNumber}**`)
                    .addField('Reason', reason)
                    .setFooter(`Ticket \#${closedTicket.ticketNumber}`)
                    .setTimestamp();

                if (!foundHook) {
                    staffChannel.createWebhook('Tickets', bot.user.avatarURL).then( webhook => {
                        webhook.send(infoEmbed);
                    });
                } else {
                    foundHook.send(infoEmbed);
                }
            });
        }
    });   
}