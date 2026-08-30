const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { queueEmbed, errorEmbed } = require("../utils/embeds");

module.exports = {
  data: new SlashCommandBuilder().setName("queue").setDescription("Lihat antrian lagu saat ini"),

  async execute(interaction, client) {
    const player = client.lavalink.getPlayer(interaction.guildId);
    if (!player || (!player.queue.current && player.queue.tracks.length === 0)) {
      return interaction.reply({ embeds: [errorEmbed("Antrian kosong.")], ephemeral: true });
    }

    let page = 1;
    const perPage = 10;
    const totalPages = Math.max(Math.ceil(player.queue.tracks.length / perPage), 1);

    const buildRow = (curPage) =>
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("queue_prev")
          .setLabel("◀")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(curPage <= 1),
        new ButtonBuilder()
          .setCustomId("queue_next")
          .setLabel("▶")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(curPage >= totalPages)
      );

    const msg = await interaction.reply({
      embeds: [queueEmbed(player, page, perPage)],
      components: totalPages > 1 ? [buildRow(page)] : [],
      fetchReply: true,
    });

    if (totalPages <= 1) return;

    const collector = msg.createMessageComponentCollector({ time: 60_000 });

    collector.on("collect", async (btnInt) => {
      if (btnInt.user.id !== interaction.user.id) {
        return btnInt.reply({ content: "Hanya yang menjalankan command ini yang bisa mengganti halaman.", ephemeral: true });
      }
      if (btnInt.customId === "queue_prev") page--;
      if (btnInt.customId === "queue_next") page++;

      await btnInt.update({
        embeds: [queueEmbed(player, page, perPage)],
        components: [buildRow(page)],
      });
    });

    collector.on("end", async () => {
      try {
        await msg.edit({ components: [] });
      } catch {}
    });
  },
};
