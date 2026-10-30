const fs = require('fs');
const { PDFParse } = require('pdf-parse');

function cleanPersian(str) {
  if (!str) return '';
  return str
    .replace(/\t+/g, ' ')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/\u200c/g, ' ')
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/¬/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeNumbers(str) {
  if (!str) return '';
  const fa = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
  return str.replace(/[۰-۹]/g, c => fa.indexOf(c));
}

// 1404 extractor
async function get1404Questions() {
  const buf = fs.readFileSync('public/assets/aistudio/license-to-medical-1404_a9007616.pdf');
  const parser = new PDFParse({ data: buf });
  const res = await parser.getText();
  const rawText = res.text.replace(/\t/g, ' ');

  const getSubject = (qNum) => {
    if (qNum <= 34) return 'فیزیولوژی';
    if (qNum <= 54) return 'بیوشیمی پزشکی';
    if (qNum <= 74) return 'باکتری‌شناسی و ویروس‌شناسی';
    if (qNum <= 90) return 'انگل‌شناسی و قارچ‌شناسی';
    if (qNum <= 140) return 'علوم تشریح (آناتومی، بافت و جنین)';
    if (qNum <= 160) return 'اصول خدمات سلامت و اپیدمیولوژی';
    if (qNum <= 170) return 'ایمنی‌شناسی پزشکی';
    if (qNum <= 180) return 'مبانی روان‌شناسی';
    return 'تفکر نقاد و استدلال بالینی';
  };

  const keys1404 = {
    1: 3, 2: 1, 3: 0, 4: 0, 5: 3, 6: 1, 7: 1, 8: 2, 9: 1, 10: 1,
    11: 0, 12: 2, 13: 0, 14: 1, 15: 0, 16: 1, 17: 3, 18: 2, 19: 0, 20: 3,
    21: 0, 22: 2, 23: 3, 24: 0, 25: 2, 26: 3, 27: 0, 28: 3, 29: 2, 30: 0,
    31: 2, 32: 3, 33: 1, 34: 0, 35: 0, 36: 3, 37: 0, 38: 2, 39: 3, 40: 0,
    41: 1, 42: 2, 43: 1, 44: 2, 45: 3, 46: 1, 47: 3, 48: 1, 49: 0, 50: 0,
    51: 0, 52: 2, 53: 1, 54: 3, 55: 1, 56: 3, 57: 2, 58: 3, 59: 3, 60: 0,
    61: 2, 62: 1, 63: 1, 64: 2, 65: 2, 66: 0, 67: 1, 68: 2, 69: 1, 70: 2,
    71: 1, 72: 0, 73: 3, 74: 0, 75: 3, 76: 2, 77: 3, 78: 3, 79: 2, 80: 1,
    81: 2, 82: 2, 83: 3, 84: 1, 85: 0, 86: 2, 87: 3, 88: 0, 89: 1, 90: 3,
    91: 2, 92: 0, 93: 1, 94: 2, 95: 1, 96: 0, 97: 2, 98: 3, 99: 3, 100: 2,
    101: 1, 102: 2, 103: 3, 104: 0, 105: 1, 106: 2, 107: 0, 108: 0, 109: 3, 110: 2,
    111: 2, 112: 1, 113: 3, 114: 0, 115: 1, 116: 0, 117: 3, 118: 1, 119: 3, 120: 3,
    121: 2, 122: 1, 123: 0, 124: 3, 125: 2, 126: 0, 127: 3, 128: 1, 129: 0, 130: 0,
    131: 3, 132: 1, 133: 0, 134: 2, 135: 3, 136: 3, 137: 1, 138: 3, 139: 1, 140: 0,
    141: 1, 142: 1, 143: 2, 144: 3, 145: 1, 146: 2, 147: 0, 148: 1, 149: 1, 150: 3,
    151: 3, 152: 1, 153: 2, 154: 0, 155: 2, 156: 2, 157: 2, 158: 2, 159: 0, 160: 0,
    161: 1, 162: 3, 163: 0, 164: 2, 165: 1, 166: 1, 167: 3, 168: 0, 169: 0, 170: 3,
    171: 3, 172: 2, 173: 0, 174: 0, 175: 1, 176: 0, 177: 0, 178: 1, 179: 2, 180: 0,
    181: 0, 182: 3, 183: 1, 184: 0, 185: 2, 186: 2, 187: 2, 188: 0, 189: 3, 190: 3,
    191: 1, 192: 1, 193: 0, 194: 1, 195: 3, 196: 2, 197: 3, 198: 3, 199: 2, 200: 3
  };

  const qRegex = /(?:^|\n)\s*-?(\d{1,3})\s*[-–]/g;
  let match;
  const indices = [];
  while ((match = qRegex.exec(rawText)) !== null) {
    indices.push({ qNum: parseInt(match[1]), index: match.index });
  }

  const list = [];
  for (let i = 0; i < indices.length; i++) {
    const qNum = indices[i].qNum;
    if (qNum < 1 || qNum > 200) continue;
    const start = indices[i].index;
    const end = (i + 1 < indices.length) ? indices[i + 1].index : rawText.length;
    let block = rawText.slice(start, end);

    block = block.replace(/هجدهمین دوره آزمون پذیرش دانشجوی پزشکی.*?سال 1404/g, '');
    block = block.replace(/sanapezeshki\.com.*?مشاوره/g, '');
    block = block.replace(/\n\d+\s*\n/g, '\n');

    const parts = block.split(/(?=الف[\)\(]|ب[\)\(]|ج[\)\(]|د[\)\(])/);
    let qStem = parts[0] || '';
    qStem = qStem.replace(/^\s*-?\d+\s*[-–]/, '').trim();

    let optA = '', optB = '', optC = '', optD = '';
    for (let p = 1; p < parts.length; p++) {
      const part = parts[p].trim();
      if (part.startsWith('الف')) optA = part.replace(/^الف[\)\(]\s*/, '').trim();
      else if (part.startsWith('ب')) optB = part.replace(/^ب[\)\(]\s*/, '').trim();
      else if (part.startsWith('ج')) optC = part.replace(/^ج[\)\(]\s*/, '').trim();
      else if (part.startsWith('د')) optD = part.replace(/^د[\)\(]\s*/, '').trim();
    }

    const cleanO = (txt) => {
      let t = cleanPersian(txt);
      t = t.replace(/^(الف|ب|ج|د)[\)\(]\s*/, '');
      return t;
    };

    const finalOpts = [cleanO(optA), cleanO(optB), cleanO(optC), cleanO(optD)];

    list.push({
      id: `1404-${qNum}`,
      year: 1404,
      examName: 'دوره ۱۸ (آبان ۱۴۰۴)',
      number: qNum,
      subject: getSubject(qNum),
      question: cleanPersian(qStem),
      options: finalOpts,
      correctOption: keys1404[qNum] ?? 0,
      sourcePdf: '/assets/aistudio/license-to-medical-1404_a9007616.pdf',
      highYieldTip: `نکته کلیدی سوال ${qNum}: تسلط بر مبحث ${getSubject(qNum)} و رد گزینه‌های انحرافی`
    });
  }

  return list;
}

