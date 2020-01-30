<template>
  <button
    class="w-12 h-8 inline-flex items-center justify-center cursor-pointer"
    :class="classes"
    @mousedown="toggle"
  ></button>
</template>

<script>
export default {
  name: 'Note',
  props: {
    note: Object,
    offset: Number,
  },
  computed: {
    classes() {
      const { on, offset } = this.note;
      return [
        offset % 4 === 0 ? 'ml-2' : 'ml-1',
        on ? 'bg-blue-400' : 'bg-gray-700',
      ];
    },
  },
  methods: {
    toggle() {
      this.$emit('toggle', this.note);
    },
  },
};
</script>
