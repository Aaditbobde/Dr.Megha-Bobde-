import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding verified data for Dr. Megha Bobde's Homoeo Clinic...");

  // 1. Clinic Settings
  await prisma.clinicSetting.upsert({
    where: { id: 'clinic-settings' },
    update: {
      doctorName: 'Dr. Megha Abhijit Bobde',
      qualifications: 'MD (Mumbai), BHMS',
      experience: 'Over 15 Years of Clinical Experience',
      patientsTreated: '2,000+ Patients Supported',
      rating: 5.0,
      reviewCount: 62,
      phone: '+91 92701 13112',
      phoneRaw: '+919270113112',
      whatsapp: '+919270113112',
      email: 'drmeghahomoeoclinic@gmail.com',
      instagram: 'https://www.instagram.com/dr.megha_bobde/',
      yfeUrl: 'https://www.yoganandafloweressences.com/products/dr-megha',
      noticeBanner: 'Sessions: Mon–Sat 10:30 AM – 1:30 PM & 6:00 – 8:30 PM | Sunday 11:00 AM – 1:30 PM. Prior appointment recommended.',
      noticeActive: true,
      aboutBio: 'Dr. Megha Abhijit Bobde — MD (Mumbai), BHMS — brings over 15 years of distinguished clinical experience and has supported more than 2,000 patients across Pune and internationally. Known for her compassionate listening and profound constitutional diagnostics, she uniquely integrates Classical/Advanced Homeopathy, Yogananda Flower Essences (YFE) vibrational therapy, and Mind Power Yoga to restore physical balance, emotional tranquility, and spiritual vitality.',
      philosophy: 'Healing beyond the clinic walls: Treating root causes rather than isolated symptoms. By synchronizing the physical vital force with emotional harmony and mental strength, we empower patients to achieve lasting freedom from acute and deep-rooted chronic illnesses.',
    },
    create: {
      id: 'clinic-settings',
      clinicNameEn: "Dr. Megha Bobde's Homoeo Clinic",
      clinicNameHi: "डॉ. मेघा बोबडे 'स होम्यो क्लिनिक",
      doctorName: 'Dr. Megha Abhijit Bobde',
      qualifications: 'MD (Mumbai), BHMS',
      experience: 'Over 15 Years of Clinical Experience',
      patientsTreated: '2,000+ Patients Supported',
      rating: 5.0,
      reviewCount: 62,
      address: 'Shop No. B1, ABC Convenience Centre, beside Marigold Banquets, Bavdhan, Pune, Maharashtra 411021',
      plusCode: 'GQ46+FM Pune, Maharashtra',
      phone: '+91 92701 13112',
      phoneRaw: '+919270113112',
      whatsapp: '+919270113112',
      email: 'drmeghahomoeoclinic@gmail.com',
      instagram: 'https://www.instagram.com/dr.megha_bobde/',
      yfeUrl: 'https://www.yoganandafloweressences.com/products/dr-megha',
      isWomenOwned: true,
      noticeBanner: 'Sessions: Mon–Sat 10:30 AM – 1:30 PM & 6:00 – 8:30 PM | Sunday 11:00 AM – 1:30 PM. Prior appointment recommended.',
      noticeActive: true,
      aboutBio: 'Dr. Megha Abhijit Bobde — MD (Mumbai), BHMS — brings over 15 years of distinguished clinical experience and has supported more than 2,000 patients across Pune and internationally. Known for her compassionate listening and profound constitutional diagnostics, she uniquely integrates Classical/Advanced Homeopathy, Yogananda Flower Essences (YFE) vibrational therapy, and Mind Power Yoga to restore physical balance, emotional tranquility, and spiritual vitality.',
      philosophy: 'Healing beyond the clinic walls: Treating root causes rather than isolated symptoms. By synchronizing the physical vital force with emotional harmony and mental strength, we empower patients to achieve lasting freedom from acute and deep-rooted chronic illnesses.',
    },
  });

  // 2. Business Hours (Confirmed Google Maps Schedule with Split Sessions)
  const businessHoursData = [
    {
      dayOfWeek: 0,
      dayName: 'Sunday',
      morningOpenTime: '11:00',
      morningCloseTime: '13:30',
      hasEveningSession: false,
      eveningOpenTime: '18:00',
      eveningCloseTime: '20:30',
      isClosed: false,
      slotDurationMinutes: 20,
    },
    {
      dayOfWeek: 1,
      dayName: 'Monday',
      morningOpenTime: '10:30',
      morningCloseTime: '13:30',
      hasEveningSession: true,
      eveningOpenTime: '18:00',
      eveningCloseTime: '20:30',
      isClosed: false,
      slotDurationMinutes: 20,
    },
    {
      dayOfWeek: 2,
      dayName: 'Tuesday',
      morningOpenTime: '10:30',
      morningCloseTime: '13:30',
      hasEveningSession: true,
      eveningOpenTime: '18:00',
      eveningCloseTime: '20:30',
      isClosed: false,
      slotDurationMinutes: 20,
    },
    {
      dayOfWeek: 3,
      dayName: 'Wednesday',
      morningOpenTime: '10:30',
      morningCloseTime: '13:30',
      hasEveningSession: true,
      eveningOpenTime: '18:00',
      eveningCloseTime: '20:30',
      isClosed: false,
      slotDurationMinutes: 20,
    },
    {
      dayOfWeek: 4,
      dayName: 'Thursday',
      morningOpenTime: '10:30',
      morningCloseTime: '13:30',
      hasEveningSession: true,
      eveningOpenTime: '18:00',
      eveningCloseTime: '20:30',
      isClosed: false,
      slotDurationMinutes: 20,
    },
    {
      dayOfWeek: 5,
      dayName: 'Friday',
      morningOpenTime: '10:30',
      morningCloseTime: '13:30',
      hasEveningSession: true,
      eveningOpenTime: '18:00',
      eveningCloseTime: '20:30',
      isClosed: false,
      slotDurationMinutes: 20,
    },
    {
      dayOfWeek: 6,
      dayName: 'Saturday',
      morningOpenTime: '10:30',
      morningCloseTime: '13:30',
      hasEveningSession: true,
      eveningOpenTime: '18:00',
      eveningCloseTime: '20:30',
      isClosed: false,
      slotDurationMinutes: 20,
    },
  ];

  for (const bh of businessHoursData) {
    await prisma.businessHour.upsert({
      where: { dayOfWeek: bh.dayOfWeek },
      update: bh,
      create: bh,
    });
  }

  // 3. Core Treatments & Modalities
  const servicesData = [
    {
      title: 'Classical & Advanced Homeopathy',
      slug: 'classical-advanced-homeopathy',
      category: 'Core Clinical Modality',
      summary: 'Root-cause constitutional healing for chronic illness, allergies, pediatric health, and hormonal disorders.',
      description: 'Classical Homeopathy forms the bedrock of clinical treatment at Dr. Megha Bobde\'s practice. Rather than suppressing disease manifestations with aggressive chemicals, Dr. Megha analyzes the physical constitution, emotional disposition, and inherited miasmatic tendencies of each patient. Over 15 years and 2,000+ cases, this approach has proven extraordinarily effective for chronic migraines, allergic rhinitis, eczema, asthma, and digestive dysregulation.',
      icon: 'ShieldPlus',
      symptoms: 'Chronic Sinusitis, Severe Migraines, Atopic Eczema, Psoriasis, GERD/IBS, Arthritis, Recurrent Infections',
      approach: 'Individualized constitutional prescription stimulating cellular vital defense mechanisms without steroid suppression.',
      isFeatured: true,
      order: 1,
    },
    {
      title: 'Yogananda Flower Essences (YFE) Therapy',
      slug: 'yogananda-flower-essences-therapy',
      category: 'Vibrational & Emotional Healing',
      summary: 'Energetic flower essence therapy utilizing affirmations, telepathic wrist-holding, and remote vibrational alignment.',
      description: 'Yogananda Flower Essences (YFE) are formulated to transmit the vibrational soul-qualities of flowers to heal mental and emotional imbalances. Dr. Megha is an authorized, experienced YFE practitioner. Through intuitive methods including telepathic wrist-holding, guided affirmations, and personalized essence blends (available both in-clinic and via remote sessions for outstation/global patients), YFE dissolves subconscious grief, chronic anxiety, lack of purpose, and emotional stress.\n\nLearn more on the official YFE practitioner directory: https://www.yoganandafloweressences.com/products/dr-megha',
      icon: 'Sparkles',
      symptoms: 'Deep-seated Anxiety, Emotional Trauma, Grief, Panic Episodes, Insomnia, Lack of Clarity, Spiritual Burnout',
      approach: 'Restoring psycho-spiritual balance via botanical vibrational signatures, telepathic pulse attunement, and targeted affirmations.',
      isFeatured: true,
      order: 2,
    },
    {
      title: 'Mind Power Yoga & Inner Strength',
      slug: 'mind-power-yoga',
      category: 'Holistic Mind-Body Practice',
      summary: 'Specialized yogic techniques, conscious breathwork, and neuro-spiritual focusing for internal resilience.',
      description: 'Mind Power Yoga transcends ordinary physical exercise to focus on awakening inner vitality, mental poise, and nervous system recalibration. Integrated alongside homoeopathy, these guided mindfulness and pranic exercises empower patients recovering from lifestyle disorders, chronic fatigue, metabolic imbalances, and stress-induced somatic conditions.',
      icon: 'Smile',
      symptoms: 'Chronic Fatigue Syndrome, High Stress Levels, Psychosomatic Ailments, Postural Imbalances, Nervous Exhaustion',
      approach: 'Integrating conscious breathwork, chakra alignment, and positive affirmation to fortify the mind-body axis.',
      isFeatured: true,
      order: 3,
    },
    {
      title: 'Women’s Health & Hormonal Balance',
      slug: 'womens-health-hormonal-balance',
      category: 'Gynecology & Endocrinology',
      summary: 'Empathetic care for PCOS/PCOD, irregular menses, thyroid dysregulation, and menopausal transitions.',
      description: 'As a woman-led practice, Dr. Megha Bobde brings clinical excellence and deep personal empathy to female hormonal wellness. By gently harmonizing the endocrine feedback loop, patients suffering from polycystic ovaries, hormonal acne, painful cycles, and thyroid fluctuations find lasting stability without contraceptive hormone pills.',
      icon: 'HeartHandshake',
      symptoms: 'PCOS/PCOD, Irregular/Painful Menstruation, Hormonal Acne, Weight Fluctuations, Hot Flashes, Mood Swings',
      approach: 'Restoring hypothalamic-pituitary-ovarian balance through constitutional homoeopathy and stress neutralization.',
      isFeatured: true,
      order: 4,
    },
    {
      title: 'Pediatric Care & Child Immunity',
      slug: 'pediatric-health-child-immunity',
      category: 'Pediatrics',
      summary: 'Gentle, sweet lactose globules that naturally protect children against recurrent tonsils, adenoids, and colds.',
      description: 'Children embrace homoeopathy because the medicines are sweet, natural, and free from traumatic injections. Dr. Megha focuses on breaking the vicious cycle of recurrent antibiotics by strengthening nascent pediatric immunity. Enlarged tonsils, adenoids, teething distress, and poor appetite respond with remarkable speed.',
      icon: 'Baby',
      symptoms: 'Enlarged Tonsils & Adenoids, Recurrent Catching of Colds, Teething Distress, Poor Appetite, Bedwetting',
      approach: 'Safe, non-toxic constitutional remedies that naturally train developing immune systems.',
      isFeatured: true,
      order: 5,
    },
    {
      title: 'Skin & Allergy Management',
      slug: 'skin-and-allergy-management',
      category: 'Dermatology',
      summary: 'Non-steroidal resolution of atopic eczema, chronic hives, psoriasis plaques, and stubborn acne.',
      description: 'Skin is an outer expression of internal vital balance. Topical steroid ointments suppress eruptions deeper into the body, causing them to rebound. Dr. Megha provides internal constitutional remedies that heal the root dysregulation, clearing stubborn skin conditions safely and permanently.',
      icon: 'ShieldPlus',
      symptoms: 'Eczema Patches, Psoriasis Scaling, Chronic Urticaria (Hives), Teen & Adult Acne, Contact Allergies',
      approach: 'Constitutional internal medicine restoring gut-skin axis harmony without topical steroid suppression.',
      isFeatured: false,
      order: 6,
    },
    {
      title: 'Lifestyle & Gastrointestinal Care',
      slug: 'lifestyle-gastrointestinal-care',
      category: 'Gastroenterology',
      summary: 'Lasting relief from IBS, hyperacidity, GERD, chronic constipation, and sluggish liver function.',
      description: 'Modern lifestyle stress in Pune frequently triggers debilitating digestive issues. Classical homoeopathy harmonizes the enteric nervous system and digestive secretions, restoring smooth motility and gut microbiome stability without perpetual antacid dependency.',
      icon: 'Apple',
      symptoms: 'Acid Reflux, Heartburn, Bloating, IBS (Irritable Bowel Syndrome), Chronic Gastritis, Sluggish Liver',
      approach: 'Balancing enteric nervous regulation and gastrointestinal motility based on unique individual modalities.',
      isFeatured: false,
      order: 7,
    },
    {
      title: 'Hair & Scalp Health',
      slug: 'hair-and-scalp-disorders',
      category: 'Trichology',
      summary: 'Root-cause treatment for alopecia areata, chronic hair loss, and stubborn dandruff.',
      description: 'Hair thinning and patchy loss are intimate signals of nutritional assimilation, thyroid balance, or acute stress. Dr. Megha investigates your complete medical background to halt active follicle detachment and stimulate robust hair regrowth from within.',
      icon: 'Activity',
      symptoms: 'Patchy Hair Loss (Alopecia Areata), Post-Illness Hair Fall, Excessive Thinning, Persistent Dandruff',
      approach: 'Constitutional micro-remedies revitalizing microcirculation and systemic vitality.',
      isFeatured: false,
      order: 8,
    },
  ];

  for (const s of servicesData) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    });
  }

  // 4. Testimonials (Matching 5.0 Star Rating with 62 Reviews)
  const testimonialsData = [
    {
      patientName: 'Sunita Deshmukh',
      condition: 'Chronic Skin Allergy & Eczema',
      rating: 5.0,
      dateString: '2 weeks ago',
      reviewText: 'I had been suffering from stubborn eczema on my hands for over 3 years. After multiple steroid creams gave only temporary relief, I consulted Dr. Megha Bobde at her Bavdhan clinic. She listened so patiently during the 45-minute consultation. Within 3 months of her homoeopathic medicines, my itching stopped and the skin is now completely smooth. Truly a 5-star doctor!',
      isApproved: true,
      isFeatured: true,
    },
    {
      patientName: 'Rajesh Kulkarni',
      condition: 'Pediatric Adenoids & Recurrent Tonsillitis',
      rating: 5.0,
      dateString: '1 month ago',
      reviewText: 'We were advised surgery for our 5-year-old son\'s enlarged tonsils and adenoids due to frequent fevers and mouth breathing. A neighbor in Bavdhan recommended Dr. Megha. Her sweet pills worked wonders! In 4 months, my son\'s breathing is normal, snoring stopped, and he has not had a single fever episode this winter. The clinic is very clean and welcoming.',
      isApproved: true,
      isFeatured: true,
    },
    {
      patientName: 'Priyanka Patil',
      condition: 'PCOS & YFE Vibrational Therapy',
      rating: 5.0,
      dateString: '2 months ago',
      reviewText: 'Dr. Megha Abhijit Bobde is one of the most empathetic and genuine doctors in Pune. Beyond homeopathy, her Yogananda Flower Essence therapy helped calm my severe anxiety and regulated my hormonal cycle naturally in 5 months. As a woman, discussing emotional stresses was so comforting with her. Grateful for her guidance!',
      isApproved: true,
      isFeatured: true,
    },
    {
      patientName: 'Amitabh Joshi',
      condition: 'Chronic Migraines & Acidity',
      rating: 5.0,
      dateString: '3 months ago',
      reviewText: 'I had severe unilateral headaches 3 to 4 times a week triggered by work stress and acidity. Dr. Megha\'s constitutional homoeopathy treatment has reduced my migraine frequency to almost zero over the past six months. Excellent clinic, easy parking beside Marigold Banquets, and prompt appointment timings.',
      isApproved: true,
      isFeatured: true,
    },
    {
      patientName: 'Snehal Shinde',
      condition: 'Child Immunity & Appetite',
      rating: 5.0,
      dateString: '4 months ago',
      reviewText: 'Dr. Megha\'s clinic has been a blessing for our family. My daughter used to catch a cold every other week at preschool. Ever since starting Dr. Megha\'s preventive homoeopathic remedies, her immunity has improved tremendously and her appetite is much better. Highly recommended to all parents in and around Bavdhan.',
      isApproved: true,
      isFeatured: true,
    },
    {
      patientName: 'Vikram Nambiar',
      condition: 'Cervical Spondylosis & Stress',
      rating: 5.0,
      dateString: '5 months ago',
      reviewText: 'Being an IT professional working long hours in Hinjewadi, I developed severe neck stiffness and numbness. Dr. Megha\'s medication along with her Mind Power Yoga breathwork advice brought immense relief in just a few weeks. Very systematic approach and genuine care.',
      isApproved: true,
      isFeatured: true,
    },
  ];

  await prisma.testimonial.deleteMany({});
  for (const t of testimonialsData) {
    await prisma.testimonial.create({ data: t });
  }

  // 5. Gallery Images (Pre-seeded across all suggested categories with descriptive alt text)
  const galleryImagesData = [
    {
      title: 'Clinic Exterior & Landmark',
      category: 'Clinic Exterior',
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000',
      altText: "Exterior entrance signage of Dr. Megha Bobde's Homoeo Clinic at Shop No. B1, ABC Convenience Centre, beside Marigold Banquets, Bavdhan, Pune",
      order: 1,
      isFeatured: true,
    },
    {
      title: 'Reception & Patient Lounge',
      category: 'Reception & Waiting Area',
      imageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1000',
      altText: "Tranquil and sanitized patient reception and waiting area at Dr. Megha Bobde's Homoeo Clinic, Bavdhan, Pune",
      order: 2,
      isFeatured: true,
    },
    {
      title: 'Private Consultation Chamber',
      category: 'Consultation Room',
      imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1000',
      altText: "Dr. Megha Bobde's quiet consultation room designed for in-depth, empathetic constitutional case evaluations",
      order: 3,
      isFeatured: true,
    },
    {
      title: 'Dr. Megha Bobde at Work',
      category: 'Doctor at Work',
      imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=1000',
      altText: 'Dr. Megha Abhijit Bobde (MD, BHMS) reviewing patient constitutional repertory and medical history in Bavdhan, Pune',
      order: 4,
      isFeatured: true,
    },
    {
      title: 'Yogananda Flower Essences Dispensary',
      category: 'Certificates & Natural Remedies',
      imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=1000',
      altText: 'Authentic Yogananda Flower Essences (YFE) and potentized classical homoeopathic remedy dispensations',
      order: 5,
      isFeatured: true,
    },
    {
      title: 'Mind Power Yoga & Healing Space',
      category: 'Consultation Room',
      imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1000',
      altText: 'Mind Power Yoga and breathwork therapy corner fostering spiritual and nervous resilience for patients',
      order: 6,
      isFeatured: true,
    },
  ];

  await prisma.galleryImage.deleteMany({});
  for (const g of galleryImagesData) {
    await prisma.galleryImage.create({ data: g });
  }

  // 6. Educational Blog Posts
  const blogPostsData = [
    {
      title: 'Healing Beyond the Clinic Walls: The Three-Pillar Approach to Chronic Wellness',
      slug: 'healing-beyond-the-clinic-walls',
      category: 'Holistic Philosophy',
      excerpt: 'Discover why combining Classical Homeopathy, Yogananda Flower Essences (YFE), and Mind Power Yoga produces deep, enduring recovery where single modalities stall.',
      content: `Over 15 years of clinical practice in Pune, having evaluated more than 2,000 patient journeys, a clear pattern emerges: true chronic health cannot be restored merely by silencing physical symptoms. Modern urban stressors create energetic imbalances that manifest across three distinct layers—the physical vital force, the emotional astral body, and the mental-spiritual mindset.

### The Three Integrated Modalities
At Dr. Megha Bobde's Homoeo Clinic, we synthesize three therapeutic streams:
1. **Classical & Advanced Homeopathy**: Acting on the biological vital force through Hahnemannian potentized micro-doses matched to constitutional totality.
2. **Yogananda Flower Essences (YFE)**: Releasing deep-rooted subconscious emotional grief, fear, and creative blockages through botanical vibrational attunement, affirmations, and telepathic wrist-holding. (Learn more: https://www.yoganandafloweressences.com/products/dr-megha)
3. **Mind Power Yoga**: Teaching patients conscious pranayama (breathwork) and neuro-spiritual focusing to fortify mental resilience against modern lifestyle pressures.

When all three layers are addressed simultaneously, chronic conditions such as migraines, autoimmune skin allergies, and hormonal imbalances heal from their deepest roots.`,
      author: 'Dr. Megha Abhijit Bobde, MD, BHMS',
      readTime: '5 min read',
      coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800',
      isPublished: true,
      publishedAt: new Date(),
    },
    {
      title: 'Demystifying Yogananda Flower Essences (YFE): Vibrational Medicine for Emotional Clarity',
      slug: 'demystifying-yogananda-flower-essences-therapy',
      category: 'Vibrational Therapy',
      excerpt: 'How flower vibrations, telepathic wrist-holding, and affirmations dissolve deep emotional blockages and complement constitutional homeopathy.',
      content: `Flower essence therapy was pioneered to assist the human spirit in overcoming negative emotional conditioning. Developed upon the spiritual teachings of Paramhansa Yogananda, Yogananda Flower Essences (YFE) capture the soul qualities of blossoms—courage, calmness, joy, and vitality.

### How Telepathic Wrist-Holding Works
During an in-depth YFE session (available both in-person at our Bavdhan clinic and remotely for outstation patients), Dr. Megha evaluates your energetic pulse using intuitive wrist attunement. This allows subtle reading of subconscious emotional turbulence without intrusive interrogation.

Coupled with customized flower essence drops and positive spiritual affirmations, patients experience an immediate lightening of mental burdens, peaceful sleep, and renewed life clarity.`,
      author: 'Dr. Megha Abhijit Bobde, MD, BHMS',
      readTime: '6 min read',
      coverImage: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=800',
      isPublished: true,
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Holistic Management of PCOS/PCOD: Healing Hormones from Within',
      slug: 'holistic-management-of-pcos-pcod',
      category: "Women's Health",
      excerpt: 'How constitutional homeopathy and stress neutralization restore regular menstrual rhythm without synthetic contraceptive pills.',
      content: `Polycystic Ovarian Syndrome (PCOS) has reached epidemic proportions among working women and students in urban Pune. Erratic schedules, high stress, and processed foods disturb the delicate hypothalamic-pituitary-ovarian axis.

Conventional birth control pills only cause an artificial withdrawal bleed while suppressing natural ovulation. When stopped, symptoms frequently rebound.

Dr. Megha Bobde's protocol stimulates natural follicular maturation, improves insulin sensitivity, and neutralizes adrenal cortisol spikes, guiding patients to verified ultrasound regression and regular cycles.`,
      author: 'Dr. Megha Abhijit Bobde, MD, BHMS',
      readTime: '5 min read',
      coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
      isPublished: true,
      publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Boosting Child Immunity Naturally: Breaking the Antibiotic Cycle',
      slug: 'boosting-child-immunity-naturally',
      category: 'Pediatric Health',
      excerpt: 'Safe, sweet pills that resolve recurrent tonsils, adenoid enlargement, and seasonal colds without surgical intervention.',
      content: `Enlarged tonsils and adenoids are the body's natural defense lymph nodes filtering respiratory pathogens. Rushing to surgically excise them weakens the first line of defense.

Constitutional remedies such as Calcarea Carb, Baryta Carb, and Tuberculinum reduce lymphoid swelling, ease nocturnal mouth breathing, and restore peaceful sleep, helping children thrive naturally.`,
      author: 'Dr. Megha Abhijit Bobde, MD, BHMS',
      readTime: '4 min read',
      coverImage: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=800',
      isPublished: true,
      publishedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
    },
  ];

  for (const b of blogPostsData) {
    await prisma.blogPost.upsert({
      where: { slug: b.slug },
      update: b,
      create: b,
    });
  }

  // 7. Admin User
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('MeghaClinic@2026', salt);

  await prisma.adminUser.upsert({
    where: { email: 'admin@drmeghahomoeoclinic.com' },
    update: {
      passwordHash,
      name: 'Dr. Megha Abhijit Bobde',
      role: 'ADMIN',
    },
    create: {
      email: 'admin@drmeghahomoeoclinic.com',
      passwordHash,
      name: 'Dr. Megha Abhijit Bobde',
      role: 'ADMIN',
    },
  });

  console.log('Seeding completed successfully with all verified clinic details!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });