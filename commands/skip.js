const { SlashCommandBuilder } = require("discord.js");
const { successEmbed, errorEmbed } = require("../utils/embeds");
const { ensureVoice } = require("../utils/checks");

module.exports = {
  data: new SlashCommandBuilder().setName("skip").setDescription("Lewati lagu yang sedang diputar"),

  async execute(interaction, client) {
    const check = await ensureVoice(interaction, client, true);
    if (!check.ok) return;
    const { player } = check;

    const skipped = player.queue.current;
    await player.skip();
    return interaction.reply({
      embeds: [successEmbed(`Melewati **${skipped?.info?.title || "lagu ini"}**.`)],
    });
  },
};
