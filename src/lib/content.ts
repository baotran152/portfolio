// Single source of truth for content that more than one surface needs. The landing
// page, the chat helper drawer and the system prompt all read from here, so a change
// lands everywhere at once instead of drifting between copies.

export const QUESTIONS = {
  Me: 'Who are you? I want to know more about you.',
  Projects: 'What are your projects? What are you working on right now?',
  Skills: 'What are your skills? Give me a list of your soft and hard skills.',
  Background: 'What is your education and working experience background?',
  Contact: 'How can I reach you?',
} as const;

export type QuestionKey = keyof typeof QUESTIONS;

// Colour and icon stay at the call site: the icon is JSX, which does not belong in
// a data module shared with the server-side prompt.
export const QUESTION_ORDER: QuestionKey[] = [
  'Me',
  'Projects',
  'Skills',
  'Background',
  'Contact',
];

export const QUESTION_COLORS: Record<QuestionKey, string> = {
  Me: '#329696',
  Projects: '#3E9858',
  Skills: '#856ED9',
  Background: '#B95F9D',
  Contact: '#C19433',
};
