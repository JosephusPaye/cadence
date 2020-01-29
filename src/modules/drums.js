import instruments from './synth.js';
import Tone from 'tone';

const SILENT_NOTE = 0;

export class Drums {
  constructor(sequence, sequenceToLane) {
    this.claps = this.makeClapSequence(sequence[sequenceToLane.clap]);
    this.snares = this.makeSnareSequence(sequence[sequenceToLane.snare]);
    this.kicks = this.makeKickSequence(sequence[sequenceToLane.kick]);
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
  }

  playNote(note) {
    const instrument = instruments[note.lane];

    if (instrument.note) {
      instrument.synth.triggerAttackRelease(
        instrument.note,
        instrument.duration
      );
    } else {
      instrument.synth.triggerAttackRelease(instrument.duration);
    }
  }

  toggleNote(note) {
    if (note.on) {
      this.playNote(note);
    }

    if (note.lane === 'kick') {
      this.toggleEventSilence(
        this.kicks._events[note.offset],
        instruments.kick.note
      );
    } else if (note.lane === 'clap') {
      this.toggleEventSilence(
        this.claps._events[note.offset],
        instruments.clap.duration
      );
    } else if (note.lane === 'snare') {
      this.toggleEventSilence(
        this.snares._events[note.offset],
        instruments.snare.duration
      );
    }
  }

  toggleEventSilence(event, newValue) {
    event.value = event.value === SILENT_NOTE ? newValue : SILENT_NOTE;
  }

  makeKickSequence(kickLane) {
    const kick = instruments.kick;
    const kicks = kickLane.notes.map(note => {
      return note.on ? kick.note : SILENT_NOTE;
    });
    return new Tone.Sequence(
      function(time, note) {
        if (note !== SILENT_NOTE) {
          kick.synth.triggerAttackRelease(note, kick.duration, time);
        }
      },
      kicks,
      '8n'
    );
  }

  makeClapSequence(clapLane) {
    const clap = instruments.clap;
    const claps = clapLane.notes.map(note => {
      return note.on ? clap.duration : SILENT_NOTE;
    });
    return new Tone.Sequence(
      function(time, note) {
        if (note !== SILENT_NOTE) {
          clap.synth.triggerAttackRelease(clap.duration, time);
        }
      },
      claps,
      '8n'
    );
  }

  makeSnareSequence(snareLane) {
    const snare = instruments.snare;
    const snares = snareLane.notes.map(note => {
      return note.on ? snare.duration : SILENT_NOTE;
    });
    return new Tone.Sequence(
      function(time, note) {
        if (note !== SILENT_NOTE) {
          snare.synth.triggerAttackRelease(snare.duration, time);
        }
      },
      snares,
      '8n'
    );
  }

  dispose() {
    this.kicks.dispose();
    this.claps.dispose();
    this.snares.dispose();
  }

  clear() {
    this.stop();
    this.kicks._events.forEach(event => {
      event.value = SILENT_NOTE;
    });
    this.claps._events.forEach(event => {
      event.value = SILENT_NOTE;
    });
    this.snares._events.forEach(event => {
      event.value = SILENT_NOTE;
    });
  }
}
