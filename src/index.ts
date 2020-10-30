import {ChangelogFunctions} from '@changesets/types'
import {config} from 'dotenv'

config()

const changelogFunctions: ChangelogFunctions = {
  getReleaseLine: async (changeset, _type) => {
    const [firstLine, ...futureLines] = changeset.summary
      .split('\n')
      .map(l => l.trimRight())

    let returnVal = `- ${
      changeset.commit ? `${changeset.commit}: ` : ''
    }${firstLine}`

    if (futureLines.length > 0) {
      returnVal += `\n${futureLines.map(l => `  ${l}`).join('\n')}`
    }

    return returnVal
  },
  getDependencyReleaseLine: async (changesets, dependenciesUpdated) => {
    if (dependenciesUpdated.length === 0) return ''

    const changesetLinks = changesets.map(
      changeset => `- Updated dependencies [${changeset.commit}]`
    )

    const updatedDepenenciesList = dependenciesUpdated.map(
      dependency => `  - ${dependency.name}@${dependency.newVersion}`
    )

    return [...changesetLinks, ...updatedDepenenciesList].join('\n')
  },
}

export default changelogFunctions
