<template>
  <div class="flex p-2 mb-2 bg-gray-800">
    <div
      class="w-32 h-8 inline-flex items-center cursor-default px-1 text-gray-400"
    >
      Beat library
    </div>
    <div class="ml-2 flex-grow flex items-center">
      <button
        class="px-3 h-8 inline-flex flex-shrink-0 items-center justify-center capitalize cursor-pointer mr-1"
        :class="
          currentBeat === beat ? 'bg-blue-400' : 'bg-gray-700 text-gray-300'
        "
        v-for="beat in beats"
        :key="beat"
        @click="$emit('select', beat)"
      >
        {{ beat }}
      </button>
      <div class="text-gray-500 italic" v-if="beats.length === 0">
        No saved beats yet. Save beats to see them here.
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'beat-library',
  props: {
    currentBeat: String,
    beats: Array,
  },
};
</script>
