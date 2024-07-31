
# User Management Demo

This repo is created by using [Next.js 14](https://nextjs.org/blog/next-14) template from [Redux Toolkit](https://redux-toolkit.js.org/introduction/getting-started) :
```bash
npx create-next-app --example with-redux with-redux-app
```


## Features and Implementation

- Simulate login feature and manage user session via [NextAuth.js Credentials](https://next-auth.js.org/providers/credentials).

- Using [Redux](https://redux.js.org/usage/nextjs) and [Redux Toolkit](https://redux-toolkit.js.org) to manage application state when create, update, delete and display user information.

- Implement [React Hook Form](https://react-hook-form.com) and [Yup](https://github.com/jquense/yup) to handle form validation.

- UI component is powered by [Material UI](https://mui.com/material-ui/getting-started).

- Handle fetching data from server using [Axios](https://axios-http.com/docs/intro) and [Redux AsyncThunk](https://redux-toolkit.js.org/api/createAsyncThunk)

- Using [Jest](https://jestjs.io/docs/getting-started) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) for unit testing.
## Run Locally

Clone the project

```bash
  git clone https://github.com/chitnarongm/user-management-demo.git
```

Go to the project directory

```bash
  cd user-management-demo
```

Install dependencies

```bash
  npm install
```

Before starting, this repo has simulated simple local database as following files:
- `/app/api/users/mockUserService.ts` - to simulate `create`, `update`, `delete` and `retrieve` database operations.
- `/data/users.json` - main database file, will be operated by `/app/api/users/mockUserService.ts`
- `/data/initialUsers.json` - initial valid sample user data, used to setup and reset user data by copying data from this file into `/data/users.json`

Setup database

- Copy data from `/data/initialUsers.json` to `/data/users.json`


Start the server

```bash
  npm run dev
```


## Running Tests

To run tests, run the following command
```bash
  npm run test
```

Watch mode

```bash
  npm run test:watch
```

Coverage mode

```bash
  npm run coverage
```
