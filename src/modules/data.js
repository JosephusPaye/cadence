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

export function makeLanes({ patterns, instruments }) {
  return Object.keys(patterns)
    .map(laneKey => {
      return {
        name: laneKey,
        prettyName: camelToSnakeCase(laneKey, ' '),
        order: allInstruments.indexOf(laneKey),
        enabled: instruments.includes(laneKey),
        notes: patterns[laneKey].map((noteValue, offset) => {
          return {
            lane: laneKey,
            offset,
            on: Boolean(noteValue),
          };
        }),
      };
    })
    .sort((laneA, laneB) => laneA.order - laneB.order);
}

export const defaultBeat = {
  patterns: {
    ride: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    openHat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    closedHat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    rim: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    clap: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    snare: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    tom: [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    kick: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
  },
  instruments: ['ride', 'openHat', 'closedHat', 'clap', 'snare', 'tom', 'kick'],
};
