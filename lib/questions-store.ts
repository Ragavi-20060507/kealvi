export type Question = {
  id: string;
  body: string;
  author: string | null;
  votes: number;
};

export const questions: Question[] = [
  {
    id: "1",
    body: "What is Next.js?",
    author: "system",
    votes: 0,
  },
];