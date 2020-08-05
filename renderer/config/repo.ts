import t from '../locale'

export default (locale: string): Record<string, string> => {
  const message = t(locale)
  return {
    [`${message.spa}(vue + vuex + vue-router)`]: 'ali322/frontend-boilerplate#vue-spa',
    [`${message.micro}(vue + vuex + vue-router)`]: 'ali322/frontend-boilerplate#micro',
    [`${message.spa}(react + redux + react-router)`]: 'ali322/frontend-boilerplate#spa',
    [`${message.spa}(react + mobx + react-router)`]: 'ali322/frontend-boilerplate#mobx-spa',
    [`${message.mpa}(vue + vuex)`]: 'ali322/frontend-boilerplate#vue',
    [`${message.mpa}(react + redux)`]: 'ali322/frontend-boilerplate#master',
    [`${message.spa}(react + mobx)`]: 'ali322/frontend-boilerplate#mobx',

    [`SSR ${message.spa}(koa + react + redux + react-router)`]: 'ali322/ssr-boilerplate#spa',
    [`SSR ${message.spa}(koa + vue + vuex + vue-router)`]: 'ali322/ssr-boilerplate#vue-spa',
    [`SSR ${message.mpa}(react+redux)`]: 'ali322/ssr-boilerplate#master',
    [`SSR ${message.mpa}(vue+vuex)`]: 'ali322/ssr-boilerplate#vue'
  }
}
