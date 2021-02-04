import './App.css';
import {useState} from 'react'
import _ from 'lodash'

const randomUniqueSequence = n => {
    const digits = [];
    for (let i = 0; i < 10; i += 1) {
        digits.push(i);
    }
    const shuffled = _.shuffle(digits);
    return shuffled.slice(0, n).join("");
};

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
const maxTries = 8;

function PlayingGame({currentGuess, guesses, gameState, setCurrentGuess, answer, setGameState, setGuesses}) {

    const typeDigit = event => {
        const potentialGuess = event.target.value;
        if (potentialGuess.length <= guessLength && containsOnlyDigits(potentialGuess) && onlyUniques(potentialGuess)) {
            setCurrentGuess(potentialGuess);
        }
    };

    const handleKeyPress = event => {
        if (event.key === "Enter") {
            makeGuess();
        }
    };

    const guessInfo = () => {
        let correctPositions = 0;
        let wrongPositions = 0;
        for (let index = 0; index < currentGuess.length; index += 1) {
            const letter = currentGuess[index];
            const answerIndex = answer.indexOf(letter);
            if (answerIndex === index) {
                correctPositions += 1;
            } else if (answerIndex !== -1) {
                wrongPositions += 1;
            }
        }
        return {correctPositions, wrongPositions};
    };

    const makeGuess = () => {
        console.log(answer);
        if (currentGuess.length === guessLength) {
            const currentGuessInfo = guessInfo();
            guesses.push({digits: currentGuess, ...currentGuessInfo});
            if (currentGuessInfo.correctPositions === guessLength) {
                setGameState("won");
            } else if (guesses.length === maxTries) {
                setGameState("lost");
            }
            setGuesses(guesses);
            setCurrentGuess("");
        }
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

    const [guesses, setGuesses] = useState([]);
    const [answer, setAnswer] = useState(randomUniqueSequence(guessLength));
    const [currentGuess, setCurrentGuess] = useState("");
    const [gameState, setGameState] = useState("playing");

    const reset = () => {
        setGuesses([]);
        setAnswer(randomUniqueSequence(guessLength));
        setCurrentGuess("");
        setGameState("playing");
    };

    return (
        <div className="App">
            <h1>4Digits!</h1>
            <button className={"reset"} onClick={reset}>Reset</button>
            <PlayingGame answer={answer} currentGuess={currentGuess} gameState={gameState} guesses={guesses}
                         setCurrentGuess={setCurrentGuess} setGameState={setGameState} setGuesses={setGuesses}/>
            <WonGame gameState={gameState} answer={answer}/>
            <LostGame gameState={gameState}/>
        </div>
    );
}

export default App;
