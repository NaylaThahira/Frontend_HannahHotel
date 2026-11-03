export function matchesListingSearch(name: string, description: string | undefined, query: string) {
  const text = `${name} ${description || ''}`.toLocaleLowerCase('id-ID');
  return query.trim().toLocaleLowerCase('id-ID').split(/\s+/).every(word => text.includes(word));
}
