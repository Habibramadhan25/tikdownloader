const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.url}`);
  next();
});

const validateTikTokUrl = (inputUrl) => {
  try {
    const parsedUrl = new URL(inputUrl);
    const allowedHosts = ["tiktok.com", "www.tiktok.com", "vm.tiktok.com", "vt.tiktok.com"];
    return allowedHosts.some(host => parsedUrl.hostname === host || parsedUrl.hostname.endsWith("." + host)) ? parsedUrl.toString() : false;
  } catch (e) {
    return false;
  }
};

app.get('/api/v1/proxy', async (req, res) => {
  const targetUrl = req.query.url;
  const filename = req.query.filename || 'video.mp4';
  if (!targetUrl) return res.status(400).send('Missing URL');
  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*'
      }
    });
    
    res.set('Content-Type', response.headers.get('content-type') || 'application/octet-stream');
    
    // Only force download if explicitly requested, otherwise it will play inline
    if (req.query.download === '1') {
      res.set('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
    }
    
    // Pass content length so browser knows the file size
    const contentLength = response.headers.get('content-length');
    if (contentLength) {
      res.set('Content-Length', contentLength);
    }

    const { Readable } = require('stream');
    const stream = Readable.fromWeb(response.body);
    
    stream.on('error', (err) => {
      console.error('Proxy stream error:', err);
      if (!res.headersSent) res.status(500).end();
    });
    
    stream.pipe(res);
  } catch (err) {
    console.error('Proxy fetch error:', err);
    res.status(500).end();
  }
});

app.post('/api/v1/downloads/prepare', async (req, res) => {
  console.log(`[DOWNLOAD] Request received`);
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ success: false, message: 'URL tidak boleh kosong' });
  }

  const normalizedUrl = validateTikTokUrl(url);
  if (!normalizedUrl) {
    return res.status(400).json({ success: false, message: 'URL TikTok tidak valid' });
  }

  console.log(`[DOWNLOAD] Original URL: ${normalizedUrl}`);

  const providerApi = process.env.TIKTOK_PROVIDER_API;
  if (!providerApi) {
    return res.status(500).json({ success: false, message: 'TikTok download provider is not configured.' });
  }

  try {
    let finalUrl = normalizedUrl;
    
    // Resolve short URLs
    if (finalUrl.includes('vm.tiktok.com') || finalUrl.includes('vt.tiktok.com')) {
      console.log(`[DOWNLOAD] Resolving short URL...`);
      try {
        const headResponse = await fetch(finalUrl, { method: 'HEAD', redirect: 'follow' });
        finalUrl = headResponse.url;
        // The resolved URL might be very long and contain query parameters.
        // We typically strip the query string from tiktok URLs to make them clean, but it's optional.
        const parsedFinal = new URL(finalUrl);
        finalUrl = parsedFinal.origin + parsedFinal.pathname;
        console.log(`[DOWNLOAD] Resolved URL: ${finalUrl}`);
      } catch (redirectErr) {
        console.error(`Failed to resolve short URL: ${redirectErr.message}`);
        // Fallback to original if resolve fails
      }
    }

    const requestUrl = `${providerApi}${encodeURIComponent(finalUrl)}`;
    console.log(`[DOWNLOAD] Calling provider...`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout
    
    let fetchOptions = { 
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      }
    };

    if (providerApi.includes('jaky.dev') && process.env.JAKY_API_KEY) {
      fetchOptions.headers['x-jaky-key'] = process.env.JAKY_API_KEY;
    }
    
    const response = await fetch(requestUrl, fetchOptions);
    clearTimeout(timeoutId);
    
    const data = await response.json();
    console.log(`[DOWNLOAD] Provider response:`, data.code !== undefined ? `code=${data.code}` : `status=${data.status}`);
    console.log(`[DOWNLOAD] Processing completed`);

    // Universal mapping for both Tikwm and Jaky
    if ((data.code === 0 && data.data) || (data.status === true && data.data)) {
      const isJaky = Array.isArray(data.data);
      const videoData = isJaky ? data : data.data;
      
      let playUrl = '';
      let hdPlayUrl = '';
      
      if (isJaky) {
        playUrl = data.data.find(d => d.type === 'nowatermark')?.url || '';
        hdPlayUrl = data.data.find(d => d.type === 'nowatermark_hd')?.url || playUrl;
      } else {
        playUrl = videoData.play || videoData.video || videoData.no_watermark || '';
        hdPlayUrl = videoData.hdplay || videoData.hd_video || videoData.play || videoData.video || '';
      }

      const parseJakyNumber = (str) => {
        if (!str) return 0;
        return parseInt(str.toString().replace(/[^0-9]/g, ''), 10) || 0;
      };

      const mappedData = {
        code: 0,
        data: {
          title: videoData.title || videoData.desc || 'TikTok Video',
          author: { 
            unique_id: videoData.author?.unique_id || videoData.author?.nickname || 'user', 
            nickname: videoData.author?.nickname || videoData.author?.fullname || 'User', 
            avatar: videoData.author?.avatar || '' 
          },
          cover: videoData.cover || videoData.thumbnail || '',
          duration: videoData.durations || videoData.duration || 0,
          size: videoData.size_nowm || videoData.size || 0,
          play: playUrl,
          hdplay: hdPlayUrl,
          music: videoData.music_info?.url || videoData.music || videoData.audio || '',
          play_count: parseJakyNumber(videoData.stats?.views) || videoData.play_count || 0,
          digg_count: parseJakyNumber(videoData.stats?.likes) || videoData.digg_count || 0,
          comment_count: parseJakyNumber(videoData.stats?.comment) || videoData.comment_count || 0,
          share_count: parseJakyNumber(videoData.stats?.share) || videoData.share_count || 0,
        }
      };
      
      return res.json({ success: true, ...mappedData });
    } else {
      return res.status(404).json({ success: false, message: data.msg || data.message || 'Video tidak tersedia atau privat' });
    }
    
  } catch (error) {
    console.error(`[DOWNLOAD] Error processing video:`, error);
    if (error.name === 'AbortError' || error.message.includes('timeout')) {
      return res.status(504).json({
        success: false,
        error: "DOWNLOAD_PROVIDER_TIMEOUT",
        message: "The video processing service took too long to respond."
      });
    }
    return res.status(500).json({ success: false, message: `Server error saat memproses video: ${error.message}` });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
