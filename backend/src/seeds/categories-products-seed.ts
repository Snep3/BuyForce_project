import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();
import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { addDays, subDays } from 'date-fns';


// =======================================================
// --- ייבוא כל ה-Entities (וודא שהנתיבים היחסיים נכונים!) ---
// =======================================================
import { Category } from '../sql-api-connection/entities/categories.entity';
import { Product } from '../sql-api-connection/entities/products.entity';
import { User } from '../sql-api-connection/entities/users.entity';
import { Group } from '../sql-api-connection/entities/groups.entity'; 
import { Transaction, TransactionType, TransactionStatus } from '../sql-api-connection/entities/transactions.entity';
import { GroupMembership } from '../sql-api-connection/entities/group_memberships.entity'; 
import { Admin } from '../sql-api-connection/entities/admins.entity';
import { AuditLog } from '../sql-api-connection/entities/audit_logs.entity';
import { ProductImage } from '../sql-api-connection/entities/product_images.entity';
import { ProductSpec } from '../sql-api-connection/entities/product_specs.entity';
import { UserSetting, NotificationLevel } from '../sql-api-connection/entities/user_settings.entity';
import { Wishlist } from '../sql-api-connection/entities/wishlist.entity';
import { SearchHistory } from '../sql-api-connection/entities/search_history.entity';
import { HomepageMetric } from '../sql-api-connection/entities/homepage_metrics.entity';
import { Notification } from '../sql-api-connection/entities/notifications.entity';
import { ProductPerformance } from '../sql-api-connection/entities/product_performance.entity';


// =======================================================
// --- נתונים גלובליים ---
// =======================================================
const DEFAULT_SUPPLIER_UUID = 'a1b2c3d4-e5f6-7890-1234-567890abcdef';
const baseImageUrl = 'https://your-real-cdn.com/images/'; 

// 🟢 הגדרת 9 הקטגוריות
const categoriesData = [
    { name: 'Electronics', slug: 'electronics', sortOrder: 10 },
    { name: 'Home Appliances', slug: 'home-appliances', sortOrder: 20 },
    { name: 'Phones', slug: 'phones', sortOrder: 30 },
    { name: 'Headphones', slug: 'headphones', sortOrder: 40 },
    { name: 'Laptops', slug: 'laptops', sortOrder: 50 },
    { name: 'Mixed (כללי)', slug: 'mixed', sortOrder: 60 },
    { name: 'Fashion', slug: 'fashion', sortOrder: 70 },
    { name: 'Gadgets', slug: 'gadgets', sortOrder: 80 },
    { name: 'Seasonal Items', slug: 'seasonal-items', sortOrder: 90 },
];

