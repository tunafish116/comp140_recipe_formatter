export async function onRequestPost({ request, env }) {
  try {
    const {content} = await request.json();

    // Empty check
    if (!content || content.trim().length === 0) {
      return jsonError("Content cannot be empty", 400);
    }

    // Size limit
    if (content.length > 10_000) {
      return jsonError("Content exceeds 10,000 characters", 413);
    }

    // Rate limiting (per IP)
    const ip =
      request.headers.get("CF-Connecting-IP") ?? "unknown";

    const key = `last_submit:${ip}`;
    const now = Date.now();

    const lastSubmit = await env.RATE_LIMIT.get(key);

    if (lastSubmit && now - Number(lastSubmit) < 5_000) {
      return jsonError(
        "You may only add new entries once every 5 seconds",
        429
      );
    }

    // Store timestamp (expires automatically)
    await env.RATE_LIMIT.put(key, String(now), {
      expirationTtl: 60
    });

    // Insert entry into the D1 database
    await env.DB
      .prepare("INSERT INTO python_code (content) VALUES (?)")
      .bind(content)
      .run();

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { headers: { "Content-Type": "application/json" }, status: 500 }
    );
  }
}

export async function onRequestGet({ env }) {
  const result = await env.DB
    .prepare("SELECT id, content, created_at FROM python_code")
    .all();

  return new Response(
    JSON.stringify(result.results),
    { headers: { "Content-Type": "application/json" } }
  );
}