import request from '@/utils/request';

// 查询栏舍列表
export function barnsList(query) {
    return request({
        url: '/iot/barns/list',
        method: 'get',
        params: query,
    });
}

// 查询栏舍详细
export function getBarns(farmsId) {
    return request({
        url: '/iot/barns/' + farmsId,
        method: 'get',
    });
}

// 新增栏舍
export function addBarns(data) {
    return request({
        url: '/iot/barns',
        method: 'post',
        data: data,
    });
}

// 修改栏舍
export function updateBarns(data) {
    return request({
        url: '/iot/barns',
        method: 'put',
        data: data,
    });
}

// 删除栏舍
export function delBarns(farmsId) {
    return request({
        url: '/iot/barns/' + farmsId,
        method: 'delete',
    });
}

// 导出栏舍信息
export function exportBarns() {
    return request({
        url: '/iot/barns/export',
        method: 'post',
    });
}
