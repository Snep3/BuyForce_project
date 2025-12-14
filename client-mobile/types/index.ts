// types/index.ts

// PRD Source [525] & [959]
export type GroupStatus = 
  | 'OPEN'            // הקבוצה פעילה
  | 'REACHED_TARGET'  // הגיע ליעד (70%-100%)
  | 'LOCKED'          // ננעל, ממתין לחיוב
  | 'CHARGED'         // הצלחה - חויב
  | 'FAILED'          // כישלון - לא הגיע ליעד
  | 'REFUNDED';       // כסף הוחזר

// PRD Source [915] - Products
export interface Product {
  id: string; // PRD uses UUID
  name: string;
  categoryId: number;
  description: string;
  image_url: string;
  price_regular: number;
  price_group: number;
  min_members: number;
  target_members: number;
}

// PRD Source [953] - Groups
export interface GroupDeal extends Product {
  groupId: string;
  groupStatus: GroupStatus;
  joinedCount: number;
  deadline: string; // ISO Date
}