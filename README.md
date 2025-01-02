# Build Web Application Express-API ExpressJS With Docker

## Prerequisites

- Ensure you have [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed on your machine.
- Make sure you have [Node.js](https://nodejs.org/) and [Yarn](https://classic.yarnpkg.com/en/docs/install/) for package management.

## Swagger documentation
- http://localhost:5000/api-docs/

## Installation

Follow these steps to set up and run the application:

1. **Install the necessary packages:**

   ```bash
   yarn install

2. **Create database Express:**
   ```bash
   yarn db:create

3. **Create database tables in database Express:**
   ```bash
   yarn db:migrate

4. **Seed sample data into database tables:**
   ```bash
   yarn db:seed:all

5. **Build with docker compose:**
   ```bash
   docker compose up