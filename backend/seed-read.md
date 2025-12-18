על מנת להשתמש בseed 
יש לכתוב את הפקודות הבאות בטרמינל
נתקין 
npm install dotenv typeorm pg uuid date-fns
ונתקין גם את npm install
 --save-dev @types/node @types/uuid @types/date-fns
אבטל התקנה של 
npm uninstall uuid 
ואתקין:
npm install uuid@9

יש להיכנס ל
package.json
 ולהגדיר בתוך הסקריפט את הseed
 למשל 
     "seed": "ts-node -r tsconfig-paths/register src/seeds/categories-products-seed.ts"

עכשיו בשביל להרית את הseed 
חייבים להשתמש בפקודה הבאה
 npm run seed