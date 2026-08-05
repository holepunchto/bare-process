import process from '.'

/** Alias for the type of the global `process` object. */
type Process = typeof process

declare global {
  /** The global `process` object, providing information about and control over the current Bare process. */
  const process: Process
}
