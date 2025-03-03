const fanSettingTable = {
    mode1: {
        // 风机状态选项
        statusOptions: [
            { value: '0', label: '关闭' },
            { value: '1', label: '开启' },
            { value: '2', label: '循环' },
            { value: '3', label: '轮询' },
        ],
        // 表格列配置
        columns: [
            { field: 'level', title: '等级', width: 80, align: 'center' },
            {
                field: 'fan1',
                title: '风机1',
                width: 120,
                align: 'center',
                editRender: {
                    name: 'select',
                    options: [
                        { value: '0', label: '关闭' },
                        { value: '1', label: '开启' },
                        { value: '2', label: '循环' },
                        { value: '3', label: '轮询' },
                    ],
                },
            },
            {
                field: 'fan2',
                title: '风机2',
                width: 120,
                align: 'center',
                editRender: {
                    name: 'select',
                    options: [
                        { value: '0', label: '关闭' },
                        { value: '1', label: '开启' },
                        { value: '2', label: '循环' },
                        { value: '3', label: '轮询' },
                    ],
                },
            },
            {
                field: 'fan3',
                title: '风机3',
                width: 120,
                align: 'center',
                editRender: {
                    name: 'select',
                    options: [
                        { value: '0', label: '关闭' },
                        { value: '1', label: '开启' },
                        { value: '2', label: '循环' },
                        { value: '3', label: '轮询' },
                    ],
                },
            },
            {
                field: 'fan4',
                title: '风机4',
                width: 120,
                align: 'center',
                editRender: {
                    name: 'select',
                    options: [
                        { value: '0', label: '关闭' },
                        { value: '1', label: '开启' },
                        { value: '2', label: '循环' },
                        { value: '3', label: '轮询' },
                    ],
                },
            },
            {
                field: 'fan5',
                title: '风机5',
                width: 120,
                align: 'center',
                editRender: {
                    name: 'select',
                    options: [
                        { value: '0', label: '关闭' },
                        { value: '1', label: '开启' },
                        { value: '2', label: '循环' },
                        { value: '3', label: '轮询' },
                    ],
                },
            },
            {
                field: 'fanX',
                title: '风机X',
                width: 120,
                align: 'center',
                editRender: {
                    name: 'select',
                    options: [
                        { value: '0', label: '关闭' },
                        { value: '1', label: '开启' },
                        { value: '2', label: '循环' },
                        { value: '3', label: '轮询' },
                    ],
                },
            },
            {
                field: 'startTime',
                title: '开启时间',
                width: 160,
                align: 'center',
                editRender: { name: 'input' },
            },
            {
                field: 'endTime',
                title: '关闭时间',
                width: 160,
                align: 'center',
                editRender: { name: 'input' },
            },
            {
                field: 'temperature',
                title: '温差',
                width: 100,
                align: 'center',
                editRender: { name: 'input' },
            },
        ],
        // 默认表格数据
        defaultData: [
            {
                level: { key: 'level', value: '' },
                fan1: { key: 'fan1', value: '' },
                fan2: { key: 'fan2', value: '' },
                fan3: { key: 'fan3', value: '' },
                fan4: { key: 'fan4', value: '' },
                fan5: { key: 'fan5', value: '' },
                fanX: { key: 'fanX', value: '' },
                startTime: { key: 'startTime', value: '' },
                endTime: { key: 'endTime', value: '' },
                temperature: { key: 'temperature', value: '' },
            },
        ],
    },
};

