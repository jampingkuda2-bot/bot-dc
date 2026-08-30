const { SlashCommandBuilder } = require("discord.js");
const { successEmbed, errorEmbed } = require("../utils/embeds");
const { ensureVoice } = require("../utils/checks");

module.exports = {
  data: new SlashCommandBuilder().setName("resume").setDescription("Lanjutkan lagu yang dijeda"),

  async execute(interaction, client) {
    const check = await ensureVoice(interaction, client, true);
    if (!check.ok) return;
    const { player } = check;

    if (!player.paused) {
      return interaction.reply({ embeds: [errorEmbed("Lagu tidak sedang dijeda.")], ephemeral: true });
    }

    await player.resume();
    return interaction.reply({ embeds: [successEmbed("Lagu dilanjutkan.")] });
  },
};
