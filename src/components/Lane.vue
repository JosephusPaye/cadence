<template>
  <div class="flex select-none" :class="`${offset === 0 ? 'mt-0' : 'mt-1'}`">
    <button
      class="w-32 h-8 inline-flex items-center justify-center cursor-pointer bg-gray-700 capitalize text-gray-400 active:bg-blue-400"
      @mousedown="playNote"
      @keydown.space="playNote"
    >
      {{ lane.prettyName }}
    </button>
    <Note
      v-for="(note, index) in lane.notes"
      :key="index"
      :note="note"
      @toggle="toggleNote"
    />
  </div>
</template>

<script>
import Note from './Note.vue';

export default {
  name: 'Lane',

  components: { Note },

  props: {
    lane: Object,
    offset: Number,
  },

  methods: {
    toggleNote(note) {
      this.$emit('toggle-note', note);
    },

    playNote() {
      this.$emit('play-note', {
        lane: this.lane.name,
        offset: 0,
        on: true,
      });
    },
  },
};
</script>