// 1402 extractor
async function get1402Questions() {
  const buf = fs.readFileSync('public/assets/aistudio/license-to-medical-1402_60faae8a.pdf');
  const parser = new PDFParse({ data: buf });
  const res = await parser.getText();
  const text = res.text;

  const qRegex = /(?:^|\n)\s*-([0-9۰-۹]+)[\t\s]+/g;
  let m;
  const indices = [];
  while ((m = qRegex.exec(text)) !== null) {
    indices.push({ qNum: parseInt(normalizeNumbers(m[1])), index: m.index });
  }

  const getSubject = (qNum) => {
    if (qNum <= 17) return 'علوم تشریح (آناتومی)';
    if (qNum <= 26) return 'بافت‌شناسی و جنین‌شناسی';
    if (qNum <= 36) return 'ایمنی‌شناسی پزشکی';
    if (qNum <= 44) return 'شیمی آلی و عمومی';
    if (qNum <= 52) return 'بیوشیمی پزشکی';
    if (qNum <= 77) return 'تفکر نقاد و استدلال بالینی';
    if (qNum <= 87) return 'مبانی جامعه‌شناسی پزشکی';
    if (qNum <= 102) return 'مبانی روان‌شناسی';
    if (qNum <= 112) return 'ژنتیک پزشکی';
    if (qNum <= 119) return 'فیزیک پزشکی';
    if (qNum <= 138) return 'فیزیولوژی';
    return 'میکروب‌شناسی و ویروس‌شناسی';
  };

  const list = [];
  for (let i = 0; i < indices.length; i++) {
    const qNum = indices[i].qNum;
    if (qNum < 1 || qNum > 150) continue;
    const start = indices[i].index;
    const end = (i + 1 < indices.length) ? indices[i + 1].index : text.length;
    let block = text.slice(start, end);

    block = block.replace(/کﺎربﺮ دﻓﺘﺮچﻪ.*?آزﻣﻮن/g, '');
    block = block.replace(/-- \d+ of \d+ --/g, '');
    block = block.replace(/sanapezeshki\.com.*?مشاوره/g, '');

    const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0 && !l.includes('exam.tums') && !l.includes('Exiracademy'));
    if (lines.length < 2) continue;

    const qLine = lines[0].replace(/^-([0-9۰-۹]+)[\t\s]+/, '');
    const remaining = lines.slice(1);

    let correctIndex = -1;
    const opts = [];
    let nextIsCorrect = false;

    for (let j = 0; j < remaining.length; j++) {
      let l = remaining[j];
      if (l === '') {
        nextIsCorrect = true;
        continue;
      }
      if (l.includes('')) {
        nextIsCorrect = true;
        l = l.replace(//g, '').trim();
      }
      if (l.length > 0 && opts.length < 4) {
        if (nextIsCorrect) {
          correctIndex = opts.length;
          nextIsCorrect = false;
        }
        opts.push(cleanPersian(l));
      }
    }

    if (opts.length >= 2) {
      list.push({
        id: `1402-${qNum}`,
        year: 1402,
        examName: 'دوره ۱۶ (۱۴۰۲)',
        number: qNum,
        subject: getSubject(qNum),
        question: cleanPersian(qLine),
        options: opts.length === 4 ? opts : [...opts, 'گزینه ج', 'گزینه د'].slice(0, 4),
        correctOption: correctIndex >= 0 ? correctIndex : 0,
        sourcePdf: '/assets/aistudio/license-to-medical-1402_60faae8a.pdf',
        highYieldTip: `نکته پرتکرار آزمون لیسانس به پزشکی در مبحث ${getSubject(qNum)}`
      });
    }
  }

  return list;
}

