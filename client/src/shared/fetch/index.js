const fetchAction = (url, params) => ({
  type: 'FETCH',
  url,
  params
})

export default fetchAction