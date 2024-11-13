### Problem Statement

Set up a project having APIs & frontend separately.
On the front end, there should be a sign-in & sign-up page.
After sign-up, the system should send a welcome email to the user and a randomly generated password to log in to the system later. You can use any preferred method for sending emails.
On successful login, there should be a simple dashboard showing the number of registered cars in your system.
Make a CRUD for categories e.g. Bus, Sedan, SUV, Hatchback, etc.
Make a CRUD for Cars where the user can select one of the categories from the dropdown & can have other fields like color, model, make, registration-no, etc.
Must use data tables for sorting & pagination.
Your system should be protected XSS & should have implemented JWT.
Each create & update module must have both front-end & back-end data validation.

### Backend Setup

Backend server is using Express.js as backend framework pairing with MongoDB for data storing. To communicate with database Mongoose is the main driver, all communications with database is happening through this Mongoose.

For error handling 'http-errors' package is used and for validation, Mongoose builtin Schema validation API is used. There is also a global error handling middleware acting as a central place to handle all errors occured in backend application. Errors are properly logged in a file using a package called Windston.

Nodemailer is use to send mails like welcome email on account creation and resetting passwords.

### Project Startup

Node version >= 20.x.x
NPM version >= 10.7.x
Yarn version >= 1.22.x

Step 1: Install Node.js, NPM and Yarn in your system.
Step 2: Clone the repo from https://github.com/AownAli-SE/backend-test-task
Step 3: Install dependencies by executing command: yarn install
Step 4: Install and start MongoDB server. You can use any MongoDB client (Atlas, shell or Compass)
Step 5: Create an env file with the name: .env.development or copy .env.example file and rename it
Step 6: Define all variables in .env.development file according to the .env.example file
Step 4: Run project by executing command: yarn dev

### Important Packages Used

- Typescript
- argon2: For hashing,
- cors: To make server secure from xss attack
- express: Core backend server package,
- helmet: For setting request headers,
- http-errors: For sending convenient error response,
- jsonwebtoken: For implementing JWT auth,
- mongoose: ODM / Database driver,
- nodemailer: For sending mails,
- winston: For logging to file,
- winston-daily-rotate-file: For creating a new log file for each day
