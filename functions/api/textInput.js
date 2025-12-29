export async function onRequestPost({ request, env }) {
  try {
    const {content} = await request.json();

    // Insert entry into the D1 database
    await env.DB
      .prepare("INSERT INTO textInput (content) VALUES (?)")
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
    .prepare("SELECT id, content, created_at FROM textInput")
    .all();

  return new Response(
    JSON.stringify(result.results),
    { headers: { "Content-Type": "application/json" } }
  );
}