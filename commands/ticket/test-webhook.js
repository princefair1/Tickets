const Discord = require("discord.js");

module.exports = {
    name: 'test-webhook'
}

module.exports.run = async (bot, message, args, color, staffChannel) => {
    staffChannel.fetchWebhooks().then( webhook => {
        let foundHook = webhook.find('name', 'Tickets');

        let infoEmbed = new Discord.RichEmbed()
            .setColor(color)
            .setTitle('New Ticket')
            .setDescription('Test New Ticket Webhook');

        if (!foundHook) {
            staffChannel.createWebhook('Tickets', bot.user.avatarURL).then( webhook => {
                webhook.send(infoEmbed);
            });
            return;
        } else {
            foundHook.send(infoEmbed);
        }
    });
}