import t from '../locale'

export default (locale: string): Record<string, string> => {
  const message = t(locale)
  let prefix = 'ali322'
  return {
    [`${message.spa}(vue + vuex + vue-router)`]: `${prefix}/frontend-boilerplate#vue-spa`,
    [`${message.micro}(vue + vuex + vue-router)`]: `${prefix}/frontend-boilerplate#micro`,
    [`${message.spa}(react + redux + react-router)`]: `${prefix}/frontend-boilerplate#spa`,
    [`${message.spa}(react + mobx + react-router)`]: `${prefix}/frontend-boilerplate#mobx-spa`,
    [`${message.mpa}(vue + vuex)`]: `${prefix}/frontend-boilerplate#vue`,
    [`${message.mpa}(react + redux)`]: `${prefix}/frontend-boilerplate#master`,
    [`${message.spa}(react + mobx)`]: `${prefix}/frontend-boilerplate#mobx`,

    [`SSR ${message.spa}(koa + react + redux + react-router)`]: `${prefix}/ssr-boilerplate#spa`,
    [`SSR ${message.spa}(koa + vue + vuex + vue-router)`]: `${prefix}/ssr-boilerplate#vue-spa`,
    [`SSR ${message.mpa}(react+redux)`]: `${prefix}/ssr-boilerplate#master`,
    [`SSR ${message.mpa}(vue+vuex)`]: `${prefix}/ssr-boilerplate#vue`
  }
}
