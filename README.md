# OrangeHRM Playwright Automation Framework

## Overview

This project is a UI Automation Framework built using Playwright and JavaScript to automate key workflows of the OrangeHRM application. The framework follows industry-standard automation practices including Page Object Model (POM), test data separation, environment variable management, reusable components, and failure diagnostics.

The framework is designed to be scalable, maintainable, and easy to extend as additional modules and test scenarios are added.

---

## Technology Stack

* Playwright
* JavaScript (Node.js)
* Page Object Model (POM)
* Dotenv
* HTML Reports
* Git & GitHub

---

## Framework Features

* Page Object Model implementation
* Reusable page classes
* Test data separation
* Environment variable management using `.env`
* Dynamic test data generation
* HTML execution reports
* Screenshot capture on failure
* Video recording on failure
* Trace capture on failure
* Scalable folder structure
* Cross-browser execution support

---

## Project Structure

```text
hrmsystem
│
├── pages
│   ├── LoginPage.js
│   ├── DashboardPage.js
│   ├── AdminPage.js
│   └── UserManagementPage.js
│
├── tests
│   └── auth
│       ├── login.spec.js
│       └── user-management.spec.js
│
├── test-data
│   ├── loginData.js
│   └── userManagementData.js
│
├── fixtures
│
├── playwright.config.js
├── package.json
├── .env
├── .gitignore
└── README.md
```

---

## Implemented Test Scenarios

### Login Module

* Valid Login
* Invalid Login
* Invalid Credentials Validation

### User Management Module

* Create User
* Search User
* Edit User Status
* Delete User
* Delete Cancellation Validation

---

## Environment Variables

Create a `.env` file in the project root.

Example:

```env
ORANGE_USERNAME=<your_username>
ORANGE_PASSWORD=<your_password>

ORANGE_INVALIDUSERNAME=<invalid_username>
ORANGE_INVALIDPASSWORD=<invalid_password>
```

The `.env` file is excluded from source control using `.gitignore` to prevent exposing credentials.

---

## Installation

Clone the repository:

```bash
git clone <repository-url>
```

Navigate to project folder:

```bash
cd hrmsystem
```

Install dependencies:

```bash
npm install
```

Install Playwright browsers:

```bash
npx playwright install
```

---

## Running Tests

Run all tests:

```bash
npx playwright test
```

Run tests in headed mode:

```bash
npx playwright test --headed
```

Run a specific test file:

```bash
npx playwright test tests/auth/user-management.spec.js
```

Run tests in UI mode:

```bash
npx playwright test --ui
```

---

## Reporting

Generate and view Playwright HTML Report:

```bash
npx playwright show-report
```

The framework automatically captures:

* HTML Reports
* Screenshots on Failure
* Video Recordings on Failure
* Playwright Traces on Failure

---

## Framework Design Principles

### Page Object Model (POM)

All page-specific locators and actions are maintained within dedicated page classes.

Example:

```javascript
await loginPage.login(username, password);

await userManagementPage.clickAddUser();

await userManagementPage.searchUser(username);
```

Benefits:

* Improved maintainability
* Better code reusability
* Reduced locator duplication
* Easier troubleshooting

---

### Test Data Separation

Test data is maintained separately from automation scripts.

Example:

```javascript
const userManagementData = {
  newUser: {
    role: 'Admin',
    statusEnabled: 'Enabled',
    statusDisabled: 'Disabled',
    password: 'Test@12345Aa!'
  }
};
```

Benefits:

* Easier maintenance
* Better readability
* Reusable data across tests
* Reduced hardcoding

---

### Environment Variable Management

Sensitive information such as usernames and passwords are managed using environment variables rather than hardcoded values.

Benefits:

* Improved security
* Easier environment configuration
* Better CI/CD integration

---

## Failure Diagnostics

The framework automatically captures failure evidence:

### Screenshots

Captured automatically when a test fails.

### Videos

Recorded and retained for failed executions.

### Traces

Playwright trace files are retained for failed executions to assist with root cause analysis.

---

## Future Enhancements

* API Automation using Playwright APIRequestContext
* Data-Driven Testing using JSON files
* Cucumber BDD Integration
* Jenkins CI/CD Integration
* GitHub Actions Pipeline
* Cross-Browser Regression Suite
* Database Validation
* Parallel Regression Execution

---

## Author

Avantika Tiwari

QA Engineer | Test Analyst | Playwright Automation | API Testing | SQL Validation | Agile Testing