// 🟢 5 מוצרים לכל קטגוריה (סה"כ 45) - שימוש ב-minMembers במקום minGroupSize
const productsData = (categoryMap: Record<string, Category>) => {
    
    return [
        // --- 1. Electronics (5 Products) ---
        { supplierId: DEFAULT_SUPPLIER_UUID, categoryId: categoryMap['electronics'].id, name: 'Smart 4K TV 65"', slug: 'smart-4k-tv-65', priceRegular: 8000, priceGroup: 6500, minMembers: 7, maxMembers: 7, isActive: true, description: 'טלוויזיה חכמה גדולה.' },
        { supplierId: DEFAULT_SUPPLIER_UUID, categoryId: categoryMap['electronics'].id, name: 'Projector Pro 2000', slug: 'projector-pro-2000', priceRegular: 3500, priceGroup: 2800, minMembers: 10, maxMembers: 10, isActive: true, description: 'מקרן לקולנוע ביתי.' },
        { supplierId: DEFAULT_SUPPLIER_UUID, categoryId: categoryMap['electronics'].id, name: 'Sound Bar Ultimate', slug: 'sound-bar-ultimate', priceRegular: 2200, priceGroup: 1750, minMembers: 15, maxMembers: 15, isActive: true, description: 'סאונד בר 5.1.' },
        { supplierId: DEFAULT_SUPPLIER_UUID, categoryId: categoryMap['electronics'].id, name: 'Digital Camera Mirrorless', slug: 'digital-camera-mirrorless', priceRegular: 5500, priceGroup: 4800, minMembers: 6, maxMembers: 6, isActive: true, description: 'מצלמת מירורלס מקצועית.' },
        { supplierId: DEFAULT_SUPPLIER_UUID, categoryId: categoryMap['electronics'].id, name: 'Smart Home Hub X', slug: 'smart-home-hub-x', priceRegular: 450, priceGroup: 350, minMembers: 30, maxMembers: 30, isActive: true, description: 'רכזת בית חכם.' },

        // --- 2. Home Appliances (5 Products) ---
        { supplierId: DEFAULT_SUPPLIER_UUID, categoryId: categoryMap['home-appliances'].id, name: 'Robot Vacuum & Mop', slug: 'robot-vacuum-mop', priceRegular: 2500, priceGroup: 1900, minMembers: 12, maxMembers: 12, isActive: true, description: 'שואב ושוטף רובוטי.' },
        { supplierId: DEFAULT_SUPPLIER_UUID, categoryId: categoryMap['home-appliances'].id, name: 'Coffee Machine Pro', slug: 'coffee-machine-pro', priceRegular: 1800, priceGroup: 1450, minMembers: 10, maxMembers: 10, isActive: true, description: 'מכונת קפה אוטומטית.' },
        { supplierId: DEFAULT_SUPPLIER_UUID, categoryId: categoryMap['home-appliances'].id, name: 'Air Fryer XL', slug: 'air-fryer-xl', priceRegular: 950, priceGroup: 750, minMembers: 20, maxMembers: 20, isActive: true, description: 'מטגן אוויר בנפח גדול.' },
        { supplierId: DEFAULT_SUPPLIER_UUID, categoryId: categoryMap['home-appliances'].id, name: 'Smart Refrigerator 2025', slug: 'smart-refrigerator-2025', priceRegular: 12000, priceGroup: 9500, minMembers: 5, maxMembers: 5, isActive: true, description: 'מקרר חכם עם מסך.' },
        { supplierId: DEFAULT_SUPPLIER_UUID, categoryId: categoryMap['home-appliances'].id, name: 'Dishwasher Silent 2.0', slug: 'dishwasher-silent', priceRegular: 4200, priceGroup: 3400, minMembers: 8, maxMembers: 8, isActive: true, description: 'מדיח כלים שקט.' },

        // --- 3. Phones (5 Products) ---
        { supplierId: DEFAULT_SUPPLIER_UUID, categoryId: categoryMap['phones'].id, name: 'Flagship Smartphone X90', slug: 'flagship-smartphone-x90', priceRegular: 4500.00, priceGroup: 3800.00, minMembers: 10, maxMembers: 10, isActive: true, description: 'טלפון דגל 2025.' }, 
        { supplierId: DEFAULT_SUPPLIER_UUID, categoryId: categoryMap['phones'].id, name: 'Mid-Range Phone Plus', slug: 'mid-range-phone-plus', priceRegular: 2800, priceGroup: 2200, minMembers: 15, maxMembers: 15, isActive: true, description: 'טלפון ביניים עם מצלמה טובה.' },
        { supplierId: DEFAULT_SUPPLIER_UUID, categoryId: categoryMap['phones'].id, name: 'Budget Smart Phone Z', slug: 'budget-smart-phone-z', priceRegular: 1200, priceGroup: 950, minMembers: 25, maxMembers: 25, isActive: true, description: 'טלפון חכם בתקציב נמוך.' },
        { supplierId: DEFAULT_SUPPLIER_UUID, categoryId: categoryMap['phones'].id, name: 'Rugged Outdoor Phone', slug: 'rugged-outdoor-phone', priceRegular: 1500, priceGroup: 1150, minMembers: 20, maxMembers: 20, isActive: true, description: 'טלפון עמיד למים ואבק.' },
        { supplierId: DEFAULT_SUPPLIER_UUID, categoryId: categoryMap['phones'].id, name: 'Phone Lite Edition', slug: 'phone-lite-edition', priceRegular: 3200, priceGroup: 2700, minMembers: 12, maxMembers: 12, isActive: true, description: 'גרסה קלה וקומפקטית.' },

        // --- 4. Headphones (5 Products) ---
        { supplierId: DEFAULT_SUPPLIER_UUID, categoryId: categoryMap['headphones'].id, name: 'ANC Over-Ear Pro', slug: 'anc-over-ear-pro', priceRegular: 1800, priceGroup: 1400, minMembers: 15, maxMembers: 15, isActive: true, description: 'אוזניות קשת עם סינון רעשים מתקדם.' }, 
        { supplierId: DEFAULT_SUPPLIER_UUID, categoryId: categoryMap['headphones'].id, name: 'True Wireless Sport', slug: 'true-wireless-sport', priceRegular: 650, priceGroup: 480, minMembers: 30, maxMembers: 30, isActive: true, description: 'אוזניות ספורט אלחוטיות.' },
        { supplierId: DEFAULT_SUPPLIER_UUID, categoryId: categoryMap['headphones'].id, name: 'Budget Wireless Earbuds', slug: 'budget-wireless-earbuds', priceRegular: 250, priceGroup: 190, minMembers: 50, maxMembers: 50, isActive: true, description: 'אוזניות אלחוטיות בסיסיות.' },
        { supplierId: DEFAULT_SUPPLIER_UUID, categoryId: categoryMap['headphones'].id, name: 'Studio Monitoring Headphones', slug: 'studio-monitoring-headphones', priceRegular: 1100, priceGroup: 850, minMembers: 20, maxMembers: 20, isActive: true, description: 'אוזניות סטודיו.' },
        { supplierId: DEFAULT_SUPPLIER_UUID, categoryId: categoryMap['headphones'].id, name: 'Kids Safe Headphones', slug: 'kids-safe-headphones', priceRegular: 300, priceGroup: 220, minMembers: 40, maxMembers: 40, isActive: true, description: 'אוזניות עם הגבלת ווליום לילדים.' },

        // --- 5. Laptops (5 Products) ---
        { supplierId: DEFAULT_SUPPLIER_UUID, categoryId: categoryMap['laptops'].id, name: 'Gaming Laptop RTX 4070', slug: 'gaming-laptop-rtx4070', priceRegular: 11000.00, priceGroup: 8800.00, minMembers: 6, maxMembers: 6, isActive: true, description: 'מחשב נייד לגיימינג.' }, 
        { supplierId: DEFAULT_SUPPLIER_UUID, categoryId: categoryMap['laptops'].id, name: 'Ultra Slim Workstation', slug: 'ultra-slim-workstation', priceRegular: 7500, priceGroup: 6200, minMembers: 8, maxMembers: 8, isActive: true, description: 'מחשב דק לעבודה.' },
        { supplierId: DEFAULT_SUPPLIER_UUID, categoryId: categoryMap['laptops'].id, name: 'Budget Student Laptop', slug: 'budget-student-laptop', priceRegular: 2800, priceGroup: 2100, minMembers: 15, maxMembers: 15, isActive: true, description: 'מחשב לתלמידים.' },
        { supplierId: DEFAULT_SUPPLIER_UUID, categoryId: categoryMap['laptops'].id, name: '2-in-1 Touchscreen Laptop', slug: '2-in-1-touchscreen-laptop', priceRegular: 4800, priceGroup: 3900, minMembers: 10, maxMembers: 10, isActive: true, description: 'מחשב היברידי.' },
        { supplierId: DEFAULT_SUPPLIER_UUID, categoryId: categoryMap['laptops'].id, name: 'MacBook Pro Clone', slug: 'macbook-pro-clone', priceRegular: 9000, priceGroup: 7500, minMembers: 7, maxMembers: 7, isActive: true, description: 'מחשב דמוי מקבוק.' },

        // --- 6. Mixed (5 Products) ---
        { supplierId: DEFAULT_SUPPLIER_UUID, categoryId: categoryMap['mixed'].id, name: 'Universal Car Mount', slug: 'universal-car-mount', priceRegular: 150, priceGroup: 110, minMembers: 50, maxMembers: 50, isActive: true, description: 'מתקן אוניברסלי לרכב.' },
        { supplierId: DEFAULT_SUPPLIER_UUID, categoryId: categoryMap['mixed'].id, name: 'Portable Bluetooth Speaker', slug: 'portable-bluetooth-speaker', priceRegular: 400, priceGroup: 300, minMembers: 35, maxMembers: 35, isActive: true, description: 'רמקול בלוטות\' קטן.' },
        { supplierId: DEFAULT_SUPPLIER_UUID, categoryId: categoryMap['mixed'].id, name: 'Wireless Charging Pad', slug: 'wireless-charging-pad', priceRegular: 180, priceGroup: 135, minMembers: 40, maxMembers: 40, isActive: true, description: 'משטח טעינה אלחוטי.' },
        { supplierId: DEFAULT_SUPPLIER_UUID, categoryId: categoryMap['mixed'].id, name: 'Set of Reusable Bags', slug: 'set-of-reusable-bags', priceRegular: 90, priceGroup: 65, minMembers: 100, maxMembers: 100, isActive: true, description: 'סט תיקים רב-פעמיים.' },
        { supplierId: DEFAULT_SUPPLIER_UUID, categoryId: categoryMap['mixed'].id, name: 'High-Speed HDMI Cable', slug: 'high-speed-hdmi-cable', priceRegular: 50, priceGroup: 35, minMembers: 120, maxMembers: 120, isActive: true, description: 'כבל HDMI ארוך.' },

        // --- 7. Fashion (5 Products) ---
        { supplierId: DEFAULT_SUPPLIER_UUID, categoryId: categoryMap['fashion'].id, name: 'Organic Cotton T-Shirt', slug: 'organic-cotton-t-shirt', priceRegular: 120, priceGroup: 95, minMembers: 30, maxMembers: 30, isActive: true, description: 'חולצת טי מכותנה אורגנית.' },
        { supplierId: DEFAULT_SUPPLIER_UUID, categoryId: categoryMap['fashion'].id, name: 'Slim Fit Denim Jeans', slug: 'slim-fit-denim-jeans', priceRegular: 380, priceGroup: 290, minMembers: 20, maxMembers: 20, isActive: true, description: 'ג\'ינס דנים בגזרה צרה.' },
        { supplierId: DEFAULT_SUPPLIER_UUID, categoryId: categoryMap['fashion'].id, name: 'Classic Leather Belt', slug: 'classic-leather-belt', priceRegular: 220, priceGroup: 170, minMembers: 25, maxMembers: 25, isActive: true, description: 'חגורת עור קלאסית.' },
        { supplierId: DEFAULT_SUPPLIER_UUID, categoryId: categoryMap['fashion'].id, name: 'Minimalist Wrist Watch', slug: 'minimalist-wrist-watch', priceRegular: 450, priceGroup: 360, minMembers: 15, maxMembers: 15, isActive: true, description: 'שעון יד מינימליסטי.' },
        { supplierId: DEFAULT_SUPPLIER_UUID, categoryId: categoryMap['fashion'].id, name: 'Sport Running Shoes', slug: 'sport-running-shoes', priceRegular: 550, priceGroup: 420, minMembers: 18, maxMembers: 18, isActive: true, description: 'נעלי ריצה קלות.' },

        // --- 8. Gadgets (5 Products) ---
        { supplierId: DEFAULT_SUPPLIER_UUID, categoryId: categoryMap['gadgets'].id, name: 'Ultra Slim Smart Watch V2', slug: 'ultra-slim-smart-watch-v2', priceRegular: 1200.00, priceGroup: 890.00, minMembers: 15, maxMembers: 15, isActive: true, description: 'שעון חכם דק במיוחד.' },
        { supplierId: DEFAULT_SUPPLIER_UUID, categoryId: categoryMap['gadgets'].id, name: 'Drone Mini 4K', slug: 'drone-mini-4k', priceRegular: 1900, priceGroup: 1550, minMembers: 10, maxMembers: 10, isActive: true, description: 'רחפן קטן עם מצלמת 4K.' },
        { supplierId: DEFAULT_SUPPLIER_UUID, categoryId: categoryMap['gadgets'].id, name: 'Portable Mini Projector', slug: 'portable-mini-projector', priceRegular: 950, priceGroup: 750, minMembers: 12, maxMembers: 12, isActive: true, description: 'מקרן כיס נייד.' },
        { supplierId: DEFAULT_SUPPLIER_UUID, categoryId: categoryMap['gadgets'].id, name: 'GPS Tracker Personal', slug: 'gps-tracker-personal', priceRegular: 320, priceGroup: 250, minMembers: 20, maxMembers: 20, isActive: true, description: 'מכשיר איתור אישי.' },
        { supplierId: DEFAULT_SUPPLIER_UUID, categoryId: categoryMap['gadgets'].id, name: 'VR Headset Basic', slug: 'vr-headset-basic', priceRegular: 600, priceGroup: 480, minMembers: 18, maxMembers: 18, isActive: true, description: 'משקפי מציאות מדומה בסיסיים.' },

        // --- 9. Seasonal Items (5 Products) ---
        { supplierId: DEFAULT_SUPPLIER_UUID, categoryId: categoryMap['seasonal-items'].id, name: 'Electric Fan Summer Pro', slug: 'electric-fan-summer-pro', priceRegular: 450, priceGroup: 350, minMembers: 25, maxMembers: 25, isActive: true, description: 'מאוורר חשמלי עוצמתי (קיץ).' },
        { supplierId: DEFAULT_SUPPLIER_UUID, categoryId: categoryMap['seasonal-items'].id, name: 'Portable Outdoor Heater', slug: 'portable-outdoor-heater', priceRegular: 650, priceGroup: 500, minMembers: 20, maxMembers: 20, isActive: true, description: 'מחמם נייד לגינה (חורף).' },
        { supplierId: DEFAULT_SUPPLIER_UUID, categoryId: categoryMap['seasonal-items'].id, name: 'Christmas LED Light String', slug: 'christmas-led-light-string', priceRegular: 100, priceGroup: 75, minMembers: 80, maxMembers: 80, isActive: true, description: 'שרשרת אורות לד (חגים).' },
        { supplierId: DEFAULT_SUPPLIER_UUID, categoryId: categoryMap['seasonal-items'].id, name: 'Sun Umbrella UV Protect', slug: 'sun-umbrella-uv-protect', priceRegular: 200, priceGroup: 150, minMembers: 30, maxMembers: 30, isActive: true, description: 'שמשיה נגד UV (קיץ).' },
        { supplierId: DEFAULT_SUPPLIER_UUID, categoryId: categoryMap['seasonal-items'].id, name: 'Garden Tools Set Spring', slug: 'garden-tools-set-spring', priceRegular: 300, priceGroup: 220, minMembers: 40, maxMembers: 40, isActive: true, description: 'ערכת כלי גינה (אביב).' },
    ];
};


