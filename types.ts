export enum Condition {
  NEW = 'Nauja',
  LIKE_NEW = 'Kaip nauja',
  GOOD = 'Gera',
  USED = 'Naudota',
  WORKS_LOOKS_BAD = 'Atrodo ne kaip, bet funkciją atlieka',
  JUNK = 'Šlamštas'
}

export enum OrderStatus {
  PENDING_SHIPMENT = 'Laukiama išsiuntimo',
  SHIPPED = 'Išsiųsta',
  DELIVERED = 'Pristatyta',
  COMPLETED = 'Užbaigta'
}

export interface Locker {
  id: string;
  name: string;
  address: string;
  city: string;
  type: 'Omniva' | 'DPD' | 'LP Express';
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'match' | 'offer' | 'sale';
  read: boolean;
  link?: string;
  timestamp: string;
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

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface Chat {
  id: string;
  part: Part;
  buyer: Seller;
  messages: Message[];
  lastMessageAt: string;
}

export interface Order {
  id: string;
  part: Part;
  status: OrderStatus;
  shippingCode: string;
  createdAt: string;
  locker: Locker;
  paymentMethod: 'card' | 'paypal' | 'bank';
  labelUrl?: string;
}
