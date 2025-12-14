import { GroupDeal } from '../types';

export const MOCK_DEALS: GroupDeal[] = [
  // 1. קבוצה פעילה רגילה (Active)
  {
    id: '101',
    groupId: 'g1',
    name: 'Sony WH-1000XM5 Noise Canceling',
    categoryId: 1,
    description: 'Top tier noise canceling headphones',
    image_url: 'https://placehold.co/400x300/png',
    price_regular: 1400,
    price_group: 990,
    min_members: 40,
    target_members: 50,
    joinedCount: 45, // 90% Progress
    groupStatus: 'OPEN',
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(), // +48h
  },
  // 2. קבוצה חדשה (Active)
  {
    id: '102',
    groupId: 'g2',
    name: 'Dyson V15 Detect Vacuum',
    categoryId: 3,
    description: 'Detects invisible dust',
    image_url: 'https://placehold.co/400x300/png',
    price_regular: 3200,
    price_group: 2400,
    min_members: 80,
    target_members: 100,
    joinedCount: 12,
    groupStatus: 'OPEN',
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 120).toISOString(), // +5 days
  },
  // 3. קבוצה שהגיעה ליעד (Active / Reached Target)
  {
    id: '103',
    groupId: 'g3',
    name: 'Ninja Grill AG301',
    categoryId: 3,
    description: 'The grill that sears, sizzles, and air fry crisps',
    image_url: 'https://placehold.co/400x300/png',
    price_regular: 1100,
    price_group: 850,
    min_members: 30,
    target_members: 40,
    joinedCount: 40, 
    groupStatus: 'REACHED_TARGET',
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 5).toISOString(),
  },
  // 4. קבוצה שהצליחה וחויבה (Won / Completed)
  {
    id: '104',
    groupId: 'g4',
    name: 'Nespresso Vertuo Next',
    categoryId: 3,
    description: 'Compact coffee machine',
    image_url: 'https://placehold.co/400x300/png',
    price_regular: 800,
    price_group: 550,
    min_members: 20,
    target_members: 20,
    joinedCount: 20,
    groupStatus: 'CHARGED',
    deadline: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // Ended
  },
  // 5. קבוצה שנכשלה (Missed / Failed)
  {
    id: '105',
    groupId: 'g5',
    name: 'Electric Scooter Xiaomi 4',
    categoryId: 5,
    description: 'Go further',
    image_url: 'https://placehold.co/400x300/png',
    price_regular: 2500,
    price_group: 1900,
    min_members: 50,
    target_members: 50,
    joinedCount: 15,
    groupStatus: 'FAILED',
    deadline: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(), // Ended
  }
];

// מדמה את ה-DB שמחזיק לאיזה קבוצות המשתמש נרשם [cite: 974]
export const MY_JOINED_GROUP_IDS = ['g1', 'g3', 'g4', 'g5'];