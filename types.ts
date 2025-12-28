
export enum Condition {
  NEW = 'Nauja',
  LIKE_NEW = 'Kaip nauja',
  GOOD = 'Gera',
  USED = 'Naudota',
  WORKS_LOOKS_BAD = 'Atrodo ne kaip, bet funkciją atlieka',
  JUNK = 'Šlamštas'
}

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  configuration: string;
  displacement: string;
  power: string;
}

export interface PartCompatibility {
  brand: string;
  model: string;
  configurations: string[];
}

export interface Seller {
  name: string;
  rating: number;
  reviewCount: number;
  avatar: string;
}

export interface Part {
  id: string;
  title: string;
  partCode?: string;
  category: string;
  brand: string;
  compatibility: PartCompatibility;
  price: number;
  condition: Condition;
  location: string;
  description: string;
  imageUrl: string;
  seller: Seller;
  createdAt: string;
}

// Added missing types for order and shipping management
export enum OrderStatus {
  AWAITING_REGISTRATION = 'AWAITING_REGISTRATION',
  LABEL_READY = 'LABEL_READY',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED'
}

export type ParcelSize = 'S' | 'M' | 'L' | 'XL';

export interface Locker {
  id: string;
  type: 'Omniva' | 'DPD' | 'LP Express';
  name: string;
  address: string;
  city: string;
}

export interface Order {
  id: string;
  part: Part;
  status: OrderStatus;
  locker: Locker;
  trackingNumber?: string;
  labelUrl?: string;
  shippingCode?: string;
  parcelSize?: ParcelSize;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface Chat {
  id: string;
  part: Part;
  messages: Message[];
}
