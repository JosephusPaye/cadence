<template>
  <div id="app">
    <div class="relative mx-auto" style="max-width: 993px">
      <div class="flex mb-2">
        <Button @click="togglePlayback" color="primary">{{
          playing ? 'Stop' : 'Start'
        }}</Button>
        <Button
          class="ml-2"
          :toggled="headerControl === 'tempo'"
          @click="toggleHeaderControl('tempo')"
          >Tempo</Button
        >
        <Button
          class="ml-2"
          :toggled="headerControl === 'instruments'"
          @click="toggleHeaderControl('instruments')"
          >Instruments</Button
        >
        <Button class="ml-auto" @click="clearPattern">Clear</Button>
      </div>
      <TempoControl v-model="tempo" v-if="headerControl === 'tempo'" />
      <InstrumentsControl
        v-else-if="headerControl === 'instruments'"
        :lanes="lanes"
        @toggle="toggleLane"
      />
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
import TempoControl from './components/TempoControl.vue';
import InstrumentsControl from './components/InstrumentsControl.vue';

export default {
  name: 'app',

  components: {
    Button,
    Grid,
    InstrumentsControl,
    TempoControl,
  },

  data() {
    return {
      loading: true,
      playing: false,
      tempo: 120,
      headerControl: 'none',
      lanes: makeLanes(defaultBeat),
    };
  },

  watch: {
    tempo(newTempo) {
      Tone.Transport.bpm.value = newTempo;
    },
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

    toggleHeaderControl(control) {
      if (this.headerControl === control) {
        this.headerControl = 'none';
      } else {
        this.headerControl = control;
      }
    },

    toggleLane(lane) {
      lane.enabled = !lane.enabled;
      this.drums.toggleLane(lane);
    },
  },
};
</script>

<style>
@import './assets/tailwind.css';

body {
  color: rgba(0, 0, 0, 0.87);
  @apply text-base bg-gray-900 py-16 px-16;
}

.js-focus-visible :focus:not(.focus-visible) {
  outline: none;
}
</style>
