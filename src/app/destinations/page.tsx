'use client';

import Card from './components/Card';
import { useDestinations } from '@/src/hooks/useDestinations';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DestinationsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [bookingCode, setBookingCode] = useState<string | null>(null);
  const { destinations, loading, error } = useDestinations();

  useEffect(() => {
    setBookingCode(localStorage.getItem('bookingCode'));
  }, []);

  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      await fetch('/api/logout', { method: 'POST' });
      localStorage.removeItem('bookingCode');
      router.replace('/');
    } finally {
      setIsLoggingOut(false);
    }
  }

  const filteredDestinations = destinations.filter((destination) => {
    const normalizedQuery = searchQuery.toLowerCase();
    const matchesDestination = destination.name.toLowerCase().includes(normalizedQuery);

    const matchesSubDestination = destination.destinations.some((subDestination) => {
      return subDestination.name.toLowerCase().includes(normalizedQuery) || subDestination.alias.some((alias) => alias.toLowerCase().includes(normalizedQuery));
    });

    return matchesDestination || matchesSubDestination;
  });

  return (
    <div className="min-h-screen p-8 flex flex-col items-center gap-6 bg-[#f0fafa]">
      <div className="w-full max-w-6xl flex justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-[#1a7a7a]">Destinations</h1>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="px-4 py-2 text-sm font-semibold text-white bg-[#3cb7b7] rounded-lg hover:bg-[#2aa0a0] disabled:opacity-50"
        >
          {isLoggingOut ? 'Logging out...' : 'Log out'}
        </button>
      </div>
      {bookingCode && (
        <div className="w-full max-w-6xl rounded-xl bg-[#1a7a7a] px-6 py-2 flex items-center gap-3">
          <span className="text-white text-sm min-[400px]:text-lg font-bold">Booking code:</span>
          <span className="text-white text-sm font-bold">{bookingCode}</span>
        </div>
      )}
      <div className="w-full max-w-6xl">
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search destinations..."
          className="w-full rounded-lg border border-[#3cb7b7] bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[#2aa0a0] focus:ring-2 focus:ring-[#3cb7b730]"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {loading ? (
          <div className="col-span-full flex justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#3cb7b7] border-t-transparent" />
          </div>
        ) : error ? (
          <p className="col-span-full text-center text-red-500 text-lg font-semibold">{error}</p>
        ) : filteredDestinations.length > 0 ? (
          filteredDestinations.map((destination) => (
            <Card
              key={destination.slug}
              image={destination.thumbnail}
              title={destination.name}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-lg font-semibold text-[#2a9494]">No destinations found</p>
        )}
      </div>
    </div>
  );
}
