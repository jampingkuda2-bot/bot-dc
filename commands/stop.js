const { SlashCommandBuilder } = require("discord.js");
const { successEmbed } = require("../utils/embeds");
const { ensureVoice } = require("../utils/checks");

module.exports = {
  data: new SlashCommandBuilder().setName("stop").setDescription("Hentikan musik dan kosongkan antrian"),

  async execute(interaction, client) {
    const check = await ensureVoice(interaction, client, true);
    if (!check.ok) return;
    const { player } = check;

    player.queue.tracks.splice(0, player.queue.tracks.length);
    await player.stopPlaying(true, false);
    await player.destroy();

    return interaction.reply({ embeds: [successEmbed("Musik dihentikan dan bot keluar dari voice channel.")] });
  },
};
