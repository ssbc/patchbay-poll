
  const publishPoll = (api) => {
    const closesAt = new Date()
    closesAt.setDate(closesAt.getDate() + 7)

    const opts = {
      type: 'poll',
      version: 'v1',
      title: 'should I host a wellington savings pool meetup?',
      body: 'savings pools involve money, but are really about exploring community dynamics, trust, and dreaming about a better future',
      closesAt: '2018-03-20T03:40:06.222Z',
      details: {
        type: 'chooseOne',
        choices: ['yes', 'no', 'tell me more']
      }
    }
    ScuttlePoll(server).poll.async.chooseOne(opts, console.log)
  }
