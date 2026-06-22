module.exports = {
  default: `
    --require step-definitions/**/*.js
    --format progress
    --format html:reports/cucumber-report.html
    features/**/*.feature
  `
};
