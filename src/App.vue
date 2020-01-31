<template>
  <div id="app">
    <div class="relative mx-auto" style="max-width: 993px">
      <div class="flex mb-2">
        <Button @click="togglePlayback" color="primary">{{
          playing ? 'Stop' : 'Start'
        }}</Button>
        <Button
          class="ml-2"
          :toggled="header === 'tempo'"
          @click="toggleHeader('tempo')"
          >Tempo</Button
        >
        <Button
          class="ml-2"
          :toggled="header === 'instruments'"
          @click="toggleHeader('instruments')"
          >Instruments</Button
        >
        <input
          v-model="beat.title"
          class="ml-auto w-32 px-3 py-1 bg-gray-700 text-black text-white"
        />
        <FeedbackButton ref="feedbackButton" label="Save" @click="saveBeat" />
        <Button
          class="ml-2"
          :toggled="header === 'library'"
          @click="toggleHeader('library')"
          >Library</Button
        >
      </div>
      <TempoControl v-model="beat.tempo" v-if="header === 'tempo'" />
      <InstrumentsControl
        v-else-if="header === 'instruments'"
        :lanes="beat.lanes"
        @toggle="toggleLane"
      />
      <BeatLibrary
        v-else-if="header === 'library'"
        :beats="savedBeatTitles"
        :current-beat="beat.title"
        @select="loadSavedBeat"
      />
      <Grid
        class="mx-auto"
        :lanes="beat.lanes"
        @toggle-note="toggleNote"
        @play-note="playNote"
      />
      <div class="mt-2 w-full flex">
        <CopyButton label="Copy link" :content="beatUrl" />
        <Button class="ml-auto" @click="clearPattern">Clear</Button>
      </div>
      <div
        v-if="loading"
        class="absolute left-0 top-0 w-full h-full bg-gray-700 opacity-75 text-white flex items-center justify-center text-xl"
      >
        Loading...
      </div>
      <div class="text-center mt-24 pt-4 text-gray-700 text-sm">
        Created by
        <a
          class="underline hover:text-gray-500 focus:text-gray-400"
          href="https://twitter.com/JosephusPaye"
          target="_blank"
          rel="noopener"
          >Josephus Paye II</a
        >
        for
        <a
          class="underline hover:text-gray-500 focus:text-gray-400"
          href="https://twitter.com/JosephusPaye/status/1214853295023411200"
          target="_blank"
          rel="noopener"
          >#CreateWeekly</a
        >. View on
        <a
          class="underline hover:text-gray-500 focus:text-gray-400"
          href="https://github.com/JosephusPaye/cadence"
          target="_blank"
          rel="noopener"
          >Github</a
        >.
      </div>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import Tone from 'tone';

import { defaultBeat, beatFromUrl } from './modules/beat';
import { Drums } from './modules/drums';
import * as storage from './modules/storage';
import Button from './components/Button.vue';
import CopyButton from './components/CopyButton.vue';
import FeedbackButton from './components/FeedbackButton.vue';
import Grid from './components/Grid.vue';
import InstrumentsControl from './components/InstrumentsControl.vue';
import BeatLibrary from './components/BeatLibrary.vue';
import TempoControl from './components/TempoControl.vue';

export default {
  name: 'app',

  components: {
    Button,
    CopyButton,
    FeedbackButton,
    Grid,
    InstrumentsControl,
    BeatLibrary,
    TempoControl,
  },

  data() {
    return {
      loading: true,
      playing: false,
      header: 'none',
      savedBeatTitles: storage.getSavedBeatTitles(),
      beat: beatFromUrl(storage.getLastOpenBeat(defaultBeat)),
      beatUrl: '',
    };
  },

  watch: {
    beat: {
      handler(beat) {
        this.onBeatChange(beat);
      },
      deep: true,
      immediate: true,
    },
    'beat.tempo': {
      handler(newTempo) {
        Tone.Transport.bpm.value = newTempo;
      },
      immediate: true,
    },
    'beat.title': {
      handler(newTitle) {
        this.onTitleChange(newTitle);
      },
      immediate: true,
    },
  },

  created() {
    this.drums = new Drums(this.beat.lanes, this.beat.samplePack, () => {
      this.loading = false;
    });
    this.onBeatChange = debounce(this.onBeatChange, 300, {
      leading: true,
      trailing: true,
    });
    this.onTitleChange = debounce(this.onTitleChange, 300, {
      leading: true,
      trailing: true,
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

    toggleNote(note) {
      note.toggle();
      if (note.on && Tone.Transport.state !== 'started') {
        this.drums.playNote(note);
      }
    },

    playNote(note) {
      this.drums.playNote(note);
    },

    toggleHeader(control) {
      if (this.header === control) {
        this.header = 'none';
      } else {
        this.header = control;
      }
    },

    toggleLane(lane) {
      lane.toggle();
      this.drums.toggleLane(lane);
    },

    onBeatChange(beat) {
      const { href, hash } = beat.getUrl();
      this.beatUrl = href;
      location.hash = hash;
      storage.setLastOpenBeat(beat);
    },

    onTitleChange(title) {
      document.title = title + ' – Cadence';
    },

    saveBeat() {
      storage.saveBeat(this.beat);
      this.savedBeatTitles = storage.getSavedBeatTitles();
      this.$refs.feedbackButton.setLabel('Saved!');
    },

    loadSavedBeat(title) {
      this.stop();
      this.loading = true;
      this.beat = storage.loadBeat(title, this.beat);
      this.drums = new Drums(this.beat.lanes, this.beat.samplePack, () => {
        this.loading = false;
      });
    },

    clearPattern() {
      this.stop();
      this.beat.clear();
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
