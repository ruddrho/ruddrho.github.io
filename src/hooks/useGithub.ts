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

const fallbackProfile: GithubProfile = {
  avatar_url: 'https://github.com/ruddrho.png',
  html_url: 'https://github.com/ruddrho',
  name: 'Ruddrho Mollik',
  bio: 'Mechanical Engineering student interested in robotics, autonomous navigation, SLAM, ROS 2, and intelligent systems.',
  public_repos: 16,
  followers: 0,
  following: 0,
}

export function useGithub(username: string) {
  const [profile, setProfile] =
    useState<GithubProfile>(fallbackProfile)

  const [repos, setRepos] =
    useState<GithubRepo[]>([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState(false)

  useEffect(() => {
    const controller = new AbortController()

    async function loadGithubData() {
      try {
        setError(false)

        /*
          LIVE GITHUB PROFILE

          Date.now() creates a unique request URL.
          cache: 'no-store' prevents the browser from
          reusing an old GitHub API response.
        */
        const profileResponse = await fetch(
          `https://api.github.com/users/${username}?_=${Date.now()}`,
          {
            signal: controller.signal,
            cache: 'no-store',
            headers: {
              Accept: 'application/vnd.github+json',
            },
          }
        )

        if (!profileResponse.ok) {
          throw new Error(
            `GitHub profile request failed: ${profileResponse.status}`
          )
        }

        const profileData =
          (await profileResponse.json()) as GithubProfile

        setProfile(profileData)
      } catch (e) {
        if ((e as Error).name !== 'AbortError') {
          /*
            If GitHub API cannot be reached,
            keep the portfolio section visible
            using the fallback profile.
          */
          setProfile(fallbackProfile)
          setError(true)
        }
      }

      try {
        /*
          LIVE PUBLIC REPOSITORIES
        */
        const reposResponse = await fetch(
          `https://api.github.com/users/${username}/repos?sort=updated&direction=desc&per_page=100&_=${Date.now()}`,
          {
            signal: controller.signal,
            cache: 'no-store',
            headers: {
              Accept: 'application/vnd.github+json',
            },
          }
        )

        if (reposResponse.ok) {
          const repoData =
            (await reposResponse.json()) as GithubRepo[]

          setRepos(
            repoData
              .filter((repo) => !repo.fork)
              .slice(0, 6)
          )
        }
      } catch (e) {
        if ((e as Error).name !== 'AbortError') {
          setRepos([])
        }
      } finally {
        setLoading(false)
      }
    }

    /*
      Load immediately when the portfolio opens.
    */
    loadGithubData()

    /*
      Refresh GitHub information automatically
      every 60 seconds while the page is open.
    */
    const refreshInterval = window.setInterval(() => {
      loadGithubData()
    }, 60000)

    return () => {
      controller.abort()
      window.clearInterval(refreshInterval)
    }
  }, [username])

  return {
    profile,
    repos,
    loading,
    error,
  }
}
