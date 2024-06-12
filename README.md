Hello,

For this app to work, you will need to make a .env file in the "backend" directory.

DATABASE_URL=***LNIK TO YOUR DATABASE_URL***
JWT_SECRET=***YOUR SECRET KEY***

You can make a JWT_SECRET by running the following command in your console:

openssl rand -base64 32

Copy and paste the key that will be generated.