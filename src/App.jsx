import "./App.css";
import confetti from "canvas-confetti";
import { useState } from "react";
import { Square } from "./components/Square";
import { TURNS } from "./components/constants";
import { checkWinnerFrom, checkEndGame } from "./logic.js/board";
import { WinnerModal } from "./components/WinnerModal.jsx";
function App() {
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem('board')
    return boardFromStorage ? JSON.parse(boardFromStorage) :
    Array(9).fill(null);
  })

  
  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn')
    return turnFromStorage ?? TURNS.X
  });
  //Null no hay ganador, false Empate

  const [winner, setWinner] = useState(null);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn(TURNS.X);
    setWinner(null);

    window.localStorage.removeItem('board')
    window.localStorage.removeitem('turn')
  };


  const updateBoard = (index) => {
    //Si ya tiene algo
    if (board[index] || winner) return;
    //Actualizar el tablero
    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);
    //Cambiar el turno
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
    setTurn(newTurn);

    window.localStorage.setItem('board', JSON.stringify(newBoard));
    window.localStorage.setItem('turn', newTurn);

    //Revisar si hay ganador
    const newWinner = checkWinnerFrom(newBoard);

    if (newWinner) {
      confetti();
      setWinner(newWinner);
    } else if (checkEndGame(newBoard)) {
      setWinner(false);
    }
  };
  return (
    <main className="board">
      <h1>TRIQUI</h1>
      <button onClick={resetGame}>Reset Game</button>
      <section className="game">
        {board.map((square, index) => {
          return (
            <Square key={index} index={index} updateBoard={updateBoard}>
              {square}
            </Square>
          );
        })}
      </section>
      <section className="turn">
        <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
      </section>
      <WinnerModal resetGame={resetGame} winner={winner}></WinnerModal>
    </main>
  );
}

export default App;