const ratioSettingTable = {
    mode1: {
        // 表格列配置
        columns: [
            { field: 'level', title: '等级', width: 80, align: 'center' },
            { field: 'vent1', title: '变频1', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'vent2', title: '变频2', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'vent3', title: '变频3', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'vent4', title: '变频4', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'ventX', title: '变频X', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'windWindow', title: '侧风窗', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'skyWindow', title: '天窗窗', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'rollScreen', title: '卷帘', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'sunScreen', title: '遮阳', width: 120, align: 'center', editRender: { name: 'input' } },
        ],
        // 默认表格数据
        defaultData: [
            {
                key: 'level',
                vent1: { key: 'vent1', value: '' },
                vent2: { key: 'vent2', value: '' },
                vent3: { key: 'vent3', value: '' },
                vent4: { key: 'vent4', value: '' },
                ventX: { key: 'ventX', value: '' },
                windWindow: { key: 'windWindow', value: '' },
                skyWindow: { key: 'skyWindow', value: '' },
                rollScreen: { key: 'rollScreen', value: '' },
                sunScreen: { key: 'sunScreen', value: '' },
            },
            {
                key: 'level',

                vent1: { key: 'vent1', value: '' },
                vent2: { key: 'vent2', value: '' },
                vent3: { key: 'vent3', value: '' },
                vent4: { key: 'vent4', value: '' },
                ventX: { key: 'ventX', value: '' },
                windWindow: { key: 'windWindow', value: '' },
                skyWindow: { key: 'skyWindow', value: '' },
                rollScreen: { key: 'rollScreen', value: '' },
                sunScreen: { key: 'sunScreen', value: '' },
            },
            {
                key: 'level',

                vent1: { key: 'vent1', value: '' },
                vent2: { key: 'vent2', value: '' },
                vent3: { key: 'vent3', value: '' },
                vent4: { key: 'vent4', value: '' },
                ventX: { key: 'ventX', value: '' },
                windWindow: { key: 'windWindow', value: '' },
                skyWindow: { key: 'skyWindow', value: '' },
                rollScreen: { key: 'rollScreen', value: '' },
                sunScreen: { key: 'sunScreen', value: '' },
            },
        ],
    },
};

const lightSettingTable = {
    mode1: {
        // 通用模式表格列配置
        columns: [
            { field: 'level', title: '光照', width: 80, align: 'center' },
            { field: 'light', title: '光照', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'startTime1', title: '开启时间', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'endTime1', title: '关闭时间', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'time', title: '时长', width: 120, align: 'center', editRender: { name: 'input' } },
        ],
        // 默认表格数据
        defaultData: [
            {
                key: 'level',
                light: { key: 'light', value: '' },
                startTime1: { key: 'startTime1', value: '' },
                endTime1: { key: 'endTime1', value: '' },
                time: { key: 'time', value: '' },
            },
            {
                key: 'level',
                light: { key: 'light', value: '' },
                startTime1: { key: 'startTime1', value: '' },
                endTime1: { key: 'endTime1', value: '' },
                time: { key: 'time', value: '' },
            },
            {
                key: 'level',
                light: { key: 'light', value: '' },
                startTime1: { key: 'startTime1', value: '' },
                endTime1: { key: 'endTime1', value: '' },
                time: { key: 'time', value: '' },
            },
        ],
    },
    mode2: {
        // 特定1模式表格列配置
        columns: [
            { field: 'level', title: '光照时间段', width: 100, align: 'center' },
            { field: 'lightStartTime', title: '光照开始时间', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'lightStartIntensity', title: '光照开始时间强度', width: 140, align: 'center', editRender: { name: 'input' } },
            { field: 'lightEndTime', title: '光照结束时间', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'lightEndIntensity', title: '光照结束时间强度', width: 140, align: 'center', editRender: { name: 'input' } },
            { field: 'lightDuration', title: '光照持续时间', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'lightMaxIntensity', title: '光照最大强度', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'lightMinIntensity', title: '光照最小强度', width: 120, align: 'center', editRender: { name: 'input' } },
        ],
        // 默认表格数据
        defaultData: [
            {
                key: 'level',

                lightStartTime: { key: 'lightStartTime', value: '' },
                lightStartIntensity: { key: 'lightStartIntensity', value: '' },
                lightEndTime: { key: 'lightEndTime', value: '' },
                lightEndIntensity: { key: 'lightEndIntensity', value: '' },
                lightDuration: { key: 'lightDuration', value: '' },
                lightMaxIntensity: { key: 'lightMaxIntensity', value: '' },
                lightMinIntensity: { key: 'lightMinIntensity', value: '' },
            },
            {
                key: 'level',

                lightStartTime: { key: 'lightStartTime', value: '' },
                lightStartIntensity: { key: 'lightStartIntensity', value: '' },
                lightEndTime: { key: 'lightEndTime', value: '' },
                lightEndIntensity: { key: 'lightEndIntensity', value: '' },
                lightDuration: { key: 'lightDuration', value: '' },
                lightMaxIntensity: { key: 'lightMaxIntensity', value: '' },
                lightMinIntensity: { key: 'lightMinIntensity', value: '' },
            },
            {
                key: 'level',

                lightStartTime: { key: 'lightStartTime', value: '' },
                lightStartIntensity: { key: 'lightStartIntensity', value: '' },
                lightEndTime: { key: 'lightEndTime', value: '' },
                lightEndIntensity: { key: 'lightEndIntensity', value: '' },
                lightDuration: { key: 'lightDuration', value: '' },
                lightMaxIntensity: { key: 'lightMaxIntensity', value: '' },
                lightMinIntensity: { key: 'lightMinIntensity', value: '' },
            },
        ],
    },
};

