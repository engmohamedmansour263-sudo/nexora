import { calculators } from '../src/lib/calculators.ts';
import { localizedCalculator } from '../src/lib/calculator-translations.ts';
import { templates, templateName, templateDescription } from '../src/lib/templates.ts';

const locales = ['en', 'ar', 'hi', 'bn', 'es', 'pt'];
const failures = [];
for (const locale of locales) {
  for (const calculator of calculators) {
    const translated = localizedCalculator(calculator, locale);
    if (!translated.name?.trim() || !translated.description?.trim()) {
      failures.push(`${locale}/${calculator.slug}: missing name or description`);
    }
    if (locale !== 'en' && translated.name === calculator.name) {
      failures.push(`${locale}/${calculator.slug}: untranslated calculator name`);
    }
  }
}
for (const locale of locales) {
  for (const template of templates) {
    if (!templateName(template, locale)?.trim() || !templateDescription(template, locale)?.trim()) {
      failures.push(`${locale}/${template.slug}: missing template name or description`);
    }
  }
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`Translations passed: ${calculators.length} calculators and ${templates.length} templates × ${locales.length} locales.`);
