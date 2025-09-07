
'use client';
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";

function Button({ className = "", variant = "primary", ...props }: any) {
  const base =
    "inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium shadow-sm transition active:scale-[.99] focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants: any = {
    primary: "bg-black/80 text-white backdrop-blur hover:bg-black hover:shadow-md focus:ring-black/30",
    primaryLight: "bg-white text-black hover:bg-white shadow-md border border-black/10",
    subtle: "bg-white/30 text-slate-900 hover:bg-white/50 backdrop-blur border border-white/50",
    subtleDark: "bg-zinc-900/60 text-white hover:bg-zinc-900/80 border border-white/10 backdrop-blur",
  };
  return <button className={`${base} ${variants[variant] || ""} ${className}`} {...props} />;
}
function IconButton(props: any) { return <Button aria-label={props["aria-label"]} variant="primary" className="p-2 rounded-2xl h-10 w-10 items-center justify-center !px-2" {...props} />; }
function AutoGrowTextarea({ className = "", value, onChange, onKeyDown, onHeightChange, minLines = 1, maxLines = 2, style = {}, ...props }: any) {
  const ref = React.useRef<HTMLTextAreaElement | null>(null);
  const [height, setHeight] = React.useState(46);
  React.useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    el.style.height = 'auto';
    const styles = window.getComputedStyle(el);
    const line = parseFloat(styles.lineHeight) || 20;
    const pad = (parseFloat(styles.paddingTop) || 0) + (parseFloat(styles.paddingBottom) || 0);
    const minH = Math.ceil(line * Math.max(1, minLines) + pad);
    const maxH = Math.ceil(line * Math.max(minLines, maxLines) + pad);
    const next = Math.max(minH, Math.min(el.scrollHeight, maxH));
    setHeight(next);
    onHeightChange && onHeightChange(next);
  }, [value, minLines, maxLines, onHeightChange]);
  return (
    <textarea ref={ref} rows={1} value={value} onChange={onChange} onKeyDown={onKeyDown} style={{ ...style, height }}
      className={"w-full rounded-2xl border bg-white/60 border-white/40 backdrop-blur p-3 leading-6 text-slate-900 placeholder-slate-600 shadow-inner focus:outline-none focus:ring-2 focus:ring-black/20 resize-none no-scrollbar overflow-y-auto " + className} {...props} />
  );
}
const Svg = ({ className = "h-5 w-5", children, ...props }: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true" {...props}>{children}</svg>
);
function ImageIcon(props: any){ return(<Svg {...props}><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="8.5" cy="10.5" r="1.5" /><path d="M21 17l-6-6-4 4-5-5" /></Svg>); }
function DownloadIcon(props: any){ return(<Svg {...props}><path d="M12 3v12" /><path d="M7 10l5 5 5-5" /><path d="M4 21h16" /></Svg>); }
function MagicWandIcon(props: any){ return(<Svg {...props}><path d="M3 21l9-9" /><path d="M12.5 7.5l4-4" /><path d="M14 10l6-6" /><path d="M8 2l0 3" /><path d="M2 8l3 0" /><path d="M20 10l0 3" /><path d="M10 20l3 0" /><path d="M5 19l2 2" /></Svg>); }
function SunIcon(props: any){ return(<Svg {...props}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></Svg>); }
function MoonIcon(props: any){ return(<Svg {...props}><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></Svg>); }
function RadiateIcon({ className = "h-5 w-5" }: any) {
  return (<svg viewBox="0 0 24 24" className={className} aria-hidden><rect x="0" y="0" width="24" height="24" fill="#ffffff" /><circle cx="12" cy="12" r="3" fill="#000000" /><g stroke="#000" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="23" /><line x1="1" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="23" y2="12" /><line x1="4.2" y1="4.2" x2="7.8" y2="7.8" /><line x1="16.2" y1="16.2" x2="19.8" y2="19.8" /><line x1="4.2" y1="19.8" x2="7.8" y2="16.2" /><line x1="16.2" y1="7.8" x2="19.8" y2="4.2" /></g></svg>);
}

