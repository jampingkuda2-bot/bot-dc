const { SlashCommandBuilder } = require("discord.js");
const { successEmbed } = require("../utils/embeds");
const { ensureVoice } = require("../utils/checks");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("filters")
    .setDescription("Terapkan efek audio")
    .addStringOption((opt) =>
      opt
        .setName("efek")
        .setDescription("Pilih efek audio")
        .setRequired(true)
        .addChoices(
          { name: "Normal (matikan semua efek)", value: "clear" },
          { name: "Bassboost", value: "bassboost" },
          { name: "Nightcore", value: "nightcore" },
          { name: "Vaporwave", value: "vaporwave" },
          { name: "8D Audio", value: "eightD" },
          { name: "Karaoke (kurangi vokal)", value: "karaoke" }
        )
    ),

  async execute(interaction, client) {
    const check = await ensureVoice(interaction, client, true);
    if (!check.ok) return;
    const { player } = check;

    await interaction.deferReply();

    switch (interaction.options.getString("efek")) {
      case "clear":
        await player.filterManager.resetFilters();
        break;
      case "bassboost":
        await player.filterManager.toggleEqualizer("bassboost");
        break;
      case "nightcore":
        await player.filterManager.toggleNightcore();
        break;
      case "vaporwave":
        await player.filterManager.toggleVaporwave();
        break;
      case "eightD":
        await player.filterManager.toggleRotation();
        break;
      case "karaoke":
        await player.filterManager.toggleKaraoke();
        break;
    }

    return interaction.editReply({ embeds: [successEmbed(`Efek **${interaction.options.getString("efek")}** diterapkan.`)] });
  },
};
