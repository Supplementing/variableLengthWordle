"use client";

import { useState } from "react";
import { Medal } from "lucide-react";

const Leaderboard = () => {
  const rows = [
    { name: "John Doe", score: 100 },
    { name: "Jane Doe", score: 90 },
    { name: "John Smith", score: 80 },
  ];
  return (
    <div>
      <div
        style={{
          width: "300px",
          background: "rgb(40,40,40, .5",
          color: "white",
          borderRadius: "10px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: "25px",
            fontWeight: "bold",
            backgroundColor: "rgb(40,40,40, .5)",
          }}
        >
          Top Players
        </h2>

        {rows.map((row, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",

              borderBottom: "1px solid grey",
              padding: "10px",
            }}
          >
            <Medal
              color={index === 0 ? "gold" : index === 1 ? "silver" : "#6e4d25"}
            />
            <div style={{ marginLeft: "20px" }}>
              <h1 style={{ fontSize: "20px", fontWeight: "bold" }}>
                {row.name}
              </h1>
              <p>{row.score} solves</p>
            </div>
          </div>
        ))}
      </div>
      <div>
        <p style={{ color: "grey", marginLeft: "5px" }}>Your Rank: 556th</p>
      </div>
    </div>
  );
};

export default Leaderboard;
