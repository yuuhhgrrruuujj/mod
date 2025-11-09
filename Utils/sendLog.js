const Keyv = require('keyv');

// Make sure the environment variable exists
if (!process.env.DATABASE_URL) {
  console.error('Error: DATABASE_URL is not defined!');
  process.exit(1);
}

// Create Keyv instance
const logChannels = new Keyv(process.env.DATABASE_URL);

// Optional: listen for connection errors
logChannels.on('error', err => console.error('Keyv connection error:', err));

module.exports = {
  sendLog: async (interaction, message) => {
    const logChName = await logChannels.get(`logchannel_${interaction.guild.id}`);
    const log = interaction.guild.channels.cache.find(ch => ch.name === logChName);

    let msgContent = {};
    if (message.color) msgContent = { embeds: [message] };
    else msgContent = { content: message };

    // Reply to interaction
    await interaction.reply(msgContent);

    // Send to log channel if it exists
    if (log) log.send(msgContent);
  }
};
