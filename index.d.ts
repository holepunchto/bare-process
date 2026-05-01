import abort from 'bare-abort'
import EventEmitter, { EventMap } from 'bare-events'
import os from 'bare-os'
import hrtime from 'bare-hrtime'
import stdio from 'bare-stdio'
import posix from 'bare-posix'

interface ProcessEvents extends EventMap {
  beforeExit: [code: number]
  exit: [code: number]
  idle: []
  resume: []
  suspend: [linger: number]
  uncaughtException: [err: unknown]
  unhandledRejection: [reason: unknown, promise: Promise<unknown>]

  SIGBREAK: []
  SIGHUP: []
  SIGINT: []
  SIGPIPE: []
  SIGTERM: []
  SIGWINCH: []
}

interface Process<M extends ProcessEvents = ProcessEvents> extends EventEmitter<M> {
  readonly stdin: typeof stdio.in
  readonly stdout: typeof stdio.out
  readonly stderr: typeof stdio.err

  readonly arch: ReturnType<typeof os.arch>
  readonly argv: string[]
  readonly env: Record<string, string>
  readonly execPath: string
  readonly hrtime: typeof hrtime
  readonly pid: number
  readonly platform: ReturnType<typeof os.platform>
  readonly ppid: number
  readonly version: string
  readonly versions: Record<string, string>

  exitCode: number
  title: string

  exit(code?: number): never

  suspend(): void
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

declare let process: Process

declare namespace process {
  export { type ProcessEvents }
}

export = process