const GLOW_RGB = "132,0,255";
class AppError extends Error { code?: string; constructor(message: string, code?: string){ super(message); this.code = code; } }
const isSafetyError = (err: any) => Boolean(err && (err.code === 'SAFETY' || /SAFETY|block/i.test(String(err?.message))));
const SEXUAL_WORDS = ['nude','naked','nsfw','porn','xxx','erotic','fetish','sexual','intercourse','blowjob','handjob','cum','boob','boobs','breast','breasts','areola','nipple','tits','ass','butt','penis','vagina','anal'];
function sanitizeForPreview(text: string){ if(!text) return ''; let out = text; for(const w of SEXUAL_WORDS){ try{ out = out.replace(new RegExp(`\\b${w}\\b`, 'gi'), '•••'); }catch{} } return out; }
function preModerate(prompt: string){ if(!prompt) return {allowed:true}; const lower = prompt.toLowerCase(); for(const w of SEXUAL_WORDS){ if(lower.includes(w)) return {blocked:true, reason:'sexual'}; } return {allowed:true}; }

function useWindowSize(){ const [size,setSize]=useState({width: typeof window!=='undefined'?window.innerWidth:0, height: typeof window!=='undefined'?window.innerHeight:0}); useEffect(()=>{ const onR=()=>setSize({width:window.innerWidth,height:window.innerHeight}); window.addEventListener('resize',onR); return ()=>window.removeEventListener('resize',onR);},[]); return size; }
function usePointerParallax(){ const x=useMotionValue(0), y=useMotionValue(0); const springX=useSpring(x,{stiffness:100,damping:20,mass:0.5}); const springY=useSpring(y,{stiffness:100,damping:20,mass:0.5}); const rotateX=useTransform(springY,[-40,40],[6,-6]); const rotateY=useTransform(springX,[-40,40],[-6,6]); const onMove=(e:any)=>{ const r=e.currentTarget.getBoundingClientRect(); const px=(e.clientX??(e.touches?.[0]?.clientX||r.width/2))-r.left; const py=(e.clientY??(e.touches?.[0]?.clientY||r.height/2))-r.top; x.set((px-r.width/2)/6); y.set((py-r.height/2)/6); }; const onLeave=()=>{x.set(0);y.set(0);}; return {rotateX,rotateY,onMove,onLeave,springX,springY}; }
function useIsMobile(){ const [isM,setIsM]=useState(()=> (typeof window!=='undefined'?window.matchMedia('(max-width: 640px)').matches:false)); useEffect(()=>{ if(typeof window==='undefined')return; const mql=window.matchMedia('(max-width: 640px)'); const h=(e:any)=>setIsM(e.matches); try{mql.addEventListener('change',h);}catch{mql.addListener(h);} return ()=>{try{mql.removeEventListener('change',h);}catch{mql.removeListener(h);}};},[]); return isM; }
function drawContain(ctx:CanvasRenderingContext2D, img:HTMLImageElement, canvas:HTMLCanvasElement){ const cw=canvas.width,ch=canvas.height, iw=img.naturalWidth|| (img as any).width, ih=img.naturalHeight||(img as any).height; const scale=Math.min(cw/iw,ch/ih); const dw=iw*scale, dh=ih*scale; const dx=(cw-dw)/2, dy=(ch-dh)/2; ctx.clearRect(0,0,cw,ch); ctx.imageSmoothingEnabled=true; ctx.imageSmoothingQuality='high'; ctx.drawImage(img,dx,dy,dw,dh); }
async function applyLocalFilterToDataUrl(dataUrl:string, prompt:string){ const img=await new Promise<HTMLImageElement>((res,rej)=>{ const i=new Image(); i.onload=()=>res(i); i.onerror=()=>rej(new Error('load fail')); i.src=dataUrl; }); const canvas=document.createElement('canvas'); canvas.width=img.naturalWidth; canvas.height=img.naturalHeight; const ctx=canvas.getContext('2d')!; ctx.drawImage(img,0,0); const kw=(prompt||'').toLowerCase(); try{ if(kw.includes('grayscale')||kw.includes('black and white')||kw.includes('b&w')){ const id=ctx.getImageData(0,0,canvas.width,canvas.height); for(let i=0;i<id.data.length;i+=4){ const r=id.data[i],g=id.data[i+1],b=id.data[i+2]; const v=0.299*r+0.587*g+0.114*b; id.data[i]=id.data[i+1]=id.data[i+2]=v; } ctx.putImageData(id,0,0); } else if(kw.includes('invert')||kw.includes('negative')){ const id=ctx.getImageData(0,0,canvas.width,canvas.height); for(let i=0;i<id.data.length;i+=4){ id.data[i]=255-id.data[i]; id.data[i+1]=255-id.data[i+1]; id.data[i+2]=255-id.data[i+2]; } ctx.putImageData(id,0,0); } else { const id=ctx.getImageData(0,0,canvas.width,canvas.height); for(let i=0;i<id.data.length;i+=4){ id.data[i]=Math.min(255,id.data[i]*1.06); id.data[i+1]=Math.min(255,id.data[i+1]*1.03); id.data[i+2]=Math.min(255,id.data[i+2]*1.03);} ctx.putImageData(id,0,0);} }catch{} return canvas.toDataURL('image/png'); }
async function fetchWithTimeout(url:string, options:any={}, ms=30000){ const c=new AbortController(); const id=setTimeout(()=>c.abort(),ms); try{ return await fetch(url,{...options, signal:c.signal}); } finally{ clearTimeout(id);} }
async function safeJson(resp:Response){ try{ return await resp.json(); }catch{ return null; } }
function parseGeminiImageFromCandidates(data:any){ const partsOut=data?.candidates?.[0]?.content?.parts||[]; const imagePart=partsOut.find((p:any)=>p.inlineData||p.inline_data); return imagePart?.inlineData?.data || imagePart?.inline_data?.data || null; }
function extractSafetyFromGemini(data:any){ const fb=data?.promptFeedback; if(fb?.blockReason) return {code:'SAFETY', message:`Prompt blocked: ${fb.blockReason}`}; const cand0=data?.candidates?.[0]; if(cand0?.finishReason==='SAFETY') return {code:'SAFETY', message:'Prompt blocked by safety system'}; return null; }
async function dataUrlToBlob(dataUrl:string){ const res=await fetch(dataUrl); return await res.blob(); }
async function callGeminiDirect({ prompt, model, imageDataUrl, apiKey }: any){ if(!apiKey) throw new AppError('Missing API key','CONFIG'); const parts:any[]=[{text:prompt||''}]; if(imageDataUrl){ const blob=await dataUrlToBlob(imageDataUrl); const buf=await blob.arrayBuffer(); const b64=btoa(String.fromCharCode(...new Uint8Array(buf))); parts.push({ inline_data:{ mime_type: blob.type || 'image/png', data: b64 } }); } const payload={ contents:[{parts}], generationConfig:{ response_mime_type:'image/png' } }; const resp=await fetchWithTimeout(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, { method:'POST', headers:{'x-goog-api-key':apiKey,'Content-Type':'application/json'}, body:JSON.stringify(payload), cache:'no-store'}, 45000); const data=await resp.json().catch(()=>({})); const safety=extractSafetyFromGemini(data); if(safety) throw new AppError(safety.message,'SAFETY'); if(!resp.ok) throw new AppError(String((data as any)?.error || await resp.text()),'NETWORK'); const imageBase64=parseGeminiImageFromCandidates(data); if(!imageBase64) throw new AppError('Model returned no image','NO_IMAGE'); return imageBase64; }
async function callBackendWithFallbacks({ body, backendUrl }: any){ const list=buildBackendCandidates(backendUrl); let lastErr:any; for(const url of list){ try{ const resp=await fetchWithTimeout(url,{ method:'POST', body, cache:'no-store' },45000); const json=await safeJson(resp); if(json?.errorCode==='SAFETY') throw new AppError(json?.errorMessage || 'Prompt blocked','SAFETY'); if(resp.ok && (json as any)?.imageBase64) return json; lastErr=new AppError(`${resp.status} at ${url}`,'NETWORK'); } catch(e){ lastErr=e; } } throw lastErr || new AppError('Backend unreachable','NETWORK'); }
function buildBackendCandidates(primary:string){ const base=(primary||'').trim() || '/api/gemini/edit'; const t=base.endsWith('/')?base.slice(0,-1):base; const c=[t,`${t}/route`,'/api/gemini/edit','/api/gemini-edit','/api/gemini','/api/edit']; return [...new Set(c)]; }

