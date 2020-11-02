import fetch from 'node-fetch'

type RequestParams = {
  repo: string
  commit: string
}

const BITBUCKET_API_URL = 'https://api.bitbucket.org/2.0'

export async function getInfo(
  request: RequestParams
): Promise<{
  pull: number
  user: string | null
  links: {
    commit: string
    pull: string | null
    user: string | null
  }
}> {
  if (!request.commit) {
    throw new Error('Please pass a commit SHA to getInfo')
  }

  if (!request.repo) {
    throw new Error(
      'Please pass a Bitbucket repository in the form of workspace/repoSlug to getInfo'
    )
  }

  if (!process.env.BITBUCKET_USERNAME || !process.env.BITBUCKET_PASSWORD) {
    let message = 'Missing environment variables:'
    if (!process.env.BITBUCKET_USERNAME) {
      message += '\n  - BITBUCKET_USERNAME environment variable is missing'
    }
    if (!process.env.BITBUCKET_PASSWORD) {
      message += '\n  - BITBUCKET_PASSWORD environment variable is missing'
    }
    throw new Error(message)
  }

  const commitApiUrl = `${BITBUCKET_API_URL}/${request.repo}/commit/${request.commit}`
  const token = `${Buffer.from(
    `${process.env.BITBUCKET_USERNAME}:${process.env.BITBUCKET_PASSWORD}`
  ).toString('base64')}`
  const headers = {
    Authorization: `Basic ${token}`,
  }

  // https://developer.atlassian.com/bitbucket/api/2/reference/resource/repositories/%7Bworkspace%7D/%7Brepo_slug%7D/commit/%7Bnode%7D
  const commitData = await fetch(commitApiUrl, {headers}).then((x: any) =>
    x.json()
  )

  const {links: commitLinks, author} = commitData

  // https://developer.atlassian.com/bitbucket/api/2/reference/resource/repositories/%7Bworkspace%7D/%7Brepo_slug%7D/commit/%7Bcommit%7D/pullrequests
  const {values} = await fetch(`${commitApiUrl}/pullrequests`, {
    headers,
  }).then((x: any) => x.json())
  const [pullRequestData] = values

  return {
    pull: pullRequestData ? pullRequestData.id : null,
    user: author ? author.display_name : null,
    links: {
      commit: `[\`${request.commit}\`](${commitLinks.html.href})`,
      pull: pullRequestData
        ? `[#${pullRequestData.id}](${pullRequestData.links.html.href})`
        : null,
      user: author
        ? `[@${author.display_name}](${author.links.html.href})`
        : null,
    },
  }
}
