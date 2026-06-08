export interface Token {
  id: number;
  original: string;
  cleaned: string;
  stemmed: string; // Basic lemmatization/stemmed approximation
  isStopword: boolean;
}

export interface WordFrequency {
  word: string;
  count: number;
  percentage: number;
}

export interface ConcordanceLine {
  id: number;
  wordIndex: number;
  leftContext: string;
  keyword: string;
  rightContext: string;
}

export interface PreloadedPoem {
  id: string;
  title: string;
  author: string;
  year: string;
  text: string;
  genre: string;
  background: string;
}

export interface TestCase {
  id: number;
  name: string;
  type: 'normal' | 'edge' | 'failure';
  inputDesc: string;
  inputText: string;
  expectedBehavior: string;
  actualBehavior?: string;
  status?: 'pass' | 'fail';
  debuggingNotes?: string;
}

export interface AiPromptLog {
  id: number;
  phase: string;
  prompt: string;
  responsePreview: string;
  modificationMade: string;
}

export interface NGram {
  phrase: string;
  count: number;
  percentage: number;
}

export interface ReadabilityMetrics {
  fleschReadingEase: number;
  fleschKincaidGrade: number;
  gunningFog: number;
  totalSentences: number;
  avgSentenceLength: number;
  syllablesPerWord: number;
  complexWordsPercentage: number;
}

export interface POSBreakdown {
  noun: number;
  verb: number;
  adjective: number;
  adverb: number;
  grammaticalStopword: number;
  other: number;
}
