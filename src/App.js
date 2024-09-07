import React, { useState, useEffect } from 'react';
import { Box, Flex, Text, Button, VStack, IconButton, Progress } from '@chakra-ui/react';
import { ArrowForwardIcon, RepeatIcon } from '@chakra-ui/icons';
import Confetti from 'react-confetti';
import correctSound from './correct.mp3';
import incorrectSound from './incorrect.mp3';
import questions from './questions.json'; 

function App() {
  const [seconds, setSeconds] = useState(10);  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); 
  const [selectedAnswer, setSelectedAnswer] = useState(null);  
  const [feedback, setFeedback] = useState("");  
  const [score, setScore] = useState(0);  
  const [emoji, setEmoji] = useState("😊");  
  const [quizEnded, setQuizEnded] = useState(false);  

  const correctAudio = new Audio(correctSound);
  const incorrectAudio = new Audio(incorrectSound);

  const currentQuestion = questions[currentQuestionIndex];  

  useEffect(() => {
    if (seconds > 0 && !quizEnded) {
      const timerId = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timerId);  
    } else if (seconds === 0 && !quizEnded) {
      handleNextQuestion();  
    }
  }, [seconds, quizEnded]);

  const handleAnswerClick = (answer) => {
    if (quizEnded) return;

    setSelectedAnswer(answer);

    if (answer === currentQuestion.answer) {
      setFeedback("Correct!");
      setScore(score + 1);
      setEmoji("🎉");
      correctAudio.play();
    } else {
      setFeedback("Incorrect!");
      setEmoji("😢");
      incorrectAudio.play();
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null); 
    setFeedback(""); 
    setSeconds(10); 

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizEnded(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSeconds(10);
    setEmoji("😊");
    setFeedback("");
    setQuizEnded(false);
  };

  const getFinalFeedback = () => {
    if (score === questions.length) {
      return "Amazing! You got all the questions right!";
    } else if (score > questions.length / 2) {
      return "Good job! You did well.";
    } else {
      return "Don't worry, better luck next time!";
    }
  };

  return (
    <Flex direction="column" height="100vh" bg="#E6DFD5" align="center">
      {!quizEnded && (
        <Box
          as="header"
          width="100%" 
          bg="#342A22" 
          color="white" 
          padding="4"
          textAlign="center"
          fontSize="xl"
          fontWeight="bold"
          position="sticky"
          top="0"
          zIndex="1000"
        >
          ⏳ Timer: {seconds} seconds
        </Box>
      )}

      <Box
        fontSize="3xl"
        mb="4"
        mt="12"
        textAlign="center"
        color="#342A22"
      >
        {emoji} Score: {score}
      </Box>

      {!quizEnded && (
        <Box width="80%" mb="12">
          <Progress
            value={(currentQuestionIndex / questions.length) * 100}
            colorScheme="teal"
            size="lg"
            borderRadius="full"
            hasStripe
            isAnimated
          />
        </Box>
      )}

      {!quizEnded ? (
        <Box
          width={["80%", "60%", "40%"]}
          padding="10"
          bg="white"
          borderRadius="lg"
          boxShadow="2xl"
          textAlign="center"
          position="relative"
        >
          <Text fontSize="2xl" fontWeight="bold" mb="8">
            {currentQuestion.question}
          </Text>

          <Flex justify="center" gap="4" mb="4">
            <Button
              backgroundColor={
                selectedAnswer
                  ? selectedAnswer === "Myth" && currentQuestion.answer === "Myth"
                    ? "green"
                    : selectedAnswer === "Myth"
                    ? "red"
                    : "#342A22"
                  : "#342A22"
              }
              color="white" 
              borderRadius="full"
              size="lg"
              width="40%"
              onClick={() => handleAnswerClick("Myth")}
              isDisabled={selectedAnswer !== null}
            >
              Myth
            </Button>
            <Button
              backgroundColor={
                selectedAnswer
                  ? selectedAnswer === "Fact" && currentQuestion.answer === "Fact"
                    ? "green"
                    : selectedAnswer === "Fact"
                    ? "red"
                    : "#342A22"
                  : "#342A22"
              }
              color="white"  
              borderRadius="full"
              size="lg"
              width="40%"
              onClick={() => handleAnswerClick("Fact")}
              isDisabled={selectedAnswer !== null}
            >
              Fact
            </Button>
          </Flex>

          {selectedAnswer && (
            <VStack spacing="4" mt="6">
              <Text fontSize="xl" fontWeight="bold" color={feedback === "Correct!" ? "green.500" : "red.500"}>
                {feedback}
              </Text>
              <Text fontSize="md" color="gray.600">
                {currentQuestion.explanation}
              </Text>
            </VStack>
          )}

          <IconButton
            aria-label="Next question"
            icon={<ArrowForwardIcon />}
            size="lg"
            backgroundColor="#342A22"  
            color="white"
            borderRadius="full"
            position="absolute"
            bottom="4"
            right="4"
            onClick={handleNextQuestion}
            isDisabled={selectedAnswer === null}
          />
        </Box>
      ) : (
        <Box
          width={["80%", "60%", "40%"]}
          padding="10"
          bg="white"
          borderRadius="lg"
          boxShadow="2xl"
          textAlign="center"
          position="relative"
        >
          <Text fontSize="2xl" fontWeight="bold" mb="8">
            {getFinalFeedback()}
          </Text>
          <Button
            backgroundColor="#342A22"  
            color="white"  
            size="lg"
            onClick={handleRestartQuiz}
            leftIcon={<RepeatIcon />}
          >
            Play Again
          </Button>
        </Box>
      )}

      {quizEnded && <Confetti />} {/* Show confetti when quiz ends */}
    </Flex>
  );
}

export default App;
