import DebateUser from './DebateUser'

export default interface Room {
  id: number
  topic: string
  time: number
  groups: string[]
  description: string
  isOngoing: boolean
  owner: DebateUser
  users: DebateUser[]
}
