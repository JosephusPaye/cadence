<template>
  <div class="flex" :class="`${offset === 0 ? 'mt-0' : 'mt-1'}`">
    <div
      class="w-32 h-8 inline-flex items-center justify-center cursor-pointer bg-gray-700 capitalize text-gray-400"
    >
      {{ lane.prettyName }}
    </div>
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
  },
};
</script>
