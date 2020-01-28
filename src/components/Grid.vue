<template>
  <div class="flex p-2 bg-gray-800">
    <Column
      v-for="(cells, index) in pattern"
      :key="index"
      :cells="cells"
      @toggle-cell="toggleCell"
    />
  </div>
</template>

<script>
import Column from './Column.vue';

export default {
  name: 'Cell',
  components: {
    Column,
  },
  props: {
    width: Number,
    height: Number,
    pattern: Array,
  },
  methods: {
    toggleCell(cell) {
      this.$emit('toggle-cell', cell);
    },
  },
};
</script>
