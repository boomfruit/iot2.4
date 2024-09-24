import request from '@/utils/request';

// 查询品种管理列表
export function listBreeds(query) {
    return request({
        url: '/iot/breeds/list',
        method: 'get',
        params: query,
    });
}

// 查询品种管理详细
export function getBreeds(id) {
    return request({
        url: '/iot/breeds/' + id,
        method: 'get',
    });
}

// 新增品种管理
export function addBreeds(data) {
    return request({
        url: '/iot/breeds',
        method: 'post',
        data: data,
    });
}

// 修改品种管理
export function updateBreeds(data) {
    return request({
        url: '/iot/breeds',
        method: 'put',
        data: data,
    });
}

// 删除品种管理
export function delBreeds(id) {
    return request({
        url: '/iot/breeds/' + id,
        method: 'delete',
    });
}
