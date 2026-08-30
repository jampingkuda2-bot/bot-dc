const { SlashCommandBuilder } = require("discord.js");
const { successEmbed, errorEmbed } = require("../utils/embeds");
const { ensureVoice } = require("../utils/checks");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remove")
    .setDescription("Hapus lagu tertentu dari antrian")
    .addIntegerOption((opt) =>
      opt.setName("posisi").setDescription("Nomor lagu di antrian (lihat /queue)").setRequired(true).setMinValue(1)
    ),

  async execute(interaction, client) {
    const check = await ensureVoice(interaction, client, true);
    if (!check.ok) return;
    const { player } = check;

    const pos = interaction.options.getInteger("posisi");
    if (pos > player.queue.tracks.length) {
      return interaction.reply({ embeds: [errorEmbed("Nomor tidak ditemukan di antrian.")], ephemeral: true });
    }

    const [removed] = player.queue.tracks.splice(pos - 1, 1);

    return interaction.reply({ embeds: [successEmbed(`Menghapus **${removed.info.title}** dari antrian.`)] });
  },
};
