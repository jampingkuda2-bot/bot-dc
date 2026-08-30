const { SlashCommandBuilder } = require("discord.js");
const { successEmbed, errorEmbed } = require("../utils/embeds");
const { ensureVoice } = require("../utils/checks");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Atur volume musik (0-150)")
    .addIntegerOption((opt) =>
      opt.setName("level").setDescription("Level volume 0-150").setRequired(true).setMinValue(0).setMaxValue(150)
    ),

  async execute(interaction, client) {
    const check = await ensureVoice(interaction, client, true);
    if (!check.ok) return;
    const { player } = check;

    const level = interaction.options.getInteger("level");
    await player.setVolume(level);

    return interaction.reply({ embeds: [successEmbed(`Volume diatur ke **${level}%**.`)] });
  },
};