const systemSettingTable = {
    mode1: {
        // 通用模式表格列配置
        columns: [
            { field: 'tempDiff', title: '温差温度', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'windDirection', title: '风力时间', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'ventTime', title: '降温时间', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'tempRange', title: '降温温度', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'defrostTime', title: '默认时间', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'tempControl', title: '温度调节', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'initialTemp', title: '初始温度', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'openingTime', title: '开启时间', width: 120, align: 'center', editRender: { name: 'input' } },
        ],
        // 默认表格数据
        defaultData: [
            {
                tempDiff: { key: 'tempDiff', value: '' },
                windDirection: { key: 'windDirection', value: '' },
                ventTime: { key: 'ventTime', value: '' },
                tempRange: { key: 'tempRange', value: '' },
                defrostTime: { key: 'defrostTime', value: '' },
                tempControl: { key: 'tempControl', value: '' },
                initialTemp: { key: 'initialTemp', value: '' },
                openingTime: { key: 'openingTime', value: '' },
            },
        ],
    },

    mode2: {
        // 特定1模式表格列配置
        columns: [
            { field: 'tempControl', title: '温度调节', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'openingTime', title: '开启时间', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'ventTime', title: '降温时间', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'tempRange', title: '降温温度', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'initialTempRange', title: '初始降温温度', width: 140, align: 'center', editRender: { name: 'input' } },
            { field: 'tempControlRange', title: '温度调节范围', width: 140, align: 'center', editRender: { name: 'input' } },
            { field: 'defrostTime', title: '默认时间', width: 120, align: 'center', editRender: { name: 'input' } },
        ],
        // 默认表格数据
        defaultData: [
            {
                tempControl: { key: 'tempControl', value: '' },
                openingTime: { key: 'openingTime', value: '' },
                ventTime: { key: 'ventTime', value: '' },
                tempRange: { key: 'tempRange', value: '' },
                initialTempRange: { key: 'initialTempRange', value: '' },
                tempControlRange: { key: 'tempControlRange', value: '' },
                defrostTime: { key: 'defrostTime', value: '' },
            },
        ],
    },
};

