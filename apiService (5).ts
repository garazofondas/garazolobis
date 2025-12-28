
import { Part, Order, Locker, OrderStatus, TrackingEvent, ParcelSize } from './types';
import { MOCK_PARTS } from './constants';

// Šiuos kintamuosius vėliau įrašysi iš Supabase/ShipWise paskyrų
const SUPABASE_URL = 'https://tavo-id.supabase.co';
const SUPABASE_KEY = 'tavo-anon-key';
const SHIPWISE_API_URL = 'https://api.shipwise.com/api/v1';

export const CloudDB = {
  /**
   * Paima visas detales iš Supabase.
   * Kol DB nesukonfigūruota, grąžina MOCK duomenis, bet paruošta realiam fetch.
   */
  fetchAllParts: async (): Promise<Part[]> => {
    try {
      // Realus kodas atrodytų taip:
      // const response = await fetch(`${SUPABASE_URL}/rest/v1/parts?select=*`, {
      //   headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
      // });
      // return await response.json();
      
      return new Promise((resolve) => {
        setTimeout(() => {
          const saved = localStorage.getItem('remote_parts');
          resolve(saved ? JSON.parse(saved) : MOCK_PARTS);
        }, 500);
      });
    } catch (error) {
      console.error("DB Error:", error);
      return MOCK_PARTS;
    }
  },

  savePart: async (part: Part): Promise<void> => {
    // Čia vyktų POST užklausa į Supabase
    const saved = localStorage.getItem('remote_parts');
    const currentParts = saved ? JSON.parse(saved) : MOCK_PARTS;
    localStorage.setItem('remote_parts', JSON.stringify([part, ...currentParts]));
  }
};

export const LockerAPI = {
  fetchLockers: async (query: string): Promise<Locker[]> => {
    // Čia galima naudoti kurjerių API tiesiogiai
    const allLockers: Locker[] = [
      { id: 'O1', name: 'MAXIMA XX paštomatas', address: 'Taikos pr. 141', city: 'Kaunas', type: 'Omniva' },
      { id: 'O2', name: 'PC MOLAS paštomatas', address: 'K. Baršausko g. 66A', city: 'Kaunas', type: 'Omniva' },
      { id: 'D1', name: 'IKI Girstupis paštomatas', address: 'Kovo 11-osios g. 22', city: 'Kaunas', type: 'DPD' },
      { id: 'V1', name: 'MAXIMA XXX paštomatas', address: 'Mindaugo g. 11', city: 'Vilnius', type: 'Omniva' },
    ];
    return allLockers.filter(l => 
      l.city.toLowerCase().includes(query.toLowerCase()) || 
      l.address.toLowerCase().includes(query.toLowerCase())
    );
  }
};

export const ShippingAPI = {
  /**
   * Realus siuntos registravimas per ShipWise API.
   * Naudojame tavo ekrane matomą Batch/Create logiką.
   */
  registerShipment: async (orderId: string, size: ParcelSize): Promise<{trackingNumber: string, labelUrl: string}> => {
    console.log(`Siunčiama užklausa į ${SHIPWISE_API_URL}/Batch/Create...`);
    
    // Imituojame realų tinklo vėlavimą ir atsakymą iš ShipWise
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const trackingNum = `CE${Math.floor(10000000 + Math.random() * 90000000)}LT`;
        // Tikram API gautume PDF nuorodą, čia naudojame QR generavimą prototipui
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
            location: status === OrderStatus.IN_TRANSIT ? 'Logistikos Centras' : o.locker.city,
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
      case OrderStatus.LABEL_READY: return 'Pardavėjas sėkmingai apmokėjo siuntimą. Lipdukas paruoštas spausdinimui.';
      case OrderStatus.IN_TRANSIT: return `Kurjeris pamatė siuntą ${type} sistemoje. Kelionė prasidėjo!`;
      case OrderStatus.READY_FOR_PICKUP: return `Dalis pristatyta į paštomatą. Gero krapštymosi garaže!`;
      default: return `Būsena: ${status}`;
    }
  }
};

export const PaymentAPI = {
  processPayment: async (amount: number, method: string): Promise<boolean> => {
    // Čia jungiamasi prie Stripe
    return new Promise((resolve) => setTimeout(() => resolve(true), 1000));
  }
};
