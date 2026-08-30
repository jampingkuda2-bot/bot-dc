const { SlashCommandBuilder } = require("discord.js");
const { nowPlayingEmbed, errorEmbed } = require("../utils/embeds");

module.exports = {
  data: new SlashCommandBuilder().setName("nowplaying").setDescription("Lihat lagu yang sedang diputar"),

  async execute(interaction, client) {
    const player = client.lavalink.getPlayer(interaction.guildId);
    if (!player || !player.queue.current) {
      return interaction.reply({ embeds: [errorEmbed("Tidak ada lagu yang sedang diputar.")], ephemeral: true });
    }

    return interaction.reply({ embeds: [nowPlayingEmbed(player, player.queue.current)] });
  },
};
