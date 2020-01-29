<template>
  <div class="flex flex-col p-2 bg-gray-800">
    <Lane
      v-for="(lane, index) in sequence"
      :key="index"
      :lane="lane"
      :offset="index"
      @toggle-note="toggleNote"
    />
  </div>
</template>

<script>
import Lane from './Lane.vue';

export default {
  name: 'Grid',
  components: {
    Lane,
  },
  props: {
    sequence: Array,
  },
  methods: {
    toggleNote(note) {
      this.$emit('toggle-note', note);
    },
  },
};
</script>
