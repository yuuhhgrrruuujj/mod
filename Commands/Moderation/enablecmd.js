const { SlashCommandBuilder } = require('@discordjs/builders');
const Keyv = require('keyv');
const disabledcmds = new Keyv(process.env.disabledcmds);
const { sendLog } = require('../../Utils/sendLog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('enablecmd')
    .setDescription(`Enables a command from the server.`)
    .addStringOption(option =>
      option
        .setName('command')
        .setDescription(`The command that you want to enable`)
        .setRequired(true)
    ),
  requiredPerms: ['MANAGE_GUILD'],
  async execute(interaction) {
    const command = interaction.options.getString('command');
    const guildId = interaction.guild.id;

    // ✅ Get the stored list and default to an empty array if undefined
    let disabledCommands = await disabledcmds.get(guildId);
    if (!disabledCommands) disabledCommands = [];

    // ✅ If the command isn’t disabled, tell the user
    if (!disabledCommands.includes(command)) {
      return interaction.reply({
        content: `\`${command}\` is not disabled.`,
        ephemeral: true
      });
    }

    // ✅ Remove it from the array
    disabledCommands = disabledCommands.filter(cmd => cmd !== command);

    // ✅ Save the updated list
    await disabledcmds.set(guildId, disabledCommands);

    // ✅ Log the change
    await sendLog(interaction, `\`${command}\` has been enabled.`);

    // ✅ Confirm to user
    await interaction.reply({
      content: `\`${command}\` has been successfully enabled.`,
      ephemeral: true
    });
  }
};
