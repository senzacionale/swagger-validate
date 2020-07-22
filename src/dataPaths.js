function pathMatchesPattern(dataPath, pattern) {
  // TODO: properly support JSONPath

  // exact match
  if (dataPath === pattern) return true;

  // [*] — any array item
  // HACK: this will only work for the first `[*]` in the pattern!!!
  if (pattern.match(/\[\*\]/)) {
    return dataPath.replace(/\[\d+\]/, '[*]') === pattern;
  }

  throw new Error('Unsupported pattern, sorry')
}

module.exports = {
  pathMatchesPattern: pathMatchesPattern
}
