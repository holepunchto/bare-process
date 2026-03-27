import abort from 'bare-abort'
import EventEmitter, { EventMap } from 'bare-events'
import {
  arch,
  availableMemory,
  constrainedMemory,
  cpuUsage,
  memoryUsage,
  platform,
  resourceUsage,
  threadCpuUsage
} from 'bare-os'
import tty from 'bare-tty'
import fs from 'bare-fs'
import hrtime from 'bare-hrtime'

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
  readonly stdin: tty.ReadStream | fs.ReadStream
  readonly stdout: tty.WriteStream | fs.WriteStream
  readonly stderr: tty.WriteStream | fs.WriteStream

  readonly arch: ReturnType<typeof arch>
  readonly argv: string[]
  readonly env: Record<string, string>
  readonly execPath: string
  readonly hrtime: typeof hrtime
  readonly pid: number
  readonly platform: ReturnType<typeof platform>
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
  cpuUsage: typeof cpuUsage
  threadCpuUsage: typeof threadCpuUsage
  resourceUsage: typeof resourceUsage
  availableMemory: typeof availableMemory
  constrainedMemory: typeof constrainedMemory
  memoryUsage: typeof memoryUsage

  nextTick<T extends unknown[]>(cb: (...args: T) => unknown, ...args: T): void
}

declare let process: Process

declare namespace process {
  export { type ProcessEvents }
}

export = process
