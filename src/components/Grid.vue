<template>
  <div class="flex flex-col p-2 bg-gray-800">
    <Lane
      v-for="(lane, index) in enabledLanes"
      :key="index"
      :lane="lane"
      :offset="index"
      @play-note="playNote"
      @toggle-note="toggleNote"
    />
  </div>
</template>

<script>
import Lane from './Lane.vue';

export default {
  name: 'Grid',

  components: { Lane },

  props: {
    lanes: Array,
  },

  computed: {
    enabledLanes() {
      return this.lanes.filter(lane => lane.enabled);
    },
  },

  methods: {
    toggleNote(note) {
      this.$emit('toggle-note', note);
    },

    playNote(note) {
      this.$emit('play-note', note);
    },
  },
};
</script>
