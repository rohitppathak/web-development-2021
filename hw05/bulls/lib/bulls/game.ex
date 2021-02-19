defmodule Hangman.Game do
  @word_length 4
  @guess_limit 8

  def new do
    answer = random_unique_sequence
    %{
    guesses: [],
    answer: answer,
    gameState: "playing"
    }
  end

  def random_unique_sequence() do
    Enum.take(Enum.shuffle([0,1,2,3,4,5,6,7,8,9]), @word_length)
  end

  def reset() do
    new
  end

  def view(st) do
    %{
    guesses: st.guesses,
    gameState: st.gameState
    }
  end

  def guess_info(answer, [head | tail], acc \\ [0,0]) do
    {char, index} = head
    [correct, incorrect] = acc
    matching = Enum.filter(Enum.with_index(answer), fn({answer_char, _}) -> char == answer_char end)
    case matching do
      [] -> guess_info(answer, tail, acc)
      [{_match_char, match_index} | _] ->
        if match_index == index do
          guess_info(answer, tail, [correct + 1, incorrect])
        else
          guess_info(answer, tail, [correct, incorrect + 1])
        end
    end
  end

  def guess_info(answer, [], acc) do
    acc
  end

  def make_guess(st, guess) do
    guess_list = Enum.with_index(Enum.map(Enum.map(String.graphemes(guess), fn(val) -> Integer.parse(val) end), fn({i, _}) -> i end))
    [correct_positions, incorrect_positions] = guess_info(st.answer, guess_list)
    new_guess = %{
    digits: guess,
    correctPositions: correct_positions,
    wrongPositions: incorrect_positions
    }
    guesses = st[:guesses] ++ [new_guess]
    new_st = %{st | guesses: guesses}
    cond do
      correct_positions == @word_length -> %{new_st | gameState: "won"}
      length(guesses) >= @guess_limit -> %{new_st | gameState: "lost"}
      true -> new_st
    end
  end
end
