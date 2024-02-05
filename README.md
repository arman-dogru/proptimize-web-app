# Proptimize Landing Page

## Overview

Responsive landing page designed to showcase our services and engage users effectively. This project is built using React and employs various components to create an interactive user experience.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following tools installed:

- Node.js (v12.0.0 or higher)
- npm (usually comes with Node.js)
- Git

### Installation

1. **Clone the Repo**

   ```bash
   git clone https://github.com/arman-dogru/proptimize-landingpage.git
   cd proptimize-landingpage
   ```

2. **Install NPM Packages**

   Install all the necessary NPM packages:

   ```bash
   npm install
   ```

3. **Start the Development Server**

   Run the following command to start the development server:

   ```bash
   npm start
   ```

   After running this command, your default web browser should open the project running at `http://localhost:3000`.

## Development Workflow

### Branching Strategy

- Main branch: `main`
- Component branches: `component/<component_name>`
- Bugfix branches: `bugfix/<bugfix_name>`

### Common Git Commands

- **To create a new branch:**

  ```bash
  git checkout -b <branch_name>
  ```

- **To switch between branches:**

  ```bash
  git checkout <branch_name>
  ```

- **To add changes:**

  ```bash
  git add .
  ```

- **To commit changes:**

  ```bash
  git commit -m "Commit message"
  ```

- **To pull the latest changes from remote:**

  ```bash
  git pull origin <branch_name>
  ```

- **To push changes to remote:**

  ```bash
  git push origin <branch_name>
  ```

- **To merge a branch into main (after pull request approval):**

  ```bash
  git checkout main
  git pull origin main
  git merge <branch_name>
  git push origin main
  ```
