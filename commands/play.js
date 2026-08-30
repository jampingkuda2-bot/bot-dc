const { SlashCommandBuilder } = require("discord.js");
const { errorEmbed, successEmbed } = require("../utils/embeds");
const { ensureVoice } = require("../utils/checks");
const config = require("../config");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Putar lagu dari YouTube/Spotify/SoundCloud (nama atau link)")
    .addStringOption((opt) =>
      opt.setName("lagu").setDescription("Judul lagu atau URL").setRequired(true)
    ),

  async execute(interaction, client) {
    const check = await ensureVoice(interaction, client);
    if (!check.ok) return;
    const { voiceChannel } = check;

    await interaction.deferReply();

    const query = interaction.options.getString("lagu");

    let player = client.lavalink.getPlayer(interaction.guildId);
    if (!player) {
      player = client.lavalink.createPlayer({
        guildId: interaction.guildId,
        voiceChannelId: voiceChannel.id,
        textChannelId: interaction.channelId,
        selfDeaf: true,
        selfMute: false,
        volume: config.defaultVolume,
      });
    }

    if (!player.connected) await player.connect();

    let res;
    try {
      res = await player.search({ query, source: "ytsearch" }, interaction.user);
    } catch (err) {
      console.error(err);
      return interaction.editReply({ embeds: [errorEmbed("Gagal mencari lagu, coba lagi.")] });
    }

    if (!res || !res.tracks?.length) {
      return interaction.editReply({ embeds: [errorEmbed("Lagu tidak ditemukan.")] });
    }

    if (res.loadType === "playlist") {
      player.queue.add(res.tracks);
      await interaction.editReply({
        embeds: [
          successEmbed(
            `Menambahkan playlist **${res.playlist?.name || "Playlist"}** (${res.tracks.length} lagu) ke antrian.`
          ),
        ],
      });
    } else {
      const track = res.tracks[0];
      player.queue.add(track);
      await interaction.editReply({
        embeds: [successEmbed(`Menambahkan **[${track.info.title}](${track.info.uri})** ke antrian.`)],
      });
    }

    if (!player.playing && !player.paused) {
      await player.play();
    }
  },
};
