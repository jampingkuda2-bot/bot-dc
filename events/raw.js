module.exports = {
  name: "raw",
  execute(d, client) {
    // Meneruskan raw gateway event (voice state/server update) ke lavalink-client
    client.lavalink.sendRawData(d);
  },
};
