import DebateUser from './DebateUser'

export default interface Room {
  id: number
  topic: string
  time: number
  groups: string[]
  description: string
  phase: number
  owner: DebateUser
  users: DebateUser[]
}
