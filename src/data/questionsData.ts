import { Question } from "./types";
import questionsList from "./questionsData.json";
import authoredList from "./authoredQuestions.json";

// بانک اصلی (دوره‌های ۱۴۰۰ تا ۱۴۰۴) + بانک تألیفی ۱۴۰۵ (۱۲۰ سؤال فایل ورد + سؤالات مکمل)
export const questionsData: Question[] = [
  ...(questionsList as Question[]),
  ...(authoredList as Question[]),
];
