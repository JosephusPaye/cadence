import { kick, clap, cymbal } from './synth.js';
import Tone from 'tone';

const ROW_CYMBAL = 0;
const ROW_CLAP = 1;
const ROW_KICK = 2;
const SILENT_NOTE = 0;

class AudioNode {
  constructor(row, col, pitch) {
    this.row = row;
    this.col = col;
    this.pitch = pitch;
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
        const sound = j === ROW_KICK ? 'D1' : '16n';
        const node = new AudioNode(j, i, sound);
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
    const sound = row == ROW_KICK ? kick : row == ROW_CLAP ? clap : cymbal;

    if (sound === kick) {
      sound.triggerAttackRelease(cell.pitch, '16n');
    } else {
      sound.triggerAttackRelease('16n');
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
        this.kicks._events[col].value === SILENT_NOTE ? 'D1' : SILENT_NOTE;
    } else if (row == ROW_CLAP) {
      this.claps._events[col].value =
        this.claps._events[col].value === SILENT_NOTE ? '16n' : SILENT_NOTE;
    } else if (row == ROW_CYMBAL) {
      this.cymbals._events[col].value =
        this.cymbals._events[col].value === SILENT_NOTE ? '16n' : SILENT_NOTE;
    }
  }

  makeKickSequence() {
    const kicks = this.grid.map(column => {
      const node = column[ROW_KICK];
      return node.on ? node.pitch : SILENT_NOTE;
    });
    return new Tone.Sequence(
      function(time, note) {
        if (note !== SILENT_NOTE) {
          kick.triggerAttackRelease(note, '16n');
        }
      },
      kicks,
      '8n'
    );
  }

  makeClapSequence() {
    const claps = this.grid.map(column => {
      const node = column[ROW_CLAP];
      return node.on ? node.pitch : SILENT_NOTE;
    });
    return new Tone.Sequence(
      function(time, note) {
        if (note !== SILENT_NOTE) {
          clap.triggerAttackRelease('16n');
        }
      },
      claps,
      '8n'
    );
  }

  makeCymbalSequence() {
    let cymbals = this.grid.map(column => {
      const node = column[ROW_CYMBAL];
      return node.on ? node.pitch : SILENT_NOTE;
    });
    return new Tone.Sequence(
      function(time, note) {
        if (note !== SILENT_NOTE) {
          cymbal.triggerAttackRelease('16n');
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
