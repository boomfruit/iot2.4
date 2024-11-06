import request from '@/utils/request';

// 查询农场列表
export function farms(query) {
    return request({
        url: '/iot/farms/list',
        method: 'get',
        params: query,
    });
}

// 查询农场详细
export function getFarms(farmsId) {
    return request({
        url: '/iot/farms/' + farmsId,
        method: 'get',
    });
}

// 新增农场
export function addFarms(data) {
    return request({
        url: '/iot/farms',
        method: 'post',
        data: data,
    });
}

// 修改农场
export function updateFarms(data) {
    return request({
        url: '/iot/farms',
        method: 'put',
        data: data,
    });
}

// 删除农场
export function delFarms(farmsId) {
    return request({
        url: '/iot/farms/' + farmsId,
        method: 'delete',
    });
}

// 导出农场信息
export function exportFarms() {
    return request({
        url: '/iot/farms/export',
        method: 'post',
    });
}
