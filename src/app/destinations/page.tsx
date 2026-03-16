import DestinationsView from './components/DestinationsView';
import { cookies } from 'next/headers';

export default async function DestinationsPage() {
  const cookieStore = await cookies();
  const bookingCode = cookieStore.get('bookingCode')?.value ?? null;

  return <DestinationsView bookingCode={bookingCode} />;
}
