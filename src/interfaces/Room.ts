import DebateUser from './DebateUser'

export default interface Room {
  id: number
  topic: string
  groups: string[]
  description: string
  phase: number
  owner: DebateUser
  users: DebateUser[]
}
