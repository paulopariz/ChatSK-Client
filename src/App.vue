<template>
  <Toaster rich-colors position="top-right" close-button theme="dark" />

  <main class="max-w-4xl p-10 w-full h-full grid m-auto gap-6">
    <nav class="flex items-center justify-end gap-5">
      <Dialog>
        <DialogTrigger
          class="bg-primary dark:bg-white rounded-md py-1.5 font-medium text-xs tracking-wide px-4 text-background"
        >
          Criar sala
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
              <label class="text-sm">Nome da Sala *</label>
              <Input
                v-model="nameRoomCreated"
                class="mt-2"
                placeholder="Digite o nome da sala..."
              />
            </div>

            <div>
              <label class="text-sm">Imagem da sala</label>
              <div
                class="grid grid-cols-6 place-items-center border mt-2 px-2 py-3"
              >
                <label
                  class="relative cursor-pointer focus:outline-none transition-all hover:scale-95"
                  v-for="(img, index) in images"
                  :key="index"
                >
                  <input
                    type="radio"
                    class="hidden"
                    @input="selectImage(img)"
                  />
                  <div
                    tabindex="0"
                    class="w-16 h-16 overflow-hidden rounded-md border-2 border-transparent focus:border-blue-900 ring-offset-background transition-all duration-300"
                  >
                    <img
                      :src="img.src"
                      alt="Imagem"
                      class="w-full h-full object-cover"
                    />
                  </div>
                </label>
              </div>
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
      <Sheet>
        <SheetTrigger
          as-child
          class="cursor-pointer transition-all hover:rotate-12"
        >
          <img
            src="./assets/icons/settings.svg"
            alt="Configurações"
            class="invert dark:invert-0"
          />
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Configurações</SheetTitle>
            <SheetDescription>
              Configure da maneira que preferir. Clique em salvar quando
              terminar.
            </SheetDescription>
          </SheetHeader>
          <div class="grid gap-4 py-4">
            <div class="grid gap-2">
              <label for="name" class="text-sm"> Nome </label>
              <Input
                placeholder="Username"
                type="text"
                v-model="username"
                class="w-full h-12 px-5 outline-none rounded-md border justify-center bg-transparent"
              />
            </div>

            <div class="grid gap-2">
              <label for="username" class="text-sm"> Tema </label>
              <Select v-model="theme">
                <SelectTrigger class="w-full h-12 px-5">
                  <SelectValue placeholder="Selecione o tema" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="light"> Light </SelectItem>
                    <SelectItem value="dark"> Dark </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div class="grid gap-2">
              <label for="name" class="text-sm"> Sala atual </label>
              <p class="text-xs text-muted-foreground">
                Você só receberá notificacões da sua sala selecionada atualmente
              </p>
              <Input
                placeholder="Sala atual"
                disabled
                type="text"
                v-model="currentData.room"
                class="w-full h-12 px-5 outline-none rounded-md border justify-center bg-transparent"
              />
            </div>

            <div class="grid gap-2">
              <label for="name" class="text-sm"
                >Preferência de notificação
              </label>
              <p class="text-xs text-muted-foreground">
                Para
                {{ isPermissionNotification == true ? "desativar" : "ativar" }}
                as notificações vá até "Configurações do site".
              </p>
              <div
                class="h-16 rounded-md border w-full px-3 py-5 flex items-center justify-between"
              >
                <div class="flex items-center gap-3">
                  <img
                    src="./assets/icons/notification.svg"
                    alt="Notificação"
                    class="invert dark:invert-0"
                  />

                  <div class="grid gap-0.5">
                    <h1 class="text-sm font-medium">Notificação</h1>
                  </div>
                </div>

                <Switch disabled :checked="isPermissionNotification" />
              </div>
            </div>
          </div>
          <SheetFooter>
            <SheetClose as-child v-if="username !== currentData.username">
              <button
                class="bg-primary dark:bg-white rounded-md py-2 font-medium text-sm tracking-wide px-6 text-background"
                type="submit"
                @click="saveChanges"
              >
                Salvar
              </button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </nav>

    <section class="grid grid-cols-3 gap-6 content-center mt-20">
      <Dialog
        v-if="rooms.length > 0"
        v-for="(room, index) in rooms"
        :key="index"
      >
        <DialogTrigger
          @click="enterRoom(room)"
          class="relative rounded-md border overflow-hidden group hover:bg-secondary/5 p-3 w-64"
        >
          <div class="flex gap-3 items-center justify-between">
            <div class="flex gap-3 items-center">
              <img
                v-if="room?.img"
                :src="room.img"
                :alt="room.name"
                class="rounded-md w-8 h-8"
              />
              <div
                class="rounded-md w-8 h-8 border text-xs flex justify-center items-center bg-secondary/5"
                v-else
              >
                {{ room.name.charAt(0) }}
              </div>

              <div class="flex items-start flex-col">
                <h1
                  class="font-semibold tracking-wide w-36 text-start text-ellipsis overflow-hidden"
                >
                  {{ room.name }}
                </h1>
                <span class="text-xs dark:text-gray-300">
                  {{ formatData(room.createAt) }}</span
                >
                <span
                  class="text-xs dark:text-gray-300 w-36 text-start text-ellipsis overflow-hidden"
                  >Dono: {{ room.owner }}</span
                >
              </div>
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger as-child>
                  <img
                    src="./assets/icons/enter.svg"
                    alt="Entrar"
                    class="invert dark:invert-0"
                  />
                </TooltipTrigger>
                <TooltipContent> Entrar na sala </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </DialogTrigger>
        <DialogContent class="max-w-4xl h-[700px]">
          <DialogHeader>
            <DialogTitle class="flex items-center gap-3">
              <img
                :src="roomSelected.img"
                :alt="roomSelected.room"
                v-if="roomSelected.img"
                class="rounded-md w-8 h-8"
              />
              <div
                class="rounded-md w-8 h-8 border text-xs flex justify-center items-center bg-secondary/5"
                v-else
              >
                {{ roomSelected.room.charAt(0) }}
              </div>
              <h1 class="-mt-1.5">{{ roomSelected.room }}</h1>
            </DialogTitle>
          </DialogHeader>

          <Bubble :messages="messages" />

          <div class="fixed bottom-5 left-1/2 -translate-x-1/2 w-11/12">
            <Input
              type="text"
              placeholder="Mensagem"
              @keyup.enter="sendMessage"
              v-model="message"
              class="relative h-12 bg-secondary/5 outline-none"
              :disabled="!username"
            />
            <button
              @click="sendMessage"
              :disabled="!username"
              class="w-8 h-8 rounded-md absolute right-2 bottom-2 bg-secondary flex items-center justify-center group transition-all hover:scale-95 border hover:shadow-lg disabled:cursor-not-allowed"
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
import { Switch } from "./components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./components/ui/tooltip";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./components/ui/sheet";
import { Toaster } from "./components/ui/sonner";
import { toast } from "vue-sonner";
import Bubble from "./components/Bubble.vue";

