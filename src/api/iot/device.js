import request from '@/utils/request';

// 查询设备列表
export function listDevice(query) {
    return request({
        url: '/iot/device/list',
        method: 'get',
        params: query,
    });
}

// 查询未授权设备列表
export function listUnAuthDevice(query) {
    return request({
        url: '/iot/device/unAuthlist',
        method: 'get',
        params: query,
    });
}

// 查询分组可添加设备分页列表
export function listDeviceByGroup(query) {
    return request({
        url: '/iot/device/listByGroup',
        method: 'get',
        params: query,
    });
}

// 查询设备简短列表
export function listDeviceShort(query) {
    return request({
        url: '/iot/device/shortList',
        method: 'get',
        params: query,
    });
}

// 查询所有设备简短列表
export function listAllDeviceShort() {
    return request({
        url: '/iot/device/all',
        method: 'get',
    });
}

// 查询设备详细
export function getDevice(productId) {
    return request({
        url: '/iot/device/' + productId,
        method: 'get',
    });
}

// 查询设备详细
export function getFarmsDevice(farmId) {
    return request({
        url: '/iot/devices/' + farmId,
        method: 'get',
    });
}

// 设备数据同步
export function deviceSynchronization(serialNumber) {
    return request({
        url: '/iot/device/synchronization/' + serialNumber,
        method: 'get',
    });
}

// 根据设备编号查询设备详细
export function getDeviceBySerialNumber(serialNumber) {
    return request({
        url: '/iot/device/getDeviceBySerialNumber/' + serialNumber,
        method: 'get',
    });
}

// 查询设备统计信息
export function getDeviceStatistic() {
    return request({
        url: '/iot/device/statistic',
        method: 'get',
    });
}

// 选择分配设备
export function distributionDevice(deptId, deviceIds) {
    return request({
        url: '/iot/device/assignment?deptId=' + deptId + '&deviceIds=' + deviceIds,
        method: 'post',
    });
}
//回收设备
export function recycleDevice(deviceIds) {
    return request({
        url: '/iot/device/recovery?deviceIds=' + deviceIds,
        method: 'post',
    });
}
//查询设备导入记录
export function listImportRecord() {
    return request({
        url: '',
        method: 'get',
    });
}
//查询设备回收记录
export function listRecycleRecord() {
    return request({
        url: '',
        method: 'get',
    });
}
//查询设备分配记录
export function listAllotRecord() {
    return request({
        url: '',
        method: 'get',
    });
}

// 查询设备运行状态详细
export function getDeviceRunningStatus(params) {
    return request({
        url: '/iot/device/runningStatus',
        method: 'get',
        params: params,
    });
}

// 查询设备物模型的值
export function getDeviceThingsModelValue(deviceId) {
    return request({
        url: '/iot/device/thingsModelValue/' + deviceId,
        method: 'get',
    });
}

// 新增设备
export function addDevice(data) {
    return request({
        url: '/iot/devices',
        method: 'post',
        data: data,
    });
}

// 修改设备
export function updateDevice(data) {
    return request({
        url: '/iot/device',
        method: 'put',
        data: data,
    });
}

// 删除设备
export function removeBarnDevices(data) {
    return request({
        url: '/iot/devices/removeBarnDevices',
        method: 'post',
        data: data,
    });
}

// 生成设备编号
export function generatorDeviceNum(params) {
    return request({
        url: '/iot/device/generator',
        method: 'get',
        params: params,
    });
}

export function getGwDevCode(params) {
    return request({
        url: '/iot/device/gwDevCount',
        method: 'get',
        params: params,
    });
}

//mqtt连接参数查看
export function getMqttConnect(params) {
    return request({
        url: '/iot/device/getMqttConnectData',
        method: 'get',
        params: params,
    });
}

// 栏舍未绑定设备
export function unBoundDevicesList(params) {
    return request({
        url: '/iot/devices/unBoundDevicesList',
        method: 'get',
        params: params,
    });
}
