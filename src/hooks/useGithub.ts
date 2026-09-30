  name: 'Ruddrho Mollik',
  bio: 'Mechanical Engineering student interested in robotics, autonomous navigation, SLAM, ROS 2, and intelligent systems.',
  public_repos: 14,
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

    async function load() {
      setLoading(true)
      setError(false)

      // Cache-buster so an older GitHub response is not reused.
      const cacheBuster = Date.now()

      /*
        PROFILE REQUEST
      */
      try {
        const profileResponse = await fetch(
          `https://api.github.com/users/${username}?_=${cacheBuster}`,
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
          setProfile(fallbackProfile)
          setError(true)
        }
      }

      /*
        PUBLIC REPOSITORIES REQUEST

        We request up to 100 public repositories. The full returned
        list is also used to refresh the repository counter, so the
        website is not dependent only on a possibly stale profile count.
      */
      try {
        const reposResponse = await fetch(
          `https://api.github.com/users/${username}/repos?sort=updated&direction=desc&per_page=100&_=${cacheBuster}`,
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

        /*
          Use the number of public repositories actually returned
          by GitHub for the website repository counter.
        */
        setProfile((currentProfile) => ({
          ...currentProfile,
          public_repos: repoData.length,
        }))

        /*
          Keep only non-fork repositories for any future repository cards.
        */
        setRepos(
          repoData
            .filter((repo) => !repo.fork)
            .slice(0, 6)
        )
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
