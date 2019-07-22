const Mailchimp = require('mailchimp-api-v3')
const asyncPool = require('tiny-async-pool')
const progress = require('cli-progress')
const args = process.argv.slice(2)
const apiKey = args[0]
const listId = args[1]
const mailchimp = new Mailchimp(apiKey)
const count = 1000
const connectionLimit = 10
let archiveCount = 0

const archiveMember = (options) => {
  return mailchimp.delete(`/lists/${options.listId}/members/${options.memberId}`).then(() => {
    archiveCount++
    options.bar.update(archiveCount)
  }).catch((e) => {
    if (e.code !== 'ETIMEDOUT') {
      console.error(e)
    }
  })
}

const purgeContacts = async (listId) => {
  try {
    const bar = new progress.Bar()
    let inputArray = []
    let response = await mailchimp.get(`/lists/${listId}/members`, {fields: 'total_items,members.id,members.status', count: count, status: 'unsubscribed'})
    bar.start(response.total_items, 0)

    while (response.total_items > 0) {
      for (const member of response.members) {
        if (member.status === 'unsubscribed') {
          inputArray.push({memberId: member.id, listId: listId, bar: bar})
        }
      }
      await asyncPool(connectionLimit, inputArray, archiveMember)
      
      inputArray = []
      response = await mailchimp.get(`/lists/${listId}/members`, {fields: 'total_items,members.id,members.status', count: count, status: 'unsubscribed'})
    }

    bar.stop()
  } catch (e) {
    console.error(e)
  }

  console.log(`Archived ${archiveCount} members`)
}

purgeContacts(listId)