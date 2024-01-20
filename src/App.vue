<template>
  <main class="max-w-4xl p-10 w-full h-full grid m-auto gap-6">
    <div class="flex items-center justify-between">
      <div class="flex gap-3 items-center">
        <Select>
          <SelectTrigger class="w-[180px] h-12 px-5">
            <SelectValue placeholder="Selecione o tema" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              <SelectItem value="light"> Light </SelectItem>
              <SelectItem value="dark"> Dark </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input
          placeholder="Username"
          type="text"
          v-model="username"
          class="w-60 h-12 px-5 outline-none rounded-md border justify-center border-secondary focus: bg-secondary/5 transition-all bg-transparent"
        />
      </div>
    </div>

    <Dialog>
      <DialogTrigger
        class="text-sm mt-20 tracking-wide h-12 w-36 rounded-md border flex items-center gap-1.5 justify-center border-secondary bg-secondary/5 transition-all"
      >
        Criar sala
        <img src="./assets/icons/plus.svg" alt="Criar" class="w-4" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar sala</DialogTitle>
          <DialogDescription>
            Crie uma sala personalizada e estabeleça conexões com outros
            usuários.

            <div class="my-8 grid gap-4">
              <div>
                <label>Nome da Sala</label>
                <Input class="mt-2" placeholder="Digite o nome da sala..." />
              </div>

              <div>
                <label>Defina o limete de usuários</label>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose
            class="bg-white dark:bg-red-600 rounded-md py-2 font-medium text-sm tracking-wide px-6 text-background"
          >
            Criar
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    <section class="grid grid-cols-3 gap-6 content-center">
      <div
        v-for="(room, index) in rooms"
        :key="index"
        class="relative rounded-md border border-secondary h-52 overflow-hidden transition-all hover:bg-secondary/5 group"
      >
        <div class="p-5 flex items-start justify-between">
          <div class="grid gap-1.5">
            <h1
              class="text-lg font-semibold tracking-wider w-40 text-ellipsis text-nowrap overflow-hidden transition-all"
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
          @click="enterRoom(room)"
          class="w-full h-12 tracking-wide font-semibold border border-x-0 border-b-0 border-secondary bg-secondary/10 text-sm absolute bottom-0 group-transition-all"
        >
          Entrar na sala
        </button>
      </div>
    </section>

    <div class="my-10 max-w-3xl m-auto">
      <Input
        type="text"
        placeholder="msg"
        @keyup.enter="sendMessage"
        v-model="message"
      />

      <div v-for="(msg, index) in messages" :key="index">
        <p>
          <span class="font-bold">{{ msg.username }} - </span>
          {{ msg.text }} - <span class="font-bold">{{ msg.createAt }}</span>
        </p>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { io } from "socket.io-client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "./components/ui/dialog";
import { Input } from "./components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
interface Messages {
  room: string;
  text: string;
  username: string;
  createAt: string;
}

interface SendMessages {
  room: string;
  message: string;
  username: string;
}

interface CurrentData {
  id: number;
  name: string;
  owner: string;
  createAt: string;
  usersOnline: string;
}

//
const username = ref("");
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
  var room: SendMessages = JSON.parse(
    localStorage.getItem("currentData") || "null"
  );
  try {
    const data = {
      room: room.room,
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

const enterRoom = (data: CurrentData) => {
  var log = {
    username: username.value,
    room: data.name,
    id: data.id,
  };
  localStorage.setItem("currentData", JSON.stringify(log));
};

onMounted(() => {
  var data: any = localStorage.getItem("currentData");
  username.value = JSON.parse(data).username;

  socket.emit("select_room", JSON.parse(data), (res: any) => {
    for (let i = 0; i < res.length; i++) {
      const element = res[i];

      messages.value.push(element);
    }
  });

  //escutar evento
  socket.on("message", (data) => {
    messages.value.push(data);
  });
});
</script>
