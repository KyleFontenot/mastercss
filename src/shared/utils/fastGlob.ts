import fg from 'fast-glob';

// Find first file matching the pattern
export function explorePathSync(pattern) {
  const paths = fg.sync(pattern);
  return paths[0];
}

// Find all files matching the pattern
export function explorePathsSync(pattern) {
  return fg.sync(pattern);
}