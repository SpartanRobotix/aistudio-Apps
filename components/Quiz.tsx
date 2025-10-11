import React, { useState, useCallback } from 'react';
import { Group, QuizQuestion } from '../types';
import { generateQuiz } from '../services/geminiService';
import { Icon } from './common/Icon';
import Spinner from './common/Spinner';

const Quiz: React.FC<{ group: Group }> = ({ group }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizState, setQuizState] = useState<'idle' | 'loading' | 'active' | 'finished'>('idle');
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startQuiz = useCallback(async () => {
    setQuizState('loading');
    setError(null);
    try {
      const newQuestions = await generateQuiz(group);
      if (newQuestions.length === 0) throw new Error("No questions returned.");
      setQuestions(newQuestions);
      setCurrentQuestionIndex(0);
      setScore(0);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setQuizState('active');
    } catch (err) {
      setError('Failed to generate the quiz. Please try again later.');
      setQuizState('idle');
      console.error(err);
    }
  }, [group]);

  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer) return; // Prevent changing answer

    setSelectedAnswer(answer);
    const correct = answer === questions[currentQuestionIndex].correctAnswer;
    setIsCorrect(correct);
    if (correct) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setQuizState('finished');
      }
    }, 1500); // Wait 1.5 seconds before moving to next question or finishing
  };

  const renderContent = () => {
    switch (quizState) {
      case 'loading':
        return (
          <div className="text-center">
            <Spinner large={true} />
            <p className="mt-4 text-white/80 animate-pulse">Generating your fan quiz...</p>
          </div>
        );
      case 'active':
        const currentQuestion = questions[currentQuestionIndex];
        return (
          <div>
            <p className="text-center text-white/80 mb-2">Question {currentQuestionIndex + 1} of {questions.length}</p>
            <h3 className="text-xl md:text-2xl font-bold text-center mb-6">{currentQuestion.question}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === option;
                const buttonClass = isSelected
                  ? (isCorrect ? 'bg-green-500 border-green-400' : 'bg-red-500 border-red-400')
                  : 'bg-white/10 border-white/20 hover:bg-white/20';

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={!!selectedAnswer}
                    className={`p-4 rounded-lg text-left font-semibold border-2 transition-all duration-300 ${buttonClass}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        );
      case 'finished':
        return (
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-4">Quiz Complete!</h3>
            <p className="text-xl text-white/90">You scored <strong className="text-[var(--accent-color)]">{score}</strong> out of <strong className="text-[var(--accent-color)]">{questions.length}</strong></p>
            <button
              onClick={startQuiz}
              className="mt-8 flex items-center justify-center gap-2 mx-auto bg-[var(--accent-color)] text-[var(--primary-color)] font-bold py-3 px-6 rounded-full hover:opacity-90 transition-opacity"
            >
              Play Again
            </button>
          </div>
        );
      case 'idle':
      default:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Are you {group.name}'s Biggest Fan?</h2>
            <p className="text-white/80 mb-6">Test your knowledge with an AI-generated quiz!</p>
            {error && <p className="text-red-400 mb-4">{error}</p>}
            <button
              onClick={startQuiz}
              className="flex items-center justify-center gap-2 mx-auto bg-[var(--accent-color)] text-[var(--primary-color)] font-bold py-3 px-6 rounded-full hover:opacity-90 transition-opacity"
            >
              <Icon icon="quiz" className="w-5 h-5" />
              Start Quiz
            </button>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      {renderContent()}
    </div>
  );
};

export default Quiz;
