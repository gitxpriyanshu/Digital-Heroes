import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

const charities = [
  {
    name: "Junior Links Foundation",
    description: "Dedicated to providing golf equipment and coaching to underprivileged youth. We believe every child deserves a chance to swing a club.",
    logo_url: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&q=80&w=200",
    website: "https://example.org/junior-links",
    is_featured: true,
    is_active: true
  },
  {
    name: "Green Fairways Project",
    description: "Eco-conscious golf course management and preservation. Funding research into sustainable turf and water management for the sport we love.",
    logo_url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80&w=200",
    website: "https://example.org/green-fairways",
    is_featured: false,
    is_active: true
  },
  {
    name: "Golf for Veteran Heroes",
    description: "Providing physical therapy and community through golf for disabled veterans. Sport as a vehicle for healing and reintegration.",
    logo_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=200",
    website: "https://example.org/veteran-golf",
    is_featured: false,
    is_active: true
  }
];

async function seedCharities() {
  console.log('🌱 Seeding charities...');
  
  const { data, error } = await supabase
    .from('charities')
    .insert(charities)
    .select();

  if (error) {
    console.error('❌ Error seeding:', error.message);
  } else {
    console.log('✅ Successfully seeded', data?.length, 'charities.');
  }
}

seedCharities();
