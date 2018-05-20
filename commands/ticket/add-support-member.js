const Discord = require("discord.js");

module.exports = {
    name: 'add-support-member'
}

module.exports.run = async (bot, message, args, adminRoles, color, supportRole) => {
    let addedMember = message.guild.member(message.mentions.users.first());

    if (!adminRoles) return;

    if (!supportRole) {
        let infoEmbed = new Discord.RichEmbed()
            .setColor(color)
            .setTitle('Incorrect Command')
            .setDescription('You must run `;ticket init` before running this command.')
    }

    if (!addedMember) {
        let infoEmbed = new Discord.RichEmbed()
            .setColor(color)
            .setTitle('Incorrect Command')
            .setDescription('Please mention a user to add to your support team. \n**Usage:** `;ticket add-support-member [@user]`');

        message.channel.send(infoEmbed);
    }

    addedMember.addRole(supportRole).then( () => {
        message.channel.fetchWebhooks().then( webhook => {
            let foundHook = webhook.find('name', 'Tickets');

            let infoEmbed = new Discord.RichEmbed()
                .setColor(color)
                .setTitle('Success!')
                .setDescription(`${addedMember} has been added to ${supportRole} \:white_check_mark:`);

            if (!foundHook) {
                message.channel.createWebhook('Tickets', bot.user.avatarURL).then( webhook => {
                    webhook.send(infoEmbed);
                });
                return;
            } else {
                foundHook.send(infoEmbed);
            }
        });
    });
}