export default async function handler(req, res) {
  const text = req.body.message?.text || "";
  
  // Alamat URL API status internal Anda
  const statusApiUrl = "https://ue8ehrrurhrurhrururu.vercel.app/api/status";

  // Perintah: KIRIM
  if (text.toLowerCase() === "kirim") {
    await fetch(statusApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "paid" })
    });
  }

  // Perintah: GAGAL
  if (text.toLowerCase() === "gagal") {
    await fetch(statusApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "failed" })
    });
  }

  // Perintah: STOP
  if (text.toLowerCase() === "stop") {
    await fetch(statusApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "waiting" })
    });
  }

  res.status(200).send("ok");
}
