import request from '@/utils/request';

// 查询农场管理列表
export function listFarms(query) {
    return request({
        url: '/iot/farms/list',
        method: 'get',
        params: query,
    });
}

// 查询农场管理详细
export function getFarms(id) {
    return request({
        url: '/iot/farms/' + id,
        method: 'get',
    });
}

// 新增农场管理
export function addFarms(data) {
    return request({
        url: '/iot/farms',
        method: 'post',
        data: data,
    });
}

// 修改农场管理
export function updateFarms(data) {
    return request({
        url: '/iot/farms',
        method: 'put',
        data: data,
    });
}

// 删除农场管理
export function delFarms(id) {
    return request({
        url: '/iot/farms/' + id,
        method: 'delete',
    });
}

// 获取当前公司及子公司接口

export function companyOtherFarms() {
    return request({
        url: 'system/dept/list/',
        method: 'get',
    });
}
