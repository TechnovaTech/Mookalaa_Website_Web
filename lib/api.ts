const ADMIN_API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'https://mookala.vercel.app/api';

// Generate realistic demo data
function generateEventData(adminEvent: any) {
  const eventId = adminEvent._id || adminEvent.id;
  if (!eventId) return { price: 299, attendees: 125, rating: '4.2', organizerEvents: 8, organizerFollowers: 450 };
  
  // Use last 4 characters of ID as seed
  const seedStr = eventId.toString().slice(-4);
  const seed = parseInt(seedStr, 16) || 1000;
  
  return {
    price: seed % 4 === 0 ? 0 : Math.floor((seed % 400) + 150), // ₹150-₹550 or free
    attendees: Math.floor((seed % 250) + 75), // 75-325 attendees
    rating: (((seed % 15) / 10) + 3.5).toFixed(1), // 3.5-5.0 rating
    organizerEvents: Math.floor((seed % 12) + 3), // 3-15 events
    organizerFollowers: Math.floor((seed % 600) + 150) // 150-750 followers
  };
}

function transformEvent(adminEvent: any) {
  const getImageUrl = (event: any) => {
    // Check for base64 encoded image in media.bannerImage
    if (event.media?.bannerImage) {
      return `data:image/jpeg;base64,${event.media.bannerImage}`;
    }
    // Check for regular image URLs
    if (event.bannerImage) return event.bannerImage.startsWith('http') ? event.bannerImage : `https://mookala.vercel.app${event.bannerImage}`;
    if (event.image) return event.image.startsWith('http') ? event.image : `https://mookala.vercel.app${event.image}`;
    if (event.imageUrl) return event.imageUrl.startsWith('http') ? event.imageUrl : `https://mookala.vercel.app${event.imageUrl}`;
    return '/placeholder.svg';
  };

  const cleanCategory = (cat: string) => {
    if (!cat) return 'General';
    // Remove 'categories.' prefix if it exists (case insensitive)
    return cat.replace(/^categories\./i, '');
  };

  // Get ticket pricing from tickets array
  const tickets = adminEvent.tickets || [];
  
  // Create price display based on ticket categories
  let priceDisplay = 'Free';
  if (tickets.length > 0) {
    const prices = tickets.map(t => {
      const price = parseInt(t.price.replace(/[₹,]/g, '')) || 0;
      return { type: t.priceType, price: price };
    }).filter(p => p.price > 0);
    
    if (prices.length > 0) {
      const minPrice = Math.min(...prices.map(p => p.price));
      const maxPrice = Math.max(...prices.map(p => p.price));
      
      if (minPrice === maxPrice) {
        priceDisplay = `₹${minPrice}`;
      } else {
        priceDisplay = `₹${minPrice} - ₹${maxPrice}`;
      }
    }
  }
  
  const lowestPrice = tickets.length > 0 
    ? Math.min(...tickets.map(t => parseInt(t.price.replace(/[₹,]/g, '')) || 0))
    : 0;
  const totalCapacity = tickets.reduce((sum, t) => sum + parseInt(t.quantity || 0), 0);
  const totalSold = tickets.reduce((sum, t) => sum + parseInt(t.sold || 0), 0);
  
  // Calculate attendees as percentage of capacity (realistic simulation)
  const attendanceRate = totalCapacity > 0 ? Math.min(0.7, totalSold / totalCapacity) : 0;
  const estimatedAttendees = Math.floor(totalCapacity * attendanceRate);

  return {
    id: adminEvent._id || adminEvent.id,
    title: adminEvent.name || 'Event Title',
    description: adminEvent.description || 'No description available',
    image: getImageUrl(adminEvent),
    date: new Date(adminEvent.startDate || adminEvent.date || Date.now()),
    time: adminEvent.startTime || adminEvent.time || '7:00 PM',
    endDate: adminEvent.endDate ? new Date(adminEvent.endDate) : undefined,
    location: adminEvent.location?.name || 'Venue TBA',
    city: adminEvent.location?.city || 'City TBA',
    coordinates: { lat: 0, lng: 0 },
    category: cleanCategory(adminEvent.category),
    price: lowestPrice,
    priceDisplay: priceDisplay,
    isFree: lowestPrice === 0,
    isOnline: adminEvent.locationType === 'online',
    organizer: {
      id: adminEvent.organizer?._id || '1',
      name: adminEvent.organizer?.name || 'Event Organizer',
      image: adminEvent.organizer?.profileImage || '/placeholder.svg',
      verified: adminEvent.organizer?.kycStatus === 'approved',
      events: adminEvent.organizer?.totalEvents || 0,
      followers: adminEvent.organizer?.followers || 0,
    },
    attendees: estimatedAttendees,
    maxCapacity: totalCapacity,
    tags: adminEvent.languages || adminEvent.subCategories || [adminEvent.category].filter(Boolean),
    featured: false,
    rating: 0,
    tickets: tickets,
    terms: adminEvent.terms,
    scannerStaff: adminEvent.scannerStaff || [],
    artists: adminEvent.artistDetails || [],
    status: adminEvent.status,
    createdAt: adminEvent.createdAt,
    updatedAt: adminEvent.updatedAt
  };
}

