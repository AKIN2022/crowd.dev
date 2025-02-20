export default () => {
  return {
    filters: {
      period: 7,
      platform: 'all'
    },
    conversations: {
      loading: false,
      trending: [],
      total: 0
    },
    activities: {
      loading: false,
      recent: [],
      total: 0
    },
    members: {
      loadingActive: false,
      loadingRecent: false,
      active: [],
      recent: [],
      total: 0
    },
    organizations: {
      loadingActive: false,
      loadingRecent: false,
      active: [],
      recent: [],
      total: 0
    }
  }
}
