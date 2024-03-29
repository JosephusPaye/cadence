import { camelToSnakeCase } from './util';

const allInstruments = [
  'ride',
  'openHat',
  'closedHat',
  'rim',
  'clap',
  'snare',
  'tom',
  'kick',
];

export class Note {
  constructor(lane, offset, on) {
    this.lane = lane;
    this.offset = offset;
    this.on = on;
  }

  toggle() {
    this.on = !this.on;
  }
}

export class Lane {
  constructor(name, notes, enabled) {
    this.name = name;
    this.notes = notes;
    this.enabled = enabled;
    this.prettyName = camelToSnakeCase(name, ' ');
    this.order = allInstruments.indexOf(name);
  }

  toggle() {
    this.enabled = !this.enabled;
  }

  isClear() {
    return this.notes.every(note => note.on === false);
  }

  clear() {
    for (const note of this.notes) {
      note.on = false;
    }
  }
}

export class Beat {
  constructor(data) {
    this.title = data.title;
    this.tempo = data.tempo;
    this.samplePack = data.samplePack;
    this.instruments = data.instruments;
    this.lanes = patternsToLanes(data.patterns, data.instruments);
  }

  clear() {
    for (const lane of this.lanes) {
      lane.clear();
    }
  }

  clone() {
    return new Beat(JSON.parse(JSON.stringify(this.getData())));
  }

  getData() {
    const enabledLanes = this.lanes
      .filter(lane => lane.enabled)
      .map(lane => lane.name);

    return {
      title: this.title,
      tempo: this.tempo,
      samplePack: this.samplePack,
      instruments: this.instruments.filter(instrument =>
        enabledLanes.includes(instrument)
      ),
      patterns: lanesToPatterns(this.lanes),
    };
  }

  getUrl() {
    const hash = this.toBase64();
    return {
      hash,
      href: location.origin + '/#' + hash,
    };
  }

  toBase64() {
    const json = JSON.stringify(this.getData());
    return btoa(json);
  }

  static fromBase64(string) {
    const data = JSON.parse(atob(string));
    return new Beat(data);
  }
}

export const defaultBeat = new Beat({
  title: 'Untitled beat',
  tempo: 120,
  samplePack: 'default',
  patterns: {
    ride: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    snare: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    tom: [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    kick: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
  },
  instruments: ['ride', 'openHat', 'closedHat', 'clap', 'snare', 'tom', 'kick'],
});

export function beatFromUrl(fallback) {
  if (location.hash) {
    try {
      return new Beat(JSON.parse(atob(location.hash.slice(1))));
    } catch {
      // Let it fallback to default beat below
    }
  }
  return fallback;
}

function blankPatterns() {
  const patterns = {};
  for (const instrument of allInstruments) {
    patterns[instrument] = new Array(16).fill(0);
  }
  return patterns;
}

function patternsToLanes(patterns, instruments) {
  const allPatterns = Object.assign(blankPatterns(), patterns);
  return Object.keys(allPatterns)
    .map(laneKey => {
      const notes = allPatterns[laneKey].map(
        (noteValue, offset) => new Note(laneKey, offset, Boolean(noteValue))
      );
      const enabled = instruments.includes(laneKey);
      return new Lane(laneKey, notes, enabled);
    })
    .sort((laneA, laneB) => laneA.order - laneB.order);
}

function lanesToPatterns(lanes) {
  const patterns = {};
  const nonBlankLanes = lanes.filter(lane => !lane.isClear());
  for (const lane of nonBlankLanes) {
    patterns[lane.name] = lane.notes.map(note => Number(note.on));
  }
  return patterns;
}
