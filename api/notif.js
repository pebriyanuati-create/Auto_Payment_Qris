export default async function handler(req, res) {
  const BOT_TOKEN = process.env.BOT_TOKEN;
  const CHAT_ID = process.env.CHAT_ID;

  // Tangkap data dari frontend
  const name = req.body?.name || "User Misterius";
  const device = req.body?.device || "Device tidak diketahui";

  const pesan = `🔔 *Ada User Kembali!*\n\n👤 Nama: ${name}\n📱 Device: ${device}\n\nUser sedang di halaman loading.`;

  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: pesan,
      parse_mode: "Markdown" // Agar teks bisa di-bold
    })
  });

  res.status(200).json({ success: true });
}

