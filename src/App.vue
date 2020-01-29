<template>
  <div id="app" class="w-screen h-screen bg-gray-900 py-24 px-16">
    <div class="relative">
      <div class="flex mb-2">
        <Button @click.native="togglePlayback" color="primary">{{
          playing ? 'Stop' : 'Start'
        }}</Button>
        <!-- <Button class="ml-2">Tempo</Button> -->
        <Button class="ml-auto" @click.native="clearPattern">Clear</Button>
      </div>
      <Grid class="mx-auto" :lanes="lanes" @toggle-note="toggleNote" />
      <div
        v-if="loading"
        class="absolute left-0 top-0 w-full h-full bg-gray-700 opacity-75 text-white flex items-center justify-center text-xl"
      >
        Loading...
      </div>
    </div>
  </div>
</template>

<script>
import 'focus-visible';
import Tone from 'tone';
import { Drums } from './modules/drums';
import { makeLanes, defaultBeat } from './modules/data';
import Button from './components/Button.vue';
import Grid from './components/Grid.vue';

export default {
  name: 'app',

  components: {
    Button,
    Grid,
  },

  data() {
    return {
      loading: true,
      playing: false,
      lanes: makeLanes(defaultBeat),
    };
  },

  created() {
    this.drums = new Drums(this.lanes, () => {
      this.loading = false;
    });
  },

  mounted() {
    document.addEventListener(
      'click',
      () => {
        if (Tone.context.state !== 'running') {
          Tone.context.resume();
        }
      },
      { once: true }
    );
  },

  methods: {
    start() {
      this.playing = true;
      Tone.Transport.start();
      this.drums.start();
    },

    stop() {
      this.playing = false;
      Tone.Transport.pause();
      this.drums.stop();
    },

    togglePlayback() {
      if (this.playing) {
        this.stop();
      } else {
        this.start();
      }
    },

    clearPattern() {
      this.stop();
      for (const lane of this.lanes) {
        for (const note of lane.notes) {
          note.on = false;
        }
      }
    },

    toggleNote(note) {
      note.on = !note.on;
      if (note.on && Tone.Transport.state !== 'started') {
        this.drums.playNote(note);
      }
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
