import Tone from 'tone';

window.Tone = Tone;

export class Drums {
  constructor(lanes, onLoad) {
    this.initializeSequences(lanes);
    this.initializePlayers(onLoad);
  }

  initializeSequences(lanes) {
    this.sequences = new Map();
    lanes.forEach(lane => {
      this.sequences.set(lane.name, this.makeSequence(lane));
    });
  }

  initializePlayers(onLoad) {
    this.players = new Tone.Players(
      {
        clap: '/samples/clap.ogg',
        closedHat: '/samples/closed-hat.ogg',
        kick: '/samples/kick.ogg',
        openHat: '/samples/open-hat.ogg',
        ride: '/samples/ride.ogg',
        rim: '/samples/rim.ogg',
        snare: '/samples/snare.ogg',
        tom: '/samples/tom.ogg',
      },
      onLoad
    ).toMaster();
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
    this.sequences.forEach(sequence => sequence.start());
  }

  stop() {
    this.sequences.forEach(sequence => sequence.stop());
    this.players.stopAll();
  }

  playNote(note) {
    this.players.get(note.lane).start();
  }

  dispose() {
    this.sequences.forEach(sequence => sequence.dispose());
    this.players.dispose();
  }
}
