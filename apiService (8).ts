
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';
import { Part, Order, Locker, OrderStatus, TrackingEvent, ParcelSize } from './types';
import { MOCK_PARTS } from './constants';

const getConfigs = () => ({
  supabaseUrl: localStorage.getItem('config_supabase_url'),
  supabaseKey: localStorage.getItem('config_supabase_key'),
  dpdUser: localStorage.getItem('config_dpd_user'),
  dpdPass: localStorage.getItem('config_dpd_pass'),
  dpdApiUrl: 'https://api.dpd.lt/v1' // Tikras DPD API galas
});

// Dinaminis Supabase kliento kūrimas
const getSupabase = () => {
  const { supabaseUrl, supabaseKey } = getConfigs();
  if (supabaseUrl && supabaseKey) {
    return createClient(supabaseUrl, supabaseKey);
  }
  return null;
};

export const CloudDB = {
  fetchAllParts: async (): Promise<Part[]> => {
    const supabase = getSupabase();
    
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('parts')
          .select('*')
          .order('createdAt', { ascending: false });
          
        if (error) throw error;
        return data as Part[];
      } catch (error) {
        console.error("Supabase klaidų gaunant dalis:", error);
        return MOCK_PARTS; // Fallback jei DB lūžo
      }
    }
    
    // Jei nėra sukonfigūruota - naudojam localStorage kaip laikiną DB
    const saved = localStorage.getItem('remote_parts');
    return saved ? JSON.parse(saved) : MOCK_PARTS;
  },

  savePart: async (part: Part): Promise<void> => {
    const supabase = getSupabase();
    
    if (supabase) {
      const { error } = await supabase
        .from('parts')
        .insert([part]);
      
      if (error) {
        console.error("Nepavyko išsaugoti Supabase:", error);
        throw error;
      }
      return;
    }
    
    // Fallback į local
    const saved = localStorage.getItem('remote_parts');
    const currentParts = saved ? JSON.parse(saved) : MOCK_PARTS;
    localStorage.setItem('remote_parts', JSON.stringify([part, ...currentParts]));
  }
};

export const LockerAPI = {
  fetchLockers: async (query: string): Promise<Locker[]> => {
    // Čia ateityje DPD taškų API užklausa
    const allLockers: Locker[] = [
      { id: 'D1', name: 'DPD paštomatas - IKI Girstupis', address: 'Kovo 11-osios g. 22', city: 'Kaunas', type: 'DPD' },
      { id: 'D2', name: 'DPD paštomatas - PC AKROPOLIS', address: 'Karaliaus Mindaugo pr. 49', city: 'Kaunas', type: 'DPD' },
      { id: 'D3', name: 'DPD paštomatas - MAXIMA XXX', address: 'Mindaugo g. 11', city: 'Vilnius', type: 'DPD' },
      { id: 'D4', name: 'DPD paštomatas - PC RYO', address: 'Savitiškio g. 61', city: 'Panevėžys', type: 'DPD' },
      { id: 'O1', name: 'Omniva - MAXIMA XX', address: 'Taikos pr. 141', city: 'Kaunas', type: 'Omniva' },
    ];
    return allLockers.filter(l => 
      l.city.toLowerCase().includes(query.toLowerCase()) || 
      l.address.toLowerCase().includes(query.toLowerCase())
    );
  }
};

export const ShippingAPI = {
  registerShipment: async (orderId: string, size: ParcelSize): Promise<{trackingNumber: string, labelUrl: string}> => {
    const { dpdUser, dpdPass, dpdApiUrl } = getConfigs();
    
    if (dpdUser && dpdPass) {
      console.log(`[DPD] Generuojamas manifestas užsakymui ${orderId}...`);
      try {
        // Tikra užklausa į DPD API (simuliuojama struktūra)
        /*
        const response = await fetch(`${dpdApiUrl}/shipments`, {
          method: 'POST',
          headers: {
            'Authorization': 'Basic ' + btoa(`${dpdUser}:${dpdPass}`),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ parcel_size: size, ... })
        });
        const data = await response.json();
        return { trackingNumber: data.id, labelUrl: data.label };
        */
      } catch (e) {
        console.error("DPD API Error:", e);
      }
    }
    
    // Jei nėra konfigūracijos - simuliuojame sėkmę prototipui
    return new Promise((resolve) => {
      setTimeout(() => {
        const trackingNum = `DPD${Math.floor(10000000 + Math.random() * 90000000)}LT`;
        resolve({
          trackingNumber: trackingNum,
          labelUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${trackingNum}`
        });
      }, 1500);
    });
  },

  updateStatus: async (orderId: string, status: OrderStatus): Promise<void> => {
    const saved = localStorage.getItem('my_orders');
    if (saved) {
      const orders: Order[] = JSON.parse(saved);
      const updated = orders.map(o => {
        if (o.id === orderId) {
          const historyEntry: TrackingEvent = {
            status: status,
            location: 'DPD Rūšiavimo Centras',
            timestamp: new Date().toISOString(),
            description: ShippingAPI.getStatusDescription(status, o.locker.type)
          };
          return { ...o, status, trackingHistory: [...(o.trackingHistory || []), historyEntry] };
        }
        return o;
      });
      localStorage.setItem('my_orders', JSON.stringify(updated));
    }
  },

  getStatusDescription(status: OrderStatus, type: string): string {
    switch(status) {
      case OrderStatus.LABEL_READY: return 'DPD manifestas sugeneruotas. Ruoškite siuntą.';
      case OrderStatus.IN_TRANSIT: return `Siunta paimta iš terminalo ir juda DPD tinklu.`;
      case OrderStatus.READY_FOR_PICKUP: return `Siunta pristatyta į pasirinktą DPD tašką.`;
      case OrderStatus.DELIVERED: return `Siunta sėkmingai atsiimta. Pinigai pervedami pardavėjui.`;
      default: return `Būsena: ${status}`;
    }
  }
};

export const PaymentAPI = {
  processPayment: async (amount: number, method: string): Promise<boolean> => {
    // Stripe integracijos taškas
    return new Promise((resolve) => setTimeout(() => resolve(true), 1200));
  }
};