import { playAudio, sendNotification } from "./utils/index";

interface SendMessages {
  room: string;
  message: string;
  username: string;
}

interface CurrentData {
  id: number;
  name: string;
  owner: string;
  img: string;
  createAt: string;
}

interface Rooms {
  id: number;
  name: string;
  owner: string;
  img: string;
  createAt: string;
}

//
const isPermissionNotification = ref(false);
const nameRoomCreated = ref("");
const username = ref("");
const currentData: any = ref({});
const theme: any = ref("");
const message = ref("");
const rooms = ref<Rooms[]>([]);
const roomSelected = ref<any>({});

const messages = ref<any[]>([]);

const selectedImage = ref("");
const images = [
  {
    src: "https://gradients.app/public/img/main/img8.jpg",
  },
  {
    src: "https://indieground.net/wp-content/uploads/2023/03/Freebie-GradientTextures-Preview-04.jpg",
  },
  {
    src: "https://img.freepik.com/free-vector/gradient-grainy-texture_23-2148981502.jpg",
  },
  {
    src: "https://cdn.magicdecor.in/com/2023/11/18151631/Teal-Blue-Grainy-Gradient-Wallpaper-for-Wall.jpg",
  },
  {
    src: "https://img.freepik.com/premium-photo/midnight-sky-abstract-gradient-texture_170579-1432.jpg",
  },
  {
    src: "https://img.freepik.com/free-photo/abstract-gradient-neon-lights_23-2149279180.jpg",
  },
];

