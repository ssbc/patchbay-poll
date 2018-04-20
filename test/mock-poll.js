const content = {
  type: 'poll',
  version: 'v1',
  title: 'should I host a wellington savings pool meetup?',
  body: 'savings pools involve money, but are really about exploring community dynamics, trust, and dreaming about a better future',
  closesAt: '2050-03-20T03:40:06.222Z',
  details: {
    type: 'chooseOne',
    choices: ['yes', 'no', 'tell me more']
  }
}

module.exports = {
  content,
  msg: {
    key: '%pZUIPe4YcwhfyE/8lab+pjkYkydy7YQ84US9NTZ9iBM=.sha256',
    value: {
      author: '@6ilZq3kN0F+dXFHAPjAwMm87JEb/VdB+LC9eIMW3sa0=.ed25519',
      content
    }
  }
}
