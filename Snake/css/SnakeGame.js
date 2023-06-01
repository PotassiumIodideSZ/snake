import React, { useState, useEffect } from "react";
import "./css/SnakeGame.css";

const BOARD_SIZE = 20;
const SPEED = 200;

const getRandomPosition = () => {
  return Math.floor(Math.random() * BOARD_SIZE);
};

const createSnake = () => {
  return [
    { x: BOARD_SIZE / 2, y: BOARD_SIZE / 2 },
    { x: BOARD_SIZE / 2 - 1, y: BOARD_SIZE / 2 },
    { x: BOARD_SIZE / 2 - 2, y: BOARD_SIZE / 2 },
  ];
};

const createFood = () => {
  return { x: getRandomPosition(), y: getRandomPosition() };
};

const checkCollision = (head, snake) => {
  if (
    head.x < 0 ||
    head.x >= BOARD_SIZE ||
    head.y < 0 ||
    head.y >= BOARD_SIZE
  ) {
    return true;
  }
  for (let i = 0; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }
  return false;
};

const moveSnake = (snake, direction) => {
  let newHead = { ...snake[0] };
  switch (direction) {
    case "up":
      newHead.y--;
      break;
    case "down":
      newHead.y++;
      break;
    case "left":
      newHead.x--;
      break;
    case "right":
      newHead.x++;
      break;
    default:
      break;
  }
  return [newHead, ...snake.slice(0, -1)];
};

const Cell = ({ value }) => {
  let className = "cell";
  if (value === "snake") {
    className += " snake";
  } else if (value === "food") {
    className += " food";
  }
  return <div className={className} />;
};

const Board = ({ board }) => {
  return (
    <div className="board">
      {board.map((row, i) => (
        <div key={i} className="row">
          {row.map((cell, j) => (
            <Cell key={j} value={cell} />
          ))}
        </div>
      ))}
    </div>
  );
};

const SnakeGame = () => {
  const [snake, setSnake] = useState(createSnake());
  const [food, setFood] = useState(createFood());
  const [direction, setDirection] = useState("right");
  const [canChangeDirection, setCanChangeDirection] = useState(true);
  const [score, setScore] = useState(0);
  const [board, setBoard] = useState(
    Array(BOARD_SIZE)
      .fill(null)
      .map(() => Array(BOARD_SIZE).fill(null))
  );
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const newBoard = board.map((row) => row.fill(null));
    snake.forEach((segment) => {
      newBoard[segment.y][segment.x] = "snake";
    });
    newBoard[food.y][food.x] = "food";
    setBoard(newBoard);
  }, [snake, food]);


  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!canChangeDirection) return;
      switch (event.key) {
        case "ArrowUp":
          if (direction !== "down") setDirection("up");
          break;
        case "ArrowDown":
          if (direction !== "up") setDirection("down");
          break;
        case "ArrowLeft":
          if (direction !== "right") setDirection("left");
          break;
        case "ArrowRight":
          if (direction !== "left") setDirection("right");
          break;
        default:
          break;
      }
      setCanChangeDirection(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction, canChangeDirection]);

  const [speed, setSpeed] = useState(SPEED);

  useEffect(() => {
    setSpeed(SPEED - score * 10);
  }, [score]);

  useEffect(() => {
    const timerId = setInterval(() => {
      const newSnake = moveSnake(snake, direction);
      const head = newSnake[0];
      if (checkCollision(head, snake)) {
        setGameOver(true);
        clearInterval(timerId);
      } else if (head.x === food.x && head.y === food.y) {
        setSnake([...newSnake, snake[snake.length - 1]]);
        setFood(createFood());
        setScore(score + 1);
      } else {
        setSnake(newSnake);
      }
      setCanChangeDirection(true);
    }, speed);
    return () => clearInterval(timerId);
  }, [snake, food, direction]);

  const restartGame = () => {
    setSnake(createSnake());
    setFood(createFood());
    setDirection("right");
    setScore(0);
    setGameOver(false);
  };

  const renderGameOver = () => {
    return (
      <div className="game-over">
        <h1>Game Over</h1>
        <h2>Your score: {score}</h2>
        <button onClick={restartGame}>Play Again</button>
      </div>
    );
  };

  const renderGame = () => {
    return (
      <div className="game">
        <h1>Snake Game</h1>
        <h2>Score: {score}</h2>
        <Board board={board} />
      </div>
    );
  };

  return gameOver ? renderGameOver() : renderGame();
};

export default SnakeGame;
