<template>
  <ul class="space-y-5 w-full h-[530px] overflow-auto modal mt-8">
    <li
      class="max-w-lg flex gap-x-2 sm:gap-x-4 me-11"
      v-for="(msg, index) in arrayOtMessages[0]"
      :key="index"
    >
      <span
        class="flex-shrink-0 inline-flex items-center justify-center h-11 w-11 rounded-full border bg-secondary/20"
      >
        <span class="text-sm font-medium text-white leading-none uppercase">{{
          msg.username.charAt(0)
        }}</span>
      </span>

      <div>
        <div class="inline-block bg-secondary/10 rounded-2xl p-3.5 shadow-sm">
          <p class="text-white">{{ msg.text }}</p>
        </div>

        <span class="mt-1.5 flex items-center gap-x-1 text-xs text-gray-500">
          {{ msg.createAt }}
        </span>
      </div>
    </li>

    <li
      class="flex ms-auto gap-x-2 sm:gap-x-4"
      v-for="(msg, index) in arrayMyMessages[0]"
      :key="index"
    >
      <div class="grow text-end space-y-3">
        <div class="flex flex-col gap-1.5 items-end">
          <div class="inline-block bg-secondary rounded-2xl p-3.5 shadow-sm">
            <p class="text-sm text-white">{{ msg.text }}</p>
          </div>

          <span
            class="mt-1.5 ms-auto flex items-center gap-x-1 text-xs text-gray-500"
          >
            {{ msg.createAt }}
          </span>
        </div>
      </div>

      <span
        class="flex-shrink-0 inline-flex items-center justify-center h-11 w-11 rounded-full border bg-secondary/20"
      >
        <span class="font-medium text-white leading-none uppercase">{{
          msg.username.charAt(0)
        }}</span>
      </span>
    </li>
  </ul>
</template>

<script setup lang="ts">
const props = defineProps<{
  myMessage?: string;
  myUsername?: string;
  myDate?: string;
  otMessage?: string;
  otUsername?: string;
  otDate?: string;
  arrayOtMessages?: any;
  arrayMyMessages?: any;
}>();

console.log("arrayMyMessages", props.arrayMyMessages);
console.log("props", props.arrayOtMessages);
</script>