const humiditySettingTable = {
    mode1: {
        // 通用模式表格列配置
        columns: [
            { field: 'humiditySwitch', title: '湿度开关', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'startHumidity', title: '开启湿度', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'startTemp', title: '开启温度', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'protectTemp', title: '保护温度', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'controlTime', title: '控制时间', width: 120, align: 'center', editRender: { name: 'input' } },
        ],
        // 默认表格数据
        defaultData: [
            {
                humiditySwitch: { key: 'humiditySwitch', value: '' },
                startHumidity: { key: 'startHumidity', value: '' },
                startTemp: { key: 'startTemp', value: '' },
                protectTemp: { key: 'protectTemp', value: '' },
                controlTime: { key: 'controlTime', value: '' },
            },
        ],
    },

    mode2: {
        // 特定1模式表格列配置
        columns: [
            { field: 'humiditySwitch', title: '湿度开关', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'startHumidity', title: '开启湿度', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'startTemp', title: '开启温度', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'protectTemp', title: '保护温度', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'controlTime', title: '控制时间', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'humidityRange', title: '湿度调节率', width: 120, align: 'center', editRender: { name: 'input' } },
        ],
        // 默认表格数据
        defaultData: [
            {
                humiditySwitch: { key: 'humiditySwitch', value: '' },
                startHumidity: { key: 'startHumidity', value: '' },
                startTemp: { key: 'startTemp', value: '' },
                protectTemp: { key: 'protectTemp', value: '' },
                controlTime: { key: 'controlTime', value: '' },
                humidityRange: { key: 'humidityRange', value: '' },
            },
        ],
    },
};

const heatingSettingTable = {
    mode1: {
        // 通用模式表格列配置
        columns: [
            { field: 'level', title: '等级', width: 80, align: 'center' },
            { field: 'startTime1', title: '开启时间', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'endTime1', title: '关闭时间', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'startTemp', title: '开启温度', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'endTemp', title: '关闭温度', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'openTime', title: '开启时长', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'closeTime', title: '关闭时长', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'lowTemp', title: '低温时长', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'highTemp', title: '高温时长', width: 120, align: 'center', editRender: { name: 'input' } },
        ],
        // 默认表格数据
        defaultData: [
            {
                key: 'level',
                startTime1: { key: 'startTime1', value: '' },
                endTime1: { key: 'endTime1', value: '' },
                startTemp: { key: 'startTemp', value: '' },
                endTemp: { key: 'endTemp', value: '' },
                openTime: { key: 'openTime', value: '' },
                closeTime: { key: 'closeTime', value: '' },
                lowTemp: { key: 'lowTemp', value: '' },
                highTemp: { key: 'highTemp', value: '' },
            },
            {
                key: 'level',
                startTime1: { key: 'startTime1', value: '' },
                endTime1: { key: 'endTime1', value: '' },
                startTemp: { key: 'startTemp', value: '' },
                endTemp: { key: 'endTemp', value: '' },
                openTime: { key: 'openTime', value: '' },
                closeTime: { key: 'closeTime', value: '' },
                lowTemp: { key: 'lowTemp', value: '' },
                highTemp: { key: 'highTemp', value: '' },
            },
            {
                key: 'level',
                startTime1: { key: 'startTime1', value: '' },
                endTime1: { key: 'endTime1', value: '' },
                startTemp: { key: 'startTemp', value: '' },
                endTemp: { key: 'endTemp', value: '' },
                openTime: { key: 'openTime', value: '' },
                closeTime: { key: 'closeTime', value: '' },
                lowTemp: { key: 'lowTemp', value: '' },
                highTemp: { key: 'highTemp', value: '' },
            },
        ],
    },

    mode2: {
        // 特定1模式表格列配置
        columns: [
            { field: 'level', title: '加热', width: 80, align: 'center' },
            { field: 'openTime', title: '开启时长', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'closeTime', title: '关闭时长', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'lowTemp', title: '低温时长', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'highTemp', title: '高温时长', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'startTemp', title: '开启温度', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'endTemp', title: '关闭温度', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'addHeat1', title: '加热一', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'addHeat2', title: '加热二', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'addHeat3', title: '加热三', width: 120, align: 'center', editRender: { name: 'input' } },
        ],
        // 默认表格数据
        defaultData: [
            {
                key: 'level',
                openTime: { key: 'openTime', value: '' },
                closeTime: { key: 'closeTime', value: '' },
                lowTemp: { key: 'lowTemp', value: '' },
                highTemp: { key: 'highTemp', value: '' },
                startTemp: { key: 'startTemp', value: '' },
                endTemp: { key: 'endTemp', value: '' },
                addHeat1: { key: 'addHeat1', value: '' },
                addHeat2: { key: 'addHeat2', value: '' },
                addHeat3: { key: 'addHeat3', value: '' },
            },
            {
                key: 'level',
                openTime: { key: 'openTime', value: '' },
                closeTime: { key: 'closeTime', value: '' },
                lowTemp: { key: 'lowTemp', value: '' },
                highTemp: { key: 'highTemp', value: '' },
                startTemp: { key: 'startTemp', value: '' },
                endTemp: { key: 'endTemp', value: '' },
                addHeat1: { key: 'addHeat1', value: '' },
                addHeat2: { key: 'addHeat2', value: '' },
                addHeat3: { key: 'addHeat3', value: '' },
            },
            {
                key: 'level',
                openTime: { key: 'openTime', value: '' },
                closeTime: { key: 'closeTime', value: '' },
                lowTemp: { key: 'lowTemp', value: '' },
                highTemp: { key: 'highTemp', value: '' },
                startTemp: { key: 'startTemp', value: '' },
                endTemp: { key: 'endTemp', value: '' },
                addHeat1: { key: 'addHeat1', value: '' },
                addHeat2: { key: 'addHeat2', value: '' },
                addHeat3: { key: 'addHeat3', value: '' },
            },
        ],
    },
};

