export type ProfileVisibility = 'public' | 'private' | 'org'

export type Profile = {
  userId: string
  name: string
  headline?: string
  bio?: string
  skills: string[]
  interests: string[]
  goals: string[]
  location?: string
  availability?: string
  visibility: ProfileVisibility
  updatedAt: string
}
