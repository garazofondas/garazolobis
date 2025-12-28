
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';
import { Part, Locker, OrderStatus } from './types';
import { MOCK_PARTS } from './constants';

const getConfigs = () => ({
  supabaseUrl: localStorage.getItem('config_supabase_url'),
  supabaseKey: localStorage.getItem('config_supabase_key'),
});

const getSupabase = () => {
  const { supabaseUrl, supabaseKey } = getConfigs();
  if (supabaseUrl && supabaseKey && supabaseUrl.startsWith('http')) {
    try {
      return createClient(supabaseUrl, supabaseKey);
    } catch (e) {
      return null;
    }
  }
  return null;
};

export const CloudDB = {
  testConnection: async () => {
    const supabase = getSupabase();
    if (!supabase) return { success: false, message: "Trūksta nustatymų laukeliuose." };
    
    try {
      // Bandome atlikti užklausą su trumpu laukimo laiku
      const { error } = await supabase.from('parts').select('id').limit(1);
      
      if (error) {
        if (error.code === 'PGRST116' || error.message.includes('relation "parts" does not exist')) {
          return { success: false, message: "Klaida: Lentelė 'parts' nerasta! Ar paleidote SQL kodą?" };
        }
        throw error;
      }
      return { success: true, message: "Garažas sėkmingai pajungtas!" };
    } catch (e: any) {
      console.error("Supabase error:", e);
      return { success: false, message: "Nepavyko prisijungti. Patikrinkite URL ir raktą." };
    }
  },

  fetchAllParts: async (): Promise<Part[]> => {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('parts').select('*').order('createdAt', { ascending: false });
        if (!error && data) return data as Part[];
      } catch (e) {
        console.warn("DB klaida, naudojami mock duomenys.");
      }
    }
    const local = localStorage.getItem('local_parts');
    const localParts = local ? JSON.parse(local) : [];
    return [...localParts, ...MOCK_PARTS];
  },

  savePart: async (part: Part) => {
    const supabase = getSupabase();
    if (supabase) {
      const { error } = await supabase.from('parts').insert([part]);
      if (error) console.error("DB išsaugojimo klaida:", error);
    } else {
      const local = localStorage.getItem('local_parts');
      const parts = local ? JSON.parse(local) : [];
      localStorage.setItem('local_parts', JSON.stringify([part, ...parts]));
    }
  }
};

export const ShippingAPI = {
  registerShipment: async (orderId: string, size: string) => ({
    trackingNumber: 'GL-' + Math.random().toString(36).toUpperCase().substring(2, 10),
    labelUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' + orderId,
    shippingCode: Math.floor(100000 + Math.random() * 900000).toString()
  }),
  updateStatus: async (orderId: string, status: OrderStatus) => true
};

export const PaymentAPI = {
  processPayment: async (amount: number, method: string) => new Promise(r => setTimeout(() => r(true), 1500))
};

export const LockerAPI = {
  fetchLockers: async (search: string) => {
    const all: Locker[] = [
      { id: '1', type: 'Omniva', name: 'Vilniaus Akropolis', address: 'Ozo g. 25', city: 'Vilnius' },
      { id: '2', type: 'DPD', name: 'Kauno Mega', address: 'Islandijos pl. 32', city: 'Kaunas' }
    ];
    return search ? all.filter(l => l.name.toLowerCase().includes(search.toLowerCase())) : all;
  }
};