// =======================================================
// --- הגדרת ה-DataSource (ודא שמשתני הסביבה מוגדרים!) ---
// =======================================================
const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,
    logging: ['error'],
    entities: [
        Category, Product, User, Admin, AuditLog, Group, GroupMembership, 
        Transaction, ProductImage, ProductSpec, UserSetting, Wishlist, 
        SearchHistory, HomepageMetric, Notification, ProductPerformance
    ],
});


// =======================================================
// --- פונקציית ה-Seeding הראשית ---
// =======================================================
async function seedDatabase() {
    console.log('🚀 מתחילים להריץ את ה-Seed Script...');

    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }

    // קבלת Repositories
    const categoryRepository = AppDataSource.getRepository(Category);
    const productRepository = AppDataSource.getRepository(Product);
    const userRepository = AppDataSource.getRepository(User);
    const adminRepository = AppDataSource.getRepository(Admin);
    const auditLogRepository = AppDataSource.getRepository(AuditLog);
    const groupRepository = AppDataSource.getRepository(Group);
    const groupMembershipRepository = AppDataSource.getRepository(GroupMembership);
    const transactionRepository = AppDataSource.getRepository(Transaction);
    const productImageRepository = AppDataSource.getRepository(ProductImage);
    const productSpecRepository = AppDataSource.getRepository(ProductSpec);
    const userSettingRepository = AppDataSource.getRepository(UserSetting);
    const wishlistRepository = AppDataSource.getRepository(Wishlist);
    const searchHistoryRepository = AppDataSource.getRepository(SearchHistory);
    const homepageMetricRepository = AppDataSource.getRepository(HomepageMetric);
    const notificationRepository = AppDataSource.getRepository(Notification);
    const productPerformanceRepository = AppDataSource.getRepository(ProductPerformance);


    // -------------------------------------------------------
    // --- 1. ניקוי טבלאות קיימות (TRUNCATE) ---
    // -------------------------------------------------------
    console.log('🧹 מנקה טבלאות קיימות...');
    const entities = AppDataSource.entityMetadatas;
    const tableNames = entities.map(entity => `"${entity.tableName}"`).join(', ');
    await AppDataSource.query(`TRUNCATE ${tableNames} RESTART IDENTITY CASCADE;`);
    console.log('✅ הניקוי הושלם.');


    // -------------------------------------------------------
    // --- 2. יצירת קטגוריות (🏷️) ---
    // -------------------------------------------------------
    console.log('🏷️ יוצר 9 קטגוריות...');
    const savedCategories = await categoryRepository.save(categoryRepository.create(categoriesData));
    const categoryMap = savedCategories.reduce((map, cat) => { map[cat.slug] = cat; return map; }, {} as Record<string, Category>);
    console.log(`✅ נוצרו ${savedCategories.length} קטגוריות.`);

    // -------------------------------------------------------
    // --- 3. יצירת מוצרים (🛒) ---
    // -------------------------------------------------------
    console.log('🛒 יוצר 45 מוצרים (5 לכל קטגוריה)...');
    const productsToCreate = productsData(categoryMap);
    const savedProducts = await productRepository.save(productRepository.create(productsToCreate));
    const productMap = savedProducts.reduce((map, prod) => { map[prod.slug] = prod; return map; }, {} as Record<string, Product>);
    console.log(`✅ נוצרו ${savedProducts.length} מוצרים.`);

    // =======================================================
    // --- הגדרת משתני עזר ממוצרים (משתמשים ב-minMembers) ---
    // =======================================================
    const flagshipPhone = productMap['flagship-smartphone-x90'];
    const ancHeadphones = productMap['anc-over-ear-pro'];
    const gamingLaptop = productMap['gaming-laptop-rtx4070'];
    const smartWatch = productMap['ultra-slim-smart-watch-v2'];
    const tShirt = productMap['organic-cotton-t-shirt'];
    
    // -------------------------------------------------------
    // --- 4. יצירת משתמשים (👥) ---
    // -------------------------------------------------------
    console.log('👥 יוצר 8 משתמשי דוגמה...');
    const usersData = [
        { email: 'admin@buyforce.com', fullName: 'אדמין ראשי', passwordHash: uuidv4(), emailVerified: true, locale: 'he', currency: 'ILS' }, 
        { email: 'seva1@example.com', fullName: 'דני וייס', passwordHash: uuidv4(), emailVerified: true, locale: 'he', currency: 'ILS' },
        { email: 'seva2@example.com', fullName: 'אפרת כהן', passwordHash: uuidv4(), emailVerified: true, locale: 'en', currency: 'USD' },
        { email: 'seva3@example.com', fullName: 'משה לוי', passwordHash: uuidv4(), emailVerified: false, locale: 'he', currency: 'ILS' }, 
        { email: 'pre1@example.com', fullName: 'ליאור שלו', passwordHash: uuidv4(), emailVerified: true, locale: 'en', currency: 'EUR' }, 
        { email: 'pre2@example.com', fullName: 'יעל מזרחי', passwordHash: uuidv4(), emailVerified: true, locale: 'he', currency: 'ILS' },
        { email: 'power@example.com', fullName: 'יוסף חדד', passwordHash: uuidv4(), emailVerified: true, locale: 'he', currency: 'ILS' },
        { email: 'social@example.com', fullName: 'מאיה אלון', passwordHash: uuidv4(), emailVerified: true, locale: 'he', currency: 'ILS' },
    ];
    const savedUsers = await userRepository.save(userRepository.create(usersData));
    const adminUser = savedUsers[0]; 
    const userMap = savedUsers.reduce((map, user) => { map[user.email.split('@')[0]] = user; return map; }, {} as Record<string, User>);
    
    // =======================================================
    // --- הגדרת משתני עזר ממשתמשים ---
    // =======================================================
    const userPower = userMap['power'];
    const userPre1 = userMap['pre1'];
    const userSeva1 = userMap['seva1'];
    const userSocial = userMap['social'];
    console.log(`✅ נוצרו ${savedUsers.length} משתמשים.`);

    // -------------------------------------------------------
    // --- 5. יצירת מנהלים (👮) ---
    // -------------------------------------------------------
    console.log('👮 יוצר רשומת מנהל...');
    const superAdmin = (await adminRepository.save(adminRepository.create([{ userId: adminUser.id, role: 'SUPER_ADMIN' }])))[0];
    console.log(`✅ נוצרו 1 מנהלים.`);

    // -------------------------------------------------------
    // --- 6. יצירת לוגי ביקורת (✍️) ---
    // -------------------------------------------------------
    console.log('✍️ יוצר רשומות Audit Log...');
    const productToAudit = gamingLaptop;
    await auditLogRepository.save(auditLogRepository.create([
        { adminId: superAdmin.id, action: 'PRODUCT_CREATE', targetType: 'PRODUCT', targetId: productToAudit.id, details: { newValues: { name: productToAudit.name } } },
    ] as any));
    console.log(`✅ נוצרו 1 רשומות Audit Log.`);

    // -------------------------------------------------------
    // --- 7. יצירת קבוצות (📦) ---
    // -------------------------------------------------------
    console.log('📦 יוצר קבוצות רכישה...');
    const deadline = addDays(new Date(), 7); 
    const passedDeadline = subDays(new Date(), 2); 
    const groupsData = [
        // קבוצה פתוחה על אוזניות ANC - משתמש ב-minMembers
        { id: uuidv4(), productId: ancHeadphones.id, status: 'OPEN', joinedCount: 5, targetMembers: ancHeadphones.minMembers, maxMembers: ancHeadphones.maxMembers, deadline: deadline },
        // קבוצה פתוחה על שעון חכם - משתמש ב-minMembers
        { id: uuidv4(), productId: smartWatch.id, status: 'OPEN', joinedCount: 14, targetMembers: smartWatch.minMembers, maxMembers: smartWatch.maxMembers, deadline: addDays(new Date(), 1) },
        // קבוצה נעולה על טלפון דגל - משתמש ב-minMembers
        { id: uuidv4(), productId: flagshipPhone.id, status: 'LOCKED', joinedCount: flagshipPhone.minMembers, targetMembers: flagshipPhone.minMembers, maxMembers: flagshipPhone.maxMembers, deadline: passedDeadline, reachedTargetAt: passedDeadline, lockedAt: passedDeadline },
        // קבוצה שנכשלה על מחשב גיימינג - משתמש ב-minMembers
        { id: uuidv4(), productId: gamingLaptop.id, status: 'FAILED', joinedCount: 2, targetMembers: gamingLaptop.minMembers, maxMembers: gamingLaptop.maxMembers, deadline: passedDeadline, failedAt: passedDeadline },
    ];
    const savedGroups = await groupRepository.save(groupRepository.create(groupsData));
    const groupMap = savedGroups.reduce((map, group) => { map[group.status] = group; return map; }, {} as Record<string, Group>);
    console.log(`✅ נוצרו ${savedGroups.length} קבוצות רכישה.`);

    // -------------------------------------------------------
    // --- 8. יצירת טרנזקציות (💵) ---
    // -------------------------------------------------------
    console.log('💵 יוצר טרנזקציות מלאות...');
    // 🟢 תיקון: שימוש ב-userId (camelCase) כדי להתאים למאפיין ה-Entity
    const transactionsData = [
        // עסקה על קבוצת האוזניות
        { userId: userSeva1.id, groupId: groupMap['OPEN'].id, amount: ancHeadphones.priceGroup, currency: 'ILS', type: TransactionType.CHARGE, status: TransactionStatus.SUCCESS, provider: 'Tranzilla', providerRef: 'TRZ-' + uuidv4().substring(0, 10), idempotencyKey: uuidv4() },
        // עסקה על קבוצת הטלפון הנעולה
        { userId: userPre1.id, groupId: groupMap['LOCKED'].id, amount: flagshipPhone.priceGroup, currency: 'ILS', type: TransactionType.CHARGE, status: TransactionStatus.SUCCESS, provider: 'Tranzilla', providerRef: 'TRZ-' + uuidv4().substring(0, 10), idempotencyKey: uuidv4() },
        // החזר כספי על קבוצת המחשב שנכשלה
        { userId: userPre1.id, groupId: groupMap['FAILED'].id, amount: gamingLaptop.priceGroup, currency: 'ILS', type: TransactionType.REFUND, status: TransactionStatus.SUCCESS, provider: 'Tranzilla', providerRef: 'TRZ-' + uuidv4().substring(0, 10), idempotencyKey: uuidv4() },
    ];
    
    // ⬅️ הוספת as any: קריטי למניעת שגיאת טיפוס TypeORM
    const savedTransactions = await transactionRepository.save(transactionRepository.create(transactionsData) as any);
    
    // 🟢 תיקון: יצירת המפה כאן, לפני השימוש בה
    const transactionMap = savedTransactions.reduce((map, tx) => { map[tx.userId + tx.groupId] = tx; return map; }, {} as Record<string, Transaction>);

    console.log(`✅ נוצרו ${savedTransactions.length} טרנזקציות.`);

    // -------------------------------------------------------
    // --- 9. יצירת חברות בקבוצה (🤝) ---
    // -------------------------------------------------------
    console.log('🤝 יוצר חברויות לקבוצות...');
    const membershipsData = [
        // שימוש ב-transactionMap התקין
        { groupId: groupMap['OPEN'].id, userId: userSeva1.id, status: 'PAID', amountGroupPrice: ancHeadphones.priceGroup, transactionId: transactionMap[userSeva1.id + groupMap['OPEN'].id].id },
        { groupId: groupMap['LOCKED'].id, userId: userPre1.id, status: 'PAID', amountGroupPrice: flagshipPhone.priceGroup, transactionId: transactionMap[userPre1.id + groupMap['LOCKED'].id].id },
        { groupId: groupMap['FAILED'].id, userId: userPre1.id, status: 'REFUNDED', amountGroupPrice: gamingLaptop.priceGroup, transactionId: transactionMap[userPre1.id + groupMap['FAILED'].id].id },
    ];
    await groupMembershipRepository.save(groupMembershipRepository.create(membershipsData));
    console.log(`✅ נוצרו ${membershipsData.length} חברויות קבוצה.`);

    // -------------------------------------------------------
    // --- 10. יצירת מדדי דף בית (📈) ---
    // -------------------------------------------------------
    console.log('📈 יוצר מדדים עבור דף הבית...');
    const lastWeek = subDays(new Date(), 7); 
    // 🟢 שימוש ב-snake_case עבור עמודות DB
    await homepageMetricRepository.save(homepageMetricRepository.create([
        { category_id: categoryMap['laptops'].id, week_start: lastWeek, joins_count: 320, gmv: 48999.00 },
    ] as any));
    console.log(`✅ נוצרו 1 רשומות מדדים.`);

    // -------------------------------------------------------
    // --- 11. יצירת התראות (🔔) ---
    // -------------------------------------------------------
    console.log('🔔 יוצר התראות למשתמשים...');
    const NotificationChannel = { PUSH: 'push', EMAIL: 'email', IN_APP: 'in_app' };
    const NotificationStatus = { PENDING: 'PENDING', SENT: 'SENT', FAILED: 'FAILED' };
    // 🟢 שימוש ב-userId
    await notificationRepository.save(notificationRepository.create([
        { userId: userPower.id, type: 'GROUP_REACHED_TARGET', title: 'קבוצת הטלפון הושלמה!', body: 'קבוצת רכישה לטלפון הדגל הגיעה ליעד.', channel: NotificationChannel.PUSH, status: NotificationStatus.SENT, sentAt: new Date(), payload: { groupId: groupMap['LOCKED'].id } }
    ] as any));
    console.log(`✅ נוצרו 1 התראות.`);

    // -------------------------------------------------------
    // --- 12. יצירת תמונות מוצר (📸) ---
    // -------------------------------------------------------
    console.log('📸 יוצר תמונות עבור מוצרים...');
    await productImageRepository.save(productImageRepository.create([
        { productId: tShirt.id, imageUrl: `${baseImageUrl}tshirt-black-main.jpg`, sortOrder: 10 }, 
        { productId: smartWatch.id, imageUrl: `${baseImageUrl}smartwatch-main-v2.jpg`, sortOrder: 10 },
    ]));
    console.log(`✅ נוצרו 2 תמונות מוצר.`);

    // -------------------------------------------------------
    // --- 13. יצירת מפרטי מוצר (📝) ---
    // -------------------------------------------------------
    console.log('📝 יוצר מפרטים (Specs) עבור מוצרים...');
    await productSpecRepository.save(productSpecRepository.create([
        { productId: tShirt.id, specKey: 'Material', specValue: '100% Organic Cotton' },
        { productId: smartWatch.id, specKey: 'Battery Life', specValue: 'Up to 7 days' },
    ]));
    console.log(`✅ נוצרו 2 מפרטי מוצר.`);
    
    // -------------------------------------------------------
    // --- 14. יצירת הגדרות משתמש (⚙️) ---
    // -------------------------------------------------------
    console.log('⚙️ יוצר הגדרות (Settings) עבור משתמשים...');
    await userSettingRepository.save(userSettingRepository.create([
        { userId: userPower.id, notificationLevel: NotificationLevel.INSTANT },
    ]));
    console.log(`✅ נוצרו 1 רשומות User Setting.`);

    // -------------------------------------------------------
    // --- 15. יצירת רשימות משאלות (⭐) ---
    // -------------------------------------------------------
    console.log('⭐ יוצר רשימות משאלות (Wishlist) עבור משתמשים...');
    await wishlistRepository.save(wishlistRepository.create([
        { userId: userPower.id, productId: gamingLaptop.id },
        { userId: userSocial.id, productId: tShirt.id },
    ]));
    console.log(`✅ נוצרו 2 רשומות Wishlist.`);

    // -------------------------------------------------------
    // --- 16. יצירת היסטוריית חיפוש (🔍) ---
    // -------------------------------------------------------
    console.log('🔍 יוצר היסטוריית חיפוש למשתמשים...');
    await searchHistoryRepository.save(searchHistoryRepository.create([
        { userId: userPower.id, keyword: 'RTX 4070 laptop' },
        { userId: userSeva1.id, keyword: 'מכונת קפה' },
    ]));
    console.log(`✅ נוצרו 2 רשומות היסטוריית חיפוש.`);

    // -------------------------------------------------------
    // --- 17. יצירת ביצועי מוצר (📊) ---
    // -------------------------------------------------------
    console.log('📊 יוצר מדדי ביצועים למוצרים...');
    await productPerformanceRepository.save(productPerformanceRepository.create([
        // 🛑 הוחלף: lastAggregatedAt ⬅️ ל-lastUpdated
        { productId: flagshipPhone.id, views7d: 12000, joins7d: 80, wishlistAdds7d: 55, conversionRate: 0.66, lastUpdated: new Date() },
    ] as any));
    console.log(`✅ נוצרו 1 רשומות ביצועי מוצר.`);

    console.log('----------------------------------------------------');
    console.log('🎉 ה-Seed Script הושלם בהצלחה!');
    console.log('סה"כ: 9 קטגוריות, 45 מוצרים, 4 קבוצות, 8 משתמשים');
    console.log('----------------------------------------------------');

    await AppDataSource.destroy();
}

seedDatabase().catch((error) => {
    console.error('❌ שגיאה במהלך ה-Seeding:', error);
    if (AppDataSource.isInitialized) {
        AppDataSource.destroy();
    }
});