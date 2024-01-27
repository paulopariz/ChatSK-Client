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
          </DialogDescription>
        </DialogHeader>
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

        <Dialog>
          <DialogTrigger
            @click="enterRoom(room)"
            class="w-full h-12 tracking-wide font-semibold border border-x-0 border-b-0 bg-accent dark:bg-transparent text-sm absolute bottom-0 group-"
          >
            Entrar na sala
          </DialogTrigger>
          <DialogContent class="max-w-4xl h-[700px]">
            <DialogHeader>
              <DialogTitle>{{ roomSelected.room }}</DialogTitle>
            </DialogHeader>

            <Bubble
              :array-ot-messages="otMessages"
              :array-my-messages="myMessages"
            />

            <div class="fixed bottom-5 left-1/2 -translate-x-1/2 w-11/12">
              <Input
                type="text"
                placeholder="Mensagem"
                @keyup.enter="sendMessage"
                v-model="message"
                class="relative h-12"
              />
              <button
                class="w-8 h-8 rounded-md absolute right-2 bottom-2 bg-secondary/50 flex items-center justify-center group transition-all hover:scale-95 border hover:bg-secondary/35 hover:shadow-lg hover:shadow-secondary/15"
              >
                <img
                  src="./assets/icons/send.svg"
                  alt="Enviar"
                  class="group-hover:rotate-45 group-hover:-ml-1 transition-all"
                />
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <h1
        v-else
        class="tracking-wide absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        Nenhuma sala criada!
      </h1>
    </section>
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
import { Toaster } from "./components/ui/sonner";
import { toast } from "vue-sonner";
import Bubble from "./components/Bubble.vue";

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
const theme: any = ref("");
const message = ref("");
const rooms = ref<Rooms[]>([]);
const roomSelected = ref<any>({});

const otMessages = ref<any[]>([]);
const myMessages = ref<any[]>([]);

const socket = io("http://localhost:3001");

// Métodos

//formata a data de criacao da sala
const formatData = (data: string) => {
  return moment(data).format("DD/MM/YY [ás] hh:mm");
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
  myMessages.value = [];
  otMessages.value = [];

  const log = {
    username: username.value,
    room: data.name,
    id: data.id,
  };

  //salva no localStorage
  localStorage.setItem("currentData", JSON.stringify(log));

  //atualiza a variável reativa roomSelected
  roomSelected.value = log;

  //seleciona a sala e traz as mensagens
  socket.emit("select_room", log, (res: any) => {
    var my = res.filter((msg: Messages) => msg.username === username.value);
    var ot = res.filter((msg: Messages) => msg.username !== username.value);

    myMessages.value.push(my);
    otMessages.value.push(ot);
  });

  //escuta o evento "message" para atualizar as mensagens
  socket.on("message", (data) => {
    if (data.username === username.value) {
      myMessages.value[0].push(data);
    } else {
      otMessages.value[0].push(data);
    }
  });
};

const listRooms = () => {
  socket.emit("list_rooms", (roomList: Rooms[]) => {
    rooms.value = roomList;
  });
};

onMounted(() => {
  listRooms();

  var isDark = localStorage.getItem("theme");
  theme.value = isDark === "dark" ? "dark" : "light";

  //atualiza a lista de salas
  socket.on("room_list_update", () => {
    listRooms();
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
