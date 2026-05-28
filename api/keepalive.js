const DEFAULT_SUPABASE_URL = "https://dtfvrjlmncrijniqskhv.supabase.co";
const DEFAULT_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_qr_f9x2Os79RHQG0XhX_4Q_1uh14LGe";

function supabaseProjectUrl() {
  const rawUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  return String(rawUrl).replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
}

module.exports = async function handler(_request, response) {
  const projectUrl = supabaseProjectUrl();
  const publishableKey =
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    DEFAULT_SUPABASE_PUBLISHABLE_KEY;

  response.setHeader("Cache-Control", "no-store");

  try {
    const supabaseResponse = await fetch(`${projectUrl}/auth/v1/settings`, {
      headers: {
        apikey: publishableKey,
        Authorization: `Bearer ${publishableKey}`,
      },
    });

    return response.status(200).json({
      ok: supabaseResponse.ok,
      upstreamStatus: supabaseResponse.status,
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    return response.status(503).json({
      ok: false,
      message: "Nao consegui acessar o Supabase neste momento.",
      detail: String(error?.message || error),
      checkedAt: new Date().toISOString(),
    });
  }
};
