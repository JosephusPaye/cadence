<template>
  <div class="flex flex-col">
    <Cell
      v-for="(cell, index) in cells"
      :key="index"
      :cell="cell"
      @toggle="toggleCell"
    />
  </div>
</template>

<script>
import Cell from './Cell.vue';

export default {
  name: 'Column',
  components: { Cell },
  props: { cells: Array },
  methods: {
    toggleCell(cell) {
      this.$emit('toggle-cell', cell);
    },
  },
};
</script>
