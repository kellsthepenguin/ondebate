import DebateUser from './DebateUser'

export default interface Room {
  topic: string
  time: number
  groups: string[]
  users: DebateUser[]
}
