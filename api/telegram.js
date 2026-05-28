export default async function handler(req, res) {
  const text = req.body.message?.text || "";
  
  // URL Vercel otomatis
  const statusApiUrl = `https://auto-payment-qris-6a4j.vercel.app/api/status`; 

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
