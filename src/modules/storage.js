import { Beat } from './beat';

const storageKeys = {
  lastOpenBeat: 'cadence:last-open-beat',
  savedBeats: 'cadence:saved-beats',
};

export function getLastOpenBeat(fallback) {
  const lastOpenBeatData = localStorage.getItem(storageKeys.lastOpenBeat);
  return lastOpenBeatData ? new Beat(JSON.parse(lastOpenBeatData)) : fallback;
}

export function setLastOpenBeat(beat) {
  localStorage.setItem(
    storageKeys.lastOpenBeat,
    JSON.stringify(beat.getData())
  );
}

export function getSavedBeatTitles() {
  const savedBeats = localStorage.getItem(storageKeys.savedBeats);
  return savedBeats ? Object.keys(JSON.parse(savedBeats)) : [];
}

export function loadBeat(title, fallback = null) {
  const savedBeats = localStorage.getItem(storageKeys.savedBeats);
  const beatData = savedBeats ? JSON.parse(savedBeats)[title] : undefined;
  return beatData ? new Beat(beatData) : fallback;
}

export function saveBeat(beat) {
  const savedBeats = localStorage.getItem(storageKeys.savedBeats);
  const updatedBeats = Object.assign(
    {},
    savedBeats ? JSON.parse(savedBeats) : {},
    {
      [beat.title]: beat.getData(),
    }
  );
  localStorage.setItem(storageKeys.savedBeats, JSON.stringify(updatedBeats));
}
