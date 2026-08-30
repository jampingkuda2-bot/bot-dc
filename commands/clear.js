const { SlashCommandBuilder } = require("discord.js");
const { successEmbed, errorEmbed } = require("../utils/embeds");
const { ensureVoice } = require("../utils/checks");

module.exports = {
  data: new SlashCommandBuilder().setName("clear").setDescription("Kosongkan antrian (lagu yang sedang diputar tidak dihentikan)"),

  async execute(interaction, client) {
    const check = await ensureVoice(interaction, client, true);
    if (!check.ok) return;
    const { player } = check;

    if (player.queue.tracks.length === 0) {
      return interaction.reply({ embeds: [errorEmbed("Antrian sudah kosong.")], ephemeral: true });
    }

    const count = player.queue.tracks.length;
    player.queue.tracks.splice(0, count);

    return interaction.reply({ embeds: [successEmbed(`Menghapus ${count} lagu dari antrian.`)] });
  },
};
