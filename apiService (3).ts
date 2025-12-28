import { Part, Order, Locker, OrderStatus, TrackingEvent } from './types';
import { MOCK_PARTS } from './constants';

export const CloudDB = {
  fetchAllParts: async (): Promise<Part[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const saved = localStorage.getItem('remote_parts');
        const remoteParts = saved ? JSON.parse(saved) : MOCK_PARTS;
        resolve(remoteParts);
      }, 500);
    });
  },

  savePart: async (part: Part): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const saved = localStorage.getItem('remote_parts');
        const currentParts = saved ? JSON.parse(saved) : MOCK_PARTS;
        const updatedParts = [part, ...currentParts];
        localStorage.setItem('remote_parts', JSON.stringify(updatedParts));
        resolve();
      }, 800);
    });
  }
};

export const LockerAPI = {
  fetchLockers: async (query: string): Promise<Locker[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const allLockers: Locker[] = [
          { id: 'O1', name: 'MAXIMA XX paštomatas', address: 'Taikos pr. 141', city: 'Kaunas', type: 'Omniva' },
          { id: 'O2', name: 'PC MOLAS paštomatas', address: 'K. Baršausko g. 66A', city: 'Kaunas', type: 'Omniva' },
          { id: 'D1', name: 'IKI Girstupis paštomatas', address: 'Kovo 11-osios g. 22', city: 'Kaunas', type: 'DPD' },
          { id: 'L1', name: 'LIDL paštomatas', address: 'Šiaurės pr. 1A', city: 'Kaunas', type: 'LP Express' },
          { id: 'V1', name: 'MAXIMA XXX paštomatas', address: 'Mindaugo g. 11', city: 'Vilnius', type: 'Omniva' },
          { id: 'V2', name: 'PC PANORAMA paštomatas', address: 'Saltoniškių g. 9', city: 'Vilnius', type: 'DPD' },
        ];
        
        const filtered = allLockers.filter(l => 
          l.city.toLowerCase().includes(query.toLowerCase()) || 
          l.address.toLowerCase().includes(query.toLowerCase()) ||
          l.name.toLowerCase().includes(query.toLowerCase())
        );
        resolve(filtered);
      }, 300);
    });
  }
};

export const ShippingAPI = {
  generateLabel: async (order: Order): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${order.trackingNumber}`);
      }, 1000);
    });
  },

  updateStatus: async (orderId: string, status: OrderStatus): Promise<void> => {
    return new Promise((resolve) => {
      const saved = localStorage.getItem('my_orders');
      if (saved) {
        const orders: Order[] = JSON.parse(saved);
        const updated = orders.map(o => {
          if (o.id === orderId) {
            const newEvent: TrackingEvent = {
              status: status,
              location: status === OrderStatus.IN_TRANSIT ? 'Logistikos centras' : 'Pristatymo vieta',
              timestamp: new Date().toISOString()
            };
            return { ...o, status, trackingHistory: [...(o.trackingHistory || []), newEvent] };
          }
          return o;
        });
        localStorage.setItem('my_orders', JSON.stringify(updated));
      }
      setTimeout(resolve, 500);
    });
  }
};

export const PaymentAPI = {
  processPayment: async (amount: number, method: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 1500);
    });
  }
};