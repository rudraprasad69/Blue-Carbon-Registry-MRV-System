# Blue Carbon Registry & MRV System

This is a Next.js project for a blockchain-based blue carbon registry and MRV (Monitoring, Reporting, and Verification) system.

## Overview

The project aims to create a transparent and decentralized platform for managing blue carbon projects and carbon credit trading. It leverages blockchain technology to ensure the immutability and traceability of carbon credits.

The frontend is built with Next.js, TypeScript, and Tailwind CSS. It includes a comprehensive set of components for displaying data, interacting with the blockchain, and managing user accounts.

The backend services are located in the `lib` directory. They provide the necessary functionality for data aggregation, validation, and verification. The services are designed to be modular and extensible, allowing for easy integration with different data sources and blockchain platforms.

## Getting Started

To get started with the project, follow these steps:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open the application in your browser:**
   [http://localhost:3000](http://localhost:3000)

## Project Structure

The project is organized into the following directories:

- `app`: Contains the main application pages and layouts.
- `components`: Contains the React components used in the application.
- `hooks`: Contains custom React hooks.
- `lib`: Contains the backend services for data aggregation, validation, and verification.
- `public`: Contains the static assets, such as images and fonts.
- `styles`: Contains the global CSS styles.

## Next Steps

The next step in the development of this project is to replace the mock data with real data from a blockchain and a database. This will involve implementing the data fetching logic in the components and creating the necessary backend services.
