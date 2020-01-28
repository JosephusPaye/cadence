import { MembraneSynth, NoiseSynth } from 'tone';

export const kick = {
  synth: new MembraneSynth().toMaster(),
  note: 'D1',
  duration: '16n',
};

export const clap = {
  synth: new NoiseSynth({
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
  }).toMaster(),
  note: null,
  duration: '16n',
};

export const cymbal = {
  synth: new NoiseSynth({
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
  }).toMaster(),
  note: null,
  duration: '16n',
};
