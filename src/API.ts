import { ShuffleArray } from './Utilies';

export type TypeOfQuestion = {
  category : string;
  correct_answer: string;
  difficulty: string;
  incorrect_answers: string[];
  question: string;
  type: string;
}

export type QuestionState = TypeOfQuestion & {answers: string[] };


export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export const fetchQuizQuestions = async (amount: number, difficulty: Difficulty) => {
  const endPointUrl = `https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}&type=multiple`;
  const data = await ( await fetch(endPointUrl)).json();
  return data.results.map( (question: TypeOfQuestion) => (
    {
      ...question,
      answers: ShuffleArray([...question.incorrect_answers, question.correct_answer])
    }
  ))
};
