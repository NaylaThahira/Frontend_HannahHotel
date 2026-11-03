import RoomsListing from '@/components/RoomsListing';

export default async function RoomsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const query = ((await searchParams).q || '').trim();
  return <RoomsListing query={query} />;
}
