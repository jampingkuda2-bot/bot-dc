const { EmbedBuilder } = require("discord.js");
const config = require("../config");

function baseEmbed() {
  return new EmbedBuilder().setColor(config.colors.main);
}

function successEmbed(desc) {
  return baseEmbed().setColor(config.colors.success).setDescription(`✅ ${desc}`);
}

function errorEmbed(desc) {
  return baseEmbed().setColor(config.colors.error).setDescription(`❌ ${desc}`);
}

function formatDuration(ms) {
  if (!ms || ms <= 0 || !isFinite(ms)) return "LIVE";
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

function progressBar(current, total, size = 18) {
  if (!total || !isFinite(total)) return "🔴 LIVE";
  const ratio = Math.min(Math.max(current / total, 0), 1);
  const filledLength = Math.round(size * ratio);
  const bar = "▬".repeat(filledLength) + "🔘" + "▬".repeat(Math.max(size - filledLength, 0));
  return bar;
}

function nowPlayingEmbed(player, track) {
  const info = track.info;
  const embed = baseEmbed()
    .setTitle("🎶 Sedang Diputar")
    .setDescription(`**[${info.title}](${info.uri})**`)
    .addFields(
      { name: "Artis", value: info.author || "Tidak diketahui", inline: true },
      { name: "Durasi", value: formatDuration(info.duration), inline: true },
      { name: "Diminta oleh", value: `<@${track.requester?.id || track.requester}>`, inline: true },
      { name: "Progress", value: `${progressBar(player.position, info.duration)} \`${formatDuration(player.position)} / ${formatDuration(info.duration)}\`` },
      { name: "Volume", value: `${player.volume}%`, inline: true },
      { name: "Loop", value: player.repeatMode === "off" ? "Mati" : player.repeatMode === "track" ? "Lagu" : "Antrian", inline: true }
    );
  if (info.artworkUrl) embed.setThumbnail(info.artworkUrl);
  return embed;
}

function queueEmbed(player, page = 1, perPage = 10) {
  const tracks = player.queue.tracks;
  const start = (page - 1) * perPage;
  const pageTracks = tracks.slice(start, start + perPage);
  const current = player.queue.current;

  let desc = current
    ? `**Sedang diputar:**\n[${current.info.title}](${current.info.uri}) - \`${formatDuration(current.info.duration)}\`\n\n`
    : "Tidak ada lagu yang sedang diputar.\n\n";

  if (pageTracks.length === 0) {
    desc += "Antrian kosong.";
  } else {
    desc += pageTracks
      .map((t, i) => `**${start + i + 1}.** [${t.info.title}](${t.info.uri}) - \`${formatDuration(t.info.duration)}\``)
      .join("\n");
  }

  const totalPages = Math.max(Math.ceil(tracks.length / perPage), 1);
  return baseEmbed()
    .setTitle("📜 Antrian Lagu")
    .setDescription(desc)
    .setFooter({ text: `Halaman ${page}/${totalPages} • Total ${tracks.length} lagu` });
}

module.exports = {
  baseEmbed,
  successEmbed,
  errorEmbed,
  nowPlayingEmbed,
  queueEmbed,
  formatDuration,
  progressBar,
};
