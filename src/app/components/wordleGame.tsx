"use client";
import React, { useState, useEffect } from "react";

import Confetti from "react-confetti";
import { FormControlLabel, Switch } from "@mui/material";
const Wordle = () => {
  const [guesses, setGuesses] = useState<string[]>(Array(5).fill(""));
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [currentLine, setCurrentLine] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [solution, setSolution] = useState<string>("");
  const [confetti, setConfetti] = useState(false);
  const [hintTries, setHintTries] = useState(0);
  const [maxHints, setMaxHints] = useState(3);
  const [extremeMode, setExtremeMode] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(120);
  const [timerStarted, setTimerStarted] = useState(false);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(
    null
  );
  const resetGame = () => {
    console.log("resetting game");
    setGuesses(Array(5).fill(""));
    setCurrentGuess("");
    setGameOver(false);
    setCurrentLine(0);
    setConfetti(false);
    setHintTries(0);
    setTimeRemaining(120);
    setTimerStarted(false);
    setExtremeMode(false);
    getRandomWord();
  };
  const toggleExtremeMode = () => {
    setExtremeMode(!extremeMode);
    // need to set the timer to 5 seconds * the length of the word so you have 5 seconds per guess
  };
  const addHint = () => {
    console.log("adding hint");
    if (hintTries >= maxHints) {
      alert("No more hints for you!");
      return;
    }
    // need to add a hint to the current guess at a random index
    const currentGuessIndex = currentGuess.length;
    const hint = solution[currentGuessIndex];

    setCurrentGuess((prev) => {
      const currentGuessArray = prev.split("");
      currentGuessArray.push(hint);
      return currentGuessArray.join("");
    });
    setHintTries((prev) => prev + 1);
  };
  const getRandomWord = () => {
    fetch("https://random-words-api-one-pearl.vercel.app/word/")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setSolution(data.word.toLowerCase());
      });
  };
  //   initial mount, fetch a random word from the API
  useEffect(() => {
    getRandomWord();
  }, []);
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (/[a-z]/.test(e.key) != true) {
        return;
      }
      if (gameOver) {
        return;
      }
      if (e.key === "Backspace") {
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (e.key == "Enter" && currentGuess.length == solution.length) {
        setGuesses((prev) =>
          prev.map((i, idx) => (idx == currentLine ? currentGuess : i))
        );
        setCurrentGuess("");
        setCurrentLine((prev) => prev + 1);
        if (currentGuess == solution) {
          setGameOver(true);

          setConfetti(true);
        }
      } else if (currentGuess.length == solution.length || e.key == "Enter") {
        console.log("going to return, the current ", currentGuess, solution);
        return;
      } else {
        setCurrentGuess((prev) => `${prev}${e.key}`);
      }
    }
    window.addEventListener("keydown", handleKey);

    return () => window.removeEventListener("keydown", handleKey);
  }, [currentGuess, guesses, currentLine, solution]);

  useEffect(() => {
    if (
      guesses.length == solution.length &&
      guesses.every((guess) => guess.length == solution.length)
    ) {
      setGameOver(true);
    }
  }, [guesses]);
  useEffect(() => {
    if (extremeMode) {
      setTimeRemaining(5 * solution.length);
    }
  }, [extremeMode]);
  //   once the first character is entered, start the timer
  useEffect(() => {
    if (currentGuess.length > 0 && !timerStarted) {
      setTimerStarted(true);
    }
  }, [currentGuess]);

  useEffect(() => {
    if (timerStarted) {
      const interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
      setTimerInterval(interval);
      return () => clearInterval(interval);
    }
  }, [timerStarted]);

  //   finally, watch the time remaining and end the game if it runs out
  useEffect(() => {
    if (timeRemaining <= 0) {
      setGameOver(true);
      clearInterval(timerInterval);
    }
  }, [timeRemaining]);
  //   return the UI
  return (
    <div
      style={{
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      {confetti && <Confetti />}

      {extremeMode && (
        <div
          style={{
            color: "white",
            fontSize: "20px",
            background: "rgba(255, 0, 0, 0.4)",
            maxWidth: "800px",
            padding: "10px",
            borderRadius: "10px",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            marginBottom: "10px",
          }}
        >
          <div>Youve turned on extreme mode, you will now have a timer.</div>
          <div style={{ fontSize: "18px", fontStyle: "italic" }}>
            The timer will start when you enter the first character and the game
            will end when the timer runs out. Good luck!
          </div>
          😈
          <div>Time Remaining: {timeRemaining}</div>
        </div>
      )}
      {guesses.map((line, idx) => {
        return (
          <>
            <Line
              word={idx === currentLine ? currentGuess : line}
              complete={currentLine > idx}
              solution={solution}
            />
          </>
        );
      })}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between !important",
        }}
      >
        {" "}
        <FormControlLabel
          style={{}}
          control={
            <Switch checked={extremeMode} onChange={toggleExtremeMode} />
          }
          label="Extreme Mode"
        />
        <button
          style={{ float: "right" }}
          onClick={addHint}
          disabled={hintTries >= maxHints}
        >
          Hint ({maxHints - hintTries} remaining)
        </button>
      </div>

      {gameOver && (
        <div
          style={{
            position: "relative",
            bottom: "0",
            width: "100%",
            backgroundColor: "lightsalmon",
            textAlign: "center",
            fontSize: "30px",
            color: "white",
            margin: "10px",
            borderRadius: "10px",
          }}
        >
          <h3>Game over</h3>
          <h2>The word was {solution}</h2>
          <button
            onClick={resetGame}
            style={{
              backgroundColor: "white",
              borderRadius: "20px",
              width: "400px",
              height: "50px",
              marginBottom: "10px",
              fontSize: "20px",
              color: "black",
            }}
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
};
const Line = ({
  word,
  complete,
  solution,
}: {
  word: string;
  complete: boolean;
  solution: string;
}) => {
  const tiles: any = [];
  for (let i = 0; i < solution.length; i++) {
    tiles.push(
      <div
        style={{
          border: "1px solid black",
          margin: "5px",
          width: "80px",
          height: "80px",
          fontSize: "20px",
          color: "white",
          textTransform: "uppercase",
          fontWeight: "bold",
          borderRadius: "5px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor:
            (complete &&
              (word[i] == solution[i]
                ? "seagreen"
                : solution.includes(word[i])
                ? "gold"
                : "grey")) ||
            "lightslategray",
        }}
      >
        {word[i] || ""}
      </div>
    );
  }
  return <div style={{ display: "flex" }}>{tiles}</div>;
};
export default Wordle;
