// SeuComponente.vue

<template>
  <div>
    <div class="my-10 max-w-3xl m-auto">
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
    </div>
  </div>
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
