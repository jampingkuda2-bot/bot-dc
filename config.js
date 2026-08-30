require("dotenv").config();

module.exports = {
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID || null,
  defaultVolume: parseInt(process.env.DEFAULT_VOLUME || "80", 10),
  lavalink: {
    host: process.env.LAVALINK_HOST || "127.0.0.1",
    port: parseInt(process.env.LAVALINK_PORT || "2333", 10),
    password: process.env.LAVALINK_PASSWORD || "youshallnotpass",
    secure: process.env.LAVALINK_SECURE === "true",
  },
  colors: {
    main: 0x2f3136,
    success: 0x57f287,
    error: 0xed4245,
  },
};
