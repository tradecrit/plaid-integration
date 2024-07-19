# Plaid Link Backend Integration

Open source integration for Plaid Link, to show an example of how to create the backend integration for Plaid Link. This repository is a simple example of how to create a backend integration for Plaid Link using Node.js and Express.js along with Typescript. 

# Getting Started

To get started, you will need to have a Plaid account and create a new Plaid application. You can create a new Plaid application by going to the Plaid dashboard and creating a new application. Once you have created a new application, you will need to get your `client_id` and `secret` from the Plaid dashboard.

# Installation

To install the project, you will need to clone the repository and install the dependencies. You can do this by running the following commands:

```bash
git clone
cd plaid-link-backend-integration
npm install
```

# Configuration

To configure the project, you will need to create a `.env` file in the root of the project. You can optionally use the template file as an example, then add/update the following environment variables:

```bash
PLAID_CLIENT_ID=YOUR_PLAID_CLIENT_ID
PLAID_SECRET=YOUR_PLAID_SECRET
PLAID_PUBLIC_KEY=YOUR_PLAID_PUBLIC_KEY
PLAID_ENVIRONMENT=sandbox
```

# Running the Project

To run the project, you can use the following command:

```bash
npm start
```

This will start the server on `http://localhost:8080`. You can then call this endpoint from your frontend application to create a Plaid Link token along with the subsequent public token exchange.

# License

This project is licensed under the GPLv3 License - see the [LICENSE](LICENSE) file for details.

# Contributing

If you would like to contribute to this project, please create a new issue or submit a pull request. All contributions are welcome!
