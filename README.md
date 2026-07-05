# Playwright API Tests — Platzi Fake Store API

API test suite for [api.escuelajs.co/api/v1/](https://api.escuelajs.co/api/v1/) using Playwright Test.

---

## Prerequisites

- **Node.js** v18 or higher
- **npm** v8 or higher

---

## Installation

```bash
npm install
```

> No browser binaries are needed — these are pure API tests.

---

## Project Structure

```
playwright-api-tests/
├── playwright.config.ts          # Base URL, reporter, project config
└── tests/
    ├── fakeapi.platzi.tests.spec.ts  # Standalone tests (no shared state)
    ├── products.api.spec.js          # Full Products suite with beforeEach/afterEach
    └── helpers/
        ├── products.helper.js        # createProduct / deleteProduct / createProductPayload
        └── tags.js                   # Tag constants (@smoke, @regression, etc.)
```

---

## Running Tests

### Run all tests

```bash
npx playwright test
```

### Run a specific test file

```bash
# Structured suite with beforeEach/afterEach hooks
npx playwright test tests/products.api.spec.js

# Standalone test file
npx playwright test tests/fakeapi.platzi.tests.spec.ts
```

### Run tests by tag (grep)

Tags are embedded in test names. Use `--grep` to filter:

```bash
# Smoke tests only
npx playwright test --grep "@smoke"

# Pagination tests only
npx playwright test --grep "@pagination"

# Products tests only
npx playwright test --grep "@products"

# Update tests only
npx playwright test --grep "@update"

# Delete tests only
npx playwright test --grep "@delete"
```

### Run tests by Playwright project name

```bash
npx playwright test --project fakeapi.platzi
```

### Run tests in headed mode (shows browser/network panel)

```bash
npx playwright test --headed
```

### Run a single test by title

```bash
npx playwright test --grep "Get a single product by id"
```

---

## Available Tags

| Tag          | Value         | Purpose                         |
| ------------ | ------------- | ------------------------------- |
| `smoke`      | `@smoke`      | Critical path — run on every CI |
| `regression` | `@regression` | Full regression sweep           |
| `products`   | `@products`   | All product endpoint tests      |
| `pagination` | `@pagination` | Pagination / offset-limit tests |
| `create`     | `@create`     | Product creation tests          |
| `update`     | `@update`     | Product update (PUT) tests      |
| `delete`     | `@delete`     | Product deletion tests          |

---

## Test Coverage

### `products.api.spec.js` — structured suite

Uses `beforeEach` to create a product and `afterEach` to clean it up.

| Test                                                        | Tags               |
| ----------------------------------------------------------- | ------------------ |
| Get a single product by id                                  | `@smoke @products` |
| Get a single product by slug                                | `@smoke @products` |
| Update a product                                            | `@smoke @update`   |
| Pagination returns 10 products                              | `@pagination`      |
| Pagination returns different products for different offsets | `@pagination`      |
| Get products related by id                                  | `@smoke @products` |
| Get products related by slug                                | `@smoke @products` |
| Create a product                                            | `@smoke @products` |
| Delete a product                                            | `@smoke @delete`   |

Also includes an **Annotations examples** describe block that demonstrates:

- `test.skip` — temporarily disabled test
- `test.fixme` — known broken test
- `test.fail` — expected-to-fail assertion
- `test.slow` — increases timeout 3×

### `fakeapi.platzi.tests.spec.ts` — standalone tests

No shared setup. Each test is fully self-contained.

| Test                                                        |
| ----------------------------------------------------------- |
| Get a single product by id                                  |
| Create a product                                            |
| Update a product                                            |
| Delete a product                                            |
| Pagination returns 10 products                              |
| Pagination returns different products for different offsets |
| Get products related by id                                  |
| Get products related by slug                                |

---

## Reports

After a test run, open the HTML report:

```bash
npx playwright show-report
```

Trace files are captured on first retry and can be viewed in the Playwright Trace Viewer:

```bash
npx playwright show-trace <path-to-trace.zip>
```

---

## Configuration

| Setting            | Value                              |
| ------------------ | ---------------------------------- |
| Base URL           | `https://api.escuelajs.co/api/v1/` |
| Parallel execution | Enabled (`fullyParallel: true`)    |
| Reporter           | HTML                               |
| Trace              | On first retry                     |
| Project name       | `fakeapi.platzi`                   |

To change the base URL, edit `playwright.config.ts`:

```ts
use: {
  baseURL: 'https://your-api-host/api/v1/',
}
```

---

## Dependencies

| Package            | Role                                 |
| ------------------ | ------------------------------------ |
| `@playwright/test` | Test runner and API request fixtures |
| `@faker-js/faker`  | Random test data generation          |
| `@types/node`      | TypeScript Node.js types (dev)       |