const coolingSettingTable = {
    mode1: {
        // 通用模式表格列配置
        columns: [
            { field: 'level', title: '制冷', width: 80, align: 'center' },
            { field: 'startTime1', title: '开启时间', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'endTime1', title: '关闭时间', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'startTemp', title: '开启温度', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'endTemp', title: '关闭温度', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'openTime', title: '开启时长', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'closeTime', title: '关闭时长', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'lowTemp', title: '低温时长', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'highTemp', title: '高温时长', width: 120, align: 'center', editRender: { name: 'input' } },
        ],
        // 默认表格数据
        defaultData: [
            {
                key: 'level',

                startTime1: { key: 'startTime1', value: '' },
                endTime1: { key: 'endTime1', value: '' },
                startTemp: { key: 'startTemp', value: '' },
                endTemp: { key: 'endTemp', value: '' },
                openTime: { key: 'openTime', value: '' },
                closeTime: { key: 'closeTime', value: '' },
                lowTemp: { key: 'lowTemp', value: '' },
                highTemp: { key: 'highTemp', value: '' },
            },
            {
                key: 'level',

                startTime1: { key: 'startTime1', value: '' },
                endTime1: { key: 'endTime1', value: '' },
                startTemp: { key: 'startTemp', value: '' },
                endTemp: { key: 'endTemp', value: '' },
                openTime: { key: 'openTime', value: '' },
                closeTime: { key: 'closeTime', value: '' },
                lowTemp: { key: 'lowTemp', value: '' },
                highTemp: { key: 'highTemp', value: '' },
            },
            {
                key: 'level',

                startTime1: { key: 'startTime1', value: '' },
                endTime1: { key: 'endTime1', value: '' },
                startTemp: { key: 'startTemp', value: '' },
                endTemp: { key: 'endTemp', value: '' },
                openTime: { key: 'openTime', value: '' },
                closeTime: { key: 'closeTime', value: '' },
                lowTemp: { key: 'lowTemp', value: '' },
                highTemp: { key: 'highTemp', value: '' },
            },
        ],
    },
};

