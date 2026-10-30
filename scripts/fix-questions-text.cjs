const fs = require('fs');

const raw = JSON.parse(fs.readFileSync('src/data/questionsData.json', 'utf8'));

function cleanPersianString(str, isReversed = false) {
  if (!str) return '';
  let s = str.normalize('NFKC');
  s = s.replace(/[\u200B-\u200D\uFEFF]/g, '')
       .replace(/\u200c/g, ' ')
       .replace(/ي/g, 'ی')
       .replace(/ك/g, 'ک')
       .replace(/¬/g, '')
       .replace(/\s+/g, ' ')
       .trim();

  if (isReversed) {
    // Reverse word order for visual-order PDF text
    const words = s.split(' ').filter(w => w.length > 0);
    // If the string starts with question mark or typical ending, it was reversed
    s = words.reverse().join(' ');
  }

  // Clean duplicate consecutive words like "فاصله فاصله" -> "فاصله"
  s = s.replace(/\b(\S+)\s+\1\b/g, '$1');
  // Clean "الف) الف)"
  s = s.replace(/^(الف|ب|ج|د)[\)\(]\s*/, '');

  return s.trim();
}

const cleaned = raw.map(q => {
  const isReversedYear = (q.year === 1402 || q.year === 1400);

  // Check if question text actually looks reversed (e.g. contains words in reverse)
  let qText = q.question;
  if (isReversedYear) {
    qText = cleanPersianString(q.question, true);
  } else {
    qText = cleanPersianString(q.question, false);
  }

  const cleanOpts = q.options.map((opt, idx) => {
    let oText = opt;
    if (isReversedYear) {
      // If option has English words, don't reverse English
      const hasEnglish = /[a-zA-Z]/.test(opt);
      oText = cleanPersianString(opt, !hasEnglish);
    } else {
      oText = cleanPersianString(opt, false);
    }
    if (!oText || oText.length < 2) {
      const letters = ['الف', 'ب', 'ج', 'د'];
      return `گزینه ${letters[idx]}`;
    }
    return oText;
  });

  return {
    ...q,
    question: qText,
    options: cleanOpts
  };
});

fs.writeFileSync('src/data/questionsData.json', JSON.stringify(cleaned, null, 2));

const tsCode = `import { Question } from './types';
import questionsList from './questionsData.json';

export const questionsData: Question[] = questionsList as Question[];
`;
fs.writeFileSync('src/data/questionsData.ts', tsCode);

console.log(`Cleaned ${cleaned.length} questions.`);
console.log('Sample 1404 Q1:', cleaned[0].question);
console.log('Sample 1402 Q1:', cleaned.find(q => q.year === 1402)?.question);
