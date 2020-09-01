import React, { useState} from 'react';
import QuestionCard from './components/QuestionCard';
import { fetchQuizQuestions } from './API';
import { QuestionState, Difficulty } from './API';

//style
import { GlobalStyle, Wrapper } from './App.styles';

export type AnswerObject = {
  question: string;
  correct: boolean;
  answer: string;
  correctAnswer: string;
}

//total_questions
const TOTAL_QUESTIONS = 10;

const App = () => {

  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);

  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);

    const newQuestions = await fetchQuizQuestions(
      TOTAL_QUESTIONS,
      Difficulty.HARD
    );

    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false)

  };

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if(!gameOver) {
      // get user answer
      const answer = e.currentTarget.value;
      //check answer against correct answer
      const correct = questions[number].correct_answer === answer;
      if(correct) {
        setScore(prevScore => prevScore + 1);
      };

      const AnswerObject = {
        question: questions[number].question,
        correct,
        answer,
        correctAnswer: questions[number].correct_answer
      }
      setUserAnswers(prev => [...prev, AnswerObject]);
      console.log(correct);
    }
  }

  const nextQuestion = () => {

    const nextQuestion = number + 1;

    if(nextQuestion === TOTAL_QUESTIONS) {
      setGameOver(true)
    } else {
      setNumber(nextQuestion)
    }

  }

  return (

    <>
      <GlobalStyle />
      <Wrapper>
        <h1>REACT QUIZ</h1>

        {gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
        <button className="start" onClick={startTrivia}>start</button>
        ) : null }

        {!gameOver ? <p className="score">Score: {score}</p> : null}

        {loading && <p>Loading Question....</p>}

        {!loading && !gameOver && (
          <QuestionCard
            questionNr={number + 1}
            totalQuestions={TOTAL_QUESTIONS}
            question={questions[number].question}
            answers={questions[number].answers}
            userAnswer={userAnswers ? userAnswers[number] : undefined}
            callback={checkAnswer}
          />
        )}

        {
          !gameOver &&
          !loading &&
          userAnswers.length === number + 1 &&
          number !== TOTAL_QUESTIONS - 1 ? (
            <button className="next" onClick={nextQuestion}>Next Question</button>
          ) : null
        }
      </Wrapper>
    </>
  );
}

export default App;