const gasSettingTable = {
    mode1: {
        // 通用模式表格列配置
        columns: [
            { field: 'ventilationTime', title: '换气时间', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'controlTime', title: '控制时间', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'tempDiff', title: '温度差异', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'nitrogenLimit', title: '氮气下限', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'nitrogenSpeed', title: '氮气速度', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'co2Switch', title: 'CO2开关', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'co2Speed', title: 'CO2速度', width: 120, align: 'center', editRender: { name: 'input' } },
        ],
        // 默认表格数据
        defaultData: [
            {
                ventilationTime: { key: 'ventilationTime', value: '' },
                controlTime: { key: 'controlTime', value: '' },
                tempDiff: { key: 'tempDiff', value: '' },
                nitrogenLimit: { key: 'nitrogenLimit', value: '' },
                nitrogenSpeed: { key: 'nitrogenSpeed', value: '' },
                co2Switch: { key: 'co2Switch', value: '' },
                co2Speed: { key: 'co2Speed', value: '' },
            },
        ],
    },

    mode2: {
        // 特定1模式表格列配置
        columns: [
            { field: 'controlSwitch', title: '控制开关', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'co2Switch', title: 'CO2开关', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'co2Speed', title: 'CO2速度', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'nitrogenLimit', title: '氮气下限', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'nitrogenSpeed', title: '氮气速度', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'controlTime', title: '控制时间', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'ventilationTime', title: '换气时间', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'tempDiff', title: '温度调节', width: 120, align: 'center', editRender: { name: 'input' } },
        ],
        // 默认表格数据
        defaultData: [
            {
                controlSwitch: { key: 'controlSwitch', value: '' },
                co2Switch: { key: 'co2Switch', value: '' },
                co2Speed: { key: 'co2Speed', value: '' },
                nitrogenLimit: { key: 'nitrogenLimit', value: '' },
                nitrogenSpeed: { key: 'nitrogenSpeed', value: '' },
                controlTime: { key: 'controlTime', value: '' },
                ventilationTime: { key: 'ventilationTime', value: '' },
                tempDiff: { key: 'tempDiff', value: '' },
            },
        ],
    },
};

const addOxygenSettingTable = {
    mode1: {
        // 通用模式表格列配置
        columns: [
            { field: 'startNitrogenTime', title: '加氧设备启动时间量', width: 160, align: 'center', editRender: { name: 'input' } },
            { field: 'endNitrogenTime', title: '加氧设备结束时间量', width: 160, align: 'center', editRender: { name: 'input' } },
            { field: 'startControlTime', title: '加氧设备开启量控制时间', width: 180, align: 'center', editRender: { name: 'input' } },
            { field: 'endControlTime', title: '加氧设备关闭量控制时间', width: 180, align: 'center', editRender: { name: 'input' } },
            { field: 'nitrogenSpeed', title: '加氧设备开启频率', width: 140, align: 'center', editRender: { name: 'input' } },
            { field: 'openInterval', title: '开启间隔', width: 120, align: 'center', editRender: { name: 'input' } },
        ],
        // 默认表格数据
        defaultData: [
            {
                startNitrogenTime: { key: 'startNitrogenTime', value: '' },
                endNitrogenTime: { key: 'endNitrogenTime', value: '' },
                startControlTime: { key: 'startControlTime', value: '' },
                endControlTime: { key: 'endControlTime', value: '' },
                nitrogenSpeed: { key: 'nitrogenSpeed', value: '' },
                openInterval: { key: 'openInterval', value: '' },
            },
        ],
    },
};

const temperatureSettingTable = {
    mode1: {
        // 通用模式表格列配置
        columns: [
            { field: 'mode', title: '模式', width: 80, align: 'center' },
            { field: 'date', title: '日龄', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'temperature', title: '温度', width: 120, align: 'center', editRender: { name: 'input' } },
        ],
        // 默认表格数据
        defaultData: [
            {
                key: 'mode',

                date: { key: 'date', value: '' },
                temperature: { key: 'temperature', value: '' },
            },
            {
                key: 'mode',

                date: { key: 'date', value: '' },
                temperature: { key: 'temperature', value: '' },
            },
            {
                key: 'mode',

                date: { key: 'date', value: '' },
                temperature: { key: 'temperature', value: '' },
            },
        ],
    },
};

