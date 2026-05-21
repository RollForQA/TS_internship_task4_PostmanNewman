# Store API Postman/Newman Tests

[![Newman API tests](https://github.com/RollForQA/TS_internship_task4_PostmanNewman/actions/workflows/newman.yml/badge.svg)](https://github.com/RollForQA/TS_internship_task4_PostmanNewman/actions/workflows/newman.yml)

Automated API testing project for a local mock Store REST API. The Postman collection is executed with Newman in GitHub Actions, and the latest HTML report is published to GitHub Pages.

- GitHub Actions: [Newman API tests](https://github.com/RollForQA/TS_internship_task4_PostmanNewman/actions/workflows/newman.yml)
- Newman HTML report: [GitHub Pages report](https://rollforqa.github.io/TS_internship_task4_PostmanNewman/)

## Tested API

The project uses `yaml-server` to run a local mock API on `http://127.0.0.1:3000`.

| Resource | Operations |
| --- | --- |
| `/products` | `GET`, `GET /:id`, `POST`, `PUT`, `DELETE /:id` |
| `/orders` | `GET`, `GET /:id`, `POST`, `PUT`, `DELETE /:id` |
| `/users` | `GET`, `GET /:id`, `POST`, `PUT`, `DELETE /:id` |

## Test Coverage

`store.collection.json` currently covers **51 requests** and **201 assertions**.

| Area | Products | Orders | Users |
| --- | --- | --- | --- |
| CRUD endpoints | Yes | Yes | Yes |
| Full lifecycle: create -> get -> update -> get -> delete -> 404 | Yes | Yes | Yes |
| Dynamic IDs via collection variables | Yes | Yes | Yes |
| Pagination: normal page | Yes | Yes | Yes |
| Pagination: empty/out-of-range page | Yes | Yes | Yes |
| Pagination: zero page size | Yes | Yes | Yes |
| Sorting ASC | Yes | Yes | Yes |
| Sorting DESC | Yes | Yes | Yes |
| Missing numeric ID -> `404` | Yes | Yes | Yes |
| Invalid ID type -> `404` | Yes | Yes | Yes |
| Missing required fields -> `400` | Yes | Yes | Yes |
| Malformed JSON -> `400` | Yes | Yes | Yes |
| Response time checks | Yes | Yes | Yes |
| Strict JSON schema validation | Yes | Yes | Yes |
| Arrange, Act, Assert structure | Yes | Yes | Yes |

The successful response schemas use `additionalProperties: false`, so unexpected fields fail the test.

## Project Files

| File | Purpose |
| --- | --- |
| `store.collection.json` | Main Postman collection with all API tests |
| `store.environment.json` | Postman environment with `baseUrl` |
| `mockApi/db_back_up.yaml` | Source mock data |
| `mockApi/db_stage.yaml` | Runtime mock data copied from backup before API start |
| `.github/workflows/newman.yml` | CI workflow for Newman and GitHub Pages report publishing |
| `newman-report/index.html` | Local generated report, ignored by git |

## Local Run

Install dependencies:

```bash
npm install
```

Start the mock API:

```bash
npm run start-api
```

The original task command is also supported:

```bash
npm run tern-on-api
```

The corrected alias is available too:

```bash
npm run turn-on-api
```

Run the Postman collection with Newman:

```bash
npm run test:api
```

The local HTML report is generated at:

```text
newman-report/index.html
```

## CI/CD

The workflow `.github/workflows/newman.yml` runs on push and pull request to `main`.

Pipeline steps:

1. Checkout repository.
2. Install Node.js dependencies with `npm ci`.
3. Start the local mock API.
4. Wait until the API is available.
5. Run `store.collection.json` with Newman.
6. Generate an HTML report with `newman-reporter-htmlextra`.
7. Upload the report as a workflow artifact.
8. Publish the latest report to the `gh-pages` branch.

GitHub Pages is configured to serve the report from:

```text
Branch: gh-pages
Folder: /root
```

## Learning References

- [Testing REST API with Postman and curl](https://svitla.com/blog/testing-rest-api-with-postman-and-curl/)
- [Postman test examples](https://learning.postman.com/docs/tests-and-scripts/write-scripts/test-examples)
- [Postman Answers workspace](https://www.postman.com/postman/postman-answers/overview)
- [REST API tutorial](https://restfulapi.net/)
- [JSON Schema](https://json-schema.org/)
