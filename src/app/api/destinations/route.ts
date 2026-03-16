export async function GET() {
  const response = await fetch('https://book.tripx.se/wp-json/tripx/v1/destinations', {
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    return Response.json({ message: 'Failed to fetch destinations' }, { status: response.status });
  }

  const data = await response.json();
  return Response.json(data);
}
