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

    // Rate limiting by IP (5 seconds)
    const ip =
      request.headers.get("CF-Connecting-IP") ?? "unknown";

    const result = await env.DB
      .prepare("SELECT last_submit FROM users WHERE ip = ?")
      .bind(ip)
      .first();

    if(!result) {
      return jsonError("User not registered", 403);
    }
    if (Date.now() - result.last_submit < 5000) {
      return jsonError("You may only submit once every 5 seconds", 429);
    }

    // Insert/update timestamp
    await env.DB
      .prepare(
        `INSERT INTO users(ip, last_submit)
        VALUES (?, ?)
        ON CONFLICT(ip) DO UPDATE SET last_submit = excluded.last_submit`
      )
      .bind(ip, Date.now())
      .run();

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