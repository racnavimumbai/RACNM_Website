export interface Initiative {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  category: string;
  cover_image: string;
  is_featured: boolean;
  created_at: string;
}

export interface ImpactMetric {
  label: string;
  value: string;
}

export interface EventItem {
  id: string;
  initiative_id: string | null;
  title: string;
  slug: string;
  rotaract_year: string;
  event_date: string;
  location: string;
  summary: string;
  description: string;
  impact_metrics: ImpactMetric[];
  cover_image: string;
  gallery_images: string[];
  status: 'draft' | 'published';
  is_featured: boolean;
  is_upcoming?: boolean;
  created_at: string;
}

export interface GalleryPhoto {
  id: string;
  event_id: string | null;
  album_name: string;
  image_url: string;
  caption: string;
  rotaract_year: string;
  sort_order: number;
  created_at: string;
}

export interface Editorial {
  id: string;
  title: string;
  slug: string;
  author: string;
  category: string;
  pdf_url: string | null;
  cover_image: string;
  content: string;
  summary: string;
  status: 'draft' | 'published';
  published_at: string;
}

export interface BoardMember {
  id: string;
  name: string;
  role: string;
  rotaract_year: string;
  bio: string;
  image_url: string;
  sort_order: number;
  social_links: {
    instagram?: string;
    linkedin?: string;
    email?: string;
  };
}

export interface JoinApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  occupation: string;
  reason: string;
  status: 'pending' | 'contacted' | 'accepted' | 'rejected';
  created_at: string;
}

// Global state container for local persistence (when offline/in mock mode)
export const initialInitiatives: Initiative[] = [
  {
    id: "init-1",
    title: "Project Literacy & Skill Catalyst",
    slug: "project-literacy-skill-catalyst",
    summary: "Empowering under-resourced schools and youth in Navi Mumbai through digital education, books, and career guidance.",
    description: "Launched as one of RCNM's flagship community thrusts, Project Literacy provides quality learning kits, sets up digital mini-labs, and conducts career counseling sessions across Navi Mumbai municipal schools. Over 4,000 students have benefited directly.",
    category: "Education",
    cover_image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop",
    is_featured: true,
    created_at: "2024-07-01T10:00:00Z"
  },
  {
    id: "init-2",
    title: "Green Navi Mumbai Eco-Drive",
    slug: "green-navi-mumbai-eco-drive",
    summary: "Sustainable mangrove conservation, urban afforestation, and zero-plastic awareness drives across Navi Mumbai.",
    description: "In alignment with global environmental goals, RCNM leads weekly sapling plantation drives, lake cleanup campaigns, and plastic recycling workshops in collaboration with local civic bodies.",
    category: "Environment",
    cover_image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1200&auto=format&fit=crop",
    is_featured: true,
    created_at: "2024-07-15T10:00:00Z"
  },
  {
    id: "init-3",
    title: "Magnum Opus Leadership Academy",
    slug: "magnum-opus-leadership-academy",
    summary: "Transformational youth workshops focusing on public speaking, conflict resolution, ethics, and professional agility.",
    description: "Designed specifically for young leaders aged 18-28. Features masterclasses from industry leaders, debate leagues, and practical governance experiences within Rotaract District 3142.",
    category: "Leadership Growth",
    cover_image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
    is_featured: true,
    created_at: "2024-08-01T10:00:00Z"
  },
  {
    id: "init-4",
    title: "Aarogya Health & Mental Wellbeing",
    slug: "aarogya-health-mental-wellbeing",
    summary: "Free multi-specialty health camps, blood donation marathons, and mental wellness awareness dialogues.",
    description: "Partnering with leading medical institutions in Navi Mumbai to provide free diagnostic tests, eye checkups, and youth mental health support sessions.",
    category: "Community Service",
    cover_image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop",
    is_featured: false,
    created_at: "2024-08-10T10:00:00Z"
  }
];