export async function fetchApprovedEvents(category?: string) {
  try {
    const url = category 
      ? `${ADMIN_API_URL}/events/approved?category=${encodeURIComponent(category)}`
      : `${ADMIN_API_URL}/events/approved`;
    
    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }
    
    const data = await response.json();
    const events = data.events || [];
    return events.map(transformEvent);
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

export async function fetchCategories() {
  try {
    const response = await fetch(`${ADMIN_API_URL}/categories`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data.map((cat: any) => cat.name) : [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

async function fetchOrganizerEventCount(organizerId: string) {
  try {
    const response = await fetch(`${ADMIN_API_URL}/organizers/${organizerId}`, {
      cache: 'no-store',
    });
    if (response.ok) {
      const data = await response.json();
      return data.organizer?.events?.length || 0;
    }
  } catch (error) {
    console.error('Error fetching organizer events:', error);
  }
  return 0;
}

export async function fetchEventById(id: string) {
  try {
    const response = await fetch(`${ADMIN_API_URL}/events/${id}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch event');
    }
    
    const data = await response.json();
    if (data.event) {
      return transformEvent(data.event);
    }
    return null;
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
}

export interface HomeBanner {
  id: string
  title: string
  image: string
  mediaType: 'image' | 'video'
  link: string
  order: number
}

/**
 * Homepage banners managed from the admin panel. Adding or removing one there
 * changes the site on the next load — nothing is hardcoded.
 *
 * The API returns every row whatever its state, so inactive banners are
 * dropped here; without that, deactivating one in the panel would leave it
 * live on the site.
 */
export async function fetchBanners(): Promise<HomeBanner[]> {
  try {
    const response = await fetch(`${ADMIN_API_URL}/banners`, {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    })
    if (!response.ok) throw new Error('Failed to fetch banners')

    const data = await response.json()
    const banners = Array.isArray(data.banners) ? data.banners : []

    return banners
      .filter((b: any) => (b.status || 'active') === 'active' && b.image)
      .map((b: any) => ({
        id: String(b._id || ''),
        title: b.title || '',
        image: String(b.image),
        mediaType: b.mediaType === 'video' ? 'video' : 'image',
        link: b.link || '',
        order: Number(b.order) || 0,
      }))
      .sort((a: HomeBanner, b: HomeBanner) => a.order - b.order)
  } catch (error) {
    console.error('Error fetching banners:', error)
    return []
  }
}

export interface SponsorAd {
  id: string
  title: string
  image: string
  mediaType: 'image' | 'video'
  link: string
  sponsor: string
  order: number
}

/**
 * Sponsor ads from the admin panel, filtered the same way the mobile app
 * filters them: active only, and only while today sits inside the campaign's
 * start/end dates. An ad whose window has passed disappears on its own.
 */
export async function fetchAds(): Promise<SponsorAd[]> {
  try {
    const response = await fetch(`${ADMIN_API_URL}/ads`, {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    })
    if (!response.ok) throw new Error('Failed to fetch ads')

    const data = await response.json()
    const ads = Array.isArray(data.ads) ? data.ads : []
    const now = Date.now()

    return ads
      .filter((ad: any) => {
        if ((ad.status || 'active') !== 'active' || !ad.image) return false

        // Missing or unparseable dates mean "no window", so the ad runs.
        const start = ad.startDate ? Date.parse(ad.startDate) : NaN
        const end = ad.endDate ? Date.parse(ad.endDate) : NaN
        if (Number.isNaN(start) || Number.isNaN(end)) return true

        // End date is inclusive — the campaign runs through that whole day.
        return now >= start && now <= end + 24 * 60 * 60 * 1000
      })
      .map((ad: any) => ({
        id: String(ad._id || ''),
        title: ad.title || '',
        image: String(ad.image),
        mediaType: ad.mediaType === 'video' ? 'video' : 'image',
        link: ad.link || '',
        sponsor: ad.sponsor || '',
        order: Number(ad.order) || 0,
      }))
      .sort((a: SponsorAd, b: SponsorAd) => a.order - b.order)
  } catch (error) {
    console.error('Error fetching ads:', error)
    return []
  }
}
