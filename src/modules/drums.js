import { kick, clap, cymbal } from './synth.js';
import Tone from 'tone';

const ROW_CYMBAL = 0;
const ROW_CLAP = 1;
const ROW_KICK = 2;
const SILENT_NOTE = 0;

const instruments = [cymbal, clap, kick];

class AudioNode {
  constructor(row, col, note, duration) {
    this.row = row;
    this.col = col;
    this.note = note;
    this.duration = duration;
    this.on = false;
  }
}

export class Drums {
  constructor(width) {
    this.height = 3;
    this.width = width;
    this.grid = this.makeGrid(this.width);
    this.kicks = this.makeKickSequence();
    this.claps = this.makeClapSequence();
    this.cymbals = this.makeCymbalSequence();
  }

  makeGrid(width) {
    const grid = [];
    for (let i = 0; i < width; i++) {
      const column = [];
      for (let j = 0; j < this.height; j++) {
        const { note, duration } = instruments[j];
        const node = new AudioNode(j, i, note, duration);
        column.push(node);
      }
      grid.push(column);
    }
    return grid;
  }

  startSequences() {
    this.kicks.start();
    this.claps.start();
    this.cymbals.start();
  }

  stopSequences() {
    this.kicks.stop();
    this.claps.stop();
    this.cymbals.stop();
  }

  getCell(col, row) {
    return this.grid[col][row];
  }

  playCell(col, row) {
    const cell = this.getCell(col, row);
    const { synth } = instruments[row];

    if (cell.note) {
      synth.triggerAttackRelease(cell.note, cell.duration);
    } else {
      synth.triggerAttackRelease(cell.duration);
    }
  }

  toggleCell(col, row) {
    const cell = this.getCell(col, row);
    cell.on = !cell.on;

    if (cell.on) {
      this.playCell(col, row);
    }

    this.toggleCellWithinSequence(col, row);
  }

  toggleCellWithinSequence(col, row) {
    if (row == ROW_KICK) {
      this.kicks._events[col].value =
        this.kicks._events[col].value === SILENT_NOTE ? kick.note : SILENT_NOTE;
    } else if (row == ROW_CLAP) {
      this.claps._events[col].value =
        this.claps._events[col].value === SILENT_NOTE
          ? clap.duration
          : SILENT_NOTE;
    } else if (row == ROW_CYMBAL) {
      this.cymbals._events[col].value =
        this.cymbals._events[col].value === SILENT_NOTE
          ? cymbal.duration
          : SILENT_NOTE;
    }
  }

  makeKickSequence() {
    const kicks = this.grid.map(column => {
      const node = column[ROW_KICK];
      return node.on ? node.note : SILENT_NOTE;
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

  makeClapSequence() {
    const claps = this.grid.map(column => {
      const node = column[ROW_CLAP];
      return node.on ? node.duration : SILENT_NOTE;
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

  makeCymbalSequence() {
    let cymbals = this.grid.map(column => {
      const node = column[ROW_CYMBAL];
      return node.on ? node.duration : SILENT_NOTE;
    });
    return new Tone.Sequence(
      function(time, note) {
        if (note !== SILENT_NOTE) {
          cymbal.synth.triggerAttackRelease(cymbal.duration);
        }
      },
      cymbals,
      '8n'
    );
  }

  disposeSequenceAndMakeNewSequences() {
    this.kicks.dispose();
    this.claps.dispose();
    this.cymbals.dispose();
    this.kicks = this.makeKickSequence();
    this.claps = this.makeClapSequence();
    this.cymbals = this.makeCymbalSequence();
  }

  clear(width) {
    this.grid = this.makeGrid(width);
    this.disposeSequenceAndMakeNewSequences();
    this.stopSequences();
  }
}
