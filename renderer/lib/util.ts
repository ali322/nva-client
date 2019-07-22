import { format, differenceInHours, distanceInWords } from 'date-fns'
import zhCN from 'date-fns/locale/zh_cn'

export const date = (val: string, pattern: string = 'YYYY-MM-DD HH:mm:SS'): string => {
  const pass = new Date(val)
  const now = new Date()
  if (differenceInHours(now, pass) < 12) {
    return distanceInWords(now, pass, {
      locale: zhCN
    }) + '前'
  }
  return format(pass, pattern)
}

export const query = (val: string): Record<string, any> => {
  let ret: Record<string, any> = {}
  val.replace('?', '').split('&').forEach((item: string): void => {
    const segments = item.split('=')
    ret[segments[0]] = segments[1]
  })
  return ret
}
