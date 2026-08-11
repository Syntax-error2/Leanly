const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, 'src/data/mealDictionary.js');
let content = fs.readFileSync(p, 'utf-8');

const moreFoods = `
  // FRUITS
  { id: 'f-1', title: 'Orange (Medium)', category: 'Snacks', calories: 62, protein: 1, carbs: 15, fat: 0, time: '0 min', tags: ['Fruit'] },
  { id: 'f-2', title: 'Strawberries (1 cup)', category: 'Snacks', calories: 49, protein: 1, carbs: 12, fat: 0, time: '0 min', tags: ['Fruit'] },
  { id: 'f-3', title: 'Grapes (1 cup)', category: 'Snacks', calories: 104, protein: 1, carbs: 27, fat: 0, time: '0 min', tags: ['Fruit'] },
  { id: 'f-4', title: 'Watermelon (1 cup)', category: 'Snacks', calories: 46, protein: 1, carbs: 11, fat: 0, time: '0 min', tags: ['Fruit'] },
  { id: 'f-5', title: 'Pineapple (1 cup)', category: 'Snacks', calories: 82, protein: 1, carbs: 22, fat: 0, time: '0 min', tags: ['Fruit'] },
  { id: 'f-6', title: 'Mango (1 cup)', category: 'Snacks', calories: 99, protein: 1, carbs: 25, fat: 0, time: '0 min', tags: ['Fruit'] },
  { id: 'f-7', title: 'Blueberries (1 cup)', category: 'Snacks', calories: 84, protein: 1, carbs: 21, fat: 0, time: '0 min', tags: ['Fruit'] },
  { id: 'f-8', title: 'Peach (Medium)', category: 'Snacks', calories: 59, protein: 1, carbs: 14, fat: 0, time: '0 min', tags: ['Fruit'] },
  { id: 'f-9', title: 'Pear (Medium)', category: 'Snacks', calories: 101, protein: 1, carbs: 27, fat: 0, time: '0 min', tags: ['Fruit'] },
  { id: 'f-10', title: 'Kiwi (Medium)', category: 'Snacks', calories: 42, protein: 1, carbs: 10, fat: 0, time: '0 min', tags: ['Fruit'] },
  { id: 'f-11', title: 'Plum (Medium)', category: 'Snacks', calories: 30, protein: 0, carbs: 8, fat: 0, time: '0 min', tags: ['Fruit'] },
  { id: 'f-12', title: 'Raspberries (1 cup)', category: 'Snacks', calories: 64, protein: 1, carbs: 15, fat: 0, time: '0 min', tags: ['Fruit'] },
  { id: 'f-13', title: 'Blackberries (1 cup)', category: 'Snacks', calories: 62, protein: 2, carbs: 14, fat: 1, time: '0 min', tags: ['Fruit'] },
  { id: 'f-14', title: 'Papaya (1 cup)', category: 'Snacks', calories: 62, protein: 1, carbs: 16, fat: 0, time: '0 min', tags: ['Fruit'] },
  { id: 'f-15', title: 'Cantaloupe (1 cup)', category: 'Snacks', calories: 53, protein: 1, carbs: 13, fat: 0, time: '0 min', tags: ['Fruit'] },
  { id: 'f-16', title: 'Honeydew (1 cup)', category: 'Snacks', calories: 61, protein: 1, carbs: 15, fat: 0, time: '0 min', tags: ['Fruit'] },
  { id: 'f-17', title: 'Cherry (1 cup)', category: 'Snacks', calories: 87, protein: 1, carbs: 22, fat: 0, time: '0 min', tags: ['Fruit'] },
  { id: 'f-18', title: 'Pomegranate (Half)', category: 'Snacks', calories: 117, protein: 2, carbs: 26, fat: 2, time: '0 min', tags: ['Fruit'] },
  { id: 'f-19', title: 'Fig (Medium)', category: 'Snacks', calories: 37, protein: 0, carbs: 10, fat: 0, time: '0 min', tags: ['Fruit'] },
  { id: 'f-20', title: 'Grapefruit (Half)', category: 'Snacks', calories: 52, protein: 1, carbs: 13, fat: 0, time: '0 min', tags: ['Fruit'] },
  
  // VEGETABLES
  { id: 'v-1', title: 'Carrot (Medium)', category: 'Snacks', calories: 25, protein: 1, carbs: 6, fat: 0, time: '0 min', tags: ['Veggie'] },
  { id: 'v-2', title: 'Cucumber (Half)', category: 'Snacks', calories: 16, protein: 1, carbs: 4, fat: 0, time: '0 min', tags: ['Veggie'] },
  { id: 'v-3', title: 'Tomato (Medium)', category: 'Snacks', calories: 22, protein: 1, carbs: 5, fat: 0, time: '0 min', tags: ['Veggie'] },
  { id: 'v-4', title: 'Bell Pepper (Medium)', category: 'Snacks', calories: 31, protein: 1, carbs: 7, fat: 0, time: '0 min', tags: ['Veggie'] },
  { id: 'v-5', title: 'Zucchini (1 cup)', category: 'Dinner', calories: 21, protein: 1, carbs: 4, fat: 0, time: '5 min', tags: ['Veggie'] },
  { id: 'v-6', title: 'Cauliflower (1 cup)', category: 'Dinner', calories: 27, protein: 2, carbs: 5, fat: 0, time: '10 min', tags: ['Veggie'] },
  { id: 'v-7', title: 'Cabbage (1 cup)', category: 'Lunch', calories: 22, protein: 1, carbs: 5, fat: 0, time: '5 min', tags: ['Veggie'] },
  { id: 'v-8', title: 'Green Beans (1 cup)', category: 'Dinner', calories: 31, protein: 2, carbs: 7, fat: 0, time: '10 min', tags: ['Veggie'] },
  { id: 'v-9', title: 'Asparagus (1 cup)', category: 'Dinner', calories: 27, protein: 3, carbs: 5, fat: 0, time: '10 min', tags: ['Veggie'] },
  { id: 'v-10', title: 'Eggplant (1 cup)', category: 'Dinner', calories: 20, protein: 1, carbs: 5, fat: 0, time: '15 min', tags: ['Veggie'] },
  { id: 'v-11', title: 'Celery (2 stalks)', category: 'Snacks', calories: 15, protein: 1, carbs: 3, fat: 0, time: '0 min', tags: ['Veggie'] },
  { id: 'v-12', title: 'Mushroom (1 cup)', category: 'Lunch', calories: 15, protein: 2, carbs: 2, fat: 0, time: '5 min', tags: ['Veggie'] },
  { id: 'v-13', title: 'Onion (Medium)', category: 'Lunch', calories: 44, protein: 1, carbs: 10, fat: 0, time: '5 min', tags: ['Veggie'] },
  { id: 'v-14', title: 'Garlic (3 cloves)', category: 'Lunch', calories: 13, protein: 1, carbs: 3, fat: 0, time: '0 min', tags: ['Veggie'] },
  { id: 'v-15', title: 'Kale (1 cup)', category: 'Lunch', calories: 33, protein: 3, carbs: 6, fat: 1, time: '5 min', tags: ['Veggie'] },
  { id: 'v-16', title: 'Lettuce (1 cup)', category: 'Lunch', calories: 5, protein: 0, carbs: 1, fat: 0, time: '0 min', tags: ['Veggie'] },
  { id: 'v-17', title: 'Peas (1 cup)', category: 'Dinner', calories: 118, protein: 8, carbs: 21, fat: 1, time: '5 min', tags: ['Veggie'] },
  { id: 'v-18', title: 'Radish (1 cup)', category: 'Snacks', calories: 19, protein: 1, carbs: 4, fat: 0, time: '0 min', tags: ['Veggie'] },
  { id: 'v-19', title: 'Squash (1 cup)', category: 'Dinner', calories: 63, protein: 1, carbs: 16, fat: 0, time: '20 min', tags: ['Veggie'] },
  { id: 'v-20', title: 'Brussels Sprouts (1 cup)', category: 'Dinner', calories: 38, protein: 3, carbs: 8, fat: 0, time: '15 min', tags: ['Veggie'] }
`;

content = content.replace('];', moreFoods + '\n];');
fs.writeFileSync(p, content, 'utf-8');
console.log('Appended 40 foods!');
