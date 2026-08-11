const fs = require('fs');
const path = require('path');

const bases = [
  { name: 'Pork Adobo', p: 25, c: 10, f: 22, cal: 350, tags: ['High Protein', 'Classic'], category: 'Lunch', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=400' },
  { name: 'Chicken Adobo', p: 30, c: 8, f: 15, cal: 280, tags: ['High Protein'], category: 'Lunch', image: 'https://images.unsplash.com/photo-1601050690117-94f5f6e0b749?auto=format&fit=crop&q=80&w=400' },
  { name: 'Beef Tapa', p: 35, c: 10, f: 18, cal: 350, tags: ['High Protein', 'Breakfast'], category: 'Breakfast', image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=400' },
  { name: 'Pork Sinigang', p: 20, c: 12, f: 25, cal: 360, tags: ['Comfort', 'Soup'], category: 'Dinner', image: 'https://images.unsplash.com/photo-1548943487-a2e4f43b4859?auto=format&fit=crop&q=80&w=400' },
  { name: 'Shrimp Sinigang', p: 22, c: 10, f: 5, cal: 180, tags: ['Low Calorie', 'Soup'], category: 'Lunch', image: 'https://images.unsplash.com/photo-1548943487-a2e4f43b4859?auto=format&fit=crop&q=80&w=400' },
  { name: 'Bangus (Milkfish) Daing', p: 28, c: 2, f: 15, cal: 260, tags: ['Omega 3', 'Breakfast'], category: 'Breakfast', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=400' },
  { name: 'Lechon Kawali', p: 20, c: 5, f: 35, cal: 420, tags: ['High Fat', 'Indulgence'], category: 'Dinner', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=400' },
  { name: 'Sisig (Pork)', p: 22, c: 8, f: 30, cal: 400, tags: ['High Fat', 'Popular'], category: 'Dinner', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=400' },
  { name: 'Chicken Inasal', p: 40, c: 5, f: 12, cal: 300, tags: ['High Protein', 'Grilled'], category: 'Lunch', image: 'https://images.unsplash.com/photo-1601050690117-94f5f6e0b749?auto=format&fit=crop&q=80&w=400' },
  { name: 'Pinakbet', p: 6, c: 18, f: 8, cal: 160, tags: ['Vegan', 'High Fiber'], category: 'Dinner', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=400' },
  { name: 'Ginisang Monggo', p: 15, c: 25, f: 5, cal: 210, tags: ['Plant Protein', 'Healthy'], category: 'Lunch', image: 'https://images.unsplash.com/photo-1548943487-a2e4f43b4859?auto=format&fit=crop&q=80&w=400' },
  { name: 'Kare-Kare (Beef)', p: 28, c: 15, f: 25, cal: 400, tags: ['Peanut', 'Rich'], category: 'Dinner', image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=400' },
  { name: 'Chicken Tinola', p: 25, c: 10, f: 10, cal: 240, tags: ['Healthy', 'Soup'], category: 'Lunch', image: 'https://images.unsplash.com/photo-1548943487-a2e4f43b4859?auto=format&fit=crop&q=80&w=400' },
  { name: 'Beef Bulalo', p: 30, c: 5, f: 28, cal: 380, tags: ['High Protein', 'Soup'], category: 'Dinner', image: 'https://images.unsplash.com/photo-1548943487-a2e4f43b4859?auto=format&fit=crop&q=80&w=400' },
  { name: 'Pork BBQ Skewers', p: 22, c: 15, f: 12, cal: 260, tags: ['Street Food', 'Grilled'], category: 'Snacks', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=400' },
  { name: 'Lumpia (Pork)', p: 8, c: 12, f: 10, cal: 170, tags: ['Fried', 'Snack'], category: 'Snacks', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=400' },
  { name: 'Lumpiang Sariwa', p: 6, c: 22, f: 5, cal: 160, tags: ['Healthy', 'Vegetarian'], category: 'Snacks', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=400' },
  { name: 'Pancit Canton', p: 12, c: 45, f: 15, cal: 360, tags: ['Noodles', 'Carbs'], category: 'Snacks', image: 'https://images.unsplash.com/photo-1550505095-81378a57bfab?auto=format&fit=crop&q=80&w=400' },
  { name: 'Pancit Bihon', p: 10, c: 40, f: 10, cal: 300, tags: ['Noodles', 'Light'], category: 'Snacks', image: 'https://images.unsplash.com/photo-1550505095-81378a57bfab?auto=format&fit=crop&q=80&w=400' },
  { name: 'Palabok', p: 15, c: 45, f: 18, cal: 400, tags: ['Noodles', 'Rich'], category: 'Snacks', image: 'https://images.unsplash.com/photo-1550505095-81378a57bfab?auto=format&fit=crop&q=80&w=400' },
  { name: 'Halo-Halo', p: 8, c: 60, f: 12, cal: 380, tags: ['Dessert', 'Sweet'], category: 'Drinks', image: 'https://images.unsplash.com/photo-1517282009859-f000ef1b43ea?auto=format&fit=crop&q=80&w=400' },
  { name: 'Taho', p: 10, c: 35, f: 4, cal: 210, tags: ['Sweet', 'Tofu'], category: 'Snacks', image: 'https://images.unsplash.com/photo-1517282009859-f000ef1b43ea?auto=format&fit=crop&q=80&w=400' },
  { name: 'Turon', p: 2, c: 38, f: 10, cal: 250, tags: ['Sweet', 'Fried'], category: 'Snacks', image: 'https://images.unsplash.com/photo-1601050690117-94f5f6e0b749?auto=format&fit=crop&q=80&w=400' },
  { name: 'Banana Cue', p: 1, c: 40, f: 8, cal: 230, tags: ['Sweet', 'Snack'], category: 'Snacks', image: 'https://images.unsplash.com/photo-1601050690117-94f5f6e0b749?auto=format&fit=crop&q=80&w=400' },
  { name: 'Buko Pandan', p: 4, c: 45, f: 15, cal: 340, tags: ['Dessert', 'Coconut'], category: 'Drinks', image: 'https://images.unsplash.com/photo-1517282009859-f000ef1b43ea?auto=format&fit=crop&q=80&w=400' },
  { name: 'Tortang Talong', p: 12, c: 15, f: 18, cal: 270, tags: ['Vegetarian', 'Breakfast'], category: 'Breakfast', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=400' },
  { name: 'Tocino (Pork)', p: 20, c: 25, f: 18, cal: 340, tags: ['Sweet', 'Breakfast'], category: 'Breakfast', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=400' },
  { name: 'Longganisa', p: 18, c: 15, f: 25, cal: 360, tags: ['Sausage', 'Breakfast'], category: 'Breakfast', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=400' },
  { name: 'Garlic Fried Rice', p: 6, c: 45, f: 10, cal: 300, tags: ['Carbs', 'Breakfast'], category: 'Breakfast', image: 'https://images.unsplash.com/photo-1550505095-81378a57bfab?auto=format&fit=crop&q=80&w=400' },
  { name: 'White Rice', p: 4, c: 45, f: 0, cal: 200, tags: ['Carbs', 'Staple'], category: 'Lunch', image: 'https://images.unsplash.com/photo-1550505095-81378a57bfab?auto=format&fit=crop&q=80&w=400' },
  { name: 'Brown Rice', p: 5, c: 42, f: 2, cal: 210, tags: ['High Fiber', 'Healthy'], category: 'Lunch', image: 'https://images.unsplash.com/photo-1550505095-81378a57bfab?auto=format&fit=crop&q=80&w=400' },
  { name: 'Boiled Egg', p: 6, c: 1, f: 5, cal: 70, tags: ['Protein', 'Quick'], category: 'Breakfast', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=400' },
  { name: 'Salted Egg (Itlog na Maalat)', p: 7, c: 2, f: 10, cal: 130, tags: ['Salty', 'Side'], category: 'Breakfast', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=400' },
  { name: 'Calamansi Juice', p: 0, c: 20, f: 0, cal: 80, tags: ['Vitamin C', 'Drink'], category: 'Drinks', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400' },
  { name: 'Buko Juice', p: 1, c: 10, f: 0, cal: 45, tags: ['Hydrating', 'Drink'], category: 'Drinks', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400' },
  { name: 'Peppermint Tea', p: 0, c: 0, f: 0, cal: 0, tags: ['Anti-Bloat', 'Drink'], category: 'Drinks', image: 'https://images.unsplash.com/photo-1576092762791-dd9e2220abd4?auto=format&fit=crop&q=80&w=400' },
  { name: 'Ginger Tea (Salabat)', p: 0, c: 2, f: 0, cal: 10, tags: ['Anti-Bloat', 'Soothing'], category: 'Drinks', image: 'https://images.unsplash.com/photo-1576092762791-dd9e2220abd4?auto=format&fit=crop&q=80&w=400' },
  { name: 'Cucumber Salad', p: 1, c: 5, f: 0, cal: 25, tags: ['Anti-Bloat', 'Fresh'], category: 'Snacks', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=400' },
  { name: 'Papaya', p: 1, c: 15, f: 0, cal: 60, tags: ['Digestion', 'Fruit'], category: 'Breakfast', image: 'https://images.unsplash.com/photo-1517282009859-f000ef1b43ea?auto=format&fit=crop&q=80&w=400' },
  { name: 'Pineapple', p: 1, c: 13, f: 0, cal: 50, tags: ['Enzymes', 'Fruit'], category: 'Snacks', image: 'https://images.unsplash.com/photo-1517282009859-f000ef1b43ea?auto=format&fit=crop&q=80&w=400' },
];

const modifiers = [
  { prefix: '1/2 Portion ', mult: 0.5 },
  { prefix: 'Large Portion ', mult: 1.5 },
  { suffix: ' with Rice', addC: 45, addCal: 200, addP: 4 },
  { suffix: ' with Brown Rice', addC: 42, addCal: 210, addP: 5 },
  { suffix: ' (Spicy)', mult: 1 },
];

let idCounter = 1;
const meals = [];

// Add bases
bases.forEach(b => {
  meals.push({
    id: idCounter++,
    title: b.name,
    category: b.category,
    calories: b.cal,
    protein: b.p,
    carbs: b.c,
    fat: b.f,
    time: Math.floor(Math.random() * 30 + 10) + ' min',
    image: b.image,
    tags: b.tags
  });
});

// Generate variations to hit ~200 items
bases.forEach(b => {
  modifiers.forEach(m => {
    let newName = b.name;
    let p = b.p, c = b.c, f = b.f, cal = b.cal;
    
    if (m.prefix) {
      newName = m.prefix + newName;
      p = Math.round(p * m.mult);
      c = Math.round(c * m.mult);
      f = Math.round(f * m.mult);
      cal = Math.round(cal * m.mult);
    }
    if (m.suffix) {
      newName = newName + m.suffix;
      if (m.addC) c += m.addC;
      if (m.addP) p += m.addP;
      if (m.addCal) cal += m.addCal;
    }

    // Skip some arbitrary ones to keep it somewhat realistic
    if (newName.includes('Juice with Rice')) return;
    if (newName.includes('Tea with Rice')) return;
    if (newName.includes('Rice with Rice')) return;

    meals.push({
      id: idCounter++,
      title: newName,
      category: b.category,
      calories: cal,
      protein: p,
      carbs: c,
      fat: f,
      time: Math.floor(Math.random() * 30 + 10) + ' min',
      image: b.image,
      tags: b.tags
    });
  });
});

const fileContent = `export const mealDictionary = ${JSON.stringify(meals, null, 2)};\n`;

fs.writeFileSync(path.join(__dirname, '../data/mealDictionary.js'), fileContent);
console.log('Successfully generated ' + meals.length + ' meals with precise images!');

