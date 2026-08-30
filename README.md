# 🎵 Discord Music Bot + Lavalink (Termux)

Bot musik Discord fitur lengkap: play, skip, queue, loop, shuffle, volume, seek, filters (bassboost/nightcore/8D/dll), dan lainnya. Menggunakan `discord.js` v14 + `lavalink-client`, dijalankan bersama server Lavalink langsung di Termux (HP Android).

## 📁 Struktur Project

```
discord-music-bot/
├── commands/          # semua slash command
├── events/            # event handler discord.js & lavalink
├── utils/             # embed & helper
├── lavalink/
│   └── application.yml   # config server Lavalink
├── index.js           # entry point bot
├── deploy-commands.js  # daftarkan slash command ke Discord
├── config.js
├── .env.example
└── package.json
```

---

## BAGIAN 1 — Menjalankan Lavalink di Termux

Lavalink butuh **Java 17+** (Lavalink v4). Semua ini dijalankan di Termux, terpisah dari folder bot Node.js.

### 1. Install Termux dengan benar
Gunakan Termux dari **F-Droid** atau **GitHub releases** (bukan dari Play Store, karena versi Play Store sudah tidak di-update).

### 2. Update paket & install Java
```bash
pkg update -y && pkg upgrade -y
pkg install openjdk-17 wget -y
java -version
```
Pastikan muncul versi 17 ke atas.

### 3. Download Lavalink.jar
```bash
mkdir -p ~/lavalink && cd ~/lavalink
wget https://github.com/lavalink-devs/Lavalink/releases/download/4.0.8/Lavalink.jar
```
> Cek versi terbaru di https://github.com/lavalink-devs/Lavalink/releases — ganti angka versi di URL jika sudah rilis versi baru.

### 4. Taruh file konfigurasi
Salin file `lavalink/application.yml` dari project ini ke `~/lavalink/application.yml` (gunakan password sesuai keinginan, lalu samakan dengan `.env` bot nanti).

Bisa pakai `termux-setup-storage` lalu copy manual, atau `nano application.yml` dan tempel isinya langsung.

### 5. Jalankan Lavalink
```bash
cd ~/lavalink
java -jar Lavalink.jar
```
Jika berhasil, di log akan muncul `Lavalink is ready to accept connections.`

### 6. Supaya tidak mati saat layar HP terkunci
```bash
termux-wake-lock
```
Install juga **Termux:Boot** / aktifkan "Acquire wakelock" di notifikasi Termux, dan matikan battery optimization untuk Termux di pengaturan Android (Settings → Apps → Termux → Battery → Unrestricted).

### 7. Jalankan di background dengan `tmux` (disarankan)
```bash
pkg install tmux -y
tmux new -s lavalink
java -jar Lavalink.jar
# tekan Ctrl+B lalu D untuk detach (tetap jalan di background)
# untuk buka lagi: tmux attach -t lavalink
```

---

## BAGIAN 2 — Menjalankan Bot Discord

Bisa dijalankan di sesi Termux yang berbeda (`tmux new -s bot`), atau di HP/PC lain asal bisa konek ke IP Termux (untuk 1 device, `127.0.0.1` sudah cukup).

### 1. Install Node.js di Termux
```bash
pkg install nodejs-lts -y
node -v
```

### 2. Setup project bot
Salin/upload seluruh folder `discord-music-bot` ke Termux (misalnya via `termux-setup-storage` lalu copy dari folder Download), lalu:
```bash
cd discord-music-bot
npm install
cp .env.example .env
nano .env
```

Isi `.env`:
```env
DISCORD_TOKEN=token_bot_dari_discord_developer_portal
CLIENT_ID=application_id_bot
GUILD_ID=id_server_untuk_testing   # opsional, kosongkan untuk global
LAVALINK_HOST=127.0.0.1
LAVALINK_PORT=2333
LAVALINK_PASSWORD=youshallnotpass   # samakan dengan application.yml
LAVALINK_SECURE=false
```

> Buat bot & ambil token di https://discord.com/developers/applications → New Application → Bot → Reset Token. Aktifkan intent **Server Members** & **Message Content** di tab Bot.

### 3. Daftarkan slash command
```bash
npm run deploy
```

### 4. Jalankan bot
```bash
npm start
```

Jalankan di sesi `tmux` terpisah agar tetap hidup:
```bash
tmux new -s bot
npm start
# Ctrl+B lalu D untuk detach
```

---

## 🎛️ Daftar Command

| Command | Fungsi |
|---|---|
| `/play <lagu>` | Putar lagu (nama atau link YouTube/SoundCloud) |
| `/skip` | Lewati lagu |
| `/stop` | Hentikan & keluar voice channel |
| `/pause` / `/resume` | Jeda / lanjutkan |
| `/queue` | Lihat antrian (dengan tombol navigasi) |
| `/nowplaying` | Info lagu saat ini + progress bar |
| `/volume <0-150>` | Atur volume |
| `/loop <mode>` | Mati / lagu / antrian |
| `/shuffle` | Acak antrian |
| `/seek <mm:ss>` | Loncat ke posisi lagu |
| `/remove <posisi>` | Hapus lagu tertentu di antrian |
| `/clear` | Kosongkan antrian |
| `/join` / `/leave` | Kontrol manual voice channel |
| `/filters <efek>` | Bassboost, nightcore, vaporwave, 8D, karaoke |
| `/help` | Lihat semua command |

---

## ⚠️ Catatan Penting

- **Baterai & sinyal**: Menjalankan server 24/7 di HP kurang ideal untuk penggunaan jangka panjang (boros baterai, HP panas, dan mati jika restart/OS membunuh proses). Untuk pemakaian serius, pertimbangkan pindah ke VPS murah nanti — tapi untuk belajar/testing, Termux ini sudah cukup jalan.
- **YouTube sering berubah**: Google kerap mengubah signature/verifikasi YouTube sehingga plugin `youtube-plugin` di Lavalink perlu di-update berkala. Jika `/play` tiba-tiba gagal total, cek rilis terbaru plugin di https://github.com/lavalink-devs/youtube-source.
- **Versi library**: `lavalink-client` aktif dikembangkan, nama beberapa method filter (mis. `toggleNightcore`, `toggleKaraoke`) bisa berubah antar versi mayor — jika ada error "is not a function", cek dokumentasi versi yang terpasang: `npm view lavalink-client versions`.
- Jangan share `DISCORD_TOKEN` dan file `.env` ke siapa pun.

## 🔧 Troubleshooting Cepat

- **Bot online tapi `/play` tidak keluar suara** → cek Lavalink jalan (`java -jar Lavalink.jar` tidak error) dan `LAVALINK_PASSWORD` di `.env` sama persis dengan `application.yml`.
- **Slash command tidak muncul di Discord** → jalankan ulang `npm run deploy`, tunggu beberapa menit (global) atau instan (jika pakai `GUILD_ID`).
- **Lavalink error `Unsupported class file major version`** → Java yang terpasang terlalu lama, pastikan `pkg install openjdk-17`.
- **Proses mati sendiri saat HP dikunci** → aktifkan `termux-wake-lock` dan matikan battery optimization Termux.
