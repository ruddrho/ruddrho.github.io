import { useEffect, useState } from 'react'

export type GithubProfile = {
  avatar_url: string
  html_url: string
  name: string | null
  bio: string | null
  public_repos: number
  followers: number
  following: number
}

export type GithubRepo = {
  id: number
  name: string
  html_url: string
  description: string | null
  language: string | null
  stargazers_count: number
  fork: boolean
  updated_at: string
}

export function useGithub(username: string) {
  const [profile, setProfile] = useState<GithubProfile | null>(null)
  const [repos, setRepos] = useState<GithubRepo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    async function load() {
      try {
        const [p, r] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`, { signal: controller.signal }),
          fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=8`, { signal: controller.signal }),
        ])
        if (!p.ok || !r.ok) throw new Error('GitHub API request failed')
        const profileData = await p.json() as GithubProfile
        const repoData = await r.json() as GithubRepo[]
        setProfile(profileData)
        setRepos(repoData.filter(repo => !repo.fork).slice(0, 6))
      } catch (e) {
        if ((e as Error).name !== 'AbortError') setError(true)
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => controller.abort()
  }, [username])

  return { profile, repos, loading, error }
}
