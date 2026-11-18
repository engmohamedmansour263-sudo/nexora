import assert from 'node:assert/strict';
import { calculators, categories, getCalculator, isCalculatorInputValid } from '../src/lib/calculators.ts';

assert.equal(calculators.length, 32, 'Expected the 32-calculator launch catalog');
assert.equal(new Set(calculators.map((item) => item.slug)).size, calculators.length, 'Calculator slugs must be unique');
assert.ok(!calculators.some((item) => /loan|mortgage/i.test(`${item.slug} ${item.name}`)), 'Loan calculators must not be included');
assert.equal(categories.length, 10, 'Expected All plus nine categories');

for (const calculator of calculators) {
  assert.ok(calculator.slug && calculator.name && calculator.description, `Missing catalog metadata: ${calculator.slug}`);
  assert.ok(calculator.fields.length > 0, `No input fields: ${calculator.slug}`);
  const values = Object.fromEntries(calculator.fields.map((field) => [field.key, field.initial]));
  assert.ok(isCalculatorInputValid(calculator, values), `Initial values should be valid: ${calculator.slug}`);
  const results = calculator.calculate(values);
  assert.ok(results.length > 0, `No results: ${calculator.slug}`);
  for (const result of results) {
    assert.ok(result.label, `Missing result label: ${calculator.slug}`);
    assert.ok(Number.isFinite(result.value), `Non-finite initial result: ${calculator.slug}/${result.label}`);
  }
  assert.equal(getCalculator(calculator.slug), calculator, `Slug lookup failed: ${calculator.slug}`);
}

console.log(`Calculator catalog passed: ${calculators.length} calculators, ${categories.length - 1} categories.`);

const invalidCases = [
  ['fraction-to-decimal', 'denominator'],
  ['pace', 'distance'],
  ['download-time', 'speed'],
  ['travel-speed', 'hours'],
  ['paint', 'coverage'],
  ['grade', 'total'],
  ['unit-price', 'quantity'],
  ['compound-growth', 'periods'],
];
for (const [slug, key] of invalidCases) {
  const calculator = getCalculator(slug);
  const values = Object.fromEntries(calculator.fields.map((field) => [field.key, field.initial]));
  values[key] = 0;
  assert.equal(isCalculatorInputValid(calculator, values), false, `Zero divisor should be rejected: ${slug}/${key}`);
}
