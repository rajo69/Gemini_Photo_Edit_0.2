
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST,OPTIONS,GET',
  'Access-Control-Allow-Headers': 'Content-Type, x-goog-api-key',
};

export async function OPTIONS() { return new Response(null, { status: 204, headers: corsHeaders }); }
export async function GET() {
  return new Response(JSON.stringify({ ok: true, endpoint: 'gemini/edit' }), { status: 200, headers: { 'content-type': 'application/json', ...corsHeaders } });
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const prompt = String(form.get('prompt') || '');
    const model = String(form.get('model') || 'gemini-2.5-flash-image-preview');
    const file: any = form.get('image');

    const apiKeyFromForm = String(form.get('apiKey') || '');
    const apiKey = (process.env.GEMINI_API_KEY || apiKeyFromForm || '').trim();
    if (!apiKey) return new Response(JSON.stringify({ error: 'Missing GEMINI_API_KEY' }), { status: 400, headers: corsHeaders });

    const parts: any[] = [{ text: prompt }];
    if (file && typeof file === 'object' && 'arrayBuffer' in file) {
      const mime = (file as File).type || 'image/png';
      const buf = Buffer.from(await (file as File).arrayBuffer());
      const base64 = buf.toString('base64');
      parts.push({ inline_data: { mime_type: mime, data: base64 } });
    }

    const payload = { contents: [{ parts }], generationConfig: { response_mime_type: 'image/png' } };

    const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST', headers: { 'x-goog-api-key': apiKey, 'Content-Type': 'application/json' }, body: JSON.stringify(payload), cache: 'no-store'
    });

    const data = await resp.json().catch(() => ({}));
    const fb = (data as any)?.promptFeedback;
    if (fb?.blockReason) return new Response(JSON.stringify({ errorCode: 'SAFETY', errorMessage: `Prompt blocked: ${fb.blockReason}` }), { status: 400, headers: corsHeaders });

    if (!resp.ok) {
      const errText = typeof (data as any)?.error === 'string' ? (data as any).error : JSON.stringify(data);
      return new Response(JSON.stringify({ error: errText }), { status: resp.status, headers: corsHeaders });
    }

    const partsOut = (data as any)?.candidates?.[0]?.content?.parts || [];
    const imagePart = partsOut.find((p: any) => p.inlineData || p.inline_data);
    const imageBase64 = imagePart?.inlineData?.data || imagePart?.inline_data?.data;
    if (!imageBase64) return new Response(JSON.stringify({ error: 'No image in response' }), { status: 500, headers: corsHeaders });

    return new Response(JSON.stringify({ imageBase64 }), { status: 200, headers: { 'content-type': 'application/json', ...corsHeaders } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message || 'Unknown error' }), { status: 500, headers: corsHeaders });
  }
}
