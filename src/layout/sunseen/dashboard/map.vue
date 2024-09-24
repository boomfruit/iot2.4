<template>
    <div>
        <el-row :gutter="20" style="margin: 10px 0px 20px 0px">
            <el-col>
                <div style="overflow: hidden">
                    <!-- <div ref="map" style="height: 700px"></div> -->
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { getDeviceStatistic } from '@/api/iot/device';
import { listNotice, getNotice } from '@/api/system/notice';
import CountTo from 'vue-count-to';
import { loadBMap } from '@/utils/map.js';
//安装的是echarts完整包，里面包含百度地图扩展，路径为 echarts/extension/bmap/bmap.js，将其引入
//ECharts的百度地图扩展，可以在百度地图上展现点图，线图，热力图等可视化
require('echarts/extension/bmap/bmap');
import { listAllDeviceShort } from '@/api/iot/device';

export default {
    name: 'Index',
    components: {
        CountTo,
    },
    data() {
        return {
            // 遮罩层
            loading: true,
            // 是否显示弹出层
            open: false,
            // 信息列表
            noticeList: [],
            // 信息详情
            notice: {},
            // 是否为管理员
            isAdmin: false,
            // 设备列表
            deviceList: [],
            // 设备统计信息
            deviceStatistic: {},
            // 设备总数
            deviceCount: 0,
            // 版本号
            version: '3.8.0',
            // 服务器信息
            server: {
                jvm: {
                    name: '',
                    version: '',
                    startTime: '',
                    runTime: '',
                    used: '',
                    total: 100,
                },
                sys: {
                    computerName: '',
                    osName: '',
                    computerIp: '',
                    osArch: '',
                },
                cpu: {
                    cpuNum: 1,
                },
                mem: {
                    total: 2,
                },
            },
            tableData: [],
        };
    },
    created() {
        this.init();
        this.getAllDevice();
        this.getNoticeList();
        this.getDeviceStatistic();
    },
    methods: {
        init() {
            if (this.$store.state.user.roles.indexOf('tenant') === -1 && this.$store.state.user.roles.indexOf('general') === -1) {
                this.isAdmin = true;
            }
        },
        //刷新iframe
        flushIframe() {
            var iframe = window.parent.document.getElementById('iframe');
            iframe.contentWindow.location.reload(true);
        },
        /** 查询设备统计信息 */
        getDeviceStatistic() {
            getDeviceStatistic().then((response) => {
                this.deviceStatistic = response.data;
            });
        },
        /** 查询公告列表 */
        getNoticeList() {
            let queryParams = {
                pageNum: 1,
                pageSize: 6,
            };
            listNotice(queryParams).then((response) => {
                this.noticeList = response.rows.splice(0, 6);
            });
        },
        // 打开信息详情
        openDetail(id) {
            this.open = true;
            this.loading = true;
            getNotice(id).then((response) => {
                this.notice = response.data;
                this.open = true;
                this.loading = false;
            });
        },
        // 取消按钮
        closeDetail() {
            this.title = '';
            this.open = false;
        },
        /**查询所有设备 */
        getAllDevice() {
            listAllDeviceShort(this.queryParams).then((response) => {
                this.deviceList = response.rows;
                this.deviceCount = response.total;
                this.loadMap();
            });
        },
        /**加载地图*/
        loadMap() {
            this.$nextTick(() => {
                loadBMap().then(() => {
                    this.getmap();
                });
            });
        },
        /** 地图 */
        getmap() {
            var myChart = this.$echarts.init(this.$refs.map);
            var option;

            // 单击事件
            myChart.on('click', (params) => {
                if (params.data.deviceId) {
                    this.$router.push({
                        path: '/iot/device-edit',
                        query: {
                            t: Date.now(),
                            deviceId: params.data.deviceId,
                        },
                    });
                }
            });

            // 格式化数据
            let convertData = function (data, status) {
                var res = [];
                for (var i = 0; i < data.length; i++) {
                    var geoCoord = [data[i].longitude, data[i].latitude];
                    if (geoCoord && data[i].status == status) {
                        res.push({
                            name: data[i].deviceName,
                            value: geoCoord,
                            serialNumber: data[i].serialNumber,
                            status: data[i].status,
                            isShadow: data[i].isShadow,
                            firmwareVersion: data[i].firmwareVersion,
                            networkAddress: data[i].networkAddress,
                            productName: data[i].productName,
                            activeTime: data[i].activeTime == null ? '' : data[i].activeTime,
                            deviceId: data[i].deviceId,
                            serialNumber: data[i].serialNumber,
                            locationWay: data[i].locationWay,
                        });
                    }
                }
                return res;
            };
            option = {
                title: {
                    text: '设备分布（在线数 ' + this.deviceList.filter((x) => x.status == 3).length + '）',
                    subtext: 'open source iot platform',
                    sublink: '',
                    target: '_blank',
                    textStyle: {
                        color: '#454343',
                        textBorderColor: '#fff',
                        textBorderWidth: 10,
                    },
                    top: 10,
                    left: 'center',
                },
                tooltip: {
                    trigger: 'item',
                    formatter: function (params) {
                        var htmlStr = '<div style="padding:5px;line-height:28px;">';
                        htmlStr += "设备名称： <span style='color:#409EFF'>" + params.data.name + '</span><br />';
                        htmlStr += '设备编号： ' + params.data.serialNumber + '<br />';
                        htmlStr += '设备状态： ';
                        if (params.data.status == 1) {
                            htmlStr += "<span style='color:#E6A23C'>未激活</span>" + '<br />';
                        } else if (params.data.status == 2) {
                            htmlStr += "<span style='color:#F56C6C'>禁用</span>" + '<br />';
                        } else if (params.data.status == 3) {
                            htmlStr += "<span style='color:#67C23A'>在线</span>" + '<br />';
                        } else if (params.data.status == 4) {
                            htmlStr += "<span style='color:#909399'>离线</span>" + '<br />';
                        }
                        if (params.data.isShadow == 1) {
                            htmlStr += '设备影子： ' + "<span style='color:#67C23A'>启用</span>" + '<br />';
                        } else {
                            htmlStr += '设备影子： ' + "<span style='color:#909399'>未启用</span>" + '<br />';
                        }
                        htmlStr += '产品名称： ' + params.data.productName + '<br />';
                        htmlStr += '固件版本： Version ' + params.data.firmwareVersion + '<br />';
                        htmlStr += '激活时间： ' + params.data.activeTime + '<br />';
                        htmlStr += '定位方式： ';
                        if (params.data.locationWay == 1) {
                            htmlStr += '自动定位' + '<br />';
                        } else if (params.data.locationWay == 2) {
                            htmlStr += '设备定位' + '<br />';
                        } else if (params.data.locationWay == 3) {
                            htmlStr += '自定义位置' + '<br />';
                        } else {
                            htmlStr += '未知' + '<br />';
                        }
                        htmlStr += '所在地址： ' + params.data.networkAddress + '<br />';
                        htmlStr += '</div>';
                        return htmlStr;
                    },
                },
                bmap: {
                    center: [133, 38],
                    zoom: 5,
                    roam: true,
                    mapStyle: {
                        styleJson: [
                            {
                                featureType: 'water',
                                elementType: 'all',
                                stylers: {
                                    color: '#021019',
                                },
                            },
                            {
                                featureType: 'highway',
                                elementType: 'geometry.fill',
                                stylers: {
                                    color: '#000000',
                                },
                            },
                            {
                                featureType: 'highway',
                                elementType: 'geometry.stroke',
                                stylers: {
                                    color: '#147a92',
                                },
                            },
                            {
                                featureType: 'arterial',
                                elementType: 'geometry.fill',
                                stylers: {
                                    color: '#000000',
                                },
                            },
                            {
                                featureType: 'arterial',
                                elementType: 'geometry.stroke',
                                stylers: {
                                    color: '#0b3d51',
                                },
                            },
                            {
                                featureType: 'local',
                                elementType: 'geometry',
                                stylers: {
                                    color: '#000000',
                                },
                            },
                            {
                                featureType: 'land',
                                elementType: 'all',
                                stylers: {
                                    color: '#08304b',
                                },
                            },
                            {
                                featureType: 'railway',
                                elementType: 'geometry.fill',
                                stylers: {
                                    color: '#000000',
                                },
                            },
                            {
                                featureType: 'railway',
                                elementType: 'geometry.stroke',
                                stylers: {
                                    color: '#08304b',
                                },
                            },
                            {
                                featureType: 'subway',
                                elementType: 'geometry',
                                stylers: {
                                    lightness: -70,
                                },
                            },
                            {
                                featureType: 'building',
                                elementType: 'geometry.fill',
                                stylers: {
                                    color: '#000000',
                                },
                            },
                            {
                                featureType: 'all',
                                elementType: 'labels.text.fill',
                                stylers: {
                                    color: '#857f7f',
                                },
                            },
                            {
                                featureType: 'all',
                                elementType: 'labels.text.stroke',
                                stylers: {
                                    color: '#000000',
                                },
                            },
                            {
                                featureType: 'building',
                                elementType: 'geometry',
                                stylers: {
                                    color: '#022338',
                                },
                            },
                            {
                                featureType: 'green',
                                elementType: 'geometry',
                                stylers: {
                                    color: '#062032',
                                },
                            },
                            {
                                featureType: 'boundary',
                                elementType: 'all',
                                stylers: {
                                    color: '#1e1c1c',
                                },
                            },
                            {
                                featureType: 'manmade',
                                elementType: 'geometry',
                                stylers: {
                                    color: '#022338',
                                },
                            },
                            {
                                featureType: 'poi',
                                elementType: 'all',
                                stylers: {
                                    visibility: 'off',
                                },
                            },
                            {
                                featureType: 'all',
                                elementType: 'labels.icon',
                                stylers: {
                                    visibility: 'off',
                                },
                            },
                            {
                                featureType: 'all',
                                elementType: 'labels.text.fill',
                                stylers: {
                                    color: '#2da0c6',
                                    visibility: 'on',
                                },
                            },
                        ],
                    },
                },
                series: [
                    {
                        type: 'scatter',
                        coordinateSystem: 'bmap',
                        data: convertData(this.deviceList, 1),
                        symbolSize: 15,
                        itemStyle: {
                            color: '#00E5FF',
                        },
                    },
                    {
                        type: 'scatter',
                        coordinateSystem: 'bmap',
                        data: convertData(this.deviceList, 2),
                        symbolSize: 15,
                        itemStyle: {
                            color: '#00E5FF',
                        },
                    },
                    {
                        type: 'scatter',
                        coordinateSystem: 'bmap',
                        data: convertData(this.deviceList, 4),
                        symbolSize: 15,
                        itemStyle: {
                            color: '#00E5FF',
                        },
                    },
                    {
                        type: 'effectScatter',
                        coordinateSystem: 'bmap',
                        data: convertData(this.deviceList, 3),
                        symbolSize: 15,
                        showEffectOn: 'render',
                        rippleEffect: {
                            brushType: 'stroke',
                            scale: 5,
                        },
                        label: {
                            formatter: '{b}',
                            position: 'right',
                            show: false,
                        },
                        itemStyle: {
                            color: '#454343',
                            shadowBlur: 100,
                            shadowColor: '#333',
                        },
                        zlevel: 1,
                    },
                ],
            };

            option && myChart.setOption(option);
        },

        drawPieCpu() {
            // 基于准备好的dom，初始化echarts实例
            let myChart = this.$echarts.init(this.$refs.pieCpu);
            var option;
            option = {
                title: {
                    text: 'CPU使用率',
                    left: 'left',
                    textStyle: {
                        fontSize: 16,
                    },
                },
                tooltip: {
                    trigger: 'item',
                },
                legend: {
                    orient: 'vertical',
                    left: 'right',
                },
                color: ['#E6A23C', '#F56C6C', '#DDD'],
                series: [
                    {
                        name: 'CPU使用率 %',
                        type: 'pie',
                        radius: '55%',
                        label: {
                            show: false,
                        },
                        labelLine: {
                            normal: {
                                position: 'inner',
                                show: false,
                            },
                        },
                        data: [
                            {
                                value: this.server.cpu.used,
                                name: '用户',
                            },
                            {
                                value: this.server.cpu.sys,
                                name: '系统',
                            },
                            {
                                value: this.server.cpu.free,
                                name: '空闲',
                            },
                        ],
                    },
                ],
            };
            option && myChart.setOption(option);
        },
        drawPieMemery() {
            // 基于准备好的dom，初始化echarts实例
            let myChart = this.$echarts.init(this.$refs.pieMemery);
            var option;
            option = {
                title: {
                    text: '内存使用率',
                    left: 'left',
                    textStyle: {
                        fontSize: 16,
                    },
                },
                tooltip: {
                    trigger: 'item',
                },
                legend: {
                    orient: 'vertical',
                    left: 'right',
                },
                color: ['#F56C6C', '#DDD'],
                series: [
                    {
                        name: '内存使用率 G',
                        type: 'pie',
                        radius: '55%',
                        label: {
                            show: false,
                        },
                        labelLine: {
                            normal: {
                                position: 'inner',
                                show: false,
                            },
                        },
                        data: [
                            {
                                value: this.server.mem.used,
                                name: '已用',
                            },
                            {
                                value: this.server.mem.free,
                                name: '剩余',
                            },
                        ],
                    },
                ],
            };
            option && myChart.setOption(option);
        },
        drawPieDisk() {
            // 基于准备好的dom，初始化echarts实例
            let myChart = this.$echarts.init(this.$refs.pieDisk);
            var option;
            let one = this.server.sysFiles[0].used.replace('GB', '');
            let two = this.server.sysFiles[0].free.replace('GB', '');
            option = {
                title: {
                    text: '系统盘使用率',
                    left: 'left',
                    textStyle: {
                        fontSize: 16,
                    },
                },
                tooltip: {
                    trigger: 'item',
                },
                legend: {
                    orient: 'vertical',
                    left: 'right',
                },
                color: ['#F56C6C', '#DDD'],
                series: [
                    {
                        name: '磁盘状态 G',
                        type: 'pie',
                        radius: '55%',
                        label: {
                            show: false,
                        },
                        labelLine: {
                            normal: {
                                position: 'inner',
                                show: false,
                            },
                        },
                        data: [
                            {
                                value: one,
                                name: '已用',
                            },
                            {
                                value: two,
                                name: '可用',
                            },
                        ],
                    },
                ],
            };
            option && myChart.setOption(option);
        },
    },
};
</script>

