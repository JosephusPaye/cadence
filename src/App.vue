<template>
  <div id="app" class="w-screen h-screen bg-gray-900 py-24 px-16">
    <div class="flex mb-2">
      <Button @click.native="togglePlayback" color="primary">{{
        playing ? 'Stop' : 'Start'
      }}</Button>
      <!-- <Button class="ml-2">Tempo</Button> -->
      <Button class="ml-auto" @click.native="clearPattern">Clear</Button>
    </div>
    <Grid
      class="mx-auto"
      :width="16"
      :height="1"
      :pattern="pattern"
      @toggle-cell="toggleCell"
    />
  </div>
</template>

<script>
import 'focus-visible';
import Tone from 'tone';
import { Drums } from './modules/drums';
import Button from './components/Button.vue';
import Grid from './components/Grid.vue';

const drums = new Drums(16);

export default {
  name: 'app',
  components: {
    Button,
    Grid,
  },
  data() {
    return {
      playing: false,
      pattern: this.makePattern([
        [0, 0, 0], // [1, 0, 1],
        [0, 0, 0], // [0, 1, 0],
        [0, 0, 0], // [1, 0, 1],
        [0, 0, 0], // [0, 1, 0],
        [0, 0, 0], // [1, 0, 1],
        [0, 0, 0], // [0, 1, 0],
        [0, 0, 0], // [1, 0, 1],
        [0, 0, 0], // [0, 1, 0],
        [0, 0, 0], // [1, 0, 1],
        [0, 0, 0], // [0, 1, 0],
        [0, 0, 0], // [1, 0, 1],
        [0, 0, 0], // [0, 1, 0],
        [0, 0, 0], // [1, 0, 1],
        [0, 0, 0], // [0, 1, 0],
        [0, 0, 0], // [1, 0, 1],
        [0, 0, 0], // [0, 1, 0],
      ]),
    };
  },
  methods: {
    makePattern(description) {
      return description.map((column, x) => {
        return column.map((cell, y) => {
          return { on: Boolean(cell), x, y };
        });
      });
    },

    togglePlayback() {
      this.playing = !this.playing;
      if (this.playing) {
        Tone.Transport.start();
        drums.startSequences();
      } else {
        Tone.Transport.pause();
        drums.stopSequences();
      }
    },

    clearPattern() {
      for (const column of this.pattern) {
        for (const cell of column) {
          cell.on = false;
        }
      }
    },

    toggleCell(cell) {
      console.log('toggling cell', cell.x, cell.y, cell.on, '=>', !cell.on);
      cell.on = !cell.on;
      drums.toggleCell(cell.x, cell.y);
    },
  },
};
</script>

<style>
@import './assets/tailwind.css';

#app {
  color: rgba(0, 0, 0, 0.87);
  @apply text-base;
}

.js-focus-visible :focus:not(.focus-visible) {
  outline: none;
}
</style>
