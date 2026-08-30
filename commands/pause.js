const { SlashCommandBuilder } = require("discord.js");
const { successEmbed, errorEmbed } = require("../utils/embeds");
const { ensureVoice } = require("../utils/checks");

module.exports = {
  data: new SlashCommandBuilder().setName("pause").setDescription("Jeda lagu yang sedang diputar"),

  async execute(interaction, client) {
    const check = await ensureVoice(interaction, client, true);
    if (!check.ok) return;
    const { player } = check;

    if (player.paused) {
      return interaction.reply({ embeds: [errorEmbed("Lagu sudah dijeda.")], ephemeral: true });
    }

    await player.pause();
    return interaction.reply({ embeds: [successEmbed("Lagu dijeda. Gunakan `/resume` untuk melanjutkan.")] });
  },
};
