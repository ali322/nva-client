import zhCN from './zh_cn'
import enUS from './en_us'

export default (locale: string): Record<string, string> => {
  switch (locale) {
    case 'cn':
      return zhCN
    default:
      return enUS
  }
}
