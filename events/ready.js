module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    console.log(`✅ Login sebagai ${client.user.tag}`);
    client.user.setActivity("/play | Musik Bot");

    // Inisialisasi koneksi ke node Lavalink setelah bot siap
    client.lavalink.init({ id: client.user.id, username: client.user.username });
  },
};
