const { SlashCommandBuilder } = require("discord.js");
const { baseEmbed } = require("../utils/embeds");

module.exports = {
  data: new SlashCommandBuilder().setName("help").setDescription("Lihat semua command musik yang tersedia"),

  async execute(interaction) {
    const embed = baseEmbed()
      .setTitle("🎵 Daftar Command Musik")
      .addFields(
        { name: "/play <lagu>", value: "Putar lagu dari nama atau link (YouTube/Spotify/SoundCloud)" },
        { name: "/skip", value: "Lewati lagu saat ini" },
        { name: "/stop", value: "Hentikan musik & keluar voice channel" },
        { name: "/pause", value: "Jeda lagu" },
        { name: "/resume", value: "Lanjutkan lagu" },
        { name: "/queue", value: "Lihat antrian lagu" },
        { name: "/nowplaying", value: "Lihat lagu yang sedang diputar" },
        { name: "/volume <0-150>", value: "Atur volume" },
        { name: "/loop <mode>", value: "Atur pengulangan (mati/lagu/antrian)" },
        { name: "/shuffle", value: "Acak antrian" },
        { name: "/seek <mm:ss>", value: "Loncat ke posisi tertentu" },
        { name: "/remove <posisi>", value: "Hapus lagu tertentu dari antrian" },
        { name: "/clear", value: "Kosongkan antrian" },
        { name: "/join", value: "Panggil bot ke voice channel" },
        { name: "/leave", value: "Keluarkan bot dari voice channel" },
        { name: "/filters <efek>", value: "Terapkan efek audio (bassboost, nightcore, dll)" }
      )
      .setFooter({ text: "Musik Bot • Powered by Lavalink" });

    return interaction.reply({ embeds: [embed] });
  },
};
