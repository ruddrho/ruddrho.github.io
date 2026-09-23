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

/*
  Fallback profile

  This keeps the GitHub section visible even when:
  - GitHub API is temporarily unavailable
  - API rate limit is reached
  - Browser/network blocks the request

  When the API works, these values are automatically
  replaced with live GitHub data.
*/
const fallbackProfile: GithubProfile = {
  avatar_url: 'https://github.com/ruddrho.png',
  html_url: 'https://github.com/ruddrho',
  name: 'Ruddrho Mollik',
  bio: 'Mechanical Engineering student interested in robotics, autonomous navigation, SLAM, ROS 2, and intelligent systems.',
  public_repos: 13,
  followers: 0,
  following: 0,
}

export function useGithub(username: string) {
  /*
    Start with fallback profile instead of null.
    Therefore the GitHub profile card always renders.
  */
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

    async function load() {
      setLoading(true)
      setError(false)

      /*
        PROFILE REQUEST

        This is independent from the repositories request.
        A repo API failure will NOT hide the profile anymore.
      */
      try {
        const profileResponse = await fetch(
          `https://api.github.com/users/${username}`,
          {
            signal: controller.signal,
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
            Keep fallback profile visible.
          */
          setProfile(fallbackProfile)
          setError(true)
        }
      }

      /*
        REPOSITORIES REQUEST

        Repositories are no longer displayed in section 06,
        but we keep this available for future use.
      */
      try {
        const reposResponse = await fetch(
          `https://api.github.com/users/${username}/repos?sort=updated&direction=desc&per_page=30`,
          {
            signal: controller.signal,
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
        /*
          Repository request failure does not affect
          the GitHub profile section.
        */
        if ((e as Error).name !== 'AbortError') {
          setRepos([])
        }
      } finally {
        setLoading(false)
      }
    }

    load()

    return () => {
      controller.abort()
    }
  }, [username])

  return {
    profile,
    repos,
    loading,
    error,
  }
}
