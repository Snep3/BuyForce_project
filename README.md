# BuyForce_project
 1. מה צריך לפני שמתחילים

כל אחד בצוות צריך:

Docker Desktop מותקן ורץ.

את הפרויקט משוך מהמאגרים (GitHub):

git clone <ה־repo של BuyForce>
cd BuyForce_project


לוודא שבתיקייה הראשית (BuyForce_project) יש קובץ:

docker-compose.yml

db.sql – מתעדכן כל פעם שמעלים .

2. הרצה ראשונה של ה־Postgres בדוקר
שלבים:

לוודא ש־Docker Desktop פתוח.

לפתוח טרמינל בתיקיית הפרויקט (איפה שיש docker-compose.yml):

cd <הנתיב לתיקיית BuyForce_project>


להריץ (יצירת קונטיינר והעלאת ה־DB):

docker compose up -d


לבדוק שהוא רץ:

docker ps


אתם אמורים לראות משהו כזה:

... postgres:16 ... 0.0.0.0:5432->5432/tcp ... my-postgres


זהו – יש לכם Postgres לוקאלי זהה לשלי, עם אותו דאטאבייס ואותו מידע.

 3. פרטי החיבור ל־DB (ל־backend / pgAdmin)
הגדרות החיבור ל־Postgres בדוקר

כולם משתמשים באותם פרטים:

Host: localhost

Port: 5432

User: postgres

Password: 123456

Database: BuyForce_sql

דוגמה לקובץ .env ל־backend (Nest/Node)

בתיקיית backend ליצור קובץ .env עם זה:

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=123456
DB_DATABASE=BuyForce_sql

# אופציונלי:
PORT=4000


(מי שכבר עובד עם .env – רק לוודא שהערכים זהים לזה.)

4. מה עושים כשיש עדכון DB חדש
מה אני (שמוליק) עושה כשאני רוצה לעדכן את כולם

כשאני משנה דאטה/סקימה ואני רוצה שכל הצוות יסונכרן:

אצל עצמי, בתיקיית הפרויקט, אני מריץ:

docker exec my-postgres pg_dump -U postgres BuyForce_sql > db.sql


זה מוציא צילום עדכני של הדאטאבייס לקובץ db.sql ב־root של הפרויקט.

אני עושה:

git add db.sql
git commit -m "update db dump"
git push


שולח הודעה בוואטסאפ לקבוצה (טקסט מוכן למטה ).

מה כל אחד מהצוות עושה אחרי הודעת עדכון

ברגע שאתם רואים הודעה שיש עדכון חדש ל־DB:

למשוך את השינויים מה־Git:

git pull


להרוס את ה־DB הישן ולהרים מהדאמפ החדש:

docker compose down -v
docker compose up -d


לבדוק שהקונטיינר רץ:

docker ps


שוב צריך לראות my-postgres במצב Up.

מכאן – ה־backend שלכם מתחבר לאוטומטי ל־DB המעודכן (כל עוד ה־.env נכון).
