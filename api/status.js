// Memori sementara untuk memisahkan HP satu dengan HP lainnya berdasarkan IP
global.sessions = global.sessions || {};
global.latestIp = global.latestIp || null;

export default async function handler(req, res) {
  const forwarded = req.headers['x-forwarded-for'];
  const currentIp = forwarded ? forwarded.split(',')[0].trim() : req.socket.remoteAddress;

  // --- 1. JALUR MACRODROID DAN BOT TELEGRAM (POST) ---
  // Ketika MacroDroid atau Bot Telegram mengirim perintah "paid" / "gagal"
  if (req.method === "POST") {
    const mode = req.body.mode;
    
    // Sistem pintar: Akan otomatis menargetkan IP HP pembeli yang TERAKHIR KALI masuk halaman loading
    const targetIp = global.latestIp; 
    
    if (targetIp && global.sessions[targetIp]) {
      global.sessions[targetIp].mode = mode; // Mengubah status di HP pembeli
      
      // Matikan stopwatch 8 menit karena transaksi sudah direspon (sukses/gagal)
      if (mode === "paid" || mode === "failed" || mode === "waiting") {
        global.sessions[targetIp].timerStartedAt = 0;
      }
    }
    return res.status(200).json({ success: true });
  }

  // --- 2. JALUR HALAMAN WEB (GET) ---
  // Memisahkan sesi agar HP lain yang baru buka web tetap melihat QRIS
  if (!global.sessions[currentIp]) {
    global.sessions[currentIp] = { mode: "waiting", timerStartedAt: 0 };
  }

  let userSession = global.sessions[currentIp];

  // LOGIKA TIMEOUT 8 MENIT (480.000 milidetik)
  if (userSession.mode === "waiting" && userSession.timerStartedAt > 0) {
    const timeElapsed = Date.now() - userSession.timerStartedAt;
    
    if (timeElapsed > 480000) { 
      userSession.mode = "failed"; // Paksa Gagal
      userSession.timerStartedAt = 0; // Matikan stopwatch
    }
  }

  // Mengirim hasil ke frontend
  res.status(200).json({
    mode: userSession.mode,
    downloadUrl: "https://s.id/KKrSq"
  });
}
