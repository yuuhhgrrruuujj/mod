// Load environment variables first
require('dotenv').config();

const { readdirSync } = require('fs');
const { Client, Collection } = require('discord.js');
const express = require('express');
const Keyv = require('keyv');

const app = express();
const PORT = process.env.PORT || 3000;

// Tiny web server for Uptime Robot
app.get("/", (req, res) => res.send("Bot is running!"));
app.listen(PORT, () => console.log(`Web server listening on port ${PORT}`));

// Initialize Keyv databases from environment variables
const suggestionChannels = new Keyv(process.env.suggestionChannels);
const logChannels = new Keyv(process.env.logChannels);
const msgLogs = new Keyv(process.env.msgLogs);
const welcomeChannels = new Keyv(process.env.welcomeChannels);
const leaveChannels = new Keyv(process.env.leaveChannels);
const welcomeMessages = new Keyv(process.env.welcomeMessages);
const welcomeDms = new Keyv(process.env.welcomeDms);
const welcomeRoles = new Keyv(process.env.welcomeRoles);
const leaveMessages = new Keyv(process.env.leaveMessages);
const toggleWelcomeMsg = new Keyv(process.env.toggleWelcomeMsg);
const toggleWelcomeDm = new Keyv(process.env.toggleWelcomeDm);
const toggleLeaveMsg = new Keyv(process.env.toggleLeaveMsg);

// Discord client
const client = new Client({
  partials: ['MESSAGE', 'REACTION'],
  intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS']
});

// Commands setup
let commands = [];
client.commands = new Collection();
readdirSync('./Commands').forEach(folder => {
  readdirSync(`./Commands/${folder}`).forEach(file => {
    const command = require(`./Commands/${folder}/${file}`);
    client.commands.set(command.data.name, command);
    if (command.data.name !== 'help') commands.push(command.data.toJSON());
  });
});
module.exports = commands;

// Events setup
readdirSync('./Events').forEach(folder => {
  readdirSync(`./Events/${folder}`).forEach(file => {
    const event = require(`./Events/${folder}/${file}`);
    client.on(file.split('.')[0], event.bind(null, client));
  });
});

// Login to Discord
client.login(process.env.token);