const alarmSettingTable = {
    mode1: {
        // 通用模式表格列配置
        columns: [
            { field: 'type', title: '类型', width: 120, align: 'center' },
            { field: 'upperLimit', title: '上限', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'lowerLimit', title: '下限', width: 120, align: 'center', editRender: { name: 'input' } },
        ],
        // 默认表格数据
        defaultData: [
            {
                key: 'type',
                value: '报警类型',
                upperLimit: { key: 'upperLimit', value: '' },
                lowerLimit: { key: 'lowerLimit', value: '' },
            },
            {
                key: 'type',
                value: '室内温度',
                upperLimit: { key: 'upperLimit', value: '' },
                lowerLimit: { key: 'lowerLimit', value: '' },
            },
            {
                key: 'type',
                value: '室外温度',
                upperLimit: { key: 'upperLimit', value: '' },
                lowerLimit: { key: 'lowerLimit', value: '' },
            },
            {
                key: 'type',
                value: '二氧化碳',
                upperLimit: { key: 'upperLimit', value: '' },
                lowerLimit: { key: 'lowerLimit', value: '' },
            },
        ],
    },

    mode2: {
        // 特定1模式表格列配置
        columns: [
            { field: 'type', title: '类型', width: 120, align: 'center' },
            { field: 'upperLimit', title: '上限', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'lowerLimit', title: '下限', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'switch', title: '开关', width: 120, align: 'center', editRender: { name: 'input' } },
        ],
        // 默认表格数据
        defaultData: [
            {
                key: 'type',
                value: '报警类型',
                upperLimit: { key: 'upperLimit', value: '' },
                lowerLimit: { key: 'lowerLimit', value: '' },
                switch: { key: 'switch', value: '' },
            },
            {
                key: 'type',
                value: '室内温度',
                upperLimit: { key: 'upperLimit', value: '' },
                lowerLimit: { key: 'lowerLimit', value: '' },
                switch: { key: 'switch', value: '' },
            },
            {
                key: 'type',
                value: '室外温度',
                upperLimit: { key: 'upperLimit', value: '' },
                lowerLimit: { key: 'lowerLimit', value: '' },
                switch: { key: 'switch', value: '' },
            },
            {
                key: 'type',
                value: '二氧化碳',
                upperLimit: { key: 'upperLimit', value: '' },
                lowerLimit: { key: 'lowerLimit', value: '' },
                switch: { key: 'switch', value: '' },
            },
        ],
    },
};

const windowSettingTable = {
    mode1: {
        // 通用模式表格列配置
        columns: [
            { field: 'level', title: '光照', width: 80, align: 'center' },
            { field: 'window1', title: '小窗1', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'window2', title: '小窗2', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'window3', title: '小窗3', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'window4', title: '小窗4', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'window5', title: '小窗5', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'window6', title: '小窗6', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'window7', title: '小窗7', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'window8', title: '小窗8', width: 120, align: 'center', editRender: { name: 'input' } },
        ],
        // 默认表格数据
        defaultData: [
            {
                key: 'level',

                window1: { key: 'window1', value: '' },
                window2: { key: 'window2', value: '' },
                window3: { key: 'window3', value: '' },
                window4: { key: 'window4', value: '' },
                window5: { key: 'window5', value: '' },
                window6: { key: 'window6', value: '' },
                window7: { key: 'window7', value: '' },
                window8: { key: 'window8', value: '' },
            },
            {
                key: 'level',

                window1: { key: 'window1', value: '' },
                window2: { key: 'window2', value: '' },
                window3: { key: 'window3', value: '' },
                window4: { key: 'window4', value: '' },
                window5: { key: 'window5', value: '' },
                window6: { key: 'window6', value: '' },
                window7: { key: 'window7', value: '' },
                window8: { key: 'window8', value: '' },
            },
            {
                key: 'level',

                window1: { key: 'window1', value: '' },
                window2: { key: 'window2', value: '' },
                window3: { key: 'window3', value: '' },
                window4: { key: 'window4', value: '' },
                window5: { key: 'window5', value: '' },
                window6: { key: 'window6', value: '' },
                window7: { key: 'window7', value: '' },
                window8: { key: 'window8', value: '' },
            },
        ],
    },
};