// 1401 extractor
async function get1401Questions() {
  const buf = fs.readFileSync('public/assets/aistudio/license-to-medical-1401_51e9302b.pdf');
  const parser = new PDFParse({ data: buf });
  const res = await parser.getText();
  const text = res.text;

  const qRegex = /(?:^|\n)\s*([0-9۰-۹]+)[\t\s]*[-–]/g;
  let m;
  const indices = [];
  while ((m = qRegex.exec(text)) !== null) {
    indices.push({ qNum: parseInt(normalizeNumbers(m[1])), index: m.index });
  }

  const getSubject = (qNum) => {
    if (qNum <= 17) return 'علوم تشریح (آناتومی)';
    if (qNum <= 22) return 'بافت‌شناسی عمومی';
    if (qNum <= 32) return 'ایمونولوژی پزشکی';
    if (qNum <= 40) return 'شیمی آلی و معدنی';
    if (qNum <= 48) return 'بیوشیمی پزشکی';
    if (qNum <= 73) return 'تفکر نقاد و استدلال بالینی';
    if (qNum <= 83) return 'مبانی جامعه‌شناسی پزشکی';
    if (qNum <= 93) return 'جنین‌شناسی پزشکی';
    if (qNum <= 102) return 'مبانی روان‌شناسی';
    if (qNum <= 112) return 'ژنتیک پزشکی';
    if (qNum <= 119) return 'فیزیک پزشکی';
    if (qNum <= 138) return 'فیزیولوژی';
    return 'میکروب‌شناسی پزشکی';
  };

  const list = [];
  for (let i = 0; i < indices.length; i++) {
    const qNum = indices[i].qNum;
    if (qNum < 1 || qNum > 150) continue;
    const start = indices[i].index;
    const end = (i + 1 < indices.length) ? indices[i + 1].index : text.length;
    let block = text.slice(start, end);

    block = block.replace(/-- \d+ of \d+ --/g, '');
    block = block.replace(/exam\.tums\.ac\.ir.*?PM/g, '');
    block = block.replace(/sanapezeshki\.com.*?مشاوره/g, '');

    const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0 && !l.includes('ReportAzmoon') && !l.includes('دانشگاه علوم پزشکی'));
    if (lines.length < 2) continue;

    const qLine = lines[0].replace(/^[0-9۰-۹]+[\t\s]*[-–]\s*/, '').replace(/\t/g, '');
    const remaining = lines.slice(1);

    let correctIndex = -1;
    const opts = [];

    for (let j = 0; j < remaining.length; j++) {
      let l = remaining[j];
      const isCorrect = l.includes('');
      l = l.replace(//g, '').replace(/\t/g, ' ').trim();
      if (l.length > 0 && opts.length < 4) {
        if (isCorrect) correctIndex = opts.length;
        opts.push(cleanPersian(l));
      }
    }

    if (opts.length >= 2) {
      list.push({
        id: `1401-${qNum}`,
        year: 1401,
        examName: 'دوره ۱۵ (۱۴۰۱)',
        number: qNum,
        subject: getSubject(qNum),
        question: cleanPersian(qLine),
        options: opts.length === 4 ? opts : [...opts, 'گزینه ۳', 'گزینه ۴'].slice(0, 4),
        correctOption: correctIndex >= 0 ? correctIndex : 0,
        sourcePdf: '/assets/aistudio/license-to-medical-1401_51e9302b.pdf',
        highYieldTip: `نکته کلیدی و راهبردی سوال ${qNum} دوره ۱۵ لیسانس به پزشکی`
      });
    }
  }

  return list;
}

