global.sessions = global.sessions || {};
global.latestIp = global.latestIp || null;

export default async function handler(req, res) {
  const BOT_TOKEN = process.env.BOT_TOKEN;
  const CHAT_ID = process.env.CHAT_ID;

  // Deteksi IP HP user yang baru saja memicu halaman loading
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded ? forwarded.split(',')[0].trim() : req.socket.remoteAddress;

  // Daftarkan stopwatch 8 menit khusus untuk IP HP ini
  global.sessions[ip] = {
    mode: "waiting",
    timerStartedAt: Date.now()
  };
  global.latestIp = ip; // Kunci IP ini sebagai target perintah bot Telegram berikutnya

  // Pesan teks Telegram dengan informasi batas waktu 8 menit
  const pesan = `🔔 *ADA USER MASUK HALAMAN LOADING!*\n\n` +
                `🌐 *IP Perangkat:* \`${ip}\`\n` +
                `⏳ *Batas Waktu Konfirmasi:* 8 Menit\n` +
                `_Jika dalam 8 menit tidak ada respon, sistem otomatis mengunci halaman web dengan IP ini menjadi GAGAL._\n\n` +
                `💬 *Ketik manual kapan saja:*\n` +
                `- *kirim* (Sukseskan & Auto Download)\n` +
                `- *gagal* (Gagalkan/Kunci Loading)\n` +
                `- *stop* (Kembali ke halaman QRIS)`;

  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: pesan,
        parse_mode: "Markdown"
      })
    });
  } catch(err) {
    console.log("Gagal mengirim ke Telegram:", err);
  }

  res.status(200).json({ success: true });
}
