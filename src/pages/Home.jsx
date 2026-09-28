import React, { useState, useEffect } from 'react';
import { Download, Link as LinkIcon, Clipboard, X, Check, Loader2, PlayCircle, Music, Clock, User, AlertCircle, Info, Share2, ChevronDown, Heart, MessageCircle, Eye, QrCode } from 'lucide-react';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';
import { cn } from '../lib/utils';

export default function Home() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [processState, setProcessState] = useState('idle'); // idle, validating, processing, success, error, timeout
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const sanitizeFileName = (name) => {
    return name.replace(/[^a-z0-9]/gi, '_').substring(0, 30);
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toString() || '0';
  };


  // Handle keyboard shortcut and initial URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlParam = params.get('url');
    if (urlParam && validateTikTokUrl(urlParam)) {
      setUrl(urlParam);
      setTimeout(() => handleProcess(null, urlParam), 100);
    }

    const handleKeyDown = async (e) => {
      // If pressing Ctrl+V and not inside an input field
      if (e.ctrlKey && e.key === 'v' && document.activeElement.tagName !== 'INPUT') {
        try {
          const text = await navigator.clipboard.readText();
          if (validateTikTokUrl(text)) {
            setUrl(text);
            toast.success("Tautan ditemukan (Ctrl+V), memproses otomatis...");
            // Automatically process after short delay so state sets correctly
            setTimeout(() => document.getElementById('process-btn')?.click(), 100);
          }
        } catch (err) {
          // Ignore
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handlePaste = async () => {
    try {
      const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');
      
      // Firefox strictly blocks automatic clipboard reading and forces a native popup.
      // To prevent the "double paste" annoying popup, we just focus and instruct the user.
      if (isFirefox) {
        const inputEl = document.getElementById('url-input');
        if (inputEl) {
          inputEl.focus();
          toast.info("Karena keamanan Firefox, silakan tekan Ctrl+V atau klik kanan -> Paste");
        }
        return;
      }

      if (!navigator.clipboard) {
        toast.error("Browser Anda tidak mendukung fitur Paste otomatis.");
        return;
      }
      
      const text = await navigator.clipboard.readText();
      if (!text) {
        toast.error("Clipboard Anda kosong.");
        return;
      }
      setUrl(text);
      if (validateTikTokUrl(text)) {
        toast.success("Tautan ditemukan, memproses otomatis...");
        handleProcess(null, text);
      } else {
        toast.info("Tautan ditempel. Silakan klik Download.");
      }
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
      toast.error("Gagal membaca clipboard. Silakan gunakan Ctrl+V.");
    }
  };

  const handleClear = () => {
    setUrl('');
    setError(null);
    setResult(null);
    const newUrl = new URL(window.location);
    newUrl.searchParams.delete('url');
    window.history.pushState({}, '', newUrl);
  };

  const saveToHistory = (item) => {
    const history = JSON.parse(localStorage.getItem('tikdown_history') || '[]');
    const newHistory = [item, ...history.filter(h => h.url !== item.url)].slice(0, 50);
    localStorage.setItem('tikdown_history', JSON.stringify(newHistory));
  };

  const validateTikTokUrl = (inputUrl) => {
    try {
      const parsedUrl = new URL(inputUrl);
      const allowedHosts = [
        "tiktok.com",
        "www.tiktok.com",
        "vm.tiktok.com",
        "vt.tiktok.com"
      ];
      
      const isValid = allowedHosts.some(host => 
        parsedUrl.hostname === host || parsedUrl.hostname.endsWith("." + host)
      );
      
      return isValid ? parsedUrl.toString() : false;
    } catch (e) {
      return false;
    }
  };

  const handleProcess = async (e, urlOverride = null) => {
    if (e) e.preventDefault();
    const targetUrl = urlOverride || url;
    if (!targetUrl.trim()) {
      setProcessState('error');
      toast.error("Silakan masukkan URL video TikTok terlebih dahulu");
      return;
    }

    setProcessState('validating');
    const normalizedUrl = validateTikTokUrl(targetUrl);
    if (!normalizedUrl) {
      setProcessState('error');
      toast.error("Tautan tidak valid. Harap masukkan tautan TikTok yang benar.");
      return;
    }

    setIsLoading(true);
    setProcessState('processing');
    setError(null);
    setResult(null);
    setIsPlaying(false);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 35000); // 35s max frontend timeout

    try {
      const apiUrl = ''; // Menggunakan relative path agar diproxy oleh Vite (mencegah masalah CORS 100%)
      
      // Periksa backend hidup atau tidak sebelum nembak prepare
      try {
         await fetch(`${apiUrl}/api/v1/downloads/prepare`, { method: 'OPTIONS', signal: AbortSignal.timeout(2000) }).catch(() => {});
      } catch (pingErr) {
         // Abaikan ping error, biarkan fetch utama yang gagal
      }

      const response = await fetch(`${apiUrl}/api/v1/downloads/prepare`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: normalizedUrl }),
        signal: controller.signal
      });
      
      const data = await response.json();
      clearTimeout(timeoutId);

      if (response.status === 504 || data.error === 'DOWNLOAD_PROVIDER_TIMEOUT') {
        setProcessState('timeout');
        setError("The video processing service took too long to respond.");
        toast.error("Waktu habis! Layanan pemrosesan video terlalu lama merespons.");
        return;
      }
      
      if (response.status === 500 && data.message.includes('not configured')) {
        setProcessState('error');
        setError("TikTok download provider is not configured.");
        toast.error("Provider belum dikonfigurasi.");
        return;
      }

      if (data.success && data.data) {
        setProcessState('success');
        const videoData = data.data;
        
        const getAbsoluteUrl = (u, proxy = false) => {
          if (!u) return '';
          let finalUrl = u;
          if (u.startsWith('//')) finalUrl = `https:${u}`;
          else if (u.startsWith('/')) finalUrl = `https://www.tikwm.com${u}`;
          
          if (proxy) {
            // Only proxy videos and downloads to bypass CORS
            return `/api/v1/proxy?url=${encodeURIComponent(finalUrl)}`;
          }
          // For images, use direct URL since Cloudflare blocks Node JS fetch but allows browsers with no-referrer
          return finalUrl;
        };

        const processedResult = {
          success: true,
          url: targetUrl,
          title: videoData.title || 'TikTok Video',
          author: `@${videoData.author.unique_id}`,
          authorName: videoData.author.nickname,
          authorAvatar: getAbsoluteUrl(videoData.author.avatar, false),
          thumbnail: getAbsoluteUrl(videoData.cover, false),
          duration: videoData.duration || 0,
          size: videoData.size || 0,
          playCount: videoData.play_count || 0,
          likeCount: videoData.digg_count || 0,
          commentCount: videoData.comment_count || 0,
          shareCount: videoData.share_count || 0,
          downloadUrl: getAbsoluteUrl(videoData.play, true),
          hdDownloadUrl: getAbsoluteUrl(videoData.hdplay || videoData.play, true),
          playUrl: getAbsoluteUrl(videoData.play, false),
          audioUrl: getAbsoluteUrl(videoData.music, true),
          timestamp: new Date().toISOString()
        };

        setResult(processedResult);
        saveToHistory(processedResult);
        
        // Update URL to make it survive refreshes
        const newWindowUrl = new URL(window.location);
        newWindowUrl.searchParams.set('url', targetUrl);
        window.history.pushState({}, '', newWindowUrl);
        
        // Update global usage stats for admin dashboard
        const currentTotal = parseInt(localStorage.getItem('tikdown_total_processed') || '0', 10);
        localStorage.setItem('tikdown_total_processed', (currentTotal + 1).toString());

        toast.success("Video berhasil diproses!");
      } else {
        setProcessState('error');
        setError(data.message || "Gagal memproses video.");
        toast.error(data.message || "Gagal memproses video. Mungkin akun diprivat.");
      }
    } catch (err) {
      if (err.name === 'AbortError' || err.message.includes('timeout')) {
        setProcessState('timeout');
        setError("Koneksi ke backend terlalu lama.");
        toast.error("Waktu habis! Tidak ada respons dari server.");
      } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        setProcessState('error');
        setError("Download server is unavailable.");
        toast.error("Server tidak tersedia. Pastikan backend menyala.");
      } else {
        setProcessState('error');
        setError("Terjadi kesalahan saat terhubung ke server.");
        toast.error("Terjadi kesalahan sistem.");
      }
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
      // Removed the state override here because React state updates are asynchronous
      // and checking processState here evaluates the OLD state ('processing'), 
      // thus incorrectly resetting 'error' or 'timeout' states to 'idle'.
    }
  };

  const handleDownload = (fileUrl, filename) => {
    // If it's a proxy URL, append the filename and download=1 parameter so backend sets Content-Disposition
    let downloadUrl = fileUrl;
    if (downloadUrl.includes('/api/v1/proxy')) {
      downloadUrl += `&filename=${encodeURIComponent(filename)}&download=1`;
    }

    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = downloadUrl;
    a.download = filename;
    // target=_blank helps in case it doesn't trigger a download natively
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast.success("Download sedang berjalan di browser Anda!");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Drag and Drop Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const text = e.dataTransfer.getData('text');
    if (text) {
      setUrl(text);
      if (validateTikTokUrl(text)) {
        setTimeout(() => document.getElementById('process-btn')?.click(), 100);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start w-full animate-in max-w-5xl mx-auto">
      <div className="text-center mb-16 w-full max-w-4xl border-4 border-black bg-neo-yellow p-8 md:p-16 shadow-brutal-lg">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-4 text-black">
          Download Smarter.<br />
          <span className="text-neo-pink bg-black px-4 leading-relaxed mt-2 inline-block">Build Faster.</span>
        </h1>
        <p className="text-xl md:text-2xl text-black font-bold mb-10 max-w-2xl mx-auto border-b-4 border-black pb-4 inline-block">
          The ultimate Neo-Brutalist TikTok downloader. No fuss, just code and content.
        </p>

        <form 
          onSubmit={handleProcess} 
          className={cn(
            "relative flex flex-col md:flex-row gap-4 p-4 md:p-6 bg-white border-4 border-black shadow-brutal-lg transition-transform",
            isDragOver ? "bg-neo-cyan translate-x-1 translate-y-1 shadow-brutal" : ""
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="relative flex-1 flex items-center border-4 border-black bg-white shadow-brutal-sm focus-within:translate-x-1 focus-within:translate-y-1 focus-within:shadow-none transition-all">
            <input
              type="url"
              id="url-input"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste TikTok URL here..."
              className="w-full h-16 md:h-20 px-6 bg-transparent outline-none text-black text-xl md:text-2xl font-bold placeholder-black/50"
              required
            />
            {url && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-4 p-2 bg-neo-pink border-4 border-black hover:translate-x-0.5 hover:translate-y-0.5 shadow-brutal-sm hover:shadow-none transition-all text-black"
                title="Clear"
              >
                <X size={24} strokeWidth={3} />
              </button>
            )}
          </div>
          <div className="flex gap-4 shrink-0">
            {!url && (
              <button
                type="button"
                onClick={handlePaste}
                className="flex items-center justify-center gap-2 h-16 md:h-20 px-6 font-bold text-xl uppercase bg-neo-cyan border-4 border-black text-black shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
              >
                <Clipboard size={24} strokeWidth={3} />
                <span className="hidden md:inline">Paste</span>
              </button>
            )}
            <button
              id="process-btn"
              type="submit"
              disabled={isLoading || !url}
              className="flex-1 md:flex-none flex items-center justify-center gap-3 h-16 md:h-20 px-8 font-black text-xl md:text-2xl uppercase bg-neo-green border-4 border-black text-black shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-8 h-8 animate-spin" strokeWidth={3} />
                  <span>{processState === 'validating' ? 'Wait...' : 'Loading...'}</span>
                </>
              ) : (
                <>
                  <Download className="w-8 h-8" strokeWidth={3} />
                  <span>Download</span>
                </>
              )}
            </button>
          </div>
        </form>
        
        {error && (
          <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-start gap-3 text-left fade-in">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}
        
        <p className="mt-4 text-xs text-[hsl(var(--muted-foreground))] font-medium flex items-center justify-center gap-1.5">
          <Info className="w-3.5 h-3.5" />
          Only download content you have permission to use.
        </p>
      </div>

      {result && (
        <div className="w-full mt-10 animate-in">
          <div className="bg-white border-4 border-black p-6 md:p-8 shadow-brutal-lg flex flex-col lg:flex-row items-start gap-8">
            <div 
              className={cn("w-full lg:w-80 shrink-0 border-4 border-black shadow-brutal relative group bg-black flex items-center justify-center overflow-hidden aspect-[9/16]", !isPlaying && "cursor-pointer")}
              onClick={() => !isPlaying && setIsPlaying(true)}
            >
              {isPlaying ? (
                <video 
                  src={result.playUrl} 
                  controls 
                  autoPlay 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              ) : (
                <>
                  <img src={result.thumbnail} alt="Video Thumbnail" referrerPolicy="no-referrer" className="w-full h-full object-cover opacity-90" />
                  <div className="absolute inset-0 bg-neo-pink/30 flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100 backdrop-blur-sm">
                    <PlayCircle className="w-20 h-20 text-white" strokeWidth={3} />
                  </div>
                </>
              )}
            </div>
            
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-start gap-4 mb-4 border-b-4 border-black pb-4">
                <h2 className="text-2xl md:text-3xl font-black text-black uppercase line-clamp-2">{result.title}</h2>
                <div className="shrink-0 hidden sm:block p-2 bg-white border-4 border-black shadow-brutal-sm" title="Scan to open on mobile">
                  <QRCodeSVG value={result.url} size={80} />
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-base font-bold text-black mb-8">
                <div className="flex items-center gap-2 bg-neo-yellow border-4 border-black px-4 py-2 shadow-brutal-sm">
                  {result.authorAvatar ? (
                    <img src={result.authorAvatar} alt="Avatar" referrerPolicy="no-referrer" className="w-6 h-6 border-2 border-black" />
                  ) : (
                    <User className="w-5 h-5" strokeWidth={3} />
                  )}
                  <span>{result.authorName || result.author}</span>
                </div>
                <div className="flex items-center gap-2 bg-neo-cyan border-4 border-black px-4 py-2 shadow-brutal-sm">
                  <Clock className="w-5 h-5" strokeWidth={3} />
                  <span>00:{result.duration}</span>
                </div>
                {result.size > 0 && (
                  <div className="flex items-center gap-2 bg-neo-green border-4 border-black px-4 py-2 shadow-brutal-sm">
                    <Download className="w-5 h-5" strokeWidth={3} />
                    <span>{(result.size / (1024 * 1024)).toFixed(2)} MB</span>
                  </div>
                )}
              </div>

              {/* Statistics Section */}
              <div className="flex flex-wrap items-center justify-around bg-white border-4 border-black p-4 mb-8 shadow-brutal-sm">
                <div className="flex flex-col items-center">
                  <Eye className="w-8 h-8 text-black mb-2" strokeWidth={3} />
                  <span className="font-black text-2xl text-black">{formatNumber(result.playCount)}</span>
                  <span className="text-sm font-bold uppercase">Views</span>
                </div>
                <div className="flex flex-col items-center">
                  <Heart className="w-8 h-8 text-neo-pink mb-2" strokeWidth={3} />
                  <span className="font-black text-2xl text-black">{formatNumber(result.likeCount)}</span>
                  <span className="text-sm font-bold uppercase">Likes</span>
                </div>
                <div className="flex flex-col items-center">
                  <MessageCircle className="w-8 h-8 text-neo-cyan mb-2" strokeWidth={3} />
                  <span className="font-black text-2xl text-black">{formatNumber(result.commentCount)}</span>
                  <span className="text-sm font-bold uppercase">Comments</span>
                </div>
                <div className="flex flex-col items-center">
                  <Share2 className="w-8 h-8 text-neo-purple mb-2" strokeWidth={3} />
                  <span className="font-black text-2xl text-black">{formatNumber(result.shareCount)}</span>
                  <span className="text-sm font-bold uppercase">Shares</span>
                </div>
              </div>

              <div className="flex flex-col gap-4 mt-auto">
                <button 
                  onClick={() => handleDownload(result.hdDownloadUrl, `${result.author}_${sanitizeFileName(result.title)}_HD.mp4`)}
                  className="flex items-center justify-center gap-3 w-full py-4 font-black text-xl uppercase bg-neo-pink border-4 border-black text-white shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all active:translate-x-2 active:translate-y-2"
                >
                  <Download className="w-6 h-6" strokeWidth={3} />
                  Download HD
                </button>
                <button 
                  onClick={() => handleDownload(result.downloadUrl, `${result.author}_${sanitizeFileName(result.title)}.mp4`)}
                  className="flex items-center justify-center gap-3 w-full py-4 font-black text-xl uppercase bg-neo-yellow border-4 border-black text-black shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                >
                  <Download className="w-6 h-6" strokeWidth={3} />
                  Download Normal
                </button>
                <button 
                  onClick={() => handleDownload(result.audioUrl, `${result.author}_${sanitizeFileName(result.title)}_Audio.mp3`)}
                  className="flex items-center justify-center gap-3 w-full py-4 font-black text-xl uppercase bg-neo-cyan border-4 border-black text-black shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                >
                  <Music className="w-6 h-6" strokeWidth={3} />
                  Download Audio
                </button>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button 
                    onClick={() => handleDownload(result.thumbnail, `${result.author}_thumbnail.jpg`)}
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold border border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Video Thumbnail
                  </button>
                  {result.authorAvatar ? (
                    <button 
                      onClick={() => handleDownload(result.authorAvatar, `${result.author}_profile.jpg`)}
                      className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold border border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors text-sm"
                    >
                      <User className="w-4 h-4" />
                      Creator Profile
                    </button>
                  ) : (
                    <button 
                      onClick={async () => {
                        if (navigator.share) {
                          try {
                            await navigator.share({
                              title: result.title,
                              text: `Check out this TikTok video by ${result.author}`,
                              url: result.url
                            });
                          } catch (err) {
                            console.log('Share canceled', err);
                          }
                        } else {
                          handleCopyLink();
                        }
                      }}
                      className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold border border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors text-sm"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  )}
                </div>
                {result.authorAvatar && (
                   <button 
                    onClick={async () => {
                      if (navigator.share) {
                        try {
                          await navigator.share({
                            title: result.title,
                            text: `Check out this TikTok video by ${result.author}`,
                            url: result.url
                          });
                        } catch (err) {
                          console.log('Share canceled', err);
                        }
                      } else {
                        handleCopyLink();
                      }
                    }}
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold border border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors text-sm"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                )}
                <button 
                  onClick={handleCopyLink}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold border border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
                >
                  {isCopied ? <Check className="w-5 h-5 text-green-500" /> : <LinkIcon className="w-5 h-5" />}
                  {isCopied ? 'Link Copied!' : 'Copy Original Video Link'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Features/How to use section */}
      {!result && !isLoading && (
         <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl text-left fade-in">
           <div className="flex flex-col items-start p-8 bg-neo-pink border-4 border-black shadow-brutal hover:-translate-y-2 transition-transform">
             <div className="w-16 h-16 bg-white border-4 border-black shadow-brutal-sm flex items-center justify-center mb-6">
               <span className="font-black text-3xl">1</span>
             </div>
             <h3 className="font-black text-2xl mb-4 uppercase">Find a Video</h3>
             <p className="text-base font-bold text-black border-t-4 border-black pt-4">Open TikTok, find a video, click Share, and Copy Link.</p>
           </div>
           <div className="flex flex-col items-start p-8 bg-neo-cyan border-4 border-black shadow-brutal hover:-translate-y-2 transition-transform">
             <div className="w-16 h-16 bg-white border-4 border-black shadow-brutal-sm flex items-center justify-center mb-6">
               <span className="font-black text-3xl">2</span>
             </div>
             <h3 className="font-black text-2xl mb-4 uppercase">Paste Link</h3>
             <p className="text-base font-bold text-black border-t-4 border-black pt-4">Paste the copied URL into the input field above and hit Download.</p>
           </div>
           <div className="flex flex-col items-start p-8 bg-neo-green border-4 border-black shadow-brutal hover:-translate-y-2 transition-transform">
             <div className="w-16 h-16 bg-white border-4 border-black shadow-brutal-sm flex items-center justify-center mb-6">
               <span className="font-black text-3xl">3</span>
             </div>
             <h3 className="font-black text-2xl mb-4 uppercase">Save & Share</h3>
             <p className="text-base font-bold text-black border-t-4 border-black pt-4">Get your high-quality video or audio instantly. No watermark.</p>
           </div>
         </div>
      )}

      {/* FAQ Section */}
      {!result && !isLoading && (
        <div className="mt-20 w-full max-w-3xl text-left fade-in">
          <h2 className="text-2xl font-bold text-center mb-8 text-[hsl(var(--foreground))]">Frequently Asked Questions</h2>
          <div className="flex flex-col gap-4">
            {[
              { q: 'Is TikDown free to use?', a: 'Yes, TikDown is completely free to use with no hidden charges or limits.' },
              { q: 'Do I need to install any software?', a: 'No, you do not need to install any software or extensions. TikDown works directly from your web browser on any device.' },
              { q: 'Can I download TikTok videos without watermark?', a: 'Yes! Our tool automatically fetches the version of the video that does not contain a watermark.' },
              { q: 'Where are the videos saved?', a: 'By default, the videos are saved in the "Downloads" folder of your browser, whether you are on mobile or PC.' }
            ].map((faq, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] hover:border-indigo-500/30 transition-colors">
                <h4 className="font-bold text-[hsl(var(--foreground))] flex items-center justify-between">
                  {faq.q}
                  <ChevronDown className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                </h4>
                <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
