const Discord = require("discord.js");
const mongoose = require("mongoose");
const Tickets = require("../../models/tickets");

module.exports = {
    name: 'open'
}

module.exports.run = async (bot, message, args, color, supportChannel, supportRole, everyoneRole, staffChannel) => {
    let desc = args.slice(1).join(' ');
    let createdAt = message.createdAt;
    let author =  {
        id: message.author.id,
        userTag: message.author.tag
    };
    let guild = {
        id: message.guild.id,
        name: message.guild.name
    };
    let openStatus = true;
    let random = Math.floor(Math.random() * 9999 + 0000);
    random = random.toString();
    random = (random).padStart(4, '0');

    let newTicket = {desc: desc, created: createdAt, author: author, guild: guild, open: openStatus, ticketNumber: random};

    Tickets.create(newTicket, (err, newlyCreated) => {
        if (err) {
            console.log(err);
        } else {
            message.guild.createChannel(`ticket-${newlyCreated.ticketNumber}`, 'text').then( channel => {
                channel.setParent(supportChannel);
                channel.overwritePermissions(everyoneRole, {'VIEW_CHANNEL': false});
                channel.overwritePermissions(message.author.id, {'VIEW_CHANNEL': true, 'SEND_MESSAGES': true});
                channel.overwritePermissions(supportRole, {'VIEW_CHANNEL': true, 'SEND_MESSAGES': true});
                channel.overwritePermissions(bot.user.id, {'VIEW_CHANNEL': true, 'SEND_MESSAGES': true});

                // Ticket Channel Embed
                let ticketEmbed = new Discord.RichEmbed()
                    .setColor(color)
                    .setDescription(`<@${newlyCreated.author.id}>, \n\nThank you for reaching out! \nOur support team will be in contact with you very soon!`)
                    .addField('Description:', `${newlyCreated.desc}`)
                    .setFooter(`Ticket \#${newlyCreated.ticketNumber}`)
                    .setTimestamp();

                channel.send(ticketEmbed);

                // Success Message Embed
                let infoEmbed = new Discord.RichEmbed()
                    .setColor(color)
                    .setTitle('New Ticket')
                    .setDescription(`Successfully created ticket \:white_check_mark: ${channel}`);
                
                message.channel.send(infoEmbed);

                // Send to Staff Channel
                staffChannel.fetchWebhooks().then( webhook => {
                    let ticketChannel = message.guild.channels.find('name', `ticket-${newlyCreated.ticketNumber}`);
                    let foundHook = webhook.find('name', 'Tickets');

                    let infoEmbed = new Discord.RichEmbed()
                        .setColor(color)
                        .setTitle('New Ticket')
                        .setDescription(`<@${newlyCreated.author.id}> opened a new ticket: ${ticketChannel}`)
                        .addField('Description', `${newlyCreated.desc}`)
                        .setFooter(`Ticket \#${newlyCreated.ticketNumber}`)
                        .setTimestamp();

                    if(!foundHook) {
                        staffChannel.createWebhook('Tickets', bot.user.avatarURL).then( webhook => {
                            webhook.send(infoEmbed);
                        });
                    } else {
                        foundHook.send(infoEmbed);
                    }
                });
            });
        }
    });
}