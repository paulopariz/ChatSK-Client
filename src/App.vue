// SeuComponente.vue

<template>
  <main
    class="max-w-4xl px-10 w-full h-full absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 content-center grid gap-6"
  >
    <div class="w-full">
      <button
        class="text-sm tracking-wide py-2.5 w-36 float-end rounded-md border flex items-center gap-1.5 justify-center border-secondary hover:border-dashed bg-secondary/5 transition-all"
      >
        Criar sala <img src="./assets/icons/plus.svg" alt="Criar" class="w-4" />
      </button>
    </div>

    <section class="grid grid-cols-3 gap-6 content-center">
      <div
        v-for="(room, index) in rooms"
        :key="index"
        class="relative rounded-md border border-secondary hover:border-dashed h-52 overflow-hidden transition-all hover:bg-secondary/5 group"
      >
        <div class="p-5 flex items-start justify-between">
          <div class="grid gap-1.5">
            <h1
              class="text-lg font-semibold tracking-wider w-40 text-ellipsis text-nowrap overflow-hidden group-hover:pl-0.5 transition-all"
            >
              {{ room.name }}
            </h1>
            <span class="text-xs text-gray-300 tracking-wide">
              {{ room.createAt }}</span
            >
            <span class="text-xs text-gray-300 tracking-wide"
              >Dono: {{ room.owner }}</span
            >
          </div>
          <span class="text-xs mt-1.5 text-gray-300 flex items-start gap-2"
            ><img
              class="w-5 -mt-0.5"
              src="./assets/icons/users.svg"
              alt="Users"
            />{{ room.usersOnline }}/10</span
          >
        </div>

        <button
          class="w-full h-12 tracking-wide font-semibold border border-x-0 border-b-0 border-secondary bg-secondary/10 text-sm absolute bottom-0 group-hover:border-dashed transition-all"
        >
          Entrar na sala
        </button>
      </div>
    </section>

    <!-- <div class="my-10 max-w-3xl m-auto">
      <input
        class="text-black"
        type="text"
        placeholder="msg"
        @keyup.enter="sendMessage"
        v-model="message"
      />

      <br />
      <br />
      <br />

      <div v-for="(msg, index) in messages" :key="index">
        <p>
          <span class="font-bold">{{ msg.username }} - </span>
          {{ msg.text }} - <span class="font-bold">{{ msg.createAt }}</span>
        </p>
      </div>
    </div> -->
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { io } from "socket.io-client";

interface Messages {
  room: string;
  text: string;
  username: string;
  createAt: string;
}

//
const username = ref("paulopariz");
const room = ref("sala1");
const message = ref("");
const messages = ref<Messages[]>([]);
const rooms = ref([
  {
    id: 1,
    name: "Sala 001",
    owner: "paulopariz",
    createAt: "12/02/2024 às 23:12",
    usersOnline: "03",
  },
  {
    id: 2,
    name: "Sala 002",
    owner: "paulopariz 02",
    createAt: "12/02/2024 às 13:13",
    usersOnline: "00",
  },
  {
    id: 3,
    name: "Sala 04",
    owner: "user 0",
    createAt: "09/01/2024 às 23:12",
    usersOnline: "10",
  },
  {
    id: 4,
    name: "01 room",
    owner: "und user",
    createAt: "14/02/2024 às 20:42",
    usersOnline: "03",
  },
  {
    id: 5,
    name: "Sala 00012",
    owner: "paulopariz",
    createAt: "12/03/2024 às 21:54",
    usersOnline: "07",
  },
  {
    id: 6,
    name: "rooms SS",
    owner: "joh",
    createAt: "30/02/2024 às 23:12",
    usersOnline: "00",
  },
]);

const socket = io("http://localhost:3001");

const sendMessage = async () => {
  try {
    const data = {
      room: room.value,
      message: message.value,
      username: username.value,
    };
    socket.emit("message", data);
  } catch (error) {
    console.error(error);
  } finally {
    message.value = "";
  }
};

onMounted(() => {
  socket.emit(
    "select_room",
    {
      username: username.value,
      room: room.value,
    },
    (res: any) => {
      for (let i = 0; i < res.length; i++) {
        const element = res[i];
        messages.value.push(element);
      }
    }
  );

  //escutar evento
  socket.on("message", (data) => {
    console.log("data", data);

    messages.value.push(data);
  });
});
</script>
