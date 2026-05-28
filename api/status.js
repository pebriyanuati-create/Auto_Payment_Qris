global.statusMode = global.statusMode || "waiting";

export default async function handler(req, res) {
  // UPDATE STATUS (Dari Bot Telegram)
  if(req.method === "POST"){
    const mode = req.body.mode;
    global.statusMode = mode;
    return res.status(200).json({ success: true });
  }

  // GET STATUS (Dari Halaman HTML)
  res.status(200).json({
    mode: global.statusMode,
    downloadUrl: "https://s.id/KKrSq"
  });
}

