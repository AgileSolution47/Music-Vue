const generateSubtitle = ({ type, numSongs, artist }) => {
  if (numSongs === undefined && artist === undefined) {
    return type;
  }

  if (numSongs !== undefined) {
    return `${type} · ${numSongs} ${numSongs === 1 ? 'song' : 'songs'}`;
  }

  return `${type} · ${artist}`;
};

export default generateSubtitle;
