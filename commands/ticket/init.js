const Discord = require("discord.js");

module.exports = {
    name: 'init'
}

module.exports.run = async (bot, message, args, adminRoles, color, supportChannel, everyoneRole, supportRole) => {
    if (!adminRoles) return;

    if (!supportChannel || !supportRole) {
        await message.guild.createChannel('Tickets Support', 'category').then( supportCategory => {
            message.guild.createChannel('staff-ticket-log', 'text').then( channel => {
                channel.setParent(supportCategory);
                channel.overwritePermissions(everyoneRole, {'VIEW_CHANNEL': false});
                if (!supportRole) {
                    message.guild.createRole({
                        name: 'Support Team',
                        color: '#E91E63',
                        permissions: [
                            "CREATE_INSTANT_INVITE",
                            "CHANGE_NICKNAME",
                            "READ_MESSAGES",
                            "SEND_MESSAGES",
                            "EMBED_LINKS",
                            "READ_MESSAGE_HISTORY",
                            "MENTION_EVERYONE",
                            "USE_EXTERNAL_EMOJIS",
                            "ADD_REACTIONS",
                            "CONNECT",
                            "SPEAK",
                            "MOVE_MEMBERS",
                            "USE_VAD"
                        ],
                        mentionable: true
                    }).then( role => {
                        channel.overwritePermissions(role, {'VIEW_CHANNEL': true, 'SEND_MESSAGES': true});
                    });
                } else {
                    channel.overwritePermissions(supportRole, {'VIEW_CHANNEL': true, 'SEND_MESSAGES': true});
                }
            });
        });

        let infoEmbed = new Discord.RichEmbed()
            .setColor(color)
            .setTitle('Ticket Init - Success!')
            .setDescription('You may now start using your tickets system! Make sure to add support members by running `;ticket add-support-member [@member]`.')

        message.channel.send(infoEmbed);
    } else {
        let infoEmbed = new Discord.RichEmbed()
            .setColor(color)
            .setTitle('Incorrect Command')
            .setDescription('Ticket Support has already been initiated.');

        message.channel.send(infoEmbed);
        return;
    }
}