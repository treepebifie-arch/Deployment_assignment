# Deployment_assignment


## description
This repo holds a project that performs basic CRUD operations, user authentication and authorization. It uses Role-Based Access Control to manage user types and protect selected routes and acions like deleting a user or making an admin.
It follows MVC architure for clarity, scalability and easier debugging.

## Technologies Used
Node.js: Runtime environment 

Express.js.: Nodejs framework

MongoDB: non-relational Database

Mongoose: ODM for MongoDB

Morgan: middleware for easier debugging

Bcryptjs: for password hashing

Jsonwebtoken: authorization/generating token

nodemailer: sending emails from the backend

## Folder Structure
The folder structure is based on the MVC architecture, which helps to keep the code organized, and to make debugging easier.The root directory, src, contains other directories such as controllers, models, routes and config


```text

├── .gitignore      // Specifies files/folders Git should ignore.
├── package.json    // contains all dependencies used in this project.
├── index.js        // The main entry point and Express application setup.
├── README.md       // Brief description of the project and how to run it.
└──src 
    ├── models/         // Database Schemas
    ├── routes/         // Defines all route endpoints for user's authentication and authorization.
    ├── config/         // Database connection, email setup and authorization middleware.
    └── controllers/    // Holds logic/endpoint controllers

```

## How to run Locally 
* Clone this Repository
* Install all Dependencies listed in the package.json file
* Create the required .env file that will contain your mongoDB connection URI and port.

* Start the Server using 'node index.js' or 'npm run dev' after installing nodemon as a devDependency for nodemon to automatically run the server. 

The server will run on http://localhost: (the port specified in your .env).

* You can now test the endpoints using thunder client or postman,  interacting with the database via the /api/auth route.