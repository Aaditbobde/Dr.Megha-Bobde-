import React from 'react';

export default function JsonLd() {
  const clinicSchema = {
    '@context': 'https://schema.org',
    '@type': ['MedicalClinic', 'Physician'],
    name: "Dr. Megha Bobde's Homoeo Clinic",
    alternateName: "डॉ. मेघा बोबडे 'स होम्यो क्लिनिक",
    description: "Holistic healthcare clinic led by Dr. Megha Abhijit Bobde (MD Mumbai, BHMS) in Bavdhan, Pune. Over 15 years clinical experience supporting 2,000+ patients with Classical Homeopathy, Yogananda Flower Essences (YFE) vibrational therapy, and Mind Power Yoga.",
    url: 'https://drmeghahomoeoclinic.com',
    telephone: '+919270113112',
    email: 'drmeghahomoeoclinic@gmail.com',
    priceRange: '₹₹',
    medicalSpecialty: ['Homeopathic', 'HolisticMedicine'],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Shop No. B1, ABC Convenience Centre, beside Marigold Banquets',
      addressLocality: 'Bavdhan',
      addressRegion: 'Maharashtra',
      postalCode: '411021',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 18.5136,
      longitude: 73.7745,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '10:30',
        closes: '13:30',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '18:00',
        closes: '20:30',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday'],
        opens: '11:00',
        closes: '13:30',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: '62',
      bestRating: '5.0',
      worstRating: '1.0',
    },
    founder: {
      '@type': 'Person',
      name: 'Dr. Megha Abhijit Bobde',
      jobTitle: 'MD (Mumbai), BHMS Homoeopath',
      gender: 'Female',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(clinicSchema) }}
    />
  );
}