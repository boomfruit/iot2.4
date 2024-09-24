import request from '@/utils/request'

// 查询网关与子设备关联列表
export function listGateway(query) {
  return request({
    url: '/sub/gateway/list',
    method: 'get',
    params: query
  })
}

// 查询网关与子设备关联详细
export function getGateway(id) {
  return request({
    url: '/sub/gateway/' + id,
    method: 'get'
  })
}

// 新增网关与子设备关联
export function addGateway(data) {
  return request({
    url: '/sub/gateway',
    method: 'post',
    data: data
  })
}

// 修改网关与子设备关联
export function updateGateway(data) {
  return request({
    url: '/sub/gateway',
    method: 'put',
    data: data
  })
}

// 删除网关与子设备关联
export function delGateway(id) {
  return request({
    url: '/sub/gateway/' + id,
    method: 'delete'
  })
}

// 获取可选择的网关子设备列表
export function listSubGateway(query) {
  return request({
    url: '/sub/gateway/subDevice',
    method: 'get',
    params: query
  })
}

// 批量新增网关与子设备关联
export function addGatewayBatch(data) {
  return request({
    url: '/sub/gateway/addBatch',
    method: 'post',
    data: data
  })
}

// 批量新增网关与子设备关联
export function editGatewayBatch(data) {
  return request({
    url: '/sub/gateway/editBatch',
    method: 'post',
    data: data
  })
}
