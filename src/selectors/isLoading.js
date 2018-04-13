import { createSelector } from 'reselect'

export default createSelector(
  [
    state => state.location.type,
    state => state.location.payload,
    state => state.videosHash,
    state => state.videosByCategory,
    state => state.dynamicPagesHash
  ],
  (type, { slug, category }, hash1, hash2, hash3) => {
    if (type === 'VIDEO') return !hash1[slug]
    if (type === 'LIST') {
      console.log(
        'hash2 (will update when new data comes in, causing isLoading to correctly become false)',
        hash2
      )

      return !hash2[category]
    }
    if (type === 'DYNAMIC_PAGE') {
      return false // Should be return !hash3[slug]
    }
    if (type === 'DYNAMIC_PORTAL') {
      return false // Should be return !hash3[slug]
    }
  }
)
