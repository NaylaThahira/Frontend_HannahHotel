export type HotelBranch = {
  id: 'padang' | 'painan';
  title: string;
  imageUrl: string;
  description: string;
  location: string;
};

export const defaultBranches: HotelBranch[] = ['padang', 'painan'].map(id => {
  const label = id === 'padang' ? 'Padang' : 'Painan';
  return { id: id as HotelBranch['id'], title: `Hannah Hotel ${label}`, imageUrl: '',
    description: `Nikmati kenyamanan menginap di Hannah Hotel ${label}. Temukan pilihan kamar yang sesuai untuk Anda.`, location: label };
});

export function branchImageUrl(url: string) {
  return url.startsWith('/uploads/') ? `http://localhost:5000${url}` : url;
}
