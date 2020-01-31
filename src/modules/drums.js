import Tone from 'tone';

window.Tone = Tone;

const samplePacks = {
  default: {
    clap: '/samples/clap.ogg',
    closedHat: '/samples/closed-hat.ogg',
    kick: '/samples/kick.ogg',
    openHat: '/samples/open-hat.ogg',
    ride: '/samples/ride.ogg',
    rim: '/samples/rim.ogg',
    snare: '/samples/snare.ogg',
    tom: '/samples/tom.ogg',
  },
};

export class Drums {
  constructor(lanes, samplePack, onLoad) {
    this.initializeSequences(lanes);
    this.initializePlayers(samplePack, onLoad);
  }

  initializeSequences(lanes) {
    this.sequences = new Map();
    lanes.forEach(lane => {
      const sequence = this.makeSequence(lane);
      sequence.mute = lane.enabled === false;
      this.sequences.set(lane.name, sequence);
    });
  }

  initializePlayers(samplePack, onLoad) {
    this.players = new Tone.Players(samplePacks[samplePack], onLoad).toMaster();
    Object.keys(samplePacks[samplePack]).forEach(sampleKey => {
      this.players.get(sampleKey).retrigger = true;
    });
  }

  makeSequence(lane) {
    return new Tone.Sequence(
      (time, note) => {
        if (note.on) {
          this.players.get(note.lane).start(time);
        }
      },
      lane.notes,
      '8n'
    );
  }

  start() {
    for (const sequence of this.sequences.values()) {
      sequence.start();
    }
  }

  stop() {
    for (const sequence of this.sequences.values()) {
      sequence.stop();
    }
    this.players.stopAll();
  }

  playNote(note) {
    this.players.get(note.lane).start();
  }

  toggleLane(lane) {
    this.sequences.get(lane.name).mute = lane.enabled === false;
  }

  dispose() {
    for (const sequence of this.sequences.values()) {
      sequence.dispose();
    }
    this.players.dispose();
  }
}
