# Store API Postman/Newman Tests

[![Newman API tests](https://github.com/RollForQA/TS_internship_task4_PostmanNewman/actions/workflows/newman.yml/badge.svg)](https://github.com/RollForQA/TS_internship_task4_PostmanNewman/actions/workflows/newman.yml)

Automated API testing project for a local mock Store REST API and the public Swagger Petstore API. The Postman collections are executed with Newman in GitHub Actions, and the latest HTML dashboard is published to GitHub Pages.

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

`store.collection.json` covers **77 requests** and **367 assertions**.

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
| Pagination + sorting combined | Yes | Yes | Yes |
| Negative pagination values | Yes | Yes | Yes |
| Non-numeric pagination values | Yes | Yes | Yes |
| Unknown sort field -> `400` | Yes | Yes | Yes |
| Missing numeric ID -> `404` | Yes | Yes | Yes |
| Invalid ID type -> `404` | Yes | Yes | Yes |
| Special string IDs (`%20`, `null`) -> `404` | Yes | - | - |
| Update missing resource -> `404` | Yes | Yes | Yes |
| Delete missing resource idempotency | Yes | Yes | Yes |
| Missing required fields -> `400` | Yes | Yes | Yes |
| Extra fields -> `400` with cleanup | Yes | Yes | Yes |
| Empty body -> `400` | Yes | Yes | Yes |
| Malformed JSON -> `400` | Yes | Yes | Yes |
| Response time checks | Yes | Yes | Yes |
| Common response header checks | Yes | Yes | Yes |
| Strict JSON schema validation | Yes | Yes | Yes |
| Arrange, Act, Assert structure | Yes | Yes | Yes |

Common status, response-time, JSON content-type, and header checks are implemented as collection-level tests. Each request sets its expected status and response type in a request-level pre-request script, which keeps the business assertions focused and reduces duplicated Postman test code.

JSON schemas are stored as collection-level variables and reused from request tests. Successful response schemas use `additionalProperties: false`, so unexpected fields fail the test.

`petstore.collection.json` covers **30 requests** and **150 assertions**:

| Area | Petstore |
| --- | --- |
| Dynamic pet ID generation | Yes |
| Pet lifecycle: create -> get -> update -> get -> delete -> 404 | Yes |
| Pet search by valid status | Yes |
| Pet search by invalid status -> empty array | Yes |
| Pet search by tag | Yes |
| Pet invalid ID type -> `404` | Yes |
| Pet missing numeric ID -> `404` | Yes |
| Pet malformed JSON -> `400` | Yes |
| Store order lifecycle: create -> get -> delete -> 404 | Yes |
| Store order invalid ID type -> `404` | Yes |
| Store order malformed JSON -> `400` | Yes |
| Store inventory | Yes |
| User lifecycle: create -> get -> update -> get -> delete -> 404 | Yes |
| User login/logout | Yes |
| User missing username -> `404` | Yes |
| User malformed create/update JSON -> `400` | Yes |
| Response time checks | Yes |
| JSON schema validation | Yes |
| Arrange, Act, Assert structure | Yes |

## Project Files

| File | Purpose |
| --- | --- |
| `store.collection.json` | Postman collection for the local Mock API |
| `petstore.collection.json` | Postman collection for the public Swagger Petstore API |
| `store.environment.json` | Postman environment with `baseUrl` |
| `store.environment.ci.json` | CI-specific Postman environment with `baseUrl` |
| `mockApi/db_back_up.yaml` | Source mock data |
| `mockApi/db_stage.yaml` | Generated runtime mock data, ignored by git |
| `mockApi/dashboard_template.html` | HTML Dashboard template for the reports home page |
| `generate-dashboard.js` | Generates `newman-report/index.html` with run metadata |
| `.github/workflows/newman.yml` | CI workflow for Newman and GitHub Pages report publishing |
| `newman-report/index.html` | Local generated dashboard linking to both reports, ignored by git |

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

Run both Postman collections with Newman and generate the reports dashboard:

```bash
npm run test:api
```

Or run them individually:

```bash
# Run only Store API tests
npm run test:api:store

# Run only Petstore API tests
npm run test:api:petstore
```

The local HTML dashboard and detailed reports are generated at:

```text
newman-report/index.html      # Main Dashboard
newman-report/store.html     # Store API report
newman-report/petstore.html  # Petstore API report
newman-report/*-junit.xml    # JUnit reports for CI test summaries
newman-report/*.json         # Newman JSON reports
```

The `junit` reporter is built into Newman, so no separate `newman-reporter-junit` package is required. External reporters are only needed for custom reporter names such as `htmlextra`.

Run the Store collection for repeated idempotency checks:

```bash
npm run test:api:stress
```

## CI/CD

The workflow `.github/workflows/newman.yml` runs on push and pull request to `main`.

Pipeline steps:

1. Checkout repository.
2. Install Node.js dependencies with `npm ci`.
3. Start the local mock API.
4. Wait until the API is available.
5. Run both `store.collection.json` and `petstore.collection.json` with Newman.
6. Retry the public Petstore collection once to reduce external API flakes.
7. Generate HTML, JUnit, JSON reports and a central dashboard (`index.html`).
8. Publish JUnit results in the GitHub Actions test summary.
9. Upload the reports directory as a workflow artifact.
10. Publish the dashboard and reports with the official GitHub Pages deployment flow.
11. Add a PR comment with the workflow artifact link.
12. Mark the workflow as failed when any Newman collection fails.

GitHub Pages should be configured to serve the report from:

```text
Source: GitHub Actions
```

## Known Risks

The Petstore suite uses a public API, so it can fail because of network, TLS, rate-limit, or upstream data issues. The Newman command uses request/script timeouts, `--insecure` for local certificate compatibility, and one CI retry to keep those failures visible but less noisy.

`newman-report/`, `mockApi/db_stage.yaml`, and `*.log` are intentionally ignored by git because they are generated locally or in CI.

## Learning References

- [Testing REST API with Postman and curl](https://svitla.com/blog/testing-rest-api-with-postman-and-curl/)
- [Postman test examples](https://learning.postman.com/docs/tests-and-scripts/write-scripts/test-examples)
- [Postman Answers workspace](https://www.postman.com/postman/postman-answers/overview)
- [REST API tutorial](https://restfulapi.net/)
- [JSON Schema](https://json-schema.org/)
