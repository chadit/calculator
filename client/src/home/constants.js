/*
  When a page is routed to we'll probably have some state that needs to updated through a fetch request.
  This is an example of how we can handle the initial async request and updating the page to reflect a success or error
*/

export const LOADING = 'HOME::LOADING'
export const LOADING_SUCCESS = 'HOME::LOADING::SUCCESS'
export const LOADING_ERROR = 'HOME::LOADING::ERROR'
