
import { Part, Condition } from './types';

export const CATEGORIES = [
  'Variklio dalys',
  'Važiuoklė',
  'Elektros sistema',
  'Kėbulas',
  'Interjeras',
  'Ratai ir padangos',
  'Apšvietimas',
  'Įrankiai',
  'Dirbtuvių įranga',
  'Eksploatacinės medžiagos',
  'Priedai / Tiuningas'
];

export const MOCK_PARTS: Part[] = [
  {
    id: '1',
    title: 'BMW E46 M3 Vairas',
    partCode: '32302229102',
    category: 'Interjeras',
    brand: 'BMW',
    compatibility: {
      brand: 'BMW',
      model: '3 Serija',
      configurations: ['Sedanas', 'Kupė', 'Universalas'],
      minDisplacement: '1.8',
      minPower: '85'
    },
    price: 350,
    condition: Condition.LIKE_NEW,
    location: 'Vilnius',
    description: 'Originalus BMW E46 M3 vairas, oda puikios būklės. Mygtukai veikia.',
    imageUrl: 'https://images.unsplash.com/photo-1570733577524-3a047079e80d?auto=format&fit=crop&q=80&w=600',
    seller: {
      name: 'Tomas V.',
      rating: 4.8,
      reviewCount: 12,
      avatar: 'https://picsum.photos/seed/user1/100/100'
    },
    createdAt: '2023-10-25T10:00:00Z'
  },
  {
    id: '2',
    title: 'Audi A4 B8 LED Žibintas (Kairys)',
    partCode: '8K0941029C',
    category: 'Apšvietimas',
    brand: 'Audi',
    compatibility: {
      brand: 'Audi',
      model: 'A4',
      configurations: ['Sedanas', 'Avant'],
      minDisplacement: '1.8',
      minPower: '88'
    },
    price: 120,
    condition: Condition.WORKS_LOOKS_BAD,
    location: 'Kaunas',
    description: 'Veikiantis, bet stiklas pabraižytas ir vienas auselės tvirtinimas pasvilęs. Funkciją atlieka.',
    imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=600',
    seller: {
      name: 'Andrius R.',
      rating: 4.5,
      reviewCount: 5,
      avatar: 'https://picsum.photos/seed/user2/100/100'
    },
    createdAt: '2023-10-24T15:30:00Z'
  },
  {
    id: '3',
    title: 'Gedore galvučių rinkinys (1/2")',
    category: 'Įrankiai',
    brand: 'Gedore',
    compatibility: {
      brand: 'Universalu',
      model: 'Visiems modeliams',
      configurations: ['Visi tipai']
    },
    price: 45,
    condition: Condition.USED,
    location: 'Panevėžys',
    description: 'Naudotas rinkinys, trūksta 10mm galvutės (kaip visada), bet terkšlė veikia idealiai.',
    imageUrl: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=600',
    seller: {
      name: 'Garažo Valymas',
      rating: 4.2,
      reviewCount: 8,
      avatar: 'https://picsum.photos/seed/cleanup/100/100'
    },
    createdAt: '2023-10-26T12:00:00Z'
  },
  {
    id: '4',
    title: 'Rūdžių krūva (R15 VW Skardos)',
    category: 'Ratai ir padangos',
    brand: 'VW',
    compatibility: {
      brand: 'VW',
      model: 'Golf/Passat',
      configurations: ['Universalu']
    },
    price: 10,
    condition: Condition.JUNK,
    location: 'Šiauliai',
    description: 'Tikras šlamštas, stipriai surūdiję, bet gal kam nors prireiks metalo laužui ar žiemos projektui.',
    imageUrl: 'https://images.unsplash.com/photo-1506191632581-22878d2b96d9?auto=format&fit=crop&q=80&w=600',
    seller: {
      name: 'Petras',
      rating: 3.5,
      reviewCount: 2,
      avatar: 'https://picsum.photos/seed/petras/100/100'
    },
    createdAt: '2023-10-27T08:00:00Z'
  }
];
