import request from '@/utils/request'

// 查询轮训任务列列表
export function listJob(query) {
  return request({
    url: '/modbus/job/list',
    method: 'get',
    params: query
  })
}

// 查询轮训任务列详细
export function getJob(taskId) {
  return request({
    url: '/modbus/job/' + taskId,
    method: 'get'
  })
}

// 新增轮训任务列
export function addJob(data) {
  return request({
    url: '/modbus/job',
    method: 'post',
    data: data
  })
}

// 修改轮训任务列
export function updateJob(taskId,status) {
  const data = {
    taskId: taskId,
    status: status
  }
  return request({
    url: '/modbus/job',
    method: 'put',
    data: data
  })
}

// 删除轮训任务列
export function delJob(data) {
  return request({
    url: '/modbus/job/del',
    method: 'post',
    data: data
  })
}
