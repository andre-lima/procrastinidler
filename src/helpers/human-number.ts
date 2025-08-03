import humanFormat from 'human-format';

const numberScale = new humanFormat.Scale({
  '': 1,
  k: 1_000,
  M: 1_000_000,
  B: 1_000_000_000,
  T: 1_000_000_000_000,
  q: 1_000_000_000_000_000,
  Q: 1_000_000_000_000_000_000,
  s: 1_000_000_000_000_000_000_000,
  S: 1_000_000_000_000_000_000_000_000,
});

const timeScale = new humanFormat.Scale({
  seconds: 1,
  minutes: 60,
  hours: 3600,
  days: 86400,
  months: 2592000,
});

export const humanNumber = (time: number, maxDecimals: number = 2) => {
  return humanFormat(time, { scale: numberScale, separator: '', maxDecimals });
};

export const humanTime = (time: number) => {
  return humanFormat.raw(time, { scale: timeScale, maxDecimals: 2 });
};
