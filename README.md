# SwengScheduler
sweng411 web application

using:

$ node --version
v16.13.2

in order to initialize use:

npm i express express-session express-ejs-layouts connect-flash passport passport-local mongoose bcrypt ejs dotenv dhtmlx-scheduler connect-mongo nodemailer

or:

npm i


Add .env file with MONGO_USERNAME and MONGO_PASSWORD


Running on DigitalOcean Droplet - http://143.198.160.183:3000/
Mailhog - http://143.198.160.183:8025/

Special calendar note: For localhost, the server_utc in manage-calendar.ejs needs to be false, for the server it needs to be true.

