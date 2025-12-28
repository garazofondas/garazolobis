
import { Part, Order } from './types';
import { MOCK_PARTS } from './constants';

export const CloudDB = {
  uploadImage: async (base64: string): Promise<string> => {
    return new Promise((resolve) => {
      // Simuliuojame įkėlimą į serverį
      setTimeout(() => resolve(base64), 1000);
    });
  },

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

export const ShippingAPI = {
  generateLabel: async (order: Order): Promise<string> => {
    return new Promise((resolve) => {
      console.log(`Jungiamasi prie ${order.lockerType} API...`);
      setTimeout(() => {
        resolve(`https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf?order=${order.id}`);
      }, 1500);
    });
  }
};
