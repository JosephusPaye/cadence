<template>
  <div id="app">
    <div class="relative mx-auto" style="max-width: 993px">
      <div class="flex mb-2">
        <Button @click="togglePlayback" color="primary">{{
          playing ? 'Stop' : 'Start'
        }}</Button>
        <Button
          class="ml-2"
          :toggled="headerComponent === 'tempo'"
          @click="toggleHeader('tempo')"
          >Tempo</Button
        >
        <Button
          class="ml-2"
          :toggled="headerComponent === 'instruments'"
          @click="toggleHeader('instruments')"
          >Instruments</Button
        >
        <!--
          <input v-model="beat.title" class="ml-auto w-32 px-3 py-1 bg-gray-700 text-black text-white" />
          <Button>Save</Button>
          <Button
            class="ml-2"
            :toggled="headerComponent === 'tempo'"
            @click="toggleHeader('tempo')"
          >Library</Button>
        -->
      </div>
      <TempoControl v-model="beat.tempo" v-if="headerComponent === 'tempo'" />
      <InstrumentsControl
        v-else-if="headerComponent === 'instruments'"
        :lanes="beat.lanes"
        @toggle="toggleLane"
      />
      <Grid
        class="mx-auto"
        :lanes="beat.lanes"
        @toggle-note="toggleNote"
        @play-note="playNote"
      />
      <div class="mt-2 w-full flex">
        <Button ref="copyButton" :data-clipboard-text="beatUrl">
          {{ copyButtonLabel }}
        </Button>
        <Button class="ml-auto" @click="clearPattern">Clear</Button>
      </div>
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
import Clipboard from 'clipboard';
import debounce from 'lodash.debounce';
import Tone from 'tone';

import { beatFromUrl } from './modules/beat';
import { Drums } from './modules/drums';
import Button from './components/Button.vue';
import Grid from './components/Grid.vue';
import InstrumentsControl from './components/InstrumentsControl.vue';
import TempoControl from './components/TempoControl.vue';

export default {
  name: 'app',

  components: {
    Button,
    Grid,
    InstrumentsControl,
    TempoControl,
  },

  data() {
    const beat = beatFromUrl();
    return {
      loading: true,
      playing: false,
      headerComponent: 'none',
      copyButtonLabel: 'Copy link',
      beat,
      beatUrl: beat.getUrl().href,
      unsaved: false,
    };
  },

  watch: {
    beat: {
      handler(beat) {
        this.unsaved = true;
        this.onBeatChange(beat);
      },
      deep: true,
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

    this.clipboard = new Clipboard(this.$refs.copyButton.$el);
    this.clipboard.on('success', () => {
      this.setCopyButtonLabel('Copied!');
    });
    this.clipboard.on('error', () => {
      this.setCopyButtonLabel('Copy failed');
    });
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
      if (this.headerComponent === control) {
        this.headerComponent = 'none';
      } else {
        this.headerComponent = control;
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
    },

    onTitleChange(title) {
      document.title = title + (this.unsaved ? ' *' : '') + ' – Doodoo';
    },

    setCopyButtonLabel(label) {
      this.copyButtonLabel = label;
      if (this.copyButtonLabelTimeout) {
        clearTimeout(this.copyButtonLabelTimeout);
        this.copyButtonLabelTimeout = undefined;
      }
      this.copyButtonLabelTimeout = setTimeout(() => {
        this.copyButtonLabel = 'Copy link';
        this.copyButtonLabelTimeout = undefined;
      }, 2000);
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
