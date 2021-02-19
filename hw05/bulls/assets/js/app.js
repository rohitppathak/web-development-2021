import "../css/app.css"
import {ch_join, ch_make_guess, ch_reset} from "./socket"
import "phoenix_html"

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

const containsOnlyDigits = val => {
    return /^\d*$/.test(val);
};

const onlyUniques = val => {
    const seen = new Set();
    for (let c of val) {
        if (seen.has(c)) {
            return false;
        }
        seen.add(c);
    }
    return true;
};

const guessLength = 4;

function PlayingGame({currentGuess, guesses, gameState, setCurrentGuess}) {

    const typeDigit = event => {
        const potentialGuess = event.target.value;
        if (potentialGuess.length <= guessLength && containsOnlyDigits(potentialGuess) && onlyUniques(potentialGuess)) {
            setCurrentGuess(potentialGuess);
        }
    };

    useEffect(() => {
        if (gameState !== "won") setCurrentGuess("");
    }, [guesses]);

    const handleKeyPress = event => {
        if (event.key === "Enter") {
            makeGuess();
        }
    };

    const makeGuess = () => {
        ch_make_guess(currentGuess);
    };

    if (gameState !== "playing") {
        return null;
    }

    return (
        <div>
            <input value={currentGuess} onChange={typeDigit} onKeyDown={handleKeyPress}/>
            <button onClick={makeGuess}>Guess</button>
            <table className={"guessTable"}>
                <thead>
                    <tr>
                        <th>Guess</th>
                        <th>Same Positions</th>
                        <th>Different Positions</th>
                    </tr>
                </thead>
                <tbody>
                    {guesses.map((guess, index) =>
                        <tr key={index}>
                            <td>{guess.digits}</td>
                            <td>{guess.correctPositions}</td>
                            <td>{guess.wrongPositions}</td>
                        </tr>)
                    }
                </tbody>
            </table>
        </div>
    )
}

function WonGame({gameState, answer}) {
    if (gameState !== "won") return null;

    return (
        <div>
            <h1>You Won!</h1>
            <h2>{answer}</h2>
        </div>
    )
}

function LostGame({gameState}) {
    if (gameState !== "lost") return null;

    return (
        <div>
            <h1>You Lost!</h1>
        </div>
    )
}

function App() {

    const [curState, setCurState] = useState({
        guesses: [],
        gameState: "playing"
    });

    const [currentGuess, setCurrentGuess] = useState("");

    useEffect(() => {
       ch_join(setCurState)
    });

    const reset = () => {
        ch_reset();
        setCurrentGuess("");
    };

    return (
        <div className="App">
            <h1>4Digits!</h1>
            <button className={"reset"} onClick={reset}>Reset</button>
            <PlayingGame currentGuess={currentGuess} gameState={curState.gameState} guesses={curState.guesses}
                         setCurrentGuess={setCurrentGuess}/>
            <WonGame gameState={curState.gameState} answer={currentGuess}/>
            <LostGame gameState={curState.gameState}/>
        </div>
    );
}

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);
