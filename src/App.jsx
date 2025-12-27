import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import "./App.css";

const HUMAN = "X";
const AI = "O";

export default function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isHumanTurn, setIsHumanTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [score, setScore] = useState({ X: 0, O: 0 });

  useEffect(() => {
    const win = calculateWinner(board);

    if (win) {
      setWinner(win);
      setScore((prev) => ({ ...prev, [win]: prev[win] + 1 }));

      // Confetti for Winner
      if (win === HUMAN) {
        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.6 }
        });
      }
    } else if (!board.includes(null)) {
      setWinner("Draw");
    }

    // AI Plays
    if (!isHumanTurn && !win) {
      setTimeout(aiMove, 500);
    }
  }, [board]);

  function handleClick(index) {
    if (!isHumanTurn || board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = HUMAN;
    setBoard(newBoard);
    setIsHumanTurn(false);
  }

  function aiMove() {
    const emptyCells = board
      .map((val, idx) => (val === null ? idx : null))
      .filter((v) => v !== null);

    if (emptyCells.length === 0) return;

    const move =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    const newBoard = [...board];
    newBoard[move] = AI;
    setBoard(newBoard);
    setIsHumanTurn(true);
  }

  function resetGame() {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setIsHumanTurn(true);
  }

  return (
    <div className="container">
      <h1>Tic Tac Toe 🤖</h1>

      <div className="scoreboard">
        <span>You (X): {score.X}</span>
        <span>AI (O): {score.O}</span>
      </div>

      <div className={`status ${winner === HUMAN ? "winner" : ""}`}>
        {winner ? (
          winner === "Draw" ? (
            "It's a Draw 😐"
          ) : winner === HUMAN ? (
            <span className="trophy">🏆 You Won! 🏆</span>
          ) : (
            "AI Wins 🤖"
          )
        ) : isHumanTurn ? (
          "Your Turn"
        ) : (
          "AI Thinking..."
        )}
      </div>

      <div className="board">
        {board.map((value, index) => (
          <button
            key={index}
            className="square"
            onClick={() => handleClick(index)}
          >
            {value}
          </button>
        ))}
      </div>

      <button className="reset" onClick={resetGame}>
        Restart Game
      </button>
    </div>
  );
}

function calculateWinner(board) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}
