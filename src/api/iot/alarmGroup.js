import request from '@/utils/request';
// 获取设备报警分组详细信息
export function getGroupById(id) {
    return request({
        url: '/iot/groups/' + id,
        method: 'get',
    });
}

// 新增设备报警分组
export function addGroup(data) {
    return request({
        url: '/iot/groups/addGroup',
        method: 'post',
        data: data,
    });
}

// 修改设备报警分组
export function editGroup(data) {
    return request({
        url: '/iot/groups/editGroup/',
        method: 'post',
        data: data,
    });
}

// 删除设备报警分组
export function delGroup(data) {
    return request({
        url: '/iot/groups/delGroup/',
        method: 'post',
        data,
    });
}

// 导出设备报警分组
export function exportGroup() {
    return request({
        url: '/iot/groups/export',
        method: 'post',
    });
}

// 获取设备报警联系人
export function getDeviceContacts(deviceNo) {
    return request({
        url: '/iot/groups/getDeviceContacts/' + deviceNo,
        method: 'get',
    });
}

// 查询设备报警分组列表
export function listGroups(query) {
    return request({
        url: '/iot/groups/list',
        method: 'get',
        params: query,
    });
}

// 所有栏舍下的所有报警设备GET请求
export function getBarnsAlarmDevices(query) {
    return request({
        url: '/iot/barns/getBarnsAlarmDevices ',
        method: 'get',
        params: query,
    });
}
