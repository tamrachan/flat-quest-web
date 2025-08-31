import { use, useState } from 'react';
import Popup from './Popup';
import "./TicTacToe.css"

// TODO: now make it nice

function Square({ value, squareClick }) { // these are props, n therefore objects
  return (
    <button className="square" onClick={squareClick}> {value} </button>
  );
}

function calculateWinner(squares) { // this is parameter
  const winningLines = [
    // across
    [0,1,2],
    [3,4,5],
    [6,7,8],

    // down
    [0,3,6],
    [1,4,7],
    [2,5,8],

    // diagonal
    [0,4,8],
    [2,4,6]
  ]

  for (let count = 0; count < winningLines.length; count++) {
      const [a, b, c] = winningLines[count];

      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
  }

  return null;

}

function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquare] = useState(Array(9).fill(null)); // initial state is array of 9 all of which is null
  console.log(squares); // squares is the name of the array

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner is " + winner;
    console.log("uh");
  } else {
    status = "Next player: " + (xIsNext ? "x":"o"); // ternary operator (question mark). it works like:  condition ? true: false
  }
  
  function handleClick(currentSquare) {
    const nextSquares = squares.slice(); // copies array with slice method

    if (nextSquares[currentSquare] || winner){ // if its false (ie, current square is null), or if theres a winner // badly worded woops.
      return;
    }
    
    if (xIsNext) {
      nextSquares[currentSquare] = "x"; // elements in constant array can be reassigned as constant means constant reference to an array (thesius' ship much)
    } else {
      nextSquares[currentSquare] = "o";
    }

    setSquare(nextSquares); 
    setXIsNext( ! xIsNext );
  }

  console.log(winner)

  return (
    <div className="tictactoe-container"> 
      <div className="game">
        <div className="game-info">
          <div className="status"> {status} </div>
          <Popup winnerProp={winner} ></Popup>
        </div>
        <div className="game-board">
          <div className="board-row">
            <Square value={squares[0]} squareClick={() => handleClick(0)} /> {/* this is an arrow function. once square is clicked, code after => will run */}
            <Square value={squares[1]} squareClick={() => handleClick(1)} />
            <Square value={squares[2]} squareClick={() => handleClick(2)} />
          </div>

          <div className="board-row">
            <Square value={squares[3]} squareClick={() => handleClick(3)} />
            <Square value={squares[4]} squareClick={() => handleClick(4)} />
            <Square value={squares[5]} squareClick={() => handleClick(5)} />
          </div>

          <div className="board-row">
            <Square value={squares[6]} squareClick={() => handleClick(6)} />
            <Square value={squares[7]} squareClick={() => handleClick(7)} />
            <Square value={squares[8]} squareClick={() => handleClick(8)} />
          </div>
        </div>
      </div>
      

    </div>
  );
}

export default Board