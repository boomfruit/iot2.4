import request from '@/utils/request';

// 查询设备告警列表
export function listAlarm(query) {
    return request({
        url: '/iot/alarms/list',
        method: 'get',
        params: query,
    });
}
