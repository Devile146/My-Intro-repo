// api/track.js
export default async function handler(req, res) {
    // CORS headers for security
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        // ============================================
        // 🔻 IMPORTANT: YAHAN APNA BOT TOKEN LAGAYEIN 🔻
        // ============================================
        const BOT_TOKEN = "7754677986:AAGjnglM6d3RoTCDrbKHfXD_VazEZOQpfkA";     // @BotFather se milega
        const CHAT_ID = "4530245203612";         // @userinfobot se milega
        // ============================================
        
        // Vercel automatically provides these headers [citation:3][citation:7][citation:8]
        // Ye external API ke bina direct Vercel se milta hai - 100% reliable!
        const clientIP = req.headers['x-forwarded-for']?.split(',')[0].trim() 
                      || req.headers['x-real-ip'] 
                      || 'Unknown';
        
        const country = req.headers['x-vercel-ip-country'] || 'Unknown';
        const city = req.headers['x-vercel-ip-city'] || 'Unknown';
        const region = req.headers['x-vercel-ip-country-region'] || 'Unknown';
        
        // Device info from frontend
        const { userAgent, screenSize, language, timezone, timestamp } = req.body;
        
        // Parse User-Agent
        let device = 'Unknown', os = 'Unknown', browser = 'Unknown';
        if (/iPhone|iPad|iPod/i.test(userAgent)) device = 'Apple iOS';
        else if (/Android/i.test(userAgent)) device = 'Android';
        else if (/Windows/i.test(userAgent)) device = 'Windows';
        else if (/Mac/i.test(userAgent)) device = 'Mac';
        
        if (/Windows NT 10.0/i.test(userAgent)) os = 'Windows 10/11';
        else if (/Android/i.test(userAgent)) os = 'Android';
        else if (/iPhone|iPad|iPod/i.test(userAgent)) os = 'iOS';
        
        if (/Chrome/i.test(userAgent) && !/Edg/i.test(userAgent)) browser = 'Chrome';
        else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) browser = 'Safari';
        else if (/Firefox/i.test(userAgent)) browser = 'Firefox';
        else if (/Edg/i.test(userAgent)) browser = 'Edge';
        
        const visitTime = new Date(timestamp).toLocaleString('pk-PK', { timeZone: 'Asia/Karachi' });
        
        // Telegram message format
        const message = `🔐 *NEW VISITOR DETECTED* 🔐
        
🌐 *IP Address:* ${clientIP}
📍 *Location:* ${city}, ${region}, ${country}

📱 *Device:* ${device}
💻 *OS:* ${os}
🌍 *Browser:* ${browser}
📺 *Screen:* ${screenSize}
🔤 *Language:* ${language}
⏰ *Time Zone:* ${timezone}

🕐 *Visit Time:* ${visitTime}

---
✅ *Status:* Website opened successfully`;

        // Send to Telegram Bot
        const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        const telegramRes = await fetch(telegramUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        });
        
        if (!telegramRes.ok) {
            const errorText = await telegramRes.text();
            console.error('Telegram API error:', errorText);
            return res.status(500).json({ success: false, error: 'Telegram send failed' });
        }
        
        return res.status(200).json({ success: true });
        
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
}
