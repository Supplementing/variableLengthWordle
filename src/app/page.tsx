"use client";
import WordleGame from "./components/wordleGame";
import Leaderboard from "./components/leaderboard";
import React, { useState, useEffect } from "react";
import { Chip } from "@mui/material";

export default function Home() {
  const [score, setScore] = useState(0);
  useEffect(() => {
    const currentScore = localStorage.getItem("score");
    if (currentScore) {
      setScore(parseInt(currentScore));
    }
  }, []);
  return (
    <div className="flex flex-col">
      {/* <Leaderboard /> */}

      <div className="flex justify-center items-center h-screen">
        <WordleGame setScore={setScore} />
      </div>

      <Chip
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          color: "grey",
          margin: "10px",
        }}
        color="success"
        label={`Lifetime Solves: ${score}`}
      />
    </div>
  );
}