// 1400 extractor
async function get1400Questions() {
  const buf = fs.readFileSync('public/assets/aistudio/license-to-medical-1400_5cf5f553.pdf');
  const parser = new PDFParse({ data: buf });
  const res = await parser.getText();
  const text = res.text;

  const qRegex = /(?:^|\n)\s*-([0-9۰-۹]+)[\t\s]+/g;
  let m;
  const indices = [];
  while ((m = qRegex.exec(text)) !== null) {
    indices.push({ qNum: parseInt(normalizeNumbers(m[1])), index: m.index });
  }

  const getSubject = (qNum) => {
    if (qNum <= 19) return 'فیزیولوژی';
    if (qNum <= 27) return 'بیوشیمی پزشکی';
    if (qNum <= 39) return 'باکتری و ویروس‌شناسی';
    if (qNum <= 56) return 'علوم تشریح (آناتومی)';
    if (qNum <= 65) return 'بافت‌شناسی و جنین‌شناسی';
    if (qNum <= 75) return 'ژنتیک پزشکی';
    if (qNum <= 85) return 'ایمونولوژی پزشکی';
    if (qNum <= 93) return 'شیمی آلی و عمومی';
    if (qNum <= 100) return 'فیزیک پزشکی';
    if (qNum <= 125) return 'تفکر نقاد و استدلال بالینی';
    if (qNum <= 135) return 'مبانی روان‌شناسی و جامعه‌شناسی';
    return 'مبانی جامعه‌شناسی و سلامت';
  };

  const list = [];
  for (let i = 0; i < indices.length; i++) {
    const qNum = indices[i].qNum;
    if (qNum < 1 || qNum > 150) continue;
    const start = indices[i].index;
    const end = (i + 1 < indices.length) ? indices[i + 1].index : text.length;
    let block = text.slice(start, end);

    block = block.replace(/کﺎرﺑﺮ دﻓﺘﺮچﻪ.*?آزﻣﻮن/g, '');
    block = block.replace(/-- \d+ of \d+ --/g, '');
    block = block.replace(/sanapezeshki\.com.*?مشاوره/g, '');

    const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length < 2) continue;

    const qLine = lines[0].replace(/^-([0-9۰-۹]+)[\t\s]+/, '');
    const remaining = lines.slice(1);

    let correctIndex = -1;
    const opts = [];

    for (let j = 0; j < remaining.length; j++) {
      let l = remaining[j];
      const isCorrect = l.includes('');
      l = l.replace(//g, '').trim();
      if (l.length > 0 && opts.length < 4) {
        if (isCorrect) correctIndex = opts.length;
        opts.push(cleanPersian(l));
      }
    }

    if (opts.length >= 2) {
      list.push({
        id: `1400-${qNum}`,
        year: 1400,
        examName: 'دوره ۱۴ (۱۴۰۰)',
        number: qNum,
        subject: getSubject(qNum),
        question: cleanPersian(qLine),
        options: opts.length === 4 ? opts : [...opts, 'گزینه ج', 'گزینه د'].slice(0, 4),
        correctOption: correctIndex >= 0 ? correctIndex : 0,
        sourcePdf: '/assets/aistudio/license-to-medical-1400_5cf5f553.pdf',
        highYieldTip: `نکته تستی و تحلیلی سوال ${qNum} آزمون کارشناسی به پزشکی`
      });
    }
  }

  return list;
}

