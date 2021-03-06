import request from '/@/utils/request'

export function getData(data) {
  return request({
    url: '/api/integral-statictis/teacher',
    method: 'get',
    params: {
        pindex: data.pindex,
        number: data.number,
        keyword: data.keyword,
        week: data.week,
    }
  })
}

export function getCurrentWeek(schoolId) {
  return request({
    url: '/api/util//getCurrentWeek',
    method: 'get',
    params: {
      schoolId
    }
  })
}