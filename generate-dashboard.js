const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, 'mockApi', 'dashboard_template.html');
const reportDir = path.join(__dirname, 'newman-report');
const outputPath = path.join(reportDir, 'index.html');

function displayStatus(value) {
  const normalized = (value || 'unknown').toLowerCase();
  if (normalized === 'success') return { text: 'success', css: 'success' };
  if (normalized === 'failure' || normalized === 'failed') return { text: 'failure', css: 'failure' };
  if (normalized === 'cancelled' || normalized === 'skipped') return { text: normalized, css: 'skipped' };
  return { text: normalized, css: 'unknown' };
}

function replaceAll(source, replacements) {
  return Object.entries(replacements).reduce(
    (content, [key, value]) => content.replaceAll(`{{${key}}}`, value),
    source
  );
}

const storeStatus = displayStatus(process.env.STORE_OUTCOME || process.env.STORE_STATUS || 'generated');
const petstoreStatus = displayStatus(process.env.PETSTORE_OUTCOME || process.env.PETSTORE_STATUS || 'generated');
const commitSha = process.env.GITHUB_SHA ? process.env.GITHUB_SHA.slice(0, 7) : 'local';
const runNumber = process.env.GITHUB_RUN_NUMBER || 'local';
const runDate = new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kyiv' });

const template = fs.readFileSync(templatePath, 'utf8');
const html = replaceAll(template, {
  RUN_NUMBER: runNumber,
  COMMIT_SHA: commitSha,
  RUN_DATE: runDate,
  STORE_STATUS: storeStatus.text,
  STORE_STATUS_CLASS: storeStatus.css,
  PETSTORE_STATUS: petstoreStatus.text,
  PETSTORE_STATUS_CLASS: petstoreStatus.css
});

fs.mkdirSync(reportDir, { recursive: true });
fs.writeFileSync(outputPath, html, 'utf8');

console.log(`Dashboard generated: ${path.relative(__dirname, outputPath)}`);
