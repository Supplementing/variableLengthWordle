"use client";
import React, { useState, useEffect } from "react";

import Confetti from "react-confetti";
import { FormControlLabel, Switch, Button } from "@mui/material";
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
  const [definition, setDefinition] = useState<string>("");
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(
    null
  );
  const resetGame = () => {
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
        // console.log(data);
        setSolution(data.word.toLowerCase());
        setDefinition(data.definition);
        setMaxHints(Math.floor(data.word.length / 3));
      });
  };
  //   initial mount, fetch a random word from the API
  useEffect(() => {
    getRandomWord();
  }, []);
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (
        /^[a-z]|[A-Z]$/.test(e.key) != true &&
        e.key !== "Enter" &&
        e.key !== "Backspace"
      ) {
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
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    }
  }, [timeRemaining]);
  //   return the UI
  if (gameOver) {
    return (
      <div>
        {confetti && <Confetti />}
        <GameOverCard
          solution={solution}
          definition={definition}
          resetGame={resetGame}
        />
      </div>
    );
  }
  return (
    <div
      style={{
        color: "white",
        display: "flex",
        flexDirection: "column",

        justifyContent: "center",

        backgroundColor: "rgb(40, 40, 40)",
        borderRadius: "10px",
        padding: "20px",
        margin: "10px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h1 style={{ fontSize: "25px" }}>Glyphmare</h1>
        <FormControlLabel
          label="Extreme Mode"
          control={
            <Switch
              checked={extremeMode}
              onChange={toggleExtremeMode}
              color="primary"
            />
          }
        />
      </div>
      {extremeMode && (
        <>
          <div
            style={{
              color: "white",
              fontSize: "20px",
              background: "rgba(255, 0, 0, 0.4)",

              padding: "10px",
              borderRadius: "10px",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "10px",
              marginBottom: "10px",
            }}
          >
            <div style={{ fontSize: "18px", fontStyle: "italic" }}>
              Timer starts on first character. Game ends when timer runs out.
              Good luck!
            </div>
            <div>Time Remaining: {timeRemaining}</div>
          </div>
        </>
      )}
      <div style={{ alignSelf: "center" }}>
        {guesses.map((line, idx) => {
          return (
            <>
              <Line
                key={idx}
                word={idx === currentLine ? currentGuess : line}
                complete={currentLine > idx}
                solution={solution}
              />
            </>
          );
        })}
        <div
          style={{
            marginTop: "10px",
            justifyContent: "space-between",
          }}
        >
          <Button variant="contained" onClick={resetGame}>
            Reset
          </Button>

          <button
            style={{ float: "right" }}
            onClick={addHint}
            disabled={hintTries >= maxHints}
          >
            Hint ({maxHints - hintTries} remaining)
          </button>
        </div>
      </div>
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
        key={i}
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
const GameOverCard = ({
  solution,
  definition,
  resetGame,
}: {
  solution: string;
  definition: string;
  resetGame: () => void;
}) => {
  return (
    <div
      style={{
        background: "rgba(40, 40, 40)",
        padding: "20px",
        borderRadius: "10px",
        width: "300px",
      }}
    >
      <h1 style={{ fontSize: "25px", textAlign: "center" }}>Game over!</h1>
      <h2 style={{ fontSize: "20px" }}>The word was: </h2>
      <h1
        style={{
          fontSize: "20px",
          textAlign: "center",
          color: "gold",
          fontWeight: "bold",
        }}
      >
        {solution.toUpperCase()}
      </h1>
      <h2 style={{ fontSize: "20px" }}>Definition:</h2>
      <p style={{ fontSize: "18px" }}>{definition}</p>
      <Button
        style={{ marginTop: "10px", width: "100%" }}
        variant="contained"
        onClick={resetGame}
      >
        Play Again
      </Button>
    </div>
  );
};
export default Wordle;
