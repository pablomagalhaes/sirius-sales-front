export type BackendPegeableResponse<T> = {
    content: T[]
    empty: boolean
    first: boolean
    last: boolean
    number: number
    numberOfElements: number
    pageable: pageable
    size: number
    sort: sort
    totalElements: number
    totalPages: number
  }
  
  type pageable = {
    offset: number
    pageNumber: number
    pageSize: number
    paged: true
    sort: {
      sorted: boolean
      unsorted: boolean
      empty: boolean
    }
    unpaged: boolean
  }
  
  type sort = {
    sorted: boolean
    unsorted: boolean
    empty: boolean
  }
  