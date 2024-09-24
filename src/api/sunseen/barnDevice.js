import request from '@/utils/request';

// 查询栏舍设备列表
export function devices(query) {
    return request({
        url: '/iot/devices/list',
        method: 'get',
        params: query,
    });
}

// 栏舍下未绑定的设备列表
export function unBoundDevicesList(query) {
    return request({
        url: '/iot/devices/unBoundDevicesList',
        method: 'get',
        params: query,
    });
}

// 查询农场详细
export function getDevices(devicesId) {
    return request({
        url: '/iot/devices/' + devicesId,
        method: 'get',
    });
}

// 新增农场
export function addDevices(data) {
    return request({
        url: '/iot/devices',
        method: 'post',
        data: data,
    });
}

// 修改农场
export function updateDevices(data) {
    return request({
        url: '/iot/devices',
        method: 'put',
        data: data,
    });
}

// 删除农场
export function delDevices(devicesId) {
    return request({
        url: '/iot/devices/' + devicesId,
        method: 'delete',
    });
}

// 导出农场信息
export function exportDevices() {
    return request({
        url: '/iot/devices/export',
        method: 'post',
    });
}
