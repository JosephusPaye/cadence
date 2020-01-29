<template>
  <div class="flex p-2 mb-2 bg-gray-800">
    <div
      class="w-32 h-8 inline-flex items-center cursor-default px-1 text-gray-400"
    >
      Instruments
    </div>
    <div class="ml-2 flex-grow flex items-center">
      <button
        class="px-3 h-8 inline-flex flex-shrink-0 items-center justify-center capitalize cursor-pointer mr-1"
        :class="
          instrument.enabled ? 'bg-blue-400' : 'bg-gray-700 text-gray-300'
        "
        v-for="instrument in lanes"
        :key="instrument.name"
        @click="$emit('toggle', instrument)"
      >
        {{ instrument.prettyName }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'lanes-control',
  props: {
    lanes: Array,
  },
};
</script>
