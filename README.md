# SpendShifter - Frontend

This is the **frontend** of the SpendShifter application — a personal finance dashboard for tracking expenses, budgets, and recurring transactions.

**URL:** [https://spendshifter.com](https://spendshifter.com)

Built with **React**, **Javascript**, and **Axios** for API communication.

## Features

- Responsive Dashboard with expense summaries
- Expense Form and Table management
- User authentication (JWT)
- Modals for deleting entries
- Search and filtering capabilities
- Fully mobile-responsive

## Tech Stack

- **React** with functional components
- **React Router DOM** for client-side routing
- **Axios** for HTTP requests
- **Context** for global auth state management
- Custom hooks: `useSearch`, `useDeleteModal`
- Custom components

## Project Structure

```text
src/
├── assets/      # Images, logos, icons
├── components/  # Reusable UI components
├── context/     # Context providers like AuthContext
├── hooks/       # Custom hooks
├── pages/       # Page-level components
├── styles/      # globals, style variables, media queries
├── utils/       # Axios instance, helpers
└── App.jsx      # Main App component
```

## Getting Started

### Prerequisites

- Node.js >= 18
- npm or yarn
- Running backend API (see backend repo)

### Installation

```bash
git clone https://github.com/CodingKavin/SpendShifter-client.git
cd SpendShifter-client
npm install
```

### Related

- backend repo: https://github.com/CodingKavin/SpendShifter-server.git
