import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileActionBar from '@/components/MobileActionBar';
import JsonLd from '@/components/JsonLd';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#D9691E',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://drmeghahomoeoclinic.com'),
  title: "Dr. Megha Bobde's Homoeo Clinic | Classical Homoeopathy in Bavdhan, Pune",
  description: "Dr. Megha Bobde (BHMS) provides classical, holistic homoeopathy for chronic diseases, skin allergies, pediatric care, and women's hormonal health in Bavdhan, Pune. 5.0★ Google Rated.",
  keywords: [
    'homoeopathy clinic Bavdhan Pune',
    'Dr. Megha Bobde homeopath',
    'homeopathic doctor near Bavdhan',
    'classical homeopathy Pune',
    'PCOS homeopathic treatment Bavdhan',
    'eczema allergy doctor Pune',
    'pediatric homeopath Bavdhan',
    'women owned clinic Bavdhan',
  ],
  authors: [{ name: 'Dr. Megha Bobde, BHMS' }],
  openGraph: {
    title: "Dr. Megha Bobde's Homoeo Clinic | Bavdhan, Pune",
    description: "5.0★ Rated Classical Homoeopath. Safe, gentle, constitutional healing for chronic illness, skin conditions, and pediatric immunity.",
    url: 'https://drmeghahomoeoclinic.com',
    siteName: "Dr. Megha Bobde's Homoeo Clinic",
    locale: 'en_IN',
    type: 'website',
  },
  alternates: {
    canonical: 'https://drmeghahomoeoclinic.com',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <JsonLd />
      </head>
      <body className="min-h-screen flex flex-col antialiased bg-[#FDFBF7] text-espresso-900 selection:bg-brand-100 selection:text-brand-900">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <MobileActionBar />
      </body>
    </html>
  );
}