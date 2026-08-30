const { REST, Routes } = require("discord.js");
const fs = require("fs");
const path = require("path");
const config = require("./config");

const commands = [];
const commandsPath = path.join(__dirname, "commands");
for (const file of fs.readdirSync(commandsPath).filter((f) => f.endsWith(".js"))) {
  const command = require(path.join(commandsPath, file));
  if (command?.data) commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(config.token);

(async () => {
  try {
    console.log(`🚀 Mendaftarkan ${commands.length} slash command...`);

    if (config.guildId) {
      // Deploy ke 1 server saja -> update instan, cocok untuk testing
      await rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), { body: commands });
      console.log(`✅ Command berhasil didaftarkan ke guild ${config.guildId} (instan).`);
    } else {
      // Deploy global -> bisa butuh waktu hingga 1 jam untuk propagasi
      await rest.put(Routes.applicationCommands(config.clientId), { body: commands });
      console.log("✅ Command berhasil didaftarkan secara global (bisa butuh ~1 jam muncul).");
    }
  } catch (err) {
    console.error("❌ Gagal mendaftarkan command:", err);
  }
})();
