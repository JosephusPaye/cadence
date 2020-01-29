<template>
  <div id="app" class="w-screen h-screen bg-gray-900 py-24 px-16">
    <div class="flex mb-2">
      <Button @click.native="togglePlayback" color="primary">{{
        playing ? 'Stop' : 'Start'
      }}</Button>
      <!-- <Button class="ml-2">Tempo</Button> -->
      <Button class="ml-auto" @click.native="clearPattern">Clear</Button>
    </div>
    <Grid class="mx-auto" :sequence="sequence" @toggle-note="toggleNote" />
  </div>
</template>

<script>
import 'focus-visible';
import Tone from 'tone';
import { Drums } from './modules/drums';
import Button from './components/Button.vue';
import Grid from './components/Grid.vue';

export default {
  name: 'app',
  components: {
    Button,
    Grid,
  },
  data() {
    const sequenceToLane = {
      clap: 0,
      snare: 1,
      kick: 2,
    };
    return {
      playing: false,
      sequenceToLane,
      sequence: this.makeSequence({
        lanes: Object.keys(sequenceToLane),
        patterns: [
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
          [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
        ],
      }),
    };
  },
  created() {
    this.drums = new Drums(this.sequence, this.sequenceToLane);
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
    makeSequence(data) {
      return data.patterns.map((lanePattern, laneIndex) => {
        return {
          name: data.lanes[laneIndex],
          notes: lanePattern.map((noteValue, offset) => {
            return {
              lane: data.lanes[laneIndex],
              offset,
              on: Boolean(noteValue),
            };
          }),
        };
      });
    },

    togglePlayback() {
      this.playing = !this.playing;
      if (this.playing) {
        Tone.Transport.start();
        this.drums.start();
      } else {
        Tone.Transport.pause();
        this.drums.stop();
      }
    },

    clearPattern() {
      for (const lane of this.sequence) {
        for (const note of lane.notes) {
          note.on = false;
        }
      }
      this.drums.clear();
    },

    toggleNote(note) {
      console.log(
        'toggling note',
        note.lane,
        note.offset,
        note.on,
        '=>',
        !note.on
      );
      note.on = !note.on;
      this.drums.toggleNote(note);
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
