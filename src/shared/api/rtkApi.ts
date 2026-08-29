import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'

export const rtkApi = createApi({
  reducerPath: 'api',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Board'],
  endpoints: () => ({}),
})
