#install dependencies:
cd server
npm install


create .env file: 
server/.env

example: PORT=5000
MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING
JWT_SECRET=some_long_random_string
JWT_EXPIRES_IN=7d


then in server cmd do:
npm run seed:courses
npm run seed:categories
npm run seed:reviews
npm run seed:videos
npm run seed:books

then do:
npm run dev

Backend should run on:
http://localhost:5000



IN CLIENT:
cd client
npm install
npm start

Frontend runs on:
http://localhost:4200

Kapoia koumpia den douleuoun 8a ta ftiaxo
