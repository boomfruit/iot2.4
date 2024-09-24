import request from '@/utils/request'

// 查询栏舍信息列表
export function listBarns(query) {
  return request({
    url: '/iot/barns/list',
    method: 'get',
    params: query
  })
}

// 查询栏舍信息详细
export function getBarns(id) {
  return request({
    url: '/iot/barns/' + id,
    method: 'get'
  })
}

// 新增栏舍信息
export function addBarns(data) {
  return request({
    url: '/iot/barns',
    method: 'post',
    data: data
  })
}

// 修改栏舍信息
export function updateBarns(data) {
  return request({
    url: '/iot/barns',
    method: 'put',
    data: data
  })
}

// 删除栏舍信息
export function delBarns(id) {
  return request({
    url: '/iot/barns/' + id,
    method: 'delete'
  })
}
