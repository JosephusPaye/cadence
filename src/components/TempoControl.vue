<template>
  <div class="flex p-2 mb-2 bg-gray-800">
    <div
      class="w-32 h-8 inline-flex items-center cursor-default px-1 text-gray-400"
    >
      Tempo: {{ value }} bpm
    </div>
    <div class="ml-2 flex-grow flex items-center">
      <RangeSlider
        :value="value"
        @input="$emit('input', $event)"
        :min="30"
        :max="240"
      />
    </div>
  </div>
</template>

<script>
import RangeSlider from './RangeSlider.vue';

export default {
  name: 'tempo-control',

  components: {
    RangeSlider,
  },

  props: {
    value: Number,
  },
};
</script>
