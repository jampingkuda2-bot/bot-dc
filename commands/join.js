const { SlashCommandBuilder } = require("discord.js");
const { successEmbed, errorEmbed } = require("../utils/embeds");
const config = require("../config");

module.exports = {
  data: new SlashCommandBuilder().setName("join").setDescription("Panggil bot ke voice channel kamu"),

  async execute(interaction, client) {
    const voiceChannel = interaction.member.voice?.channel;
    if (!voiceChannel) {
      return interaction.reply({ embeds: [errorEmbed("Kamu harus join voice channel dulu!")], ephemeral: true });
    }

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

    return interaction.reply({ embeds: [successEmbed(`Bergabung ke **${voiceChannel.name}**.`)] });
  },
};
