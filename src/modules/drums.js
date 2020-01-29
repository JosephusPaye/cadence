// import instruments from './synth.js';
import Tone from 'tone';

window.Tone = Tone;

export class Drums {
  constructor(sequence, sequenceToLane, onLoad) {
    this.claps = this.makeSequence(sequence[sequenceToLane.clap]);
    this.snares = this.makeSequence(sequence[sequenceToLane.snare]);
    this.kicks = this.makeSequence(sequence[sequenceToLane.kick]);
    this.initializePlayers(onLoad);
  }

  initializePlayers(onLoad) {
    this.players = new Tone.Players(
      {
        kick: '/samples/kick.ogg',
        snare: '/samples/snare.ogg',
        clap: '/samples/clap.ogg',
      },
      onLoad
    ).toMaster();
    window.players = this.players;
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
    this.kicks.start();
    this.claps.start();
    this.snares.start();
  }

  stop() {
    this.kicks.stop();
    this.claps.stop();
    this.snares.stop();
    this.players.stopAll();
  }

  playNote(note) {
    this.players.get(note.lane).start();
  }

  dispose() {
    this.kicks.dispose();
    this.claps.dispose();
    this.snares.dispose();
    this.players.dispose();
  }
}
