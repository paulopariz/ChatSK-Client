<template>
  <ul class="space-y-5 w-full h-[530px] overflow-auto modal mt-8">
    <div v-for="(msg, index) in messages[0]" :key="index">
      <li
        class="max-w-lg flex gap-x-2 sm:gap-x-4 me-11"
        v-if="msg.username !== myUser"
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <span
                class="flex-shrink-0 inline-flex items-center justify-center h-11 w-11 rounded-full border"
                :class="photo(msg.username)"
              >
                <span class="text-sm font-medium leading-none uppercase">{{
                  msg.username.charAt(0)
                }}</span>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{{ msg.username }}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div>
          <div
            class="inline-block bg-secondary/10 rounded-2xl p-3.5 shadow-sm max-w-96 whitespace-wrap break-words"
          >
            <p class="text-secondary dark:text-white">{{ msg.text }}</p>
          </div>
          <span class="mt-1.5 flex items-center gap-x-1 text-xs text-gray-500">
            {{ formatData(msg.createAt) }}
          </span>
        </div>
      </li>

      <li v-else class="flex ms-auto gap-x-2 sm:gap-x-4">
        <div class="grow text-end space-y-3">
          <div class="flex flex-col gap-1.5 items-end">
            <div
              class="inline-block bg-secondary rounded-2xl p-3.5 shadow-sm max-w-96 whitespace-wrap break-words"
            >
              <p class="text-sm text-white text-start">{{ msg.text }}</p>
            </div>

            <span
              class="mt-1.5 ms-auto flex items-center gap-x-1 text-xs text-gray-500"
            >
              {{ formatData(msg.createAt) }}
            </span>
          </div>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <span
                class="flex-shrink-0 inline-flex items-center justify-center h-11 w-11 rounded-full border"
                :class="photo(msg.username)"
              >
                <span class="font-medium leading-none uppercase">{{
                  msg.username.charAt(0)
                }}</span>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{{ msg.username }}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </li>
    </div>
  </ul>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import moment from "moment";

defineProps<{
  messages?: any;
}>();

const formatData = (date: string) => {
  return moment(date).format("HH:mm");
};

const myUser = computed(() => {
  var data: any = localStorage.getItem("currentData");
  if (data) {
    return JSON.parse(data).username;
  }
});

const photo = (user: string) => {
  const name = user.charAt(0).toUpperCase();

  if (
    name === "C" ||
    name === "F" ||
    name === "J" ||
    name === "K" ||
    name === "Q"
  ) {
    return "bg-red-800/30 border-red-800/70";
  } else if (
    name === "A" ||
    name === "U" ||
    name === "N" ||
    name === "S" ||
    name === "D"
  ) {
    return "bg-blue-800/30 border-blue-800/70";
  } else if (
    name === "B" ||
    name === "E" ||
    name === "P" ||
    name === "T" ||
    name === "Z"
  ) {
    return "bg-yellow-800/30 border-yellow-800/70";
  } else if (
    name === "G" ||
    name === "Y" ||
    name === "O" ||
    name === "M" ||
    name === "L"
  ) {
    return "bg-green-800/30 border-green-800/70";
  } else if (
    name === "H" ||
    name === "X" ||
    name === "V" ||
    name === "I" ||
    name === "W" ||
    name === "R"
  ) {
    return "bg-purple-800/30 border-purple-800/70";
  } else {
    return "bg-secondary-800/30 border-secondary-800/70";
  }
};
</script>
