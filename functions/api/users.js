export async function onRequestPost({ request, env }) {
try {
    const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";

    // Add user IP to database if not already present
    await env.DB
        .prepare(
        `INSERT OR IGNORE INTO users(ip, last_submit)
        VALUES (?, ?)`
        )
        .bind(ip, Date.now())
        .run();
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { headers: { "Content-Type": "application/json" }, status: 500 }
    );
  }
}