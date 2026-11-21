import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LenisProvider from "@/components/LenisProvider";
import BranchTransitionProvider from "@/components/BranchTransitionLoader";
import { SERVER_API_URL } from "@/lib/api";

const FOOTER_KEYS = "footer_about,footer_address,footer_phone,footer_email,footer_links,footer_show_newsletter,footer_about_padang,footer_address_padang,footer_phone_padang,footer_email_padang,footer_links_padang,footer_show_newsletter_padang";

async function getFooterSettings() {
  try {
    const res = await fetch(`${SERVER_API_URL}/api/settings?keys=${FOOTER_KEYS}`, {
      next: { revalidate: 300, tags: ['settings'] }
    });
    if (!res.ok) return {};
    return res.json();
  } catch {
    return {};
  }
}

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getFooterSettings();
  return (
    <LenisProvider>
      <BranchTransitionProvider>
        <Header />
        <main>
          {children}
        </main>
        <Footer initialSettings={settings} />
      </BranchTransitionProvider>
    </LenisProvider>
  );
}
