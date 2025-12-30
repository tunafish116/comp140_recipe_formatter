export async function onRequestGet({ request, env }) {
    const url = new URL(request.url);
    const name = url.searchParams.get("name");

    if (!name) {
        return new Response("Missing counter name", { status: 400 });
    }

    const result = await env.DB
        .prepare("SELECT count FROM counter WHERE name = ?")
        .bind(name)
        .first();

    return new Response(
        JSON.stringify({ count: result?.count ?? 0 }),
        { headers: { "Content-Type": "application/json" } }
    );
}

export async function onRequestPost({ request, env }) {
    const { name } = await request.json();
    if (!name) {
        return new Response("Missing counter name", { status: 400 });
    }

    await env.DB
        .prepare(
        `INSERT INTO counter (name, count)
            VALUES (?, 1)
            ON CONFLICT(name) DO UPDATE SET count = count + 1`
        )
        .bind(name)
        .run();

    const result = await env.DB
    .prepare("SELECT count FROM counter WHERE name = ?")
    .bind(name)
    .first();

    return new Response(
        JSON.stringify({ count: result.count }),
        { headers: { "Content-Type": "application/json" } }
    );
}