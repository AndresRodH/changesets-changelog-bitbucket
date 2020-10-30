import {ChangelogFunctions} from '@changesets/types'
import {config} from 'dotenv'
import {getBitbucketInfo} from './getBitbucketInfo'

config()

export type ChangesetChangelogBitbucketOptions = {
  repo: string
}

const changelogFunctions: ChangelogFunctions = {
  getReleaseLine: async (changeset, _type, options) => {
    if (!options || !options.repo) {
      throw new Error(
        'Please provide a repo to this changelog generator like this:\n"changelog": ["@changesets/changelog-github", { "repo": "org/repo" }]'
      )
    }
    const [firstLine, ...futureLines] = changeset.summary
      .split('\n')
      .map(l => l.trimRight())

    if (changeset.commit) {
      let {links} = await getBitbucketInfo({
        repo: options.repo,
        commit: changeset.commit,
      })
      return `\n\n- ${links.commit}${
        links.pull === null ? '' : ` ${links.pull}`
      }${
        links.user === null ? '' : ` Thanks ${links.user}!`
      } - ${firstLine}\n${futureLines.map(l => `  ${l}`).join('\n')}`
    } else {
      return `\n\n- ${firstLine}\n${futureLines.map(l => `  ${l}`).join('\n')}`
    }
  },
  getDependencyReleaseLine: async (
    changesets,
    dependenciesUpdated,
    options
  ) => {
    if (!options.repo) {
      throw new Error(
        'Please provide a repo to this changelog generator like this:\n"changelog": ["changesets-changelog-bitbucket", { "repo": "workspace/repoSlug" }]'
      )
    }
    if (dependenciesUpdated.length === 0) return ''
    const changesetLink = `- Updated dependencies [${(
      await Promise.all(
        changesets.map(async cs => {
          if (cs.commit) {
            let {links} = await getBitbucketInfo({
              repo: options.repo,
              commit: cs.commit,
            })
            return links.commit
          }
          return null
        })
      )
    )
      .filter(Boolean)
      .join(', ')}]:`

    const updatedDepenenciesList = dependenciesUpdated.map(
      dependency => `  - ${dependency.name}@${dependency.newVersion}`
    )

    return [changesetLink, ...updatedDepenenciesList].join('\n')
  },
}

export default changelogFunctions
