"use client";
import React, { useState, useEffect } from "react";

import Confetti from "react-confetti";
const Wordle = () => {
  const [guesses, setGuesses] = useState<string[]>(Array(5).fill(""));
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [currentLine, setCurrentLine] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [solution, setSolution] = useState<string>("");
  const [confetti, setConfetti] = useState(false);
  const [hintTries, setHintTries] = useState(0);
  const [maxHints, setMaxHints] = useState(3);

  const resetGame = () => {
    console.log("resetting game");
    setGuesses(Array(5).fill(""));
    setCurrentGuess("");
    setGameOver(false);
    setCurrentLine(0);
    setConfetti(false);
    setHintTries(0);
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

  //   initial mount, fetch a random word from the API
  useEffect(() => {
    fetch("https://random-words-api-one-pearl.vercel.app/word/")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setSolution(data.word.toLowerCase());
        setGuesses(Array(data.word.length).fill(""));
        setMaxHints(Math.floor(data.word.length / 3));
      });
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

          setTimeout(() => {
            alert("Winner winner");
            setConfetti(true);
          }, 100);
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
  return (
    <div style={{ color: "white" }}>
      {confetti && <Confetti />}
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
      <button onClick={addHint}>Hint {maxHints - hintTries} remaining</button>
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