export default function App(){
  const { height } = useWindowSize();
  const canvasRef = useRef<HTMLCanvasElement|null>(null);
  const [prompt, setPrompt] = useState('');
  const [imageObjectUrl, setImageObjectUrl] = useState<string|null>(null);
  const [currentImageDataUrl, setCurrentImageDataUrl] = useState<string|null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notice, setNotice] = useState('');
  const [backendUrl] = useState('/api/gemini/edit');
  const [model] = useState('gemini-2.5-flash-image-preview');
  const [isDark, setIsDark] = useState(true);
  const [inputH, setInputH] = useState(46);

  useEffect(()=>{},[]);

  const { rotateX, rotateY, onMove, onLeave, springX, springY } = usePointerParallax();
  const { scrollY } = useScroll();
  const bgScrollX = useTransform(scrollY, [0, 1000], [0, 50]);
  const bgScrollY = useTransform(scrollY, [0, 1000], [0, -80]);
  const blob1X = useTransform([springX, bgScrollX] as any, ([a,b]: any) => a + b);
  const blob1Y = useTransform([springY, bgScrollY] as any, ([a,b]: any) => a + b);

  useEffect(()=>{
    const canvas=canvasRef.current; if(!canvas) return; const ctx=canvas.getContext('2d')!;
    function draw(url:string){ const img=new Image(); img.onload=()=>drawContain(ctx,img,canvas); img.src=url; }
    const resize=()=>{ const dpr=window.devicePixelRatio||1; const r=canvas.getBoundingClientRect(); canvas.width=Math.floor(r.width*dpr); canvas.height=Math.floor(r.height*dpr); (ctx as any).setTransform(dpr,0,0,dpr,0,0); if(currentImageDataUrl) draw(currentImageDataUrl); else { ctx.clearRect(0,0,canvas.width,canvas.height); const g=ctx.createLinearGradient(0,0,canvas.width,canvas.height); g.addColorStop(0,'#0b0b13'); g.addColorStop(1,'#141428'); ctx.fillStyle=g; ctx.fillRect(0,0,canvas.width,canvas.height); ctx.strokeStyle='#ffffff10'; ctx.lineWidth=1; for(let x=40;x<canvas.width;x+=40){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,canvas.height); ctx.stroke(); } for(let y=40;y<canvas.height;y+=40){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(canvas.width,y); ctx.stroke(); } } }; resize(); const ro=new (window as any).ResizeObserver(resize); ro.observe(canvas); return ()=>ro.disconnect();
  },[currentImageDataUrl]);

  const onFile = async (file: File | null | undefined) => {
    if(!file) return; if(!file.type.startsWith('image/')){ alert('Please pick an image file.'); return; }
    if (imageObjectUrl) URL.revokeObjectURL(imageObjectUrl);
    const url = URL.createObjectURL(file); setImageObjectUrl(url);
    const dataUrl = await new Promise<string>((resolve)=>{ const r=new FileReader(); r.onload=()=>resolve(String(r.result)); r.readAsDataURL(file); });
    setCurrentImageDataUrl(dataUrl);
  };

  async function runEdit(){
    if(!prompt.trim() && !currentImageDataUrl) return;
    setNotice(''); setIsLoading(true);
    try{
      const body = new FormData();
      const effectivePrompt = (prompt && prompt.trim()) || (currentImageDataUrl ? "Enhance the image naturally: denoise, slightly sharpen, balance exposure and color." : "");
      const m = preModerate(effectivePrompt);
      if (m.blocked){ setIsLoading(false); setNotice('This request contains explicit sexual content, which this demo cannot generate. Try a non‑explicit description or a different subject.'); return; }
      body.append('prompt', effectivePrompt);
      body.append('model', model);
      if (currentImageDataUrl){ const blob = await (await fetch(currentImageDataUrl)).blob(); body.append('image', blob, 'input.png'); }
      let imageBase64: string | null = null;
      try{ const json: any = await callBackendWithFallbacks({ body, backendUrl }); imageBase64 = json?.imageBase64 || null; } catch(e:any){ if (isSafetyError(e)) throw e; console.warn('[Backend failed]', e); }
      const devKey = typeof window!=='undefined' ? (localStorage.getItem('GEMINI_API_KEY') || '') : '';
      if(!imageBase64 && devKey){ try{ imageBase64 = await callGeminiDirect({ prompt: effectivePrompt, model, imageDataUrl: currentImageDataUrl || null, apiKey: devKey }); } catch(e2:any){ if(isSafetyError(e2)) throw e2; console.warn('[Direct fail]', e2); } }
      if(!imageBase64) throw new AppError('No image from backend or direct Gemini','NO_IMAGE');
      setCurrentImageDataUrl(`data:image/png;base64,${imageBase64}`);
    }catch(err:any){
      console.error('[Edit error]',err);
      if (isSafetyError(err)){ setNotice(String(err.message || 'Prompt blocked by safety system')); }
      else{
        try{
          if(currentImageDataUrl){ const fb = await applyLocalFilterToDataUrl(currentImageDataUrl, prompt); setCurrentImageDataUrl(fb); }
          else { const ph = await generatePlaceholderFromPrompt(sanitizeForPreview(prompt) || 'New image'); setCurrentImageDataUrl(ph); }
        }catch{}
        setNotice('We couldn\\'t reach Gemini right now. A local placeholder/filter was applied. Once your /api route or API key is configured, Magic will use Gemini.');
      }
    } finally{ setIsLoading(false); }
  }

  const onDrop=(e:any)=>{ e.preventDefault(); const file=e.dataTransfer.files?.[0]; onFile(file); };
  const onChooseFile=()=>{ const input=document.createElement('input'); input.type='file'; input.accept='image/*'; input.onchange=()=>onFile((input as any).files?.[0]); input.click(); };
  const onDownload=()=>{ if(!currentImageDataUrl) return; const a=document.createElement('a'); a.href=currentImageDataUrl; a.download=`canvas-image-${Date.now()}.png`; a.click(); };
  const onKeyDown=(e:any)=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); runEdit(); } };

  const canvasHeight = useMemo(()=> Math.max(height * 0.72, 420), [height]);

  return (
    <div className="relative min-h-screen overflow-hidden text-slate-100">
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{scrollbar-width:none;-ms-overflow-style:none}`}</style>
      <motion.div aria-hidden className="pointer-events-none fixed inset-0 -z-10"
        style={{ background: "radial-gradient(900px 600px at 20% 10%, rgba(20,20,35,.6), transparent), radial-gradient(1000px 700px at 80% 30%, rgba(18,18,28,.6), transparent), linear-gradient(120deg, #0b0b13, #101022 60%, #0c1b2a)" }} />

      <div className="mx-auto max-w-6xl px-4 pt-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-2xl grid place-items-center shadow-md border bg-white text-black border-white/10">
            <RadiateIcon className="h-5 w-5" />
          </div>
          <div>
            <div className="font-semibold leading-5">Gemini Image Chat</div>
            <div className="text-xs text-slate-400">Powered by Gemini 2.5 Flash Image (preview)</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={'subtleDark'} aria-label="Toggle dark mode"><SunIcon className="h-4 w-4" /><span className="hidden sm:inline">Light</span></Button>
        </div>
      </div>

      {notice && (
        <div className="mx-auto max-w-6xl px-4 mt-4">
          <div className="rounded-xl border px-4 py-3 text-sm bg-rose-900/30 border-rose-500/30 text-rose-200">{notice}</div>
        </div>
      )}

      <motion.div className="mx-auto max-w-6xl px-4 mt-6">
        <motion.div className="relative rounded-3xl border shadow-xl overflow-hidden bg-zinc-900/70 border-white/10 backdrop-blur">
          <div aria-hidden className="pointer-events-none absolute inset-0 rounded-3xl"
            style={{ padding: 6, background: `radial-gradient(200px 200px at 50% 50%, rgba(${GLOW_RGB}, .35), rgba(${GLOW_RGB}, .15) 30%, transparent 55%)`, WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />
          <div className="relative" style={{ height: canvasHeight }} onDrop={onDrop} onDragOver={(e)=>e.preventDefault()}>
            <canvas ref={canvasRef} className="h-full w-full" />
            {!currentImageDataUrl && (
              <div className="absolute inset-0 grid place-items-center select-none" role="button" tabIndex={0} onClick={onChooseFile} onKeyDown={(e:any)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); onChooseFile(); } }}>
                <div className="text-center opacity-80">
                  <div className="mx-auto mb-4 h-14 w-14 grid place-items-center rounded-2xl bg-white/90 text-black"><ImageIcon className="h-7 w-7" /></div>
                  <div className="font-medium">Drop an image here</div>
                  <div className="text-sm text-slate-400">Then type an edit/generation prompt below and press Enter</div>
                </div>
              </div>
            )}
            {currentImageDataUrl && (<div className="absolute right-4 top-4 flex gap-2"><IconButton aria-label="Download image" onClick={onDownload}><DownloadIcon className="h-5 w-5" /></IconButton></div>)}
            {isLoading && (<div className="absolute inset-0 grid place-items-center bg-black/40 backdrop-blur-sm"><div className="animate-pulse rounded-xl border px-4 py-2 shadow-sm border-white/10 bg-zinc-900/70">Processing…</div></div>)}
          </div>
        </motion.div>
      </motion.div>

      <div className="mx-auto max-w-6xl px-4 py-4 sticky bottom-0">
        <div className="bg-zinc-900/60 border-white/10 rounded-3xl border backdrop-blur shadow-lg p-3">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_auto] md:items-stretch">
            <AutoGrowTextarea placeholder={'Describe the edit or generation (e.g., "A photorealistic golden retriever on a beach at sunset")'} className={'!bg-zinc-900/60 !text-slate-100 placeholder-zinc-400 border-white/10 caret-white'} value={prompt} onChange={(e:any)=>setPrompt(e.target.value)} onKeyDown={onKeyDown} onHeightChange={setInputH} minLines={1} maxLines={4} />
            <Button onClick={async ()=>{ await runEdit(); }} variant={'primaryLight'} style={{ height: (inputH as any) }} className="whitespace-nowrap min-w-[96px] px-5"><MagicWandIcon className="h-5 w-5" />Magic</Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-8 text-xs text-slate-400">All generated/edited images may carry an invisible SynthID watermark when using Gemini 2.5 Flash Image. Please respect local laws and content policies.</div>
    </div>
  );
}

async function generatePlaceholderFromPrompt(prompt:string){ const canvas=document.createElement('canvas'); const W=1024,H=768; canvas.width=W; canvas.height=H; const ctx=canvas.getContext('2d')!; const g=ctx.createLinearGradient(0,0,W,H); g.addColorStop(0,'#e0e7ff'); g.addColorStop(1,'#cffafe'); ctx.fillStyle=g; ctx.fillRect(0,0,W,H); ctx.fillStyle='#0f172a'; ctx.font='bold 40px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto'; const safe=sanitizeForPreview(prompt||'(no prompt)'); wrapText(ctx, `Preview: ${safe}`, 40, 100, W-80, 46); (ctx as any).strokeStyle='#0ea5e9'; (ctx as any).lineWidth=12; (ctx as any).strokeRect(24,24,W-48,H-48); return canvas.toDataURL('image/png'); }
function wrapText(ctx:CanvasRenderingContext2D, text:string, x:number, y:number, maxWidth:number, lh:number){ const words=text.split(' '); let line=''; for(let n=0;n<words.length;n++){ const test=line+words[n]+' '; const metrics=ctx.measureText(test); if((metrics as any).width>maxWidth && n>0){ ctx.fillText(line,x,y); line=words[n]+' '; y+=lh; } else { line=test; } } ctx.fillText(line,x,y); }
