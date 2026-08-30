const { SlashCommandBuilder } = require("discord.js");
const { successEmbed, errorEmbed } = require("../utils/embeds");
const { ensureVoice } = require("../utils/checks");

module.exports = {
  data: new SlashCommandBuilder().setName("shuffle").setDescription("Acak urutan antrian"),

  async execute(interaction, client) {
    const check = await ensureVoice(interaction, client, true);
    if (!check.ok) return;
    const { player } = check;

    if (player.queue.tracks.length < 2) {
      return interaction.reply({ embeds: [errorEmbed("Antrian terlalu sedikit untuk diacak.")], ephemeral: true });
    }

    await player.queue.shuffle();
    return interaction.reply({ embeds: [successEmbed("Antrian berhasil diacak.")] });
  },
};
