import hyRequest from '@/services'
import type { CreateFormDataType, CreateFormParamType } from '@/apis/types/home'
import type { CommonResponse } from '@/apis/types/CommonResponse'

enum BASEURL {
  SAVE_LUCKY_SHEET = '/saveLuckySheet',
  CREATE_FORM = '/createForm'
}

/**
 * 保存到数据库里面
 * @param data
 */
export function saveLuckySheet(data: any) {
  return hyRequest.get({
    url: BASEURL.SAVE_LUCKY_SHEET,
    headers: {
      isToken: false
    },
    data: data
  })
}

/**
 * 创建填报
 * @param data
 * @constructor
 */
export const CreateFormApi = (data: CreateFormParamType) => {
  return hyRequest.post<CommonResponse<CreateFormDataType>>({
    url: BASEURL.CREATE_FORM,
    data
  })
}
