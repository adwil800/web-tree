export async function POST(req: Request) {

    const { body } = req;
    console.log(body)
    return new Response(JSON.stringify({ message: 'Hello, World!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
}