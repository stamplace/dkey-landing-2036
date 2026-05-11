#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const file = resolve(process.cwd(), 'demo.html');
let html = readFileSync(file, 'utf8');
const original = html;
const changes = [];
const skipped = [];

function replaceTarget(label, pattern, replacement, { required = false } = {}) {
  const before = html;
  html = html.replace(pattern, (...args) => {
    return typeof replacement === 'function' ? replacement(...args) : replacement;
  });

  if (html !== before) {
    changes.push(label);
    return true;
  }

  if (required) {
    throw new Error(`Missing required target: ${label}`);
  }

  skipped.push(label);
  return false;
}

replaceTarget(
  'title',
  /<title>[\s\S]*?<\/title>/,
  '<title>DKey — שכבת עבודה מעל המקלדת</title>',
  { required: true }
);

replaceTarget(
  'brand subtitle',
  /(<strong>DKey<\/strong>\s*<small>)[\s\S]*?(<\/small>)/,
  '$1שכבת עבודה מעל המקלדת$2'
);

replaceTarget(
  'top trust pills',
  /<div class="pills">[\s\S]*?<\/div>/,
  `<div class="pills">
      <span>האדם במרכז</span>
      <span>אין שליחה אוטומטית</span>
      <span>אין הרצה אוטומטית</span>
      <span>עובד איפה שכותבים</span>
    </div>`
);

replaceTarget(
  'hero eyebrow',
  /(<p class="eyebrow">)[\s\S]*?(<\/p>)/,
  '$1DKEY · HUMAN FIRST KEYBOARD LAYER$2'
);

replaceTarget(
  'hero h1',
  /<h1>[\s\S]*?<\/h1>/,
  '<h1>המקלדת שמחזירה לך את הסדר לפני הפעולה.</h1>',
  { required: true }
);

replaceTarget(
  'hero lead',
  /(<p class="lead">)[\s\S]*?(<\/p>)/,
  `$1DKey עוזרת להפוך כל רעיון, ניסוח, פקודה או בקשה לתוצאה ברורה ומוכנה — אבל עוצרת לפני השימוש. אתה רואה, מבין, מאשר, ורק אז ממשיך.$2`,
  { required: true }
);

replaceTarget(
  'principles',
  /<div class="principles">[\s\S]*?<\/div>/,
  `<div class="principles">
      <article><strong>01</strong><span>כותבים טבעי. לא צריך פרומפט מושלם.</span></article>
      <article><strong>02</strong><span>בוחרים מצב ברור לפי ההקשר שלך.</span></article>
      <article><strong>03</strong><span>מקבלים תוצאה מוכנה לקריאה ובדיקה.</span></article>
      <article><strong>04</strong><span>מאשרים ידנית. שום דבר לא רץ לבד.</span></article>
    </div>`,
  { required: true }
);

replaceTarget(
  'scenario heading',
  /(<div class="scenarioPanel">\s*<strong>)[\s\S]*?(<\/strong>)/,
  '$1בחר רגע עבודה אמיתי$2'
);

replaceTarget(
  'app brand subtitle',
  /(<div class="appBrand">[\s\S]*?<strong>DKey<\/strong>\s*<small>)[\s\S]*?(<\/small>)/,
  '$1שכבת עבודה מעל המקלדת$2'
);

replaceTarget(
  'status pill',
  /(<div class="statusPill">)[\s\S]*?(<\/div>)/,
  '$1מוכן לבדיקה$2'
);

replaceTarget(
  'input label',
  /(<label class="inputLabel"[^>]*>)[\s\S]*?(<\/label>)/,
  '$1כתוב כאן כמו שאתה חושב$2'
);

replaceTarget(
  'output label',
  /(<div class="output">\s*<small>)[\s\S]*?(<\/small>)/,
  '$1תוצאה מוכנה לבדיקה$2'
);

replaceTarget(
  'approve button',
  /(<button class="approve"[^>]*>)[\s\S]*?(<\/button>)/,
  '$1אשר שימוש$2'
);

replaceTarget(
  'hint copy',
  /(<p class="hint"[^>]*>)[\s\S]*?(<\/p>)/,
  '$1שום דבר לא נשלח ולא רץ בלי החלטה שלך.$2'
);

if (html === original) {
  throw new Error('No changes were applied.');
}

writeFileSync(file, html);
console.log(`Applied DKey copy v2 to demo.html (${changes.length} targets).`);
console.log('Changed targets:');
for (const change of changes) console.log(`- ${change}`);

if (skipped.length) {
  console.log('Skipped optional targets:');
  for (const item of skipped) console.log(`- ${item}`);
}
