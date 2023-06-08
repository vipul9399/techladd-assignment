const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'your_database_name',
});

// Create a GraphQL schema
const schema = buildSchema(`
  type Query {
    hello: String
  }

  type Mutation {
    saveForm(data: FormInput!): String
  }

  input FormInput {
    companyUEN: String
    companyName: String
    fullName: String
    position: String
    emailAddress: String
    mobileNumber: String
    termsAndConditions: Boolean
  }
`);

// Create a root resolver
const root = {
  hello: () => 'Hello, World!',
  saveForm: ({ data }) => {
    // Save the form data to the database
    const { companyUEN, companyName, fullName, position, emailAddress, mobileNumber, termsAndConditions } = data;
    const query = `INSERT INTO forms (company_uen, company_name, full_name, position, email_address, mobile_number, terms_and_conditions)
                   VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const values = [companyUEN, companyName, fullName, position, emailAddress, mobileNumber, termsAndConditions];
    connection.query(query, values, (error, results) => {
      if (error) {
        throw error;
      }
      console.log('Form data saved successfully!');
    });

    return 'Form data saved successfully!';
  },
};

const app = express();

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(bodyParser.json());

// Serve the GraphQL API
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

// Start the server
app.listen(4000, () => {
  console.log('Server started on http://localhost:4000');
});
