const { SlashCommandBuilder } = require("discord.js");
const { successEmbed, errorEmbed } = require("../utils/embeds");

module.exports = {
  data: new SlashCommandBuilder().setName("leave").setDescription("Keluarkan bot dari voice channel"),

  async execute(interaction, client) {
    const player = client.lavalink.getPlayer(interaction.guildId);
    if (!player) {
      return interaction.reply({ embeds: [errorEmbed("Bot tidak sedang berada di voice channel.")], ephemeral: true });
    }

    await player.destroy();
    return interaction.reply({ embeds: [successEmbed("Bot keluar dari voice channel.")] });
  },
};
