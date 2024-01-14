import { reactive } from "vue";
import { io, Socket } from "socket.io-client";

interface State {
  connected: boolean;
  fooEvents: any[]; // Defina o tipo apropriado para os eventos foo e bar
  barEvents: any[]; // Defina o tipo apropriado para os eventos foo e bar
}

export const state: State = reactive({
  connected: false,
  fooEvents: [],
  barEvents: [],
});

// "undefined" means the URL will be computed from the `window.location` object
const URL: string | undefined =
  process.env.NODE_ENV === "production" ? undefined : "http://localhost:8003";

// Verifique se a URL é definida antes de passá-la para io()
export const socket: Socket = URL ? io(URL) : io();

socket.on("connect", () => {
  state.connected = true;
});

socket.on("disconnect", () => {
  state.connected = false;
});

socket.on("foo", (...args: any[]) => {
  state.fooEvents.push(args);
});

socket.on("bar", (...args: any[]) => {
  state.barEvents.push(args);
});
