export async function GET() {
  const text = "Hellow World!";

  return new Response(text, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
