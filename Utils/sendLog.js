const Keyv = require('keyv');

// Use your MongoDB URL from .env
const logChannelDB = new Keyv(process.env.DATABASE_URL);

// Optional: log Keyv errors
logChannelDB.on('error', err => console.error('Keyv connection error:', err));

module.exports = {
  // Function to send a log message
  sendLog: async (guild, message) => {
    // Fetch the stored log channel ID
    const logChannelId = await logChannelDB.get(`logchannel_${guild.id}`);
    if (!logChannelId) return console.log(`No log channel set for guild ${guild.id}`);

    // Get the actual channel from Discord cache
    const logChannel = guild.channels.cache.get(logChannelId);
    if (!logChannel) return console.log(`Log channel not found in guild ${guild.id}`);

    // Prepare message (embed or plain text)
    let msgContent = {};
    if (message.color) {
      msgContent = { embeds: [message] };
    } else {
      msgContent = { content: message };
    }

    // Send the log message
    logChannel.send(msgContent);
  },

  // Optional: function to set the log channel
  setLogChannel: async (guild, channel) => {
    await logChannelDB.set(`logchannel_${guild.id}`, channel.id);
    console.log(`Log channel set to ${channel.name} for guild ${guild.id}`);
  }
};
