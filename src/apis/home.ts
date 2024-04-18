import hyRequest from '@/services'

enum BASEURL {
  SAVE_LUCKY_SHEET = '/saveLuckySheet'
}

/**
 * 保存到数据库里面
 * @param data
 */
export function saveLuckySheet(data:any) {
  return hyRequest.get({
    url:BASEURL.SAVE_LUCKY_SHEET,
    headers: {
      isToken: false
    },
    data: data
  })
}
