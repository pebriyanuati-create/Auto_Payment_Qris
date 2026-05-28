// Memori sementara berbasis IP Address agar antar HP tidak saling bentrok
global.sessions = global.sessions || {};
global.latestIp = global.latestIp || null;

export default async function handler(req, res) {
  // Mendeteksi IP asli dari HP yang sedang mengakses web
  const forwarded = req.headers['x-forwarded-for'];
  const currentIp = forwarded ? forwarded.split(',')[0].trim() : req.socket.remoteAddress;

  // --- 1. JIKA ADA PERINTAH MASUK (POST dari telegram.js atau internal) ---
  if (req.method === "POST") {
    const mode = req.body.mode;
    const targetIp = global.latestIp; // Ambil IP HP terakhir yang sedang aktif transaksi
    
    if (targetIp && global.sessions[targetIp]) {
      global.sessions[targetIp].mode = mode;
      
      // Jika admin merespon (kirim/gagal/stop), matikan stopwatch otomatisnya
      if (mode === "paid" || mode === "failed" || mode === "waiting") {
        global.sessions[targetIp].timerStartedAt = 0;
      }
    }
    return res.status(200).json({ success: true });
  }

  // --- 2. JIKA WEB MELAKUKAN CEK STATUS BERKALA (GET dari index.html) ---
  
  // Jika IP HP ini belum terdaftar di memori sistem, buatkan sesi baru (default: waiting)
  if (!global.sessions[currentIp]) {
    global.sessions[currentIp] = { mode: "waiting", timerStartedAt: 0 };
  }

  let userSession = global.sessions[currentIp];

  // LOGIKA TIMEOUT 8 MENIT (8 menit = 8 * 60 * 1000 = 480000 milidetik)
  if (userSession.mode === "waiting" && userSession.timerStartedAt > 0) {
    const timeElapsed = Date.now() - userSession.timerStartedAt;
    
    if (timeElapsed > 480000) { 
      userSession.mode = "failed"; // Paksa status menjadi gagal khusus untuk IP HP ini
      userSession.timerStartedAt = 0; // Matikan stopwatch
    }
  }

  // Kirim status spesifik milik IP HP ini ke frontend HTML Anda
  res.status(200).json({
    mode: userSession.mode,
    downloadUrl: "https://download-file-video.edgeone.app/"
  });
}
