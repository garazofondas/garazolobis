
import { Part, Order, Locker, OrderStatus, TrackingEvent, ParcelSize } from './types';
import { MOCK_PARTS } from './constants';

const getConfigs = () => ({
  supabaseUrl: localStorage.getItem('config_supabase_url'),
  supabaseKey: localStorage.getItem('config_supabase_key'),
  dpdUser: localStorage.getItem('config_dpd_user'),
  dpdPass: localStorage.getItem('config_dpd_pass'),
  dpdApiUrl: 'https://api.dpd.lt/v1'
});

export const CloudDB = {
  fetchAllParts: async (): Promise<Part[]> => {
    const { supabaseUrl, supabaseKey } = getConfigs();
    
    // Čia ateityje bus Supabase fetch
    return new Promise((resolve) => {
      setTimeout(() => {
        const saved = localStorage.getItem('remote_parts');
        resolve(saved ? JSON.parse(saved) : MOCK_PARTS);
      }, 500);
    });
  },

  savePart: async (part: Part): Promise<void> => {
    const saved = localStorage.getItem('remote_parts');
    const currentParts = saved ? JSON.parse(saved) : MOCK_PARTS;
    localStorage.setItem('remote_parts', JSON.stringify([part, ...currentParts]));
  }
};

export const LockerAPI = {
  fetchLockers: async (query: string): Promise<Locker[]> => {
    // Tikri DPD paštomatai
    const allLockers: Locker[] = [
      { id: 'D1', name: 'DPD paštomatas - IKI Girstupis', address: 'Kovo 11-osios g. 22', city: 'Kaunas', type: 'DPD' },
      { id: 'D2', name: 'DPD paštomatas - PC AKROPOLIS', address: 'Karaliaus Mindaugo pr. 49', city: 'Kaunas', type: 'DPD' },
      { id: 'D3', name: 'DPD paštomatas - MAXIMA XXX', address: 'Mindaugo g. 11', city: 'Vilnius', type: 'DPD' },
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
    const { dpdUser, dpdPass } = getConfigs();
    
    if (!dpdUser || !dpdPass) {
      console.warn("DPD API duomenys nerasti. Naudojama simuliacija.");
    } else {
      console.log(`Jungiamasi tiesiogiai prie DPD (User: ${dpdUser})...`);
    }
    
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
      default: return `Būsena: ${status}`;
    }
  }
};

export const PaymentAPI = {
  processPayment: async (amount: number, method: string): Promise<boolean> => {
    return new Promise((resolve) => setTimeout(() => resolve(true), 1000));
  }
};
