export function makeLanes({ patterns, laneOrder }) {
  return Object.keys(patterns)
    .map(laneKey => {
      return {
        name: laneKey,
        order: laneOrder.indexOf(laneKey),
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
  laneOrder: [
    'ride',
    'openHat',
    'closedHat',
    'rim',
    'clap',
    'snare',
    'tom',
    'kick',
  ],
};

export const blankBeat = {
  patterns: {
    clap: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    snare: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    kick: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  laneOrder: ['clap', 'snare', 'kick'],
};
