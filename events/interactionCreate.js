const { errorEmbed } = require("../utils/embeds");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction, client);
    } catch (err) {
      console.error(`Error menjalankan command ${interaction.commandName}:`, err);
      const payload = { embeds: [errorEmbed("Terjadi kesalahan saat menjalankan command ini.")], ephemeral: true };
      if (interaction.replied || interaction.deferred) {
        await interaction.editReply(payload).catch(() => {});
      } else {
        await interaction.reply(payload).catch(() => {});
      }
    }
  },
};
