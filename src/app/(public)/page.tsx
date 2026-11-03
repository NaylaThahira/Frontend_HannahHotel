import FeaturedRooms from '@/components/FeaturedRooms'
import Gallery from '@/components/Gallery'
import Hero from '@/components/Hero'
import HomeFloatingActions from '@/components/HomeFloatingActions'
import TrustBar from '@/components/TrustBar'
import { defaultPainanAttractions, parseAttractions } from '@/lib/attractions'
import TouristAttractions from '@/components/TouristAttractions'

async function getSettings() {
  try {
    const res = await fetch('http://localhost:5000/api/settings', { cache: 'no-store' });
    if (!res.ok) return {};
    return res.json();
  } catch (error) {
    console.error(error);
    return {};
  }
}

export default async function HomePage() {
  const settings = await getSettings();

  let sectionsOrder = ['hero', 'trustbar', 'rooms', 'attractions', 'gallery'];
  if (settings.home_sections_order) {
    try {
      sectionsOrder = JSON.parse(settings.home_sections_order);
    } catch(e) {}
  }

  const renderSection = (id: string) => {
    switch (id) {
      case 'hero':
        return <Hero key="hero" title={settings.home_hero_title} subtitle={settings.home_hero_subtitle} heroImage={settings.home_hero_image} />;
      case 'trustbar':
        return <TrustBar key="trustbar" />;
      case 'rooms':
        return <FeaturedRooms key="rooms" />;
      case 'attractions':
        return <TouristAttractions key="attractions" painan={parseAttractions(settings.tourist_attractions_json, defaultPainanAttractions)} padang={parseAttractions(settings.tourist_attractions_padang_json)} />;
      case 'gallery':
        return <Gallery key="gallery" />;
      default:
        return null;
    }
  };

  return (
    <>
      {sectionsOrder.map(section => renderSection(section))}
      <HomeFloatingActions whatsappNumber={settings.home_whatsapp_number} reviewUrl={settings.home_review_url} />
    </>
  )
}