export const initialEvents: EventItem[] = [
  {
    id: "evt-upcoming-1",
    initiative_id: "init-3",
    title: "Navi Mumbai Youth Leadership Summit 2026",
    slug: "navi-mumbai-youth-leadership-summit-2026",
    rotaract_year: "2026-27",
    event_date: "2026-09-25",
    location: "CIDCO Exhibition Centre Auditorium, Navi Mumbai",
    summary: "Annual youth leadership summit featuring keynote masterclasses, interactive panel debates, and District 3142 networking.",
    description: "Join us for RCNM's flagship 45th Year Youth Leadership Summit bringing together 400+ delegates across District 3142.",
    impact_metrics: [
      { label: "Expected Delegates", value: "400+" },
      { label: "Keynote Speakers", value: "8" }
    ],
    cover_image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1200&auto=format&fit=crop",
    gallery_images: [
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1200&auto=format&fit=crop"
    ],
    status: "published",
    is_featured: true,
    is_upcoming: true,
    created_at: "2026-09-01T10:00:00Z"
  },
  {
    id: "evt-1",
    initiative_id: "init-1",
    title: "Mega Book Donation & Digital Lab Setup",
    slug: "mega-book-donation-digital-lab",
    rotaract_year: "2024-25",
    event_date: "2024-08-15",
    location: "NMMC School No. 28, Navi Mumbai",
    summary: "Donated 2,500+ books and set up 10 refurbished desktop computers for primary school students.",
    description: "On Independence Day, the Rotaract Club of Navi Mumbai celebrated by gifting educational infrastructure to 500+ underprivileged children. The event was inaugurated by District Rotaract Dignitaries and school leaders.",
    impact_metrics: [
      { label: "Books Donated", value: "2,500+" },
      { label: "Students Impacted", value: "550" },
      { label: "Computers Installed", value: "10" }
    ],
    cover_image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1200&auto=format&fit=crop",
    gallery_images: [
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=1200&auto=format&fit=crop"
    ],
    status: "published",
    is_featured: true,
    created_at: "2024-08-16T12:00:00Z"
  },
  {
    id: "evt-2",
    initiative_id: "init-2",
    title: "Mangrove Shield - 1000 Sapling Plantation Drive",
    slug: "mangrove-shield-sapling-plantation",
    rotaract_year: "2024-25",
    event_date: "2024-07-28",
    location: "Palm Beach Road Wetlands, Navi Mumbai",
    summary: "Planted 1,000 native mangrove saplings to protect Navi Mumbai's delicate coastal ecosystem.",
    description: "Over 80 Rotaract members, community volunteers, and civic partners united at dawn along Palm Beach Road to plant mangrove saplings. The initiative strengthens biodiversity and acts as a natural flood defense barrier.",
    impact_metrics: [
      { label: "Saplings Planted", value: "1,000" },
      { label: "Volunteers Joined", value: "85" },
      { label: "CO2 Offset Est.", value: "15 Tons/Yr" }
    ],
    cover_image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1200&auto=format&fit=crop",
    gallery_images: [
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511497584788-876761c1298b?q=80&w=1200&auto=format&fit=crop"
    ],
    status: "published",
    is_featured: true,
    created_at: "2024-07-29T14:00:00Z"
  },
  {
    id: "evt-3",
    initiative_id: "init-3",
    title: "Magnum Opus Conclave 2024: Leadership Reimagined",
    slug: "magnum-opus-conclave-2024",
    rotaract_year: "2024-25",
    event_date: "2024-08-25",
    location: "CIDCO Exhibition Centre Auditorium, Navi Mumbai",
    summary: "A day-long leadership summit featuring keynote speeches, panel debates, and youth networking.",
    description: "Distinguished speakers from entrepreneurship, social service, and public administration shared actionable frameworks with 300+ delegates. The conclave embodied RCNM's 45th Year theme — Magnum Opus — striving for personal and collective mastery.",
    impact_metrics: [
      { label: "Delegates Attended", value: "320+" },
      { label: "Keynote Speakers", value: "6" },
      { label: "Clubs Represented", value: "18" }
    ],
    cover_image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1200&auto=format&fit=crop",
    gallery_images: [
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop"
    ],
    status: "published",
    is_featured: true,
    created_at: "2024-08-26T09:00:00Z"
  },
  {
    id: "evt-4",
    initiative_id: "init-4",
    title: "Raktadan Mahadan - Annual Blood Donation Camp",
    slug: "raktadan-mahadan-blood-donation-camp",
    rotaract_year: "2024-25",
    event_date: "2024-08-04",
    location: "Railway Station Complex, Navi Mumbai",
    summary: "Collected 210 units of blood in partnership with Tata Memorial Blood Bank.",
    description: "RCNM organized its signature blood donation camp at Navi Mumbai Railway Station, mobilising daily commuters and youth donors. Every donor received health checkups and donor certificates.",
    impact_metrics: [
      { label: "Blood Units Collected", value: "210" },
      { label: "Lives Saved (Est.)", value: "630" }
    ],
    cover_image: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?q=80&w=1200&auto=format&fit=crop",
    gallery_images: [
      "https://images.unsplash.com/photo-1615461066841-6116e61058f4?q=80&w=1200&auto=format&fit=crop"
    ],
    status: "published",
    is_featured: false,
    created_at: "2024-08-05T15:00:00Z"
  }
];

