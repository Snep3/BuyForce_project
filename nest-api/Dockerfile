FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache icu-libs icu-data-full
# העתקת קבצי ניהול החבילות
COPY package*.json ./

# התקנת התלויות
RUN npm install

# העתקת כל שאר קבצי הקוד
COPY . .

# בניית הפרויקט (קומפילציה של TS ל-JS)
RUN npm run build

# חשיפת הפורט של השרת
EXPOSE 4000

# פקודת ההרצה
CMD ["npm", "run", "start:prod"]