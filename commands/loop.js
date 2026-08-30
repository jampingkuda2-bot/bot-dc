const { SlashCommandBuilder } = require("discord.js");
const { successEmbed } = require("../utils/embeds");
const { ensureVoice } = require("../utils/checks");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("loop")
    .setDescription("Atur mode pengulangan")
    .addStringOption((opt) =>
      opt
        .setName("mode")
        .setDescription("Mode loop")
        .setRequired(true)
        .addChoices(
          { name: "Mati", value: "off" },
          { name: "Lagu saat ini", value: "track" },
          { name: "Seluruh antrian", value: "queue" }
        )
    ),

  async execute(interaction, client) {
    const check = await ensureVoice(interaction, client, true);
    if (!check.ok) return;
    const { player } = check;

    const mode = interaction.options.getString("mode");
    await player.setRepeatMode(mode);

    const label = mode === "off" ? "dimatikan" : mode === "track" ? "lagu saat ini" : "seluruh antrian";
    return interaction.reply({ embeds: [successEmbed(`Mode loop diatur ke **${label}**.`)] });
  },
};