const zoneAlarmSettingTable = {
    mode1: {
        // 通用模式表格列配置
        columns: [
            { field: 'type', title: '类型', width: 120, align: 'center' },
            { field: 'leftFront', title: '左前温度', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'leftMiddle', title: '左中温度', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'leftBack', title: '左后温度', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'rightFront', title: '右前温度', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'rightMiddle', title: '右中温度', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'rightBack', title: '右后温度', width: 120, align: 'center', editRender: { name: 'input' } },
        ],
        // 默认表格数据
        defaultData: [
            {
                key: 'type',
                value: '上限',
                leftFront: { key: 'leftFront', value: '' },
                leftMiddle: { key: 'leftMiddle', value: '' },
                leftBack: { key: 'leftBack', value: '' },
                rightFront: { key: 'rightFront', value: '' },
                rightMiddle: { key: 'rightMiddle', value: '' },
                rightBack: { key: 'rightBack', value: '' },
            },
            {
                key: 'type',
                value: '下限',
                leftFront: { key: 'leftFront', value: '' },
                leftMiddle: { key: 'leftMiddle', value: '' },
                leftBack: { key: 'leftBack', value: '' },
                rightFront: { key: 'rightFront', value: '' },
                rightMiddle: { key: 'rightMiddle', value: '' },
                rightBack: { key: 'rightBack', value: '' },
            },
            {
                key: 'type',
                value: '使能',
                leftFront: { key: 'leftFront', value: '' },
                leftMiddle: { key: 'leftMiddle', value: '' },
                leftBack: { key: 'leftBack', value: '' },
                rightFront: { key: 'rightFront', value: '' },
                rightMiddle: { key: 'rightMiddle', value: '' },
                rightBack: { key: 'rightBack', value: '' },
            },
        ],
    },
};

const customSettingTable = {
    mode1: {
        // 通用模式表格列配置
        columns: [
            { field: 'tempMode', title: '温度模式', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'date', title: '日龄', width: 120, align: 'center', editRender: { name: 'input' } },
        ],
        // 默认表格数据
        defaultData: [
            {
                tempMode: { key: 'tempMode', value: '' },
                date: { key: 'date', value: '' },
            },
        ],
    },

    mode2: {
        // 特定1模式表格列配置
        columns: [
            { field: 'tempMode', title: '温度模式', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'date', title: '日龄', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'temp', title: '温度', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'adjustTemp', title: '改变量', width: 120, align: 'center', editRender: { name: 'input' } },
        ],
        // 默认表格数据
        defaultData: [
            {
                tempMode: { key: 'tempMode', value: '' },
                date: { key: 'date', value: '' },
                temp: { key: 'temp', value: '' },
                adjustTemp: { key: 'adjustTemp', value: '' },
            },
        ],
    },
};

export default {
    fanSettingTable,
    ratioSettingTable,
    lightSettingTable,
    systemSettingTable,
    temperatureSettingTable,
    alarmSettingTable,
    windowSettingTable,
    zoneAlarmSettingTable,
    customSettingTable,
    humiditySettingTable,
    heatingSettingTable,
    coolingSettingTable,
    gasSettingTable,
    addOxygenSettingTable,
};
