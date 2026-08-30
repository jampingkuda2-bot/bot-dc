const { Client, GatewayIntentBits, Partials } = require("discord.js");
const { LavalinkManager } = require("lavalink-client");
const fs = require("fs");
const path = require("path");

const config = require("./config");
const { loadCommands } = require("./utils/loadCommands");
const { registerLavalinkEvents } = require("./events/lavalinkEvents");

if (!config.token || !config.clientId) {
  console.error("❌ DISCORD_TOKEN dan CLIENT_ID wajib diisi di file .env");
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

// --- Setup Lavalink Manager ---
client.lavalink = new LavalinkManager({
  nodes: [
    {
      id: "main",
      host: config.lavalink.host,
      port: config.lavalink.port,
      authorization: config.lavalink.password,
      secure: config.lavalink.secure,
    },
  ],
  sendToShard: (guildId, payload) => client.guilds.cache.get(guildId)?.shard?.send(payload),
  client: {
    id: config.clientId,
    username: "MusicBot",
  },
  autoSkip: true,
  playerOptions: {
    defaultSearchPlatform: "ytsearch",
    volumeDecrementer: 0.75,
    onDisconnect: { autoReconnect: true, destroyPlayer: false },
    onEmptyQueue: { destroyAfterMs: 60_000 },
  },
});

registerLavalinkEvents(client);

// --- Load slash commands ---
loadCommands(client);

// --- Meneruskan raw gateway event ke Lavalink (voice state/server update) ---
client.on("raw", (d) => {
  if (client.lavalink) client.lavalink.sendRawData(d);
});

// --- Load event handlers (kecuali raw.js dan lavalinkEvents.js yang sudah ditangani manual) ---
const eventsPath = path.join(__dirname, "events");
const skipFiles = ["raw.js", "lavalinkEvents.js"];
for (const file of fs.readdirSync(eventsPath).filter((f) => f.endsWith(".js") && !skipFiles.includes(f))) {
  const event = require(path.join(eventsPath, file));
  if (!event.name || !event.execute) continue;
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

client.login(config.token);
