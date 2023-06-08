
# Techladd Assignment

To create a form with validations using ReactJS and a backend with Node.js using GraphQL and saving the data in MySQL, you will need to follow these steps:

## Set up a new ReactJS project:
##### Install create-react-app globally: npm install -g create-react-app
##### Create a new React project: npx create-react-app front-end
##### Change into the project directory: cd front-end

## Set up the Node.js backend:
##### Create a new directory for the backend: mkdir backend
##### Change into the backend directory: cd backend
##### Initialize a new Node.js project: npm init -y
##### Install the necessary dependencies:

### Note: Replace 'localhost', 'your_username', 'your_password', and 'your_database_name' with your MySQL server information.

## Start the backend server:
node server.js

Now, you can visit http://localhost:3000 in your browser to see the form. When you submit the form, it will make a GraphQL mutation request to the backend server running at http://localhost:4000/graphql. The form data will be stored in the formSubmissions array on the backend.


### After following proper steps as mentioned, Start the React development server:

Change back to the project root directory: cd ..
Start the React development server: npm start
Now you should have a working form with validations in ReactJS, and upon submission, it will send the form data to the backend server using GraphQL and save the data in MySQL.


