const fs = require("fs");
const Discord = require("discord.js");
const mongoose = require("mongoose");
const Tickets = require("../models/tickets");

module.exports = {
    name: "ticket"
}

module.exports.run = async (bot, message, args) => {
    await message.delete();
    let func = args[0];

    let color = '#6a89cc';

    let supportChannel = message.guild.channels.find('name', 'Tickets Support');
    let staffChannel = message.guild.channels.find('name', 'staff-ticket-log');
    let everyoneRole = message.guild.roles.find('name', '@everyone');
    let supportRole = message.guild.roles.find('name', 'Support Team');
    let adminRoles = message.member.hasPermission("ADMINISTRATOR");

    if (func === 'init') {
        bot.ticket.get(func).run(bot, message, args, adminRoles, color, supportChannel, everyoneRole, supportRole);
    }

    if (func === 'add-support-member') {
        bot.ticket.get(func).run(bot, message, args, adminRoles, color, supportRole);
    }
    
    if (func === 'open') {
        bot.ticket.get(func).run(bot, message, args, color, supportChannel, supportRole, everyoneRole, staffChannel);
    }

    if (func === 'list') {
        bot.ticket.get(func).run(bot, message, args, color, staffChannel, supportRole);
    }

    if (func === 'close') {
        bot.ticket.get(func).run(bot, message, args, color, staffChannel, supportRole);
    }

}
