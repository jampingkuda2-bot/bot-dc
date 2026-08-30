const { nowPlayingEmbed, errorEmbed, baseEmbed } = require("../utils/embeds");

function registerLavalinkEvents(client) {
  const manager = client.lavalink;

  manager.nodeManager.on("connect", (node) => {
    console.log(`🔗 Terhubung ke node Lavalink "${node.id}"`);
  });

  manager.nodeManager.on("error", (node, error) => {
    console.error(`❌ Error pada node Lavalink "${node.id}":`, error?.message || error);
  });

  manager.nodeManager.on("disconnect", (node, reason) => {
    console.warn(`⚠️ Terputus dari node Lavalink "${node.id}":`, reason?.reason || reason);
  });

  manager.on("trackStart", async (player, track) => {
    const channel = client.channels.cache.get(player.textChannelId);
    if (!channel) return;
    try {
      await channel.send({ embeds: [nowPlayingEmbed(player, track)] });
    } catch (err) {
      console.error("Gagal mengirim pesan trackStart:", err.message);
    }
  });

  manager.on("queueEnd", async (player) => {
    const channel = client.channels.cache.get(player.textChannelId);
    if (channel) {
      channel.send({ embeds: [baseEmbed().setDescription("🏁 Antrian selesai. Menunggu lagu berikutnya...")] }).catch(() => {});
    }

    // Auto-leave setelah beberapa saat jika tidak ada lagu baru
    setTimeout(async () => {
      const stillPlayer = client.lavalink.getPlayer(player.guildId);
      if (stillPlayer && !stillPlayer.playing && !stillPlayer.paused && stillPlayer.queue.tracks.length === 0) {
        await stillPlayer.destroy().catch(() => {});
        if (channel) channel.send({ embeds: [baseEmbed().setDescription("👋 Keluar voice channel karena tidak ada aktivitas.")] }).catch(() => {});
      }
    }, 60_000);
  });

  manager.on("playerDisconnect", (player) => {
    console.log(`Player di guild ${player.guildId} terputus dari voice channel.`);
  });

  manager.on("trackError", async (player, track, payload) => {
    console.error("Track error:", payload);
    const channel = client.channels.cache.get(player.textChannelId);
    if (channel) {
      channel.send({ embeds: [errorEmbed(`Gagal memutar **${track?.info?.title || "lagu"}**, melewati ke lagu berikutnya.`)] }).catch(() => {});
    }
  });

  manager.on("trackStuck", async (player, track) => {
    console.warn("Track stuck:", track?.info?.title);
    await player.skip().catch(() => {});
  });
}

module.exports = { registerLavalinkEvents };