const socket = io("http://localhost:3001");

// Métodos

//formata a data de criacao da sala
const formatData = (data: string) => {
  return moment(data).format("DD/MM/YY [ás] HH:mm");
};

const saveChanges = () => {
  if (!username.value.length) {
    return toast.info("Configure o seu username!");
  }
  var log = {
    username: username.value,
  };
  localStorage.setItem("currentData", JSON.stringify(log));
  var data: any = localStorage.getItem("currentData");
  username.value = JSON.parse(data).username;
  if (JSON.parse(data).username !== currentData.value) {
    toast.success("Username atualizado com sucesso!");
    currentData.value = JSON.parse(data);
  }
};

//seleciona a imagem de perfil da sala
const selectImage = (img: any) => {
  selectedImage.value = img.src;
};
//cria uma sala
const createRoom = () => {
  if (!nameRoomCreated.value) {
    return toast.error("Nome da sala é obrigatório!");
  }

  if (!username.value.length) {
    return toast.info("Configure o seu username!");
  }

  var data = {
    name: nameRoomCreated.value,
    owner: username.value,
    img: selectedImage.value,
  };

  if (data) {
    socket.emit("create_room", data, (response: any) => {
      if (response.success) {
        toast.success("Sala criada com sucesso!");
        nameRoomCreated.value = "";
        selectedImage.value = "";

        rooms.value.push(response.data);
      } else {
        toast.error("Ocorreu um erro, tente novamente!");
      }
    });
  }
};

//enviar mensagem
const isSending = ref(false);
const sendMessage = async () => {
  var room: SendMessages = JSON.parse(
    localStorage.getItem("currentData") || "null"
  );

  if (isSending.value) {
    return;
  }

  try {
    isSending.value = true;

    const data = {
      room: room.room,
      message: message.value,
      username: username.value,
    };

    if (message.value.length > 0) {
      socket.emit("message", data);
    }
  } catch (error) {
    console.error(error);
  } finally {
    isSending.value = false;
    message.value = "";
  }
};

const enterRoom = (data: CurrentData) => {
  if (!username.value.length) {
    return toast.info("Configure o seu username!");
  }

  messages.value = [];

  const log = {
    username: username.value,
    room: data.name,
    img: data.img,
    id: data.id,
  };

  //salva no localStorage
  localStorage.setItem("currentData", JSON.stringify(log));

  //atualiza a variável reativa roomSelected
  roomSelected.value = log;

  //seleciona a sala e traz as mensagens
  socket.emit("select_room", log, (res: any) => {
    messages.value.push(res);
  });

  //escuta o evento "message" para atualizar as mensagens
  socket.on("message", (data) => {
    messages.value[0].push(data);
    if (data.username === username.value) {
      if (Notification?.permission === "granted") {
        const audio = new Audio("/emit.mp3");
        audio.volume = 0;
        audio.play();
      }
    } else {
      if (
        Notification?.permission === "granted" &&
        document.visibilityState === "hidden"
      ) {
        playAudio("/on.mp3");
        sendNotification("ChatSK", {
          body: `${data.username}: ${data.text}`,
          icon: "/icon.png",
        });
      } else if (document.visibilityState !== "hidden") {
        const audio = new Audio("/on.mp3");
        audio.volume = 0.5;
        audio.play();

        toast(`${data.room}: ${data.username}`, {
          description: data.text,
        });
      }
    }
  });
};

const listRooms = () => {
  socket.emit("list_rooms", (roomList: Rooms[]) => {
    rooms.value = roomList;
  });
};

//chamar o popup do navegador para mostrar notificaçoes
const isNotification = () => {
  if ("Notification" in window) {
    document.addEventListener("DOMContentLoaded", () => {
      if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          return permission;
        });
      }
    });
  }
};

onMounted(() => {
  var isActive = Notification.permission;
  isPermissionNotification.value = isActive == "granted" ? true : false;

  isNotification();
  listRooms();

  var isDark = localStorage.getItem("theme");
  theme.value = isDark === "dark" ? "dark" : "light";

  var data: any = localStorage.getItem("currentData");
  if (data) {
    username.value = JSON.parse(data).username;
    currentData.value = JSON.parse(data);
  }

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