export const initialGalleryPhotos: GalleryPhoto[] = [
  {
    id: "gal-1",
    event_id: "evt-3",
    album_name: "Magnum Opus Conclave 2024",
    image_url: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1200&auto=format&fit=crop",
    caption: "President Rtn./Rtr. opening the 45th Year Magnum Opus Conclave",
    rotaract_year: "2024-25",
    sort_order: 1,
    created_at: "2024-08-25T10:00:00Z"
  },
  {
    id: "gal-2",
    event_id: "evt-2",
    album_name: "Mangrove Shield Plantation Drive",
    image_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1200&auto=format&fit=crop",
    caption: "RCNM Green Warriors at Palm Beach wetlands",
    rotaract_year: "2024-25",
    sort_order: 2,
    created_at: "2024-07-28T10:00:00Z"
  },
  {
    id: "gal-3",
    event_id: "evt-1",
    album_name: "Project Literacy Drive",
    image_url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1200&auto=format&fit=crop",
    caption: "Distributing educational kits and books to students",
    rotaract_year: "2024-25",
    sort_order: 3,
    created_at: "2024-08-15T10:00:00Z"
  },
  {
    id: "gal-4",
    event_id: "evt-1",
    album_name: "Project Literacy Drive",
    image_url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop",
    caption: "Interactive learning session with computer equipment",
    rotaract_year: "2024-25",
    sort_order: 4,
    created_at: "2024-08-15T11:00:00Z"
  },
  {
    id: "gal-5",
    event_id: "evt-3",
    album_name: "Magnum Opus Conclave 2024",
    image_url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
    caption: "Young leaders participating in panel discussion",
    rotaract_year: "2024-25",
    sort_order: 5,
    created_at: "2024-08-25T14:00:00Z"
  },
  {
    id: "gal-6",
    event_id: "evt-4",
    album_name: "Raktadan Mahadan Blood Donation",
    image_url: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?q=80&w=1200&auto=format&fit=crop",
    caption: "Volunteers assisting blood donors at the station",
    rotaract_year: "2024-25",
    sort_order: 6,
    created_at: "2024-08-04T12:00:00Z"
  }
];

export const initialEditorials: Editorial[] = [
  {
    id: "ed-1",
    title: "MAGNUM OPUS Edition #1 — Crafting 45 Years of Impact",
    slug: "magnum-opus-edition-1",
    author: "Editorial Board 2024-25",
    category: "Monthly Newsletter",
    pdf_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    cover_image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200&auto=format&fit=crop",
    summary: "The inaugural bulletin of RCNM's 45th Year, featuring President's message, project highlights, and member stories.",
    content: "Welcome to the first edition of MAGNUM OPUS, the official monthly bulletin of the Rotaract Club of Navi Mumbai for the Rotaract Year 2024-25! As we cross our 45th year of service, we look back with reverence at our legacy since 1982 and move forward with ambitious initiatives for youth empowerment, civic action, and community care.",
    status: "published",
    published_at: "2024-08-01T10:00:00Z"
  },
  {
    id: "ed-2",
    title: "Why Youth Leadership Matters in Modern Navi Mumbai",
    slug: "why-youth-leadership-matters",
    author: "Rtr. Aditi Sharma",
    category: "Thought Piece",
    pdf_url: null,
    cover_image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop",
    summary: "An introspective piece exploring how young adults are shaping urban governance and civic responsibility.",
    content: "In a fast-growing metropolis like Navi Mumbai, the role of youth extends beyond individual career goals. Being part of an institutional legacy like Rotaract provides a real platform to address environmental challenges, educational disparities, and civic needs. It teaches leadership not through textbooks, but through action.",
    status: "published",
    published_at: "2024-08-18T10:00:00Z"
  }
];

export const initialBoardMembers: BoardMember[] = [
  {
    id: "bm-1",
    name: "Rtr. Yash Sarawgi",
    role: "President (45th Year)",
    rotaract_year: "2024-25",
    bio: "Leading the Rotaract Club of Navi Mumbai into its landmark 45th Year under the theme MAGNUM OPUS.",
    image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
    sort_order: 1,
    social_links: {
      linkedin: "https://linkedin.com",
      instagram: "https://instagram.com",
      email: "rotaractclubofnavimumbai@gmail.com"
    }
  },
  {
    id: "bm-2",
    name: "Rtr. Ananya Kulkarni",
    role: "Club Secretary",
    rotaract_year: "2024-25",
    bio: "Managing club communications, secretarial operations, and inter-club relations in District 3142.",
    image_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop",
    sort_order: 2,
    social_links: {
      linkedin: "https://linkedin.com",
      instagram: "https://instagram.com"
    }
  },
  {
    id: "bm-3",
    name: "Rtr. Rohan Mehta",
    role: "Vice President & Community Director",
    rotaract_year: "2024-25",
    bio: "Spearheading community service initiatives, eco-drives, and blood donation campaigns across Navi Mumbai.",
    image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
    sort_order: 3,
    social_links: {
      linkedin: "https://linkedin.com"
    }
  },
  {
    id: "bm-4",
    name: "Rtr. Priya Verma",
    role: "Editor-in-Chief",
    rotaract_year: "2024-25",
    bio: "Curating the MAGNUM OPUS monthly publications, digital archives, and storytelling media.",
    image_url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=600&auto=format&fit=crop",
    sort_order: 4,
    social_links: {
      instagram: "https://instagram.com"
    }
  }
];

export const initialApplications: JoinApplication[] = [
  {
    id: "app-1",
    name: "Siddharth Nair",
    email: "siddharth.nair@example.com",
    phone: "+91 98201 12345",
    occupation: "Student / Engineering",
    reason: "I want to contribute to environmental projects in Navi Mumbai and develop leadership skills.",
    status: "pending",
    created_at: "2024-08-30T14:30:00Z"
  }
];
