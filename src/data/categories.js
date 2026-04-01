import {
  GiRiceCooker, GiWheat, GiOilDrum, GiChiliPepper, GiMilkCarton,
  GiFruitBowl, GiCarrot, GiCookie, GiSodaCan, GiChickenOven,
  GiFlatfish, GiSoap, GiBabyBottle
} from 'react-icons/gi'
import { MdLocalGroceryStore } from 'react-icons/md'

export const categories = [
  { id: 'all', name: 'All Products', icon: MdLocalGroceryStore, color: '#16a34a' },
  { id: 'rice', name: 'Rice & Flour', icon: GiRiceCooker, color: '#f59e0b' },
  { id: 'dal', name: 'Dal & Pulses', icon: GiWheat, color: '#d97706' },
  { id: 'oil', name: 'Oil & Ghee', icon: GiOilDrum, color: '#eab308' },
  { id: 'spices', name: 'Spices', icon: GiChiliPepper, color: '#ef4444' },
  { id: 'dairy', name: 'Dairy', icon: GiMilkCarton, color: '#3b82f6' },
  { id: 'fruits', name: 'Fruits', icon: GiFruitBowl, color: '#22c55e' },
  { id: 'vegetables', name: 'Vegetables', icon: GiCarrot, color: '#65a30d' },
  { id: 'snacks', name: 'Snacks', icon: GiCookie, color: '#f97316' },
  { id: 'beverages', name: 'Beverages', icon: GiSodaCan, color: '#0ea5e9' },
  { id: 'meat', name: 'Meat & Poultry', icon: GiChickenOven, color: '#dc2626' },
  { id: 'fish', name: 'Fish & Seafood', icon: GiFlatfish, color: '#0284c7' },
  { id: 'personal', name: 'Personal Care', icon: GiSoap, color: '#8b5cf6' },
  { id: 'baby', name: 'Baby Care', icon: GiBabyBottle, color: '#ec4899' },
]
