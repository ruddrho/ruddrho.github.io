  following: 0,
}

export function useGithub(username: string) {
  const [profile, setProfile] = useState<GithubProfile>(fallbackProfile)
  const [repos, setRepos] = useState<GithubRepo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      setLoading(true)
      setError(false)

      try {
        const profileResponse = await fetch(
          `https://api.github.com/users/${username}?t=${Date.now()}`,
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

        setProfile({
          ...profileData,
          public_repos: Math.max(
            profileData.public_repos,
            CURRENT_PUBLIC_REPOS
          ),
        })
      } catch (e) {
        if ((e as Error).name !== 'AbortError') {
          setProfile(fallbackProfile)
          setError(true)
        }
      }

      try {
        const reposResponse = await fetch(
          `https://api.github.com/users/${username}/repos?sort=updated&direction=desc&per_page=100&t=${Date.now()}`,
          {
            signal: controller.signal,
            cache: 'no-store',
            headers: {
              Accept: 'application/vnd.github+json',
            },
          }
        )

        if (!reposResponse.ok) {
          throw new Error(
            `GitHub repositories request failed: ${reposResponse.status}`
          )
        }

        const repoData =
          (await reposResponse.json()) as GithubRepo[]

        setRepos(
          repoData
            .filter((repo) => !repo.fork)
            .slice(0, 6)
        )

        setProfile((currentProfile) => ({
          ...currentProfile,
          public_repos: Math.max(
            currentProfile.public_repos,
            repoData.length,
            CURRENT_PUBLIC_REPOS
          ),
        }))
      } catch (e) {
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
