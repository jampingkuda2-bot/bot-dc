const { SlashCommandBuilder } = require("discord.js");
const { successEmbed, errorEmbed } = require("../utils/embeds");
const { ensureVoice } = require("../utils/checks");

function parseTimeToMs(str) {
  // support format mm:ss or ss
  const parts = str.split(":").map((p) => parseInt(p, 10));
  if (parts.some(isNaN)) return null;
  if (parts.length === 1) return parts[0] * 1000;
  if (parts.length === 2) return (parts[0] * 60 + parts[1]) * 1000;
  if (parts.length === 3) return (parts[0] * 3600 + parts[1] * 60 + parts[2]) * 1000;
  return null;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("seek")
    .setDescription("Loncat ke posisi tertentu dalam lagu")
    .addStringOption((opt) =>
      opt.setName("waktu").setDescription("Format mm:ss atau detik, contoh: 1:30").setRequired(true)
    ),

  async execute(interaction, client) {
    const check = await ensureVoice(interaction, client, true);
    if (!check.ok) return;
    const { player } = check;

    const track = player.queue.current;
    if (!track?.info?.isSeekable) {
      return interaction.reply({ embeds: [errorEmbed("Lagu ini tidak bisa di-seek (mis. live stream).")], ephemeral: true });
    }

    const ms = parseTimeToMs(interaction.options.getString("waktu"));
    if (ms === null || ms < 0) {
      return interaction.reply({ embeds: [errorEmbed("Format waktu tidak valid. Gunakan mm:ss.")], ephemeral: true });
    }

    await player.seek(ms);
    return interaction.reply({ embeds: [successEmbed(`Loncat ke posisi **${interaction.options.getString("waktu")}**.`)] });
  },
};
