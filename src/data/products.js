export const products = [
  // Rice & Flour
  { id: 1, name: 'Miniket Rice (Premium)', category: 'rice', price: 75, unit: 'kg', image: '🍚', discount: 0, stock: 50, rating: 4.5, description: 'Premium quality Miniket rice, aromatic and fluffy.' },
  { id: 2, name: 'Nazirshail Rice', category: 'rice', price: 82, unit: 'kg', image: '🍚', discount: 5, stock: 40, rating: 4.7, description: 'Finest Nazirshail rice from Dinajpur.' },
  { id: 3, name: 'Chinigura Rice (Aromatic)', category: 'rice', price: 120, unit: 'kg', image: '🍚', discount: 0, stock: 30, rating: 4.8, description: 'Traditional Chinigura aromatic rice for polao and biryani.' },
  { id: 4, name: 'Atta (Whole Wheat Flour)', category: 'rice', price: 55, unit: 'kg', image: '🌾', discount: 10, stock: 60, rating: 4.3, description: 'Fresh stone-ground whole wheat flour.' },
  { id: 5, name: 'Maida (All Purpose Flour)', category: 'rice', price: 50, unit: 'kg', image: '🌾', discount: 0, stock: 45, rating: 4.0, description: 'Fine quality all-purpose flour for baking.' },
  { id: 6, name: 'Suji (Semolina)', category: 'rice', price: 65, unit: 'kg', image: '🌾', discount: 0, stock: 35, rating: 4.2, description: 'Premium semolina for halwa and payesh.' },

  // Dal & Pulses
  { id: 7, name: 'Masoor Dal (Red Lentil)', category: 'dal', price: 130, unit: 'kg', image: '🫘', discount: 8, stock: 55, rating: 4.6, description: 'Premium quality red lentils, cooks fast.' },
  { id: 8, name: 'Mung Dal', category: 'dal', price: 140, unit: 'kg', image: '🫘', discount: 0, stock: 40, rating: 4.5, description: 'Split green gram dal, easy to digest.' },
  { id: 9, name: 'Chola Dal (Bengal Gram)', category: 'dal', price: 110, unit: 'kg', image: '🫘', discount: 5, stock: 45, rating: 4.4, description: 'Bengal gram dal for traditional cooking.' },
  { id: 10, name: 'Motor Dal (Yellow Peas)', category: 'dal', price: 85, unit: 'kg', image: '🫘', discount: 0, stock: 50, rating: 4.2, description: 'Dried yellow peas, great for ghugni.' },
  { id: 11, name: 'Chhola (Chickpeas)', category: 'dal', price: 120, unit: 'kg', image: '🫘', discount: 0, stock: 35, rating: 4.3, description: 'Whole chickpeas for chhola masala.' },

  // Oil & Ghee
  { id: 12, name: 'Soybean Oil (Teer)', category: 'oil', price: 180, unit: 'L', image: '🫗', discount: 5, stock: 70, rating: 4.4, description: 'Teer brand soybean oil, heart healthy.' },
  { id: 13, name: 'Mustard Oil (Pure)', category: 'oil', price: 200, unit: 'L', image: '🫗', discount: 0, stock: 40, rating: 4.6, description: 'Cold pressed pure mustard oil, traditional flavor.' },
  { id: 14, name: 'Rice Bran Oil', category: 'oil', price: 220, unit: 'L', image: '🫗', discount: 10, stock: 30, rating: 4.3, description: 'Premium rice bran oil for healthy cooking.' },
  { id: 15, name: 'Ghee (Aarong)', category: 'oil', price: 850, unit: 'kg', image: '🧈', discount: 0, stock: 25, rating: 4.8, description: 'Pure cow ghee from Aarong Dairy.' },
  { id: 16, name: 'Olive Oil (Extra Virgin)', category: 'oil', price: 750, unit: '500ml', image: '🫒', discount: 15, stock: 20, rating: 4.5, description: 'Imported extra virgin olive oil.' },

  // Spices
  { id: 17, name: 'Holud (Turmeric Powder)', category: 'spices', price: 220, unit: 'kg', image: '🟡', discount: 0, stock: 60, rating: 4.5, description: 'Pure turmeric powder, rich color and aroma.' },
  { id: 18, name: 'Morich Gura (Chili Powder)', category: 'spices', price: 350, unit: 'kg', image: '🌶️', discount: 5, stock: 45, rating: 4.4, description: 'Spicy red chili powder, perfect heat level.' },
  { id: 19, name: 'Dhonia Gura (Coriander)', category: 'spices', price: 280, unit: 'kg', image: '🫙', discount: 0, stock: 40, rating: 4.3, description: 'Freshly ground coriander powder.' },
  { id: 20, name: 'Jeera Gura (Cumin Powder)', category: 'spices', price: 450, unit: 'kg', image: '🫙', discount: 10, stock: 35, rating: 4.6, description: 'Aromatic cumin powder for rich flavor.' },
  { id: 21, name: 'Garam Masala', category: 'spices', price: 500, unit: 'kg', image: '🫙', discount: 0, stock: 30, rating: 4.7, description: 'Blend of premium whole spices, ground fresh.' },
  { id: 22, name: 'Ada (Ginger Paste)', category: 'spices', price: 60, unit: '200g', image: '🫚', discount: 0, stock: 50, rating: 4.2, description: 'Ready-to-use ginger paste.' },
  { id: 23, name: 'Roshun (Garlic Paste)', category: 'spices', price: 65, unit: '200g', image: '🧄', discount: 0, stock: 50, rating: 4.2, description: 'Fresh garlic paste for everyday cooking.' },

  // Dairy
  { id: 24, name: 'Milk (Aarong)', category: 'dairy', price: 85, unit: 'L', image: '🥛', discount: 0, stock: 100, rating: 4.6, description: 'Pasteurized full cream milk.' },
  { id: 25, name: 'Doi (Sweet Yogurt)', category: 'dairy', price: 50, unit: '200g', image: '🍶', discount: 0, stock: 40, rating: 4.5, description: 'Traditional misti doi, creamy and sweet.' },
  { id: 26, name: 'Cheese (Arla)', category: 'dairy', price: 280, unit: '200g', image: '🧀', discount: 5, stock: 25, rating: 4.3, description: 'Imported cheddar cheese slices.' },
  { id: 27, name: 'Butter (Aarong)', category: 'dairy', price: 180, unit: '200g', image: '🧈', discount: 0, stock: 30, rating: 4.4, description: 'Fresh salted butter.' },
  { id: 28, name: 'Paneer (Fresh)', category: 'dairy', price: 350, unit: 'kg', image: '🧊', discount: 0, stock: 20, rating: 4.5, description: 'Fresh homemade style paneer.' },

  // Fruits
  { id: 29, name: 'Banana (Sagor Kola)', category: 'fruits', price: 60, unit: 'dozen', image: '🍌', discount: 0, stock: 50, rating: 4.4, description: 'Fresh Sagor bananas, naturally sweet.' },
  { id: 30, name: 'Apple (Imported)', category: 'fruits', price: 280, unit: 'kg', image: '🍎', discount: 10, stock: 30, rating: 4.3, description: 'Crispy imported red apples.' },
  { id: 31, name: 'Orange (Malta)', category: 'fruits', price: 180, unit: 'kg', image: '🍊', discount: 0, stock: 35, rating: 4.5, description: 'Juicy sweet malta oranges.' },
  { id: 32, name: 'Mango (Himsagar)', category: 'fruits', price: 350, unit: 'kg', image: '🥭', discount: 0, stock: 40, rating: 4.9, description: 'Premium Himsagar mangoes from Rajshahi.' },
  { id: 33, name: 'Grapes (Green)', category: 'fruits', price: 320, unit: 'kg', image: '🍇', discount: 5, stock: 25, rating: 4.2, description: 'Seedless green grapes, imported.' },
  { id: 34, name: 'Papaya', category: 'fruits', price: 40, unit: 'kg', image: '🍈', discount: 0, stock: 30, rating: 4.1, description: 'Ripe sweet papaya.' },

  // Vegetables
  { id: 35, name: 'Alu (Potato)', category: 'vegetables', price: 35, unit: 'kg', image: '🥔', discount: 0, stock: 100, rating: 4.3, description: 'Fresh local potatoes.' },
  { id: 36, name: 'Peyaj (Onion)', category: 'vegetables', price: 55, unit: 'kg', image: '🧅', discount: 0, stock: 80, rating: 4.2, description: 'Premium quality onions.' },
  { id: 37, name: 'Tomato', category: 'vegetables', price: 60, unit: 'kg', image: '🍅', discount: 5, stock: 60, rating: 4.4, description: 'Fresh ripe tomatoes.' },
  { id: 38, name: 'Begun (Eggplant)', category: 'vegetables', price: 40, unit: 'kg', image: '🍆', discount: 0, stock: 45, rating: 4.1, description: 'Fresh purple eggplants.' },
  { id: 39, name: 'Sheem (Flat Beans)', category: 'vegetables', price: 50, unit: 'kg', image: '🫛', discount: 0, stock: 40, rating: 4.3, description: 'Tender flat beans, seasonal.' },
  { id: 40, name: 'Lau (Bottle Gourd)', category: 'vegetables', price: 30, unit: 'piece', image: '🥒', discount: 0, stock: 35, rating: 4.0, description: 'Fresh bottle gourd.' },
  { id: 41, name: 'Mula (Radish)', category: 'vegetables', price: 25, unit: 'kg', image: '🥕', discount: 0, stock: 50, rating: 4.0, description: 'White radish, fresh from farm.' },
  { id: 42, name: 'Phulkopi (Cauliflower)', category: 'vegetables', price: 45, unit: 'piece', image: '🥦', discount: 0, stock: 40, rating: 4.4, description: 'Fresh white cauliflower.' },

  // Snacks
  { id: 43, name: 'Chanachur (Bombay Mix)', category: 'snacks', price: 40, unit: '200g', image: '🍿', discount: 0, stock: 80, rating: 4.5, description: 'Crispy spicy chanachur mix.' },
  { id: 44, name: 'Chips (Lays Classic)', category: 'snacks', price: 30, unit: 'pack', image: '🥨', discount: 0, stock: 100, rating: 4.3, description: 'Classic salted potato chips.' },
  { id: 45, name: 'Biscuit (Nabisco Cream)', category: 'snacks', price: 25, unit: 'pack', image: '🍪', discount: 10, stock: 90, rating: 4.4, description: 'Cream filled sandwich biscuits.' },
  { id: 46, name: 'Cake (Mr. Baker)', category: 'snacks', price: 60, unit: 'pack', image: '🍰', discount: 0, stock: 50, rating: 4.2, description: 'Soft vanilla pound cake.' },
  { id: 47, name: 'Noodles (Maggi)', category: 'snacks', price: 20, unit: 'pack', image: '🍜', discount: 0, stock: 120, rating: 4.6, description: '2-minute masala noodles.' },
  { id: 48, name: 'Toast Biscuit', category: 'snacks', price: 35, unit: 'pack', image: '🍞', discount: 5, stock: 70, rating: 4.1, description: 'Crispy sweet toast biscuit.' },

  // Beverages
  { id: 49, name: 'Cha Pata (Tea Leaves)', category: 'beverages', price: 180, unit: '400g', image: '🍵', discount: 5, stock: 60, rating: 4.7, description: 'Premium BPL tea leaves.' },
  { id: 50, name: 'Coffee (Nescafe)', category: 'beverages', price: 250, unit: '200g', image: '☕', discount: 0, stock: 40, rating: 4.4, description: 'Instant coffee, rich aroma.' },
  { id: 51, name: 'Mango Juice (Frooto)', category: 'beverages', price: 25, unit: '250ml', image: '🧃', discount: 0, stock: 100, rating: 4.3, description: 'Mango fruit drink.' },
  { id: 52, name: 'Mineral Water (MUM)', category: 'beverages', price: 20, unit: '1L', image: '💧', discount: 0, stock: 150, rating: 4.0, description: 'Purified drinking water.' },
  { id: 53, name: 'Coca Cola', category: 'beverages', price: 35, unit: '500ml', image: '🥤', discount: 0, stock: 80, rating: 4.5, description: 'Classic Coca Cola.' },
  { id: 54, name: 'Horlicks', category: 'beverages', price: 350, unit: '500g', image: '🥛', discount: 10, stock: 35, rating: 4.6, description: 'Health drink for the family.' },

  // Meat & Poultry
  { id: 55, name: 'Chicken (Broiler)', category: 'meat', price: 195, unit: 'kg', image: '🍗', discount: 0, stock: 40, rating: 4.5, description: 'Fresh broiler chicken, cleaned.' },
  { id: 56, name: 'Chicken (Deshi/Country)', category: 'meat', price: 650, unit: 'kg', image: '🐔', discount: 0, stock: 15, rating: 4.8, description: 'Free-range country chicken.' },
  { id: 57, name: 'Beef (Bone-in)', category: 'meat', price: 700, unit: 'kg', image: '🥩', discount: 5, stock: 25, rating: 4.4, description: 'Fresh beef with bone, great for curry.' },
  { id: 58, name: 'Mutton (Goat)', category: 'meat', price: 1100, unit: 'kg', image: '🍖', discount: 0, stock: 15, rating: 4.7, description: 'Premium goat meat, fresh cut.' },
  { id: 59, name: 'Egg (Deshi)', category: 'meat', price: 140, unit: 'dozen', image: '🥚', discount: 0, stock: 60, rating: 4.6, description: 'Free-range country eggs.' },

  // Fish & Seafood
  { id: 60, name: 'Rui Mach (Rohu)', category: 'fish', price: 300, unit: 'kg', image: '🐟', discount: 0, stock: 30, rating: 4.5, description: 'Fresh Rohu fish, river caught.' },
  { id: 61, name: 'Ilish Mach (Hilsa)', category: 'fish', price: 1200, unit: 'kg', image: '🐟', discount: 0, stock: 10, rating: 4.9, description: 'Premium Padma Hilsa, the king of fish.' },
  { id: 62, name: 'Pangash Mach', category: 'fish', price: 180, unit: 'kg', image: '🐟', discount: 5, stock: 35, rating: 4.2, description: 'Fresh Pangasius fish.' },
  { id: 63, name: 'Chingri (Prawn)', category: 'fish', price: 550, unit: 'kg', image: '🦐', discount: 0, stock: 20, rating: 4.6, description: 'Medium size fresh prawns.' },
  { id: 64, name: 'Katla Mach', category: 'fish', price: 350, unit: 'kg', image: '🐟', discount: 0, stock: 25, rating: 4.4, description: 'Fresh Katla fish, great for curry.' },

  // Personal Care
  { id: 65, name: 'Soap (Lux)', category: 'personal', price: 45, unit: 'piece', image: '🧼', discount: 0, stock: 100, rating: 4.3, description: 'Lux beauty soap bar.' },
  { id: 66, name: 'Shampoo (Sunsilk)', category: 'personal', price: 220, unit: '340ml', image: '🧴', discount: 10, stock: 50, rating: 4.4, description: 'Sunsilk anti-dandruff shampoo.' },
  { id: 67, name: 'Toothpaste (Closeup)', category: 'personal', price: 120, unit: '150g', image: '🪥', discount: 5, stock: 70, rating: 4.2, description: 'Closeup gel toothpaste, fresh breath.' },
  { id: 68, name: 'Detergent (Wheel)', category: 'personal', price: 85, unit: '500g', image: '🫧', discount: 0, stock: 60, rating: 4.1, description: 'Wheel washing powder.' },
  { id: 69, name: 'Tissue Box', category: 'personal', price: 90, unit: 'box', image: '🧻', discount: 0, stock: 80, rating: 4.0, description: 'Soft facial tissue, 150 sheets.' },

  // Baby Care
  { id: 70, name: 'Baby Diaper (Huggies)', category: 'baby', price: 850, unit: 'pack', image: '👶', discount: 10, stock: 30, rating: 4.6, description: 'Huggies diapers, medium size, 40 pieces.' },
  { id: 71, name: 'Baby Cereal (Cerelac)', category: 'baby', price: 420, unit: '400g', image: '🍼', discount: 5, stock: 25, rating: 4.7, description: 'Nestle Cerelac wheat, 6+ months.' },
  { id: 72, name: 'Baby Wipes', category: 'baby', price: 180, unit: 'pack', image: '🧸', discount: 0, stock: 40, rating: 4.3, description: 'Gentle baby wipes, 80 sheets.' },
]

export const featuredProducts = products.filter(p => [3, 15, 21, 32, 56, 61].includes(p.id))
export const bestSellers = products.filter(p => [1, 7, 12, 24, 35, 47, 49, 55].includes(p.id))
export const discountedProducts = products.filter(p => p.discount > 0)
