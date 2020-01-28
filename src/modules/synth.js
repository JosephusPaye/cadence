import { MembraneSynth, NoiseSynth } from 'tone';

export const kick = new MembraneSynth().toMaster();

export const clap = new NoiseSynth({
  noise: {
    type: 'white',
    spread: 50,
    density: 80,
    surface: 12,
    frequency: 40,
  },
  volume: 0,
  envelope: {
    attack: 0.005,
    decay: 0.33,
    sustain: 0,
  },
}).toMaster();

export const cymbal = new NoiseSynth({
  noise: {
    type: 'white',
  },
  spread: 50,
  density: 80,
  surface: 12,
  frequency: 40,
  volume: 0,
  envelope: {
    attack: 0.005,
    decay: 0.06,
    sustain: 0,
  },
}).toMaster();
