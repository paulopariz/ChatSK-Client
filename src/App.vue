// SeuComponente.vue

<template>
  <div>
    <h1>teste</h1>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

onMounted(() => {});
</script>
