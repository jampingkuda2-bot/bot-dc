const { errorEmbed } = require("./embeds");

/**
 * Memastikan user berada di voice channel, dan jika bot sudah ada player,
 * user harus berada di voice channel yang sama.
 * Mengembalikan { ok: true, voiceChannel } atau { ok: false } (sudah reply error).
 */
async function ensureVoice(interaction, client, requirePlaying = false) {
  const member = interaction.member;
  const voiceChannel = member.voice?.channel;

  if (!voiceChannel) {
    await interaction.reply({ embeds: [errorEmbed("Kamu harus join voice channel dulu!")], ephemeral: true });
    return { ok: false };
  }

  const player = client.lavalink.getPlayer(interaction.guildId);

  if (requirePlaying && (!player || !player.queue.current)) {
    await interaction.reply({ embeds: [errorEmbed("Tidak ada lagu yang sedang diputar.")], ephemeral: true });
    return { ok: false };
  }

  if (player && player.voiceChannelId && player.voiceChannelId !== voiceChannel.id) {
    await interaction.reply({
      embeds: [errorEmbed("Kamu harus berada di voice channel yang sama dengan bot!")],
      ephemeral: true,
    });
    return { ok: false };
  }

  return { ok: true, voiceChannel, player };
}

module.exports = { ensureVoice };
