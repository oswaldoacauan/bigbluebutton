defmodule ClientProxy.Client do
  use GenServer, start: {__MODULE__, :start_link, []}, restart: :transient

  def via_tuple(name), do: {:via, Registry, {Registry.Client, name}}

  def start_link(name) when is_binary(name), do:
    GenServer.start_link(__MODULE__, name, name: via_tuple(name))

  def init(name) do
    #send(self(), {:set_state, name})

    {:ok, name}
  end

  def add_player(game, name) when is_binary(name), do:
    GenServer.call(game, {:add_player, name})

  def handle_call({:add_player, _name}, _from, state_data) do
      {:reply, :ok, state_data}
  end

  def handle_info({_, _, _, :subscribed, message}, state) do
    IO.puts(inspect message)
    {:noreply, state}
  end

  def handle_info({_, _, _, :message, message}, state) do
    IO.puts(inspect message)
    rx_msg = Poison.decode!(message.payload)
    ClientProxyWeb.Endpoint.broadcast("client:" <> "foo", "new_msg", rx_msg["core"])
    #ClientProxyWeb.Endpoint.broadcast("users_socket:" <> "foo", "disconnect", %{})

    {:noreply, state}
  end

  def handle_info(:timeout, state_data) do
    {:stop, {:shutdown, :timeout}, state_data}
  end

  def terminate(reason, _state) do
    IO.puts("terminate client #{reason}")
    :ok
  end


end