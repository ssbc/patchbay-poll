module.exports = [
  buildContentForYear(2016),
  buildContentForYear(2017),
  buildContentForYear(2020),
  buildContentForYear(2057)
]

function buildContentForYear (year) {
  return {
    type: 'poll',
    version: 'v1',
    title: `should I host a wellington savings pool meetup? (${year})`,
    body: 'savings pools involve money, but are really about exploring community dynamics, trust, and dreaming about a better future',
    closesAt: `${year}-03-20T03:40:06.222Z`,
    details: {
      type: 'chooseOne',
      choices: ['yes', 'no', 'tell me more']
    }
  }
}

// function buildPollDoc (content) {
//   return {
//     content,
//     msg: {
//       key: '%pZUIPe4YcwhfyE/8lab+pjkYkydy7YQ84US9NTZ9iBM=.sha256',
//       value: {
//         author: '@6ilZq3kN0F+dXFHAPjAwMm87JEb/VdB+LC9eIMW3sa0=.ed25519',
//         content
//       }
//     }
//   }
// }
