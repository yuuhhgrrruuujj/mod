const Keyv = require('keyv');

// Check that the environment variable exists
if (!process.env.DATABASE_URL) {
  console.error('Error: DATABASE_URL is not defined!');
  process.exit(1);
}

// Single Keyv instance for all stored data
const db = new Keyv(process.env.DATABASE_URL);

// Listen for Keyv errors
db.on('error', err => console.error('Keyv connection error:', err));

module.exports = {
  /**
   * Send a log message to the guild's log channel
   * @param {CommandInteraction} interaction - Discord interaction object
   * @param {string|MessageEmbed} message - Message string or embed to send
   */
  sendLog: async (interaction, message) => {
    try {
      // Fetch the log channel ID from the database
      const logChName = await db.get(`logchannel_${interaction.guild.id}`);

      // Find the channel in the guild
      const logChannel = interaction.guild.channels.cache.find(ch => ch.name === logChName);

      // Prepare message content
      let msgContent = {};
      if (message.color) msgContent = { embeds: [message] }; // It's an embed
      else msgContent = { content: message }; // Plain text

      // Reply to interaction
      await interaction.reply(msgContent).catch(() => null);

      // Send to log channel if exists
      if (logChannel) await logChannel.send(msgContent).catch(() => null);
    } catch (err) {
      console.error('Error in sendLog:', err);
    }
  },

  /**
   * Set or update the log channel for a guild
   * @param {Guild} guild - Discord Guild object
   * @param {string} channelName - Name of the log channel
   */
  setLogChannel: async (guild, channelName) => {
    try {
      await db.set(`logchannel_${guild.id}`, channelName);
      console.log(`Log channel for guild ${guild.name} set to ${channelName}`);
    } catch (err) {
      console.error('Error setting log channel:', err);
    }
  }
};
