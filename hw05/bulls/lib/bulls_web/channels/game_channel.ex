defmodule BullsWeb.GameChannel do
  use BullsWeb, :channel

  @impl true
  def join("game:" <> _id, payload, socket) do
    if authorized?(payload) do
      game = Hangman.Game.new()
      socket = assign(socket, :game, game)
      view = Hangman.Game.view(game)
      {:ok, view, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  @impl true
  def handle_in("guess", %{"guess" => guess}, socket) do
    game0 = socket.assigns[:game]
    game1 = Hangman.Game.make_guess(game0, guess)
    socket = assign(socket, :game, game1)
    view = Hangman.Game.view(game1)
    {:reply, {:ok, view}, socket}
  end

  @impl true
  def handle_in("reset", %{}, socket) do
    game1 = Hangman.Game.reset()
    socket = assign(socket, :game, game1)
    view = Hangman.Game.view(game1)
    {:reply, {:ok, view}, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
