export default async function handler(req, res) {
  const text = req.body.message?.text || "";
  
  // GANTI INI DENGAN URL VERCEL ANDA SENDIRI
  const statusApiUrl = `https://${req.headers.host}/api/status`; 
  // req.headers.host otomatis membaca domain vercel Anda.

  // PERINTAH: KIRIM
  if (text.toLowerCase() === "kirim") {
    await fetch(statusApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "paid" })
    });
  }

  // PERINTAH: STOP (Kembali ke QRIS)
  if (text.toLowerCase() === "stop") {
    await fetch(statusApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "waiting" })
    });
  }

  // PERINTAH: GAGAL (Membuat loading error)
  if (text.toLowerCase() === "gagal") {
    await fetch(statusApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "failed" })
    });
  }

  res.status(200).send("ok");
}

