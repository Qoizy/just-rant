const adjectives = [
  "Calm",
  "Hidden",
  "Quiet",
  "Angry",
  "Blue",
  "Silent",
  "Misty",
];
const nouns = [
  "River",
  "Cloud",
  "Shadow",
  "Storm",
  "Mountain",
  "Sky",
  "Forest",
];

function generateName() {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(10 + Math.random() * 90);
  return `${adj}${noun}${num}`;
}

module.exports = generateName;