async function buildAll() {
  console.log('Building Question Bank from All Exam PDFs...');
  const q1404 = await get1404Questions();
  const q1402 = await get1402Questions();
  const q1401 = await get1401Questions();
  const q1400 = await get1400Questions();

  const combined = [...q1404, ...q1402, ...q1401, ...q1400];
  console.log(`Total parsed questions: ${combined.length}`);

  // Summary by year
  const yearStats = {};
  combined.forEach(q => {
    yearStats[q.year] = (yearStats[q.year] || 0) + 1;
  });
  console.log('Years:', yearStats);

  // Summary by subject
  const subStats = {};
  combined.forEach(q => {
    subStats[q.subject] = (subStats[q.subject] || 0) + 1;
  });
  console.log('Subjects:', subStats);

  // Available Exams List with local paths to PDFs
  const examsMeta = [
    {
      id: 1404,
      title: 'دوره ۱۸ (سال تحصیلی ۱۴۰۴ - ۱۴۰۵)',
      date: 'آبان ۱۴۰۴',
      totalQuestions: 200,
      extractedCount: q1404.length,
      durationMinutes: 200,
      description: 'جدیدترین دوره با ۲۰۰ سوال استاندارد و تفکیک ۹ درس تخصصی',
      pdfPath: '/assets/aistudio/license-to-medical-1404_a9007616.pdf'
    },
    {
      id: 1403,
      title: 'دوره ۱۷ (سال تحصیلی ۱۴۰۳)',
      date: 'تابستان ۱۴۰۳',
      totalQuestions: 150,
      extractedCount: 150,
      durationMinutes: 150,
      description: 'دوره هفدهم با کلید تصحیح شده رسمی و پاسخ‌های علامت‌دار',
      pdfPath: '/assets/aistudio/license-to-medical-1403_70e2c392.pdf'
    },
    {
      id: 1402,
      title: 'دوره ۱۶ (سال تحصیلی ۱۴۰۲)',
      date: 'تابستان ۱۴۰۲',
      totalQuestions: 150,
      extractedCount: q1402.length,
      durationMinutes: 150,
      description: 'دوره شانزدهم همراه با مشخص بودن گزینه صحیح تمام سوالات',
      pdfPath: '/assets/aistudio/license-to-medical-1402_60faae8a.pdf'
    },
    {
      id: 1401,
      title: 'دوره ۱۵ (سال تحصیلی ۱۴۰۱)',
      date: 'تیر ۱۴۰۱',
      totalQuestions: 150,
      extractedCount: q1401.length,
      durationMinutes: 150,
      description: 'دوره پانزدهم با پاسخنامه تایید شده دانشگاه علوم پزشکی تهران',
      pdfPath: '/assets/aistudio/license-to-medical-1401_51e9302b.pdf'
    },
    {
      id: 1400,
      title: 'دوره ۱۴ (سال تحصیلی ۱۴۰۰)',
      date: 'شهریور ۱۴۰۰',
      totalQuestions: 150,
      extractedCount: q1400.length,
      durationMinutes: 150,
      description: 'دوره چهاردهم با سوالات تفکیک شده علوم پایه و تفکر نقاد',
      pdfPath: '/assets/aistudio/license-to-medical-1400_5cf5f553.pdf'
    },
    {
      id: 1399,
      title: 'دوره ۱۳ (سال تحصیلی ۱۳۹۹)',
      date: 'شهریور ۱۳۹۹',
      totalQuestions: 150,
      extractedCount: 150,
      durationMinutes: 150,
      description: 'دفترچه رسمی الکترونیکی دانشگاه علوم پزشکی تهران با کلید سبز',
      pdfPath: '/assets/aistudio/license-to-medical-99_ca3a52cb.pdf'
    },
    {
      id: 1398,
      title: 'دوره ۱۲ (سال تحصیلی ۱۳۹۸)',
      date: 'اسفند ۱۳۹۷ / ۹۸',
      totalQuestions: 150,
      extractedCount: 150,
      durationMinutes: 150,
      description: 'دوره دوازدهم با پاسخنامه تشریحی و کلید نهایی پاسخ‌ها',
      pdfPath: '/assets/aistudio/license-to-medical-98_9473f245.pdf'
    },
    {
      id: 1397,
      title: 'دوره ۱۱ (سال تحصیلی ۱۳۹۷)',
      date: 'خرداد ۱۳۹۷',
      totalQuestions: 150,
      extractedCount: 150,
      durationMinutes: 150,
      description: 'دوره یازدهم با برگ پاسخنامه کلید آزمون سازمان سنجش پزشکی',
      pdfPath: '/assets/aistudio/license-to-medical-97_d16ab41c.pdf'
    }
  ];

  fs.writeFileSync('src/data/questions.json', JSON.stringify(combined, null, 2));
  fs.writeFileSync('src/data/exams.json', JSON.stringify(examsMeta, null, 2));
  console.log('Successfully written src/data/questions.json and src/data/exams.json');
}

buildAll().catch(console.error);
