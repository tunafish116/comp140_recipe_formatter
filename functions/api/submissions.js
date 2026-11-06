export async function onRequestPost({ request, env }) {
 try {
        const body = await request.json();

        // Generate ID if this is a new user
        const userId = body.user_id || crypto.randomUUID();

        await env.DB.prepare(`
            INSERT INTO submissions (
                user_id,
                first_submit,
                last_submit,
                num_submissions
            )
            VALUES (?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1)
            ON CONFLICT(user_id) DO UPDATE SET
                last_submit = CURRENT_TIMESTAMP,
                num_submissions = num_submissions + 1
        `).bind(userId).run();

        return Response.json({
            success: true,
            user_id: userId
        });

    } catch (error) {
        return Response.json(
            { error: "Submission failed" },
            { status: 500 }
        );
    }
}