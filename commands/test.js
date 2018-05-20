const Discord = require("discord.js");

module.exports = {
    name: 'test'
}

module.exports.run = async (bot, message, args) => {
    const testEmbed = new Discord.RichEmbed()
        .setColor('#4cd137')
        .setTitle('Test Command Successful')
        .setDescription('Everything seems to be working');

    message.channel.send(testEmbed);
};