export interface CategorySeoConfig {
  id: string;
  slug: string;
  name: string;
  metaTitle: string;
  metaDesc: string;
  heading: string;
  subheading: string;
  seoText: string;
  faqs: { question: string; answer: string }[];
}

export const CATEGORY_CONFIGS: Record<string, CategorySeoConfig> = {
  'consoles': {
    id: '6a8ad5a068ae35d1a79d1a83',
    slug: 'consoles',
    name: 'Gaming Consoles',
    metaTitle: 'PlayStation 5 & Gaming Consoles Price in Pakistan | PGS Game Shop',
    metaDesc: 'Buy Sony PS5 Slim Disc & Digital Edition, PS5 Pro, PS4, and Xbox Series X in Pakistan. Best prices, 100% genuine with warranty in Karachi & nationwide.',
    heading: 'Gaming Consoles & PlayStation 5 Price in Pakistan',
    subheading: 'Official retail store for brand new and verified pre-owned gaming consoles with checking warranty.',
    seoText: 'Browse our complete catalog of PlayStation 5 (PS5 Slim Disc, Digital Edition, PS5 Pro), Sony PS4, and Xbox consoles in Pakistan. All consoles are imported genuine units with serial-tracked warranty and secure nationwide insured courier delivery.',
    faqs: [
      {
        question: 'What is the price of PS5 in Pakistan?',
        answer: 'PS5 Slim Digital Edition prices typically range from Rs. 220,000 to Rs. 245,000, while the PS5 Slim Disc Edition ranges from Rs. 238,000 to Rs. 260,000 depending on currency rates and warranty packages.',
      },
      {
        question: 'Do your consoles come with warranty?',
        answer: 'Yes, all new and refurbished consoles purchased from PGS Game Shop come with official checking warranty and hardware verification.',
      },
    ],
  },
  'playstation-5': {
    id: '6a8ad5a068ae35d1a79d1a83',
    slug: 'playstation-5',
    name: 'PlayStation 5',
    metaTitle: 'Sony PS5 Price in Pakistan | Buy PlayStation 5 Slim & Pro - PGS Game Shop',
    metaDesc: 'Buy Sony PlayStation 5 (PS5) in Pakistan. Slim Disc, Digital Edition & PS5 Pro available with official checking warranty in Karachi & fast nationwide shipping.',
    heading: 'Sony PlayStation 5 (PS5) Consoles & Bundles in Pakistan',
    subheading: 'Experience next-generation gaming with 4K 120Hz graphics, ultra-fast 1TB SSD, and haptic DualSense controllers.',
    seoText: 'PGS Game Shop is Karachi’s trusted destination for Sony PlayStation 5 consoles. Whether you prefer the PS5 Slim Disc Edition with 4K Ultra HD Blu-ray drive or the PS5 Slim Digital Edition, we provide genuine imported units with warranty.',
    faqs: [
      {
        question: 'What is the difference between PS5 Disc and Digital Edition?',
        answer: 'The PS5 Disc Edition has an integrated Ultra HD Blu-ray disc drive for physical games and 4K movies. The Digital Edition runs purely on digital game downloads from the PlayStation Network.',
      },
      {
        question: 'Can I visit your shop in Karachi to buy a PS5?',
        answer: 'Yes! Our retail shop is at Shop No. G19, Grace Shopping Mall, Gulshan-e-Iqbal, Karachi. You are welcome to inspect and test consoles in person.',
      },
    ],
  },
  'games': {
    id: '6a8aea066dd73e298cdb36da',
    slug: 'games',
    name: 'Game CDs',
    metaTitle: 'Buy PS5 & PS4 Game CDs in Pakistan | Pre-Owned & Sealed Discs',
    metaDesc: 'Explore original PlayStation 5 and PS4 games in Pakistan. Pre-owned tested discs, latest releases, and trade-ins at PGS Game Shop Karachi.',
    heading: 'PS5 & PS4 Video Game Discs in Pakistan',
    subheading: 'Huge collection of brand-new sealed and 100% scratch-tested pre-owned game CDs.',
    seoText: 'Find the best prices on top PlayStation games in Pakistan, including GTA V, EA Sports FC 24/25, Spider-Man 2, God of War Ragnarok, and Call of Duty. We test every pre-owned disc for seamless installation and gameplay.',
    faqs: [
      {
        question: 'Are pre-owned game discs tested?',
        answer: 'Yes, every used PS4/PS5 game disc is 100% surface-inspected, cleaned, and installation-tested before sale.',
      },
      {
        question: 'Do you offer game trade-in or exchange?',
        answer: 'Yes, we accept game trade-ins at our Karachi shop or via WhatsApp coordination for customers across Pakistan.',
      },
    ],
  },
  'controllers': {
    id: '6a8ae13c5f408109bce576a6',
    slug: 'controllers',
    name: 'Controllers',
    metaTitle: 'PS5 DualSense & Xbox Wireless Controllers Price in Pakistan',
    metaDesc: 'Buy original Sony PS5 DualSense wireless controllers, DualSense Edge, and Xbox controllers with warranty at PGS Game Shop Pakistan.',
    heading: 'PlayStation 5 DualSense & Wireless Controllers',
    subheading: 'Original Sony DualSense wireless controllers with immersive haptic feedback and dynamic adaptive triggers.',
    seoText: 'Shop original PS5 DualSense wireless controllers in all official colors (Midnight Black, White, Cosmic Red, Starlight Blue, Gray Camouflage) and custom controller grips at competitive prices in Pakistan.',
    faqs: [
      {
        question: 'Are the DualSense controllers 100% authentic Sony?',
        answer: 'Yes, all controllers sold at PGS Game Shop are 100% original Sony PlayStation units with authentic haptics, touchpad, and battery life.',
      },
    ],
  },
  'accessories': {
    id: '6a8af3ad75f0085178374d75',
    slug: 'accessories',
    name: 'Accessories',
    metaTitle: 'Gaming Accessories, Headsets & Charging Docks in Pakistan | PGS Game Shop',
    metaDesc: 'Buy official PlayStation and gaming accessories, Pulse 3D headsets, DualSense charging stations, cables, and protective covers in Pakistan.',
    heading: 'Gaming Accessories, Headsets & Charging Stations',
    subheading: 'Upgrade your gaming setup with essential accessories, cooling stands, cables, and headsets.',
    seoText: 'Discover high-quality gaming accessories for PS5, PS4, and Xbox. From DualSense charging stations to Pulse 3D headsets and HDMI 2.1 ultra high-speed cables, we have everything you need.',
    faqs: [
      {
        question: 'Do you deliver gaming accessories across Pakistan?',
        answer: 'Yes, we ship all gaming gear and accessories nationwide with tracked courier delivery.',
      },
    ],
  },
  'gift-cards': {
    id: '6ad5fe26a80297c3f58a4ec4',
    slug: 'gift-cards',
    name: 'Gift Cards',
    metaTitle: 'PlayStation PSN, Xbox & Steam Gift Cards in Pakistan | PGS Game Shop',
    metaDesc: 'Buy genuine digital PSN gift cards (USA, UK, UAE), Xbox Live and Steam wallet codes with instant delivery in Pakistan at PGS Game Shop.',
    heading: 'Digital Gaming Gift Cards & PSN Wallet Vouchers',
    subheading: 'Instant digital delivery for PlayStation PSN (US/UK/UAE), Steam, and Xbox codes with 100% redemption guarantee.',
    seoText: 'Top up your gaming wallet with genuine digital gift cards from PGS Game Shop Karachi. We offer PlayStation Store (PSN) cards in USD, GBP, and AED denominations, along with Xbox and Steam wallet vouchers. Codes are verified and delivered with instant verification.',
    faqs: [
      {
        question: 'How do I receive my Gift Card code after purchase?',
        answer: 'Gift card codes are digitally verified and delivered directly to your WhatsApp or email upon order confirmation.',
      },
      {
        question: 'Are your PSN gift cards region specific?',
        answer: 'Yes, ensure your PlayStation account region matches the card currency and region (e.g., US PSN card for USA account, UK for UK account, UAE for UAE account).',
      },
    ],
  },
};

