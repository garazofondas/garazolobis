import { Part, Order, Locker } from './types';
import { MOCK_PARTS } from './constants';

/**
 * STRIPE INSTRUKCIJA:
 * 1. Nukopijuok 'Publishable key' (pvz. pk_test_51Sj8Z...) iš savo Stripe lango.
 * 2. Pridėk jį prie savo Vercel Environment Variables kaip STRIPE_PUBLISHABLE_KEY.
 */

// Iš tavo nuotraukos matome testinį raktą (pakeisk savo tikruoju vėliau)
const STRIPE_PK = 'pk_test_51Sj8ZAKPeZ3qFQYJ'; 

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
  fetchLockers: async (city: string): Promise<Locker[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const lockers: Locker[] = [
          { id: 'O1', name: 'MAXIMA XX paštomatas', address: 'Taikos pr. 141', city: 'Kaunas', type: 'Omniva' },
          { id: 'O2', name: 'PC MOLAS paštomatas', address: 'K. Baršausko g. 66A', city: 'Kaunas', type: 'Omniva' },
          { id: 'D1', name: 'IKI Girstupis paštomatas', address: 'Kovo 11-osios g. 22', city: 'Kaunas', type: 'DPD' },
          { id: 'L1', name: 'LIDL paštomatas', address: 'Šiaurės pr. 1A', city: 'Kaunas', type: 'LP Express' },
          { id: 'V1', name: 'MAXIMA XXX paštomatas', address: 'Mindaugo g. 11', city: 'Vilnius', type: 'Omniva' },
          { id: 'V2', name: 'PC PANORAMA paštomatas', address: 'Saltoniškių g. 9', city: 'Vilnius', type: 'DPD' },
        ];
        resolve(lockers.filter(l => l.city.toLowerCase() === city.toLowerCase() || city === ''));
      }, 400);
    });
  }
};

export const PaymentAPI = {
  processPayment: async (amount: number, method: string): Promise<boolean> => {
    console.log(`Inicijuojamas ${method} per Stripe PK: ${STRIPE_PK}`);
    
    // Čia kviečiamas Stripe Checkout:
    // const stripe = (window as any).Stripe(STRIPE_PK);
    // await stripe.redirectToCheckout({ sessionId: '...' });

    return new Promise((resolve) => {
      setTimeout(() => {
        const isSuccess = Math.random() > 0.05; 
        resolve(isSuccess);
      }, 2000);
    });
  }
};

export const ShippingAPI = {
  generateLabel: async (order: Order): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf?order=${order.id}`);
      }, 1500);
    });
  }
};
