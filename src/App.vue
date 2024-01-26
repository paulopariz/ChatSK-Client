<template>
  <Toaster rich-colors position="top-right" theme="dark" />

  <main class="max-w-4xl p-10 w-full h-full grid m-auto gap-6">
    <div class="flex items-center justify-between">
      <div class="flex gap-3 items-center">
        <Select v-model="theme">
          <SelectTrigger class="w-[180px] h-12 px-5">
            <SelectValue placeholder="Selecione o tema" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="light"> Light </SelectItem>
              <SelectItem value="dark"> Dark </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <div class="flex items-center gap-1.5">
          <Input
            placeholder="Username"
            type="text"
            v-model="username"
            class="w-60 h-12 px-5 outline-none rounded-md border justify-center bg-transparent"
          />

          <button
            v-if="username !== currentUsername"
            @click="saveNameUser"
            class="bg-secondary/10 border h-12 rounded-md font-medium text-sm tracking-wide px-5 text-background"
          >
            <img src="./assets/icons/confirm.svg" alt="Save" />
          </button>
        </div>
      </div>
    </div>

    <Dialog>
      <DialogTrigger
        class="text-sm mt-20 tracking-wide h-12 w-36 rounded-md border flex items-center gap-1.5 justify-center hover:bg-secondary/10"
      >
        Criar sala
        <img
          src="./assets/icons/plus.svg"
          alt="Criar"
          class="w-4 invert dark:invert-0"
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar sala</DialogTitle>
          <DialogDescription>
            Crie uma sala personalizada e estabeleça conexões com outros
            usuários.

            <div class="my-8 grid gap-6">
              <div>
                <label class="text-base">Nome da Sala</label>
                <Input
                  v-model="nameRoomCreated"
                  class="mt-2"
                  placeholder="Digite o nome da sala..."
                />
              </div>

              <div>
                <label class="text-base">Defina o limite de usuários</label>
                <h1 class="mt-2 te">Máximo de usuários: {{ maxUser[0] }}</h1>
                <Slider class="mt-2" :max="10" :step="1" v-model="maxUser" />
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose
            @click="createRoom"
            class="bg-primary dark:bg-white rounded-md py-2 font-medium text-sm tracking-wide px-6 text-background"
          >
            Criar
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    <section class="grid grid-cols-3 gap-6 content-center">
      <div
        v-if="rooms.length > 0"
        v-for="(room, index) in rooms"
        :key="index"
        class="relative rounded-md border h-52 overflow-hidden group hover:bg-secondary/5"
      >
        <div class="p-5 flex items-start justify-between">
          <div class="grid gap-1.5">
            <h1
              class="text-lg font-semibold tracking-wider w-40 text-ellipsis text-nowrap overflow-hidden"
            >
              {{ room.name }}
            </h1>
            <span class="text-xs tracking-wide">
              {{ formatData(room.createAt) }}</span
            >
            <span class="text-xs tracking-wide">Dono: {{ room.owner }}</span>
          </div>
          <span class="text-xs mt-1.5 flex items-start gap-2"
            ><img
              class="w-5 -mt-0.5 invert dark:invert-0"
              src="./assets/icons/users.svg"
              alt="Users"
            />
            {{ room.maxUsers }}/10</span
          >
        </div>

        <button
          @click="enterRoom(room)"
          class="w-full h-12 tracking-wide font-semibold border border-x-0 border-b-0 bg-accent dark:bg-transparent text-sm absolute bottom-0 group-"
        >
          Entrar na sala
        </button>
      </div>

      <Skeleton
        v-else
        v-for="item in 6"
        :key="item"
        class="relative rounded-md h-52 overflow-hidden opacity-15"
      />
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
import { onMounted, ref, watch } from "vue";
import { io } from "socket.io-client";
import moment from "moment";
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
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Slider } from "./components/ui/slider";
import { Skeleton } from "./components/ui/skeleton";
import { Toaster } from "./components/ui/sonner";
import { toast } from "vue-sonner";

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
  // usersOnline: string;
}

interface Rooms {
  id: number;
  name: string;
  owner: string;
  createAt: string;
  maxUsers: number;
}

//
const nameRoomCreated = ref("");
const maxUser = ref([1]);
const username = ref("");
const currentUsername = ref("");
const theme: any = ref("");
const message = ref("");
const messages = ref<Messages[]>([]);
const rooms = ref<Rooms[]>([]);

const socket = io("http://localhost:3001");

// Métodos

//formata a data de criacao da sala
const formatData = (data: string) => {
  return moment(data).format("DD/MM/YY [ás] hh:mm");
};

const saveNameUser = () => {
  if (!username.value.length) {
    return toast.info("Configure o seu username!");
  }

  var log = {
    username: username.value,
  };
  localStorage.setItem("currentData", JSON.stringify(log));

  var data: any = localStorage.getItem("currentData");
  username.value = JSON.parse(data).username;

  if (JSON.parse(data).username !== currentUsername.value) {
    toast.success("Username atualizado com sucesso!");
    currentUsername.value = JSON.parse(data).username;
  }
};

//cria uma sala
const createRoom = () => {
  if (!nameRoomCreated.value) {
    return toast.error("Nome da sala é obrigatório!");
  }

  if (maxUser.value[0] < 3) {
    return toast.error("Mínimo 3 usuários!");
  }

  if (!username.value.length) {
    return toast.info("Configure o seu username!");
  }

  var data = {
    name: nameRoomCreated.value,
    owner: username.value,
    maxUsers: maxUser.value[0],
  };
  if (data) {
    socket.emit("create_room", data, (response: any) => {
      if (response.success) {
        toast.success("Sala criada com sucesso!");
        nameRoomCreated.value = "";
        maxUser.value[0] = 1;
        rooms.value.push(response.data);
      } else {
        toast.error("Ocorreu um erro, tente novamente!");
      }
    });
  }
};

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

const listRooms = () => {
  socket.emit("list_rooms", (roomList: Rooms[]) => {
    setTimeout(() => {
      rooms.value = roomList;
    }, 1000);
  });
};
onMounted(() => {
  listRooms();

  var isDark = localStorage.getItem("theme");
  theme.value = isDark === "dark" ? "dark" : "light";

  var data: any = localStorage.getItem("currentData");
  username.value = JSON.parse(data).username;
  currentUsername.value = JSON.parse(data).username;

  //atualiza a lista de salas
  socket.on("room_list_update", () => {
    listRooms();
  });

  //seleciona a sala e tras as mensagens da mesma
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

//tema
watch(theme, (value: any) => {
  if (value === "dark") {
    localStorage.setItem("theme", "dark");
    document.body.classList.toggle("dark");
  } else {
    document.body.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
});
</script>