<style lang="scss" scoped>
::v-deep .BMap_cpyCtrl {
    display: none;
}
::v-deep .anchorBL {
    display: none;
}
.phone-container {
    height: 618px;
    width: 343px;
    position: relative;
    top: 46px;
    left: 12px;
    background-color: #fff;
}

.content {
    line-height: 24px;
    padding: 10px;
    border: 1px solid #eee;
    border-radius: 10px;
}

.description {
    font-size: 12px;

    tr {
        line-height: 20px;
    }
}

.panel-group {
    .card-panel-col {
        margin-bottom: 10px;
    }

    .card-panel {
        height: 68px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        color: #666;
        border: 1px solid #eee;
        border-radius: 5px;
        //box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.08);
        background-color: #fff;

        &:hover {
            .card-panel-icon-wrapper {
                color: #fff;
            }

            .icon-blue {
                background: #36a3f7;
            }

            .icon-green {
                background: #34bfa3;
            }

            .icon-red {
                background: #f56c6c;
            }

            .icon-orange {
                background: #e6a23c;
            }
        }

        .icon-blue {
            color: #36a3f7;
        }

        .icon-green {
            color: #34bfa3;
        }

        .icon-red {
            color: #f56c6c;
        }

        .icon-orange {
            color: #e6a23c;
        }

        .card-panel-icon-wrapper {
            float: left;
            margin: 10px;
            padding: 10px;
            transition: all 0.38s ease-out;
            border-radius: 6px;
        }

        .card-panel-icon {
            float: left;
            font-size: 30px;
        }

        .card-panel-description {
            float: right;
            font-weight: bold;
            margin: 15px;
            margin-left: 0px;

            .card-panel-text {
                line-height: 14px;
                color: rgba(0, 0, 0, 0.45);
                font-size: 14px;
                margin-bottom: 12px;
                text-align: right;
            }

            .card-panel-num {
                font-size: 18px;
            }
        }
    }
}
</style>
