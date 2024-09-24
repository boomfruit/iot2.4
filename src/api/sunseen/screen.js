import request from '@/utils/request';

// MQTT统计
export function getBashBoardMetrics() {
    return request({
        url: '/bashBoard/metrics',
        method: 'get',
    });
}

// MQTT状态数据
export function getBashBoardStats() {
    return request({
        url: '/bashBoard/stats',
        method: 'get',
    });
}
