<template>
  <button
    class="w-12 h-8 font-mono inline-flex items-center justify-center cursor-pointer"
    :class="classes"
    @click="toggle"
  ></button>
</template>

<script>
export default {
  name: 'Cell',
  props: {
    cell: Object,
  },
  computed: {
    classes() {
      const { x, y, on } = this.cell;
      return [
        x === 0 ? 'ml-0' : x % 4 === 0 ? 'ml-2' : 'ml-1',
        y === 0 ? 'mt-0' : 'mt-1',
        on ? 'bg-blue-400' : 'bg-gray-700',
      ];
    },
  },
  methods: {
    toggle() {
      this.$emit('toggle', this.cell);
    },
  },
};
</script>
