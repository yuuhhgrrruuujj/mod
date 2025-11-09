const db = require('./db');

module.exports = {
  db, // export db so other modules can use it

  sendLog: async (interaction, message) => {
    try {
      const logChName = await db.get(`logchannel_${interaction.guild.id}`);
      const logChannel = interaction.guild.channels.cache.find(ch => ch.name === logChName);

      const msgContent = message.color ? { embeds: [message] } : { content: message };

      await interaction.reply(msgContent).catch(() => null);
      if (logChannel) await logChannel.send(msgContent).catch(() => null);
    } catch (err) {
      console.error('Error in sendLog:', err);
    }
  },

  setLogChannel: async (guild, channelName) => {
    try {
      await db.set(`logchannel_${guild.id}`, channelName);
      console.log(`Log channel for guild ${guild.name} set to ${channelName}`);
    } catch (err) {
      console.error('Error setting log channel:', err);
    }
  }
};
