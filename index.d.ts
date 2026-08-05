import abort from 'bare-abort'
import EventEmitter, { EventMap } from 'bare-events'
import os from 'bare-os'
import hrtime from 'bare-hrtime'
import stdio from 'bare-stdio'
import posix from 'bare-posix'

/** Events emitted by `process`. */
interface ProcessEvents extends EventMap {
  /** Emitted when the event loop empties and has no additional work scheduled. */
  beforeExit: [code: number]
  /** Emitted when the process is about to exit, either from `process.exit()` or an empty event loop. */
  exit: [code: number]
  /** Emitted during suspension when no work remains and the event loop is about to block instead of exiting. */
  idle: []
  /** Emitted when the process resumes after suspension. */
  resume: []
  /** Emitted when the process is suspended, so outstanding work can be stopped or deferred. */
  suspend: [linger: number]
  /** Emitted when a JavaScript exception bubbles all the way back to the event loop uncaught. */
  uncaughtException: [err: unknown]
  /** Emitted when a promise is rejected with no rejection handler attached. */
  unhandledRejection: [reason: unknown, promise: Promise<unknown>]

  /** Emitted when the process receives a `SIGBREAK` signal. */
  SIGBREAK: []
  /** Emitted when the process receives a `SIGHUP` signal. */
  SIGHUP: []
  /** Emitted when the process receives a `SIGINT` signal. */
  SIGINT: []
  /** Emitted when the process receives a `SIGPIPE` signal. */
  SIGPIPE: []
  /** Emitted when the process receives a `SIGTERM` signal. */
  SIGTERM: []
  /** Emitted when the process receives a `SIGWINCH` signal. */
  SIGWINCH: []
}

/** Alias for the type of the global `process` object. */
interface Process<M extends ProcessEvents = ProcessEvents> extends EventEmitter<M> {
  readonly stdin: typeof stdio.in
  readonly stdout: typeof stdio.out
  readonly stderr: typeof stdio.err

  readonly arch: ReturnType<typeof os.arch>
  readonly argv: string[]
  readonly env: Record<string, string>
  readonly execArgv: string[]
  readonly execPath: string
  readonly hrtime: typeof hrtime
  readonly pid: number
  readonly platform: ReturnType<typeof os.platform>
  readonly ppid: number
  readonly version: string
  readonly versions: Record<string, string>

  exitCode: number
  title: string

  /** Emitted when the process is about to exit, either from `process.exit()` or an empty event loop. */
  exit(code?: number): never

  /** Emitted when the process is suspended, so outstanding work can be stopped or deferred. */
  suspend(): void
  /** Emitted when the process resumes after suspension. */
  resume(): void

  cwd(): string
  chdir(dir: string): string

  kill(pid: number, signal?: string | number): void

  uptime(): number

  abort: typeof abort
  cpuUsage: typeof os.cpuUsage
  threadCpuUsage: typeof os.threadCpuUsage
  resourceUsage: typeof os.resourceUsage
  availableMemory: typeof os.availableMemory
  constrainedMemory: typeof os.constrainedMemory
  memoryUsage: typeof os.memoryUsage
  getgid: typeof posix.getgid
  setgid: typeof posix.setgid
  getegid: typeof posix.getegid
  setegid: typeof posix.setegid
  getuid: typeof posix.getuid
  setuid: typeof posix.setuid
  geteuid: typeof posix.geteuid
  seteuid: typeof posix.seteuid
  getgroups: typeof posix.getgroups

  nextTick<T extends unknown[]>(cb: (...args: T) => unknown, ...args: T): void
}

/** The global `process` object, providing information about and control over the current Bare process. */
declare let process: Process

declare namespace process {
  export { type ProcessEvents }
}

export = process
