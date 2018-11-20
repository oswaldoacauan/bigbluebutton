defmodule ClientProxyWeb.ClientChannel do
  use ClientProxyWeb, :channel

  intercept ["new_msg"]

  def join("client:" <> auth_token, _params, socket) do    
    :timer.send_interval(5_000, :ping)
    send(self, {:after_join, auth_token})
    {:ok, assign(socket, :user_id, auth_token)}
  end

  def handle_info({:after_join, auth_token}, socket) do
    {:ok, client} = ClientProxy.ClientSupervisor.start_client(auth_token)
    ClientProxy.Subscriber.subscribe(client, "from-akka-apps-redis-channel")
    # ClientProxy.Subscriber.subscribe(client, "to-html5-redis-channel")
    {:noreply, socket}
  end

  def handle_info(:ping, socket) do
   # IO.puts("Socket id: #{socket.id}")
    count = socket.assigns[:count] || 1
    push(socket, "ping", %{count: count})
    
    {:noreply, assign(socket, :count, count + 1)}
  end
    
  def handle_out("new_msg", payload, socket) do
    msg_count = socket.assigns[:msg_count] || 1
    IO.puts(msg_count)
    push(socket, "new_msg", payload)
    {:noreply, assign(socket, :msg_count, msg_count + 1)}
  end

  def terminate(reason, _state) do
    IO.puts("TERMINATING #{inspect reason}")
    :ok
  end

end
