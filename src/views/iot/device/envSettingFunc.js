// 风机设置
export function generateFanSettingTable(fans, frequency, level, valueIDs, options) {
    const _columns = []; // 用于存储风机列
    const header = [
        { field: 'level', title: '等级', width: 80, align: 'center' }, // 表头：等级列
    ];
    const endcolumns = [
        {
            field: 'startTime',
            title: '升级温差',
            width: 160,
            align: 'center',
            editRender: { name: 'VxeNumberInput', props: { type: 'float', digits: 1 } }, // 可编辑的输入框
        },
        {
            field: 'endTime',
            title: '开启时间',
            width: 160,
            align: 'center',
            editRender: { name: 'VxeNumberInput', props: { type: 'float', digits: 1 } }, // 可编辑的输入框
        },
        {
            field: 'temperature',
            title: '关闭时间',
            width: 100,
            align: 'center',
            editRender: { name: 'VxeNumberInput', props: { type: 'float', digits: 1 } }, // 可编辑的输入框
        },
    ];

    // 动态生成风机列
    for (let i = 0; i < fans; i++) {
        _columns.push({
            field: `fan${i + 1}`, // 列字段名，如 fan1, fan2, ..., fan12
            originField: `fan${i + 1}`,
            title: `风机${i + 1}`, // 列标题，如 风机1, 风机2, ..., 风机12
            width: 120,
            align: 'center',
            editRender: {
                name: 'select',
                options: options,
            },
        });
    }

    // 动态生成频率列
    for (let z = 0; z < frequency; z++) {
        _columns.push({
            field: `frequencyFan${z + 1}`, // 列字段名，如 fan1, fan2, ..., fan12
            originField: `frequencyFan${z + 1}`,
            title: `变频风机${z + 1}`, // 列标题，如 风机1, 风机2, ..., 风机12
            width: 120,
            align: 'center',
            editRender: {
                name: 'input', // 下拉菜单
            },
        });
    }

    // 合并所有列：表头 + 风机列 + 结束列
    const settingcolumns = [..._columns, ...endcolumns];
    console.log('表格列结构：', settingcolumns);

    // 生成表格行数据
    const rows = [];
    for (let j = 0; j < level; j++) {
        const row = {};
        // 初始化每个风机的状态为“关闭”
        for (let i = 0; i < fans; i++) {
            row[`fan${i + 1}`] = { key: `fan${i + 1}`, value: 0, sort: i + 1 }; // 默认值为 "0"（关闭）
        }
        for (let z = 0; z < frequency; z++) {
            // if (j === 0) {
            //     if (z === 0) {
            //         row[`ScaleSettingFrequencyConversion01`] = { key: `ScaleSettingFrequencyConversion01`, value: 0, sort: 19 };
            //     } else if (z === 1) {
            //         row[`ScaleSettingFrequencyConversion02`] = { key: `ScaleSettingFrequencyConversion01`, value: 0, sort: 20 };
            //     } else if (z === 2) {
            //         row[`ScaleSettingFrequencyConversion03`] = { key: `ScaleSettingFrequencyConversion01`, value: 0, sort: 21 };
            //     } else if (z === 3) {
            //         row[`ScaleSettingFrequencyConversion04`] = { key: `ScaleSettingFrequencyConversion01`, value: 0, sort: 22 };
            //     }
            // } else if (j === 1) {
            //     if (z === 0) {
            //         row[`ScaleSettingFrequencyConversion09`] = { key: `ScaleSettingFrequencyConversion09`, value: 0, sort: 19 };
            //     } else if (z === 1) {
            //         row[`ScaleSettingFrequencyConversion10`] = { key: `ScaleSettingFrequencyConversion10`, value: 0, sort: 20 };
            //     } else if (z === 2) {
            //         row[`ScaleSettingFrequencyConversion11`] = { key: `ScaleSettingFrequencyConversion11`, value: 0, sort: 21 };
            //     } else if (z === 3) {
            //         row[`ScaleSettingFrequencyConversion12`] = { key: `ScaleSettingFrequencyConversion12`, value: 0, sort: 22 };
            //     }
            // } else {
            //     row[`ScaleSettingFrequencyConversion${j * 8 + 1}`] = { key: `ScaleSettingFrequencyConversion${j * 8 + 1}`, value: 0, sort: fans + z + 1 };
            // }
            row[`frequencyFan${z + 1}`] = { key: `frequencyFan${z + 1}`, value: 0, sort: fans + z + 1 };
        }

        // 添加其他字段
        row.startTime = { key: 'startTime', value: '0', sort: fans + frequency + 1 };
        row.endTime = { key: 'endTime', value: '0', sort: fans + frequency + 2 };
        row.temperature = {
            key: 'temperature',
            value: '0',
            sort: fans + frequency + 3,
        };

        rows.push(row); // 将当前行添加到 rows 数组中
    }
    console.log(rows);
    rows.forEach((item, idx) => {
        const _arr = valueIDs[idx];
        for (const key in item) {
            const sort = item[key].sort; // 获取 sort 值
            if (sort !== undefined && _arr[sort - 1] !== undefined) {
                item[key].key = _arr[sort - 1]; // 将 key 赋值给 arr 的对应位置
                item[key].sort = sort;
            }
        }
    });
    return {
        columns: [...header, ...settingcolumns],
        defaultData: rows.map((item, idx) => {
            return {
                level: { key: 'level', value: idx + 1 },
                ...item,
            };
        }),
        optionsFormat: (value) => {
            return options.find((option) => option === value)?.label || value;
        },
    };
}
// 比例设置
export function generateRatioTable(vents, level, valueIDs) {
    const _columns = []; // 用于存储变频设备列
    const header = [
        { field: 'level', title: '等级', width: 80, align: 'center' }, // 表头：等级列
    ];
    const endColumns = [
        {
            field: 'windWindow',
            title: '侧风窗',
            align: 'center',
            editRender: { name: 'input' },
        },
        {
            field: 'skyWindow',
            title: '天窗窗',
            align: 'center',
            editRender: { name: 'input' },
        },
        {
            field: 'rollScreen',
            title: '卷帘',
            align: 'center',
            editRender: { name: 'input' },
        },
        {
            field: 'sunScreen',
            title: '遮阳',
            align: 'center',
            editRender: { name: 'input' },
        },
    ];

    // 动态生成变频设备列
    for (let i = 0; i < vents; i++) {
        _columns.push({
            field: `vent${i + 1}`, // 列字段名，如 vent1, vent2, ..., vent8
            title: `变频${i + 1}`, // 列标题，如 变频1, 变频2, ..., 变频8
            align: 'center',
            editRender: { name: 'input' }, // 使用输入框
        });
    }

    // 合并所有列：表头 + 变频设备列 + 结束列
    const ratioColumns = [..._columns, ...endColumns];
    console.log('比例设置表格列结构：', ratioColumns);

    // 生成表格行数据
    const rows = [];
    for (let j = 0; j < level; j++) {
        const row = {};

        // 初始化每个变频设备的值为空
        for (let i = 0; i < vents; i++) {
            row[`vent${i + 1}`] = { key: `vent${i + 1}`, value: '10', sort: i + 1 };
        }

        // 添加其他字段
        row.windWindow = { key: 'windWindow', value: '1', sort: vents + 1 };
        row.skyWindow = { key: 'skyWindow', value: '2', sort: vents + 2 };
        row.rollScreen = { key: 'rollScreen', value: '3', sort: vents + 3 };
        row.sunScreen = { key: 'sunScreen', value: '4', sort: vents + 4 };

        rows.push(row); // 将当前行添加到 rows 数组中
    }

    rows.forEach((item, idx) => {
        const _arr = valueIDs[idx];
        for (const key in item) {
            const sort = item[key].sort; // 获取 sort 值
            if (sort !== undefined && _arr[sort - 1] !== undefined) {
                item[key].key = _arr[sort - 1]; // 将 key 赋值给 arr 的对应位置
                item[key].sort = sort;
            }
        }
    });

    // 返回生成的表格配置
    return {
        columns: [...header, ...ratioColumns],
        defaultData: rows.map((item, idx) => {
            return {
                level: { key: 'level', value: idx + 1 },
                ...item,
            };
        }),
    };
}
// 光照设置
export function generateLightTable(mode, levels, valueIDs) {
    // 定义不同模式的列配置
    const modeColumns = {
        mode1: [
            { field: 'level', title: '', width: 80, align: 'center' },
            { field: 'light', title: '光照', align: 'center', editRender: { name: 'input' } },
            { field: 'startTime1', title: '开启时间', align: 'center', editRender: { name: 'input' } },
            { field: 'endTime1', title: '关闭时间', align: 'center', editRender: { name: 'input' } },
            {
                field: 'time',
                title: '开关',
                align: 'center',
                editRender: {
                    name: 'select',
                    options: [
                        { label: '开启', value: 1 },
                        { label: '关闭', value: 0 },
                    ],
                },
            },
        ],
        mode2: [
            { field: 'level', title: '', width: 100, align: 'center' },
            { field: 'lightStartTime', title: '光照日龄', align: 'center', editRender: { name: 'input' } },
            { field: 'lightStartIntensity', title: '光照开始时', align: 'center', editRender: { name: 'input' } },
            { field: 'lightEndTime', title: '光照开始分', align: 'center', editRender: { name: 'input' } },
            { field: 'lightEndIntensity', title: '光照结束时', align: 'center', editRender: { name: 'input' } },
            { field: 'lightDuration', title: '光照结束分', align: 'center', editRender: { name: 'input' } },
            { field: 'lightMaxIntensity', title: '光照开始亮度', align: 'center', editRender: { name: 'input' } },
            { field: 'lightMinIntensity', title: '光照结束亮度', align: 'center', editRender: { name: 'input' } },
            {
                field: 'lightControl',
                title: '光照控制开关',
                align: 'center',
                editRender: {
                    name: 'select',
                    options: [
                        { label: '开启', value: 1 },
                        { label: '关闭', value: 0 },
                    ],
                },
            },
        ],
    };

    // 确保选择的模式有效
    if (!modeColumns[mode]) {
        console.error(`无效的模式: ${mode}，使用默认模式 mode1`);
        mode = 'mode1';
    }

    // 获取当前模式的列配置
    const columns = modeColumns[mode];

    // 生成表格行数据
    const rows = [];
    for (let i = 0; i < levels; i++) {
        const row = {};
        if (mode === 'mode1') {
            row.light = { key: 'light', value: '1', sort: 1 };
            row.startTime1 = { key: 'startTime1', value: '2', sort: 2 };
            row.endTime1 = { key: 'endTime1', value: '3', sort: 3 };
            row.time = { key: 'time', value: '4', sort: 4 };
        } else if (mode === 'mode2') {
            row.lightStartTime = { key: 'lightStartTime', value: '1', sort: 1 };
            row.lightStartIntensity = { key: 'lightStartIntensity', value: '2', sort: 2 };
            row.lightEndTime = { key: 'lightEndTime', value: '3', sort: 3 };
            row.lightEndIntensity = { key: 'lightEndIntensity', value: '4', sort: 4 };
            row.lightDuration = { key: 'lightDuration', value: '5', sort: 5 };
            row.lightMaxIntensity = { key: 'lightMaxIntensity', value: '6', sort: 6 };
            row.lightMinIntensity = { key: 'lightMinIntensity', value: '7', sort: 7 };
            row.lightControl = { key: 'lightControl', value: '1', sort: 8 };
        }

        rows.push(row);
    }

    rows.forEach((item, idx) => {
        const _arr = valueIDs[idx];
        for (const key in item) {
            const sort = item[key].sort; // 获取 sort 值
            if (sort !== undefined && _arr[sort - 1] !== undefined) {
                item[key].key = _arr[sort - 1]; // 将 key 赋值给 arr 的对应位置
                item[key].sort = sort;
            }
        }
    });
    return {
        columns: columns,
        defaultData: rows.map((item, idx) => {
            return {
                level: { key: 'level', value: idx + 1 },
                ...item,
            };
        }),
    };
}
// 系统设置
export function generateSystemTable(mode, levels, valueIDs) {
    // 定义不同模式的列和字段配置
    const modeConfig = {
        mode1: {
            columns: [
                { field: 'tempDiff', title: '幸福温度', align: 'center', editRender: { name: 'VxeNumberInput', props: { type: 'float', digits: 1 } } },
                { field: 'windDirection', title: '最小时间', align: 'center', editRender: { name: 'VxeNumberInput', props: { type: 'float', digits: 1 } } },
                { field: 'ventTime', title: '降级延时', align: 'center', editRender: { name: 'VxeNumberInput', props: { type: 'float', digits: 1 } } },
                { field: 'tempRange', title: '隧道温度', align: 'center', editRender: { name: 'VxeNumberInput', props: { type: 'float', digits: 1 } } },
                { field: 'defrostTime', title: '默认时间', align: 'center', editRender: { name: 'VxeNumberInput', props: { type: 'float', digits: 1 } } },
                { field: 'tempControl', title: '通风级别', align: 'center', editRender: { name: 'input' } },
                { field: 'initialTemp', title: '初始温度', align: 'center', editRender: { name: 'VxeNumberInput', props: { type: 'float', digits: 1 } } },
                { field: 'openingTime', title: '升级延时', align: 'center', editRender: { name: 'VxeNumberInput', props: { type: 'float', digits: 1 } } },
            ],
        },
        mode2: {
            columns: [
                { field: 'tempControl', title: '通风等级', align: 'center', editRender: { name: 'input' } },
                { field: 'openingTime', title: '升级延时', align: 'center', editRender: { name: 'VxeNumberInput', props: { type: 'float', digits: 1 } } },
                { field: 'ventTime', title: '降级延时', align: 'center', editRender: { name: 'VxeNumberInput', props: { type: 'float', digits: 1 } } },
                { field: 'initialTempRange', title: '初始隧道等级', align: 'center', editRender: { name: 'input' } },
                { field: 'tempControlRange', title: '隧道最短时间', align: 'center', editRender: { name: 'VxeNumberInput', props: { type: 'float', digits: 1 } } },
                { field: 'defrostTime', title: '默认时间', align: 'center', editRender: { name: 'VxeNumberInput', props: { type: 'float', digits: 1 } } },
            ],
        },
    };

    // 确保选择的模式有效
    if (!modeConfig[mode]) {
        console.error(`无效的模式: ${mode}，使用默认模式 mode1`);
        mode = 'mode1';
    }

    // 获取当前模式的配置
    const config = modeConfig[mode];
    const columns = config.columns;

    // 生成表格行数据
    const rows = [];
    for (let i = 0; i < levels; i++) {
        const row = {};
        // 为每个字段创建对象
        if (mode === 'mode1') {
            row.tempDiff = { key: 'tempDiff', value: '1', sort: 1 };
            row.windDirection = { key: 'windDirection', value: '2', sort: 2 };
            row.ventTime = { key: 'ventTime', value: '3', sort: 3 };
            row.tempRange = { key: 'tempRange', value: '4', sort: 4 };
            row.defrostTime = { key: 'defrostTime', value: '5', sort: 5 };
            row.tempControl = { key: 'tempControl', value: '6', sort: 6 };
            row.initialTemp = { key: 'initialTemp', value: '7', sort: 7 };
            row.openingTime = { key: 'openingTime', value: '8', sort: 8 };
        } else if (mode === 'mode2') {
            row.tempControl = { key: 'tempControl', value: '1', sort: 1 };
            row.openingTime = { key: 'openingTime', value: '2', sort: 2 };
            row.ventTime = { key: 'ventTime', value: '3', sort: 3 };
            row.initialTempRange = { key: 'initialTempRange', value: '5', sort: 4 };
            row.tempControlRange = { key: 'tempControlRange', value: '6', sort: 5 };
            row.defrostTime = { key: 'defrostTime', value: '7', sort: 6 };
        }

        rows.push(row);
    }

    // 返回完整的表格配置
    rows.forEach((item, idx) => {
        const _arr = valueIDs[idx];
        for (const key in item) {
            const sort = item[key].sort; // 获取 sort 值
            if (sort !== undefined && _arr[sort - 1] !== undefined) {
                item[key].key = _arr[sort - 1]; // 将 key 赋值给 arr 的对应位置
                item[key].sort = sort;
            }
        }
    });
    return {
        columns: columns,
        defaultData: rows.map((item, idx) => {
            return {
                level: { key: 'level', value: idx + 1 },
                ...item,
            };
        }),
    };
}
// 湿度设置
export function generateHumidityTable(mode, levels, valueIDs) {
    // 定义不同模式的列和字段配置
    const modeConfig = {
        mode1: {
            columns: [
                {
                    field: 'humiditySwitch',
                    title: '湿度开关',
                    align: 'center',
                    editRender: {
                        name: 'select',
                        options: [
                            { label: '开启', value: 1 },
                            { label: '关闭', value: 0 },
                        ],
                    },
                },
                { field: 'startHumidity', title: '控制间隔', align: 'center', editRender: { name: 'VxeNumberInput', props: { type: 'float', digits: 1 } } },
                { field: 'startTemp', title: '开启湿度', align: 'center', editRender: { name: 'input' } },
                { field: 'protectTemp1', title: '结束湿度', align: 'center', editRender: { name: 'input' } },
                { field: 'controlTime2', title: '控制时间', align: 'center', editRender: { name: 'VxeNumberInput', props: { type: 'float', digits: 1 } } },
                { field: 'controlTime3', title: '温度差异', align: 'center', editRender: { name: 'VxeNumberInput', props: { type: 'float', digits: 1 } } },
            ],
        },
        mode2: {
            // ["湿度控制开关", "湿度开始值", "湿度结束值", "湿度控制时间", "湿度控制间隔", "湿度温度差"]
            columns: [
                {
                    field: 'humiditySwitch',
                    title: '湿度控制开关',
                    align: 'center',
                    editRender: {
                        name: 'select',
                        options: [
                            { label: '开启', value: 1 },
                            { label: '关闭', value: 0 },
                        ],
                    },
                },
                { field: 'startHumidity', title: '湿度开始值', align: 'center', editRender: { name: 'input' } },
                { field: 'startTemp', title: '湿度结束值', align: 'center', editRender: { name: 'input' } },
                { field: 'protectTemp', title: '湿度控制时间', align: 'center', editRender: { name: 'VxeNumberInput', props: { type: 'float', digits: 1 } } },
                { field: 'controlTime', title: '湿度控制间隔', align: 'center', editRender: { name: 'VxeNumberInput', props: { type: 'float', digits: 1 } } },
                { field: 'humidityRange', title: '湿度温度差', align: 'center', editRender: { name: 'VxeNumberInput', props: { type: 'float', digits: 1 } } },
            ],
        },
    };

    // 确保选择的模式有效
    if (!modeConfig[mode]) {
        console.error(`无效的模式: ${mode}，使用默认模式 mode1`);
        mode = 'mode1';
    }

    // 获取当前模式的配置
    const config = modeConfig[mode];
    const columns = config.columns;

    // 生成表格行数据
    const rows = [];
    for (let i = 0; i < levels; i++) {
        const row = {};
        if (mode === 'mode1') {
            row.humiditySwitch = { key: 'humiditySwitch', value: '1', sort: 1 };
            row.startHumidity = { key: 'startHumidity', value: '2', sort: 2 };
            row.startTemp = { key: 'startTemp', value: '3', sort: 3 };
            row.protectTemp = { key: 'protectTemp', value: '4', sort: 4 };
        } else if (mode === 'mode2') {
            row.humiditySwitch = { key: 'humiditySwitch', value: '1', sort: 1 };
            row.startHumidity = { key: 'startHumidity', value: '2', sort: 2 };
            row.startTemp = { key: 'startTemp', value: '3', sort: 3 };
            row.protectTemp = { key: 'protectTemp', value: '4', sort: 4 };
            row.controlTime = { key: 'controlTime', value: '5', sort: 5 };
            row.humidityRange = { key: 'humidityRange', value: '6', sort: 6 };
        }

        rows.push(row);
    }

    rows.forEach((item, idx) => {
        const _arr = valueIDs[idx];
        for (const key in item) {
            const sort = item[key].sort; // 获取 sort 值
            if (sort !== undefined && _arr[sort - 1] !== undefined) {
                item[key].key = _arr[sort - 1]; // 将 key 赋值给 arr 的对应位置
                item[key].sort = sort;
            }
        }
    });
    return {
        columns: columns,
        defaultData: rows.map((item, idx) => {
            return {
                level: { key: 'level', value: idx + 1 },
                ...item,
            };
        }),
    };
}
// 加热设置
export function generateHeatingTable(mode, levels, valueIDs) {
    // 定义不同模式的列和字段配置
    const modeConfig = {
        mode1: {
            columns: [
                { field: 'level', title: '等级', width: 80, align: 'center' },
                { field: 'startTime1', title: '开启时间', align: 'center', editRender: { name: 'input' } },
                { field: 'endTime1', title: '关闭时间', align: 'center', editRender: { name: 'input' } },
                { field: 'startTemp', title: '开启温度', align: 'center', editRender: { name: 'VxeNumberInput', props: { type: 'float', digits: 1 } } },
                { field: 'endTemp', title: '关闭温度', align: 'center', editRender: { name: 'VxeNumberInput', props: { type: 'float', digits: 1 } } },
                { field: 'openTime', title: '开启时', align: 'center', editRender: { name: 'input' } },
                { field: 'closeTime', title: '开启分', align: 'center', editRender: { name: 'input' } },
                { field: 'lowTemp', title: '结束时', align: 'center', editRender: { name: 'input' } },
                { field: 'highTemp', title: '结束分', align: 'center', editRender: { name: 'input' } },
            ],
        },
        mode2: {
            // ["加热开始时间时", "加热开始时间分", "加热结束时间时", "加热结束时间分", "加热开始温度", "加热结束温度", "加热一", "加热二", "加热三"]
            columns: [
                { field: 'level', title: '', width: 80, align: 'center' },
                { field: 'openTime', title: '加热开始时', align: 'center', editRender: { name: 'input' } },
                { field: 'closeTime', title: '加热开始分', align: 'center', editRender: { name: 'input' } },
                { field: 'lowTemp', title: '加热结束时', align: 'center', editRender: { name: 'input' } },
                { field: 'highTemp', title: '加热结束分', align: 'center', editRender: { name: 'input' } },
                { field: 'startTemp', title: '加热开始温度', align: 'center', editRender: { name: 'VxeNumberInput', props: { type: 'float', digits: 1 } } },
                { field: 'endTemp', title: '加热结束温度', align: 'center', editRender: { name: 'VxeNumberInput', props: { type: 'float', digits: 1 } } },
                {
                    field: 'addHeat1',
                    title: '加热一',
                    align: 'center',
                    editRender: {
                        name: 'select',
                        options: [
                            { label: '开启', value: 1 },
                            { label: '关闭', value: 0 },
                        ],
                    },
                },
                {
                    field: 'addHeat2',
                    title: '加热二',
                    align: 'center',
                    editRender: {
                        name: 'select',
                        options: [
                            { label: '开启', value: 1 },
                            { label: '关闭', value: 0 },
                        ],
                    },
                },
                {
                    field: 'addHeat3',
                    title: '加热三',
                    align: 'center',
                    editRender: {
                        name: 'select',
                        options: [
                            { label: '开启', value: 1 },
                            { label: '关闭', value: 0 },
                        ],
                    },
                },
            ],
        },
    };

    // 确保选择的模式有效
    if (!modeConfig[mode]) {
        console.error(`无效的模式: ${mode}，使用默认模式 mode1`);
        mode = 'mode1';
    }

    // 获取当前模式的配置
    const config = modeConfig[mode];
    const columns = config.columns;

    // 生成表格行数据
    const rows = [];
    for (let i = 0; i < levels; i++) {
        const row = {};
        if (mode === 'mode1') {
            row.startTime1 = { key: 'startTime1', value: '1', sort: 1 };
            row.endTime1 = { key: 'endTime1', value: '2', sort: 2 };
            row.startTemp = { key: 'startTemp', value: '3', sort: 3 };
            row.endTemp = { key: 'endTemp', value: '4', sort: 4 };
            row.openTime = { key: 'openTime', value: '5', sort: 5 };
            row.closeTime = { key: 'closeTime', value: '6', sort: 6 };
            row.lowTemp = { key: 'lowTemp', value: '7', sort: 7 };
            row.highTemp = { key: 'highTemp', value: '8', sort: 8 };
        } else if (mode === 'mode2') {
            row.openTime = { key: 'openTime', value: '1', sort: 1 };
            row.closeTime = { key: 'closeTime', value: '2', sort: 2 };
            row.lowTemp = { key: 'lowTemp', value: '3', sort: 3 };
            row.highTemp = { key: 'highTemp', value: '4', sort: 4 };
            row.startTemp = { key: 'startTemp', value: '5', sort: 5 };
            row.endTemp = { key: 'endTemp', value: '6', sort: 6 };
            row.addHeat1 = { key: 'addHeat1', value: '1', sort: 7 };
            row.addHeat2 = { key: 'addHeat2', value: '1', sort: 8 };
            row.addHeat3 = { key: 'addHeat3', value: '0', sort: 9 };
        }

        rows.push(row);
    }

    rows.forEach((item, idx) => {
        const _arr = valueIDs[idx];
        for (const key in item) {
            const sort = item[key].sort; // 获取 sort 值
            if (sort !== undefined && _arr[sort - 1] !== undefined) {
                item[key].key = _arr[sort - 1]; // 将 key 赋值给 arr 的对应位置
                item[key].sort = sort;
            }
        }
    });
    console.log(rows, 'rows');
    return {
        columns: columns,
        defaultData: rows.map((item, idx) => {
            return {
                level: { key: 'level', value: idx + 1 },
                ...item,
            };
        }),
    };
}

// 制冷设置
export function generateCoolingTable(mode, levels, valueIDs) {
    // 定义模式的列和字段配置
    const modeConfig = {
        mode1: {
            columns: [
                { field: 'level', title: '', width: 80, align: 'center' },
                { field: 'startTime1', title: '开启时间', align: 'center', editRender: { name: 'input' } },
                { field: 'endTime1', title: '结束时间', align: 'center', editRender: { name: 'input' } },
                { field: 'startTemp', title: '开始温度', align: 'center', editRender: { name: 'input' } },
                { field: 'endTemp', title: '结束温度', align: 'center', editRender: { name: 'input' } },
                { field: 'openTime', title: '开始时', align: 'center', editRender: { name: 'VxeNumberInput', props: { type: 'float', digits: 1 } } },
                { field: 'closeTime', title: '开始分', align: 'center', editRender: { name: 'VxeNumberInput', props: { type: 'float', digits: 1 } } },
                { field: 'lowTemp', title: '结束时', align: 'center', editRender: { name: 'input' } },
                { field: 'highTemp', title: '结束分', align: 'center', editRender: { name: 'input' } },
            ],
        },
        mode2: {
            columns: [
                { field: 'level', title: '', width: 80, align: 'center' },
                { field: 'startTime1', title: '开启时', align: 'center', editRender: { name: 'input' } },
                { field: 'endTime1', title: '开启分', align: 'center', editRender: { name: 'input' } },
                { field: 'startTemp', title: '关闭时', align: 'center', editRender: { name: 'input' } },
                { field: 'endTemp', title: '关闭分', align: 'center', editRender: { name: 'input' } },
                { field: 'openTime', title: '开始温度', align: 'center', editRender: { name: 'VxeNumberInput', props: { type: 'float', digits: 1 } } },
                { field: 'closeTime', title: '结束温度', align: 'center', editRender: { name: 'VxeNumberInput', props: { type: 'float', digits: 1 } } },
                { field: 'lowTemp', title: '开始时长', align: 'center', editRender: { name: 'input' } },
                { field: 'highTemp', title: '结束时长', align: 'center', editRender: { name: 'input' } },
            ],
        },
    };

    // 确保选择的模式有效
    if (!modeConfig[mode]) {
        console.error(`无效的模式: ${mode}，使用默认模式 mode1`);
        mode = 'mode1';
    }

    // 获取当前模式的配置
    const config = modeConfig[mode];
    const columns = config.columns;

    const rows = [];
    for (let i = 0; i < levels; i++) {
        const row = {};
        if (mode === 'mode1') {
            row.startTime1 = { key: 'startTime1', value: '1', sort: 1 };
            row.endTime1 = { key: 'endTime1', value: '2', sort: 2 };
            row.startTemp = { key: 'startTemp', value: '3', sort: 3 };
            row.endTemp = { key: 'endTemp', value: '4', sort: 4 };
            row.openTime = { key: 'openTime', value: '5', sort: 5 };
            row.closeTime = { key: 'closeTime', value: '6', sort: 6 };
            row.lowTemp = { key: 'lowTemp', value: '7', sort: 7 };
            row.highTemp = { key: 'highTemp', value: '8', sort: 8 };
        }

        rows.push(row);
    }

    rows.forEach((item, idx) => {
        const _arr = valueIDs[idx];
        for (const key in item) {
            const sort = item[key].sort; // 获取 sort 值
            if (sort !== undefined && _arr[sort - 1] !== undefined) {
                item[key].key = _arr[sort - 1]; // 将 key 赋值给 arr 的对应位置
                item[key].sort = sort;
            }
        }
    });
    return {
        columns: columns,
        defaultData: rows.map((item, idx) => {
            return {
                level: { key: 'level', value: idx + 1 },
                ...item,
            };
        }),
    };
}

// 气体设置
export function generateGasTable(mode, levels, valueIDs) {
    // 定义不同模式的列和字段配置
    const modeConfig = {
        mode1: {
            columns: [
                { field: 'ventilationTime', title: '间隔时间', width: 120, align: 'center', editRender: { name: 'VxeNumberInput', props: { type: 'float', digits: 1 } } },
                { field: 'controlTime', title: '控制时间', width: 120, align: 'center', editRender: { name: 'VxeNumberInput', props: { type: 'float', digits: 1 } } },
                { field: 'tempDiff', title: '温度差异', width: 120, align: 'center', editRender: { name: 'VxeNumberInput', props: { type: 'float', digits: 1 } } },
                { field: 'nitrogenLimit', title: '氮气开始', width: 120, align: 'center', editRender: { name: 'input' } },
                { field: 'nitrogenSpeed', title: '氮气结束', width: 120, align: 'center', editRender: { name: 'input' } },
                { field: 'co2Switch', title: 'CO2开始', width: 120, align: 'center', editRender: { name: 'input' } },
                { field: 'co2Speed', title: 'CO2结束', width: 120, align: 'center', editRender: { name: 'input' } },
            ],
        },
        mode2: {
            columns: [
                {
                    field: 'controlSwitch',
                    title: '控制开关',
                    align: 'center',
                    editRender: {
                        name: 'select',
                        options: [
                            { label: '开启', value: 1 },
                            { label: '关闭', value: 0 },
                        ],
                    },
                },
                { field: 'co2Switch', title: '二氧化碳开始值', align: 'center', editRender: { name: 'input' } },
                { field: 'co2Speed', title: '二氧化碳结束值', align: 'center', editRender: { name: 'input' } },
                { field: 'nitrogenLimit', title: '氨气开始值', align: 'center', editRender: { name: 'input' } },
                { field: 'nitrogenSpeed', title: '氨气结束值', align: 'center', editRender: { name: 'input' } },
                { field: 'controlTime', title: '控制时间', align: 'center', editRender: { name: 'VxeNumberInput', props: { type: 'float', digits: 1 } } },
                { field: 'ventilationTime', title: '控制间隔', align: 'center', editRender: { name: 'VxeNumberInput', props: { type: 'float', digits: 1 } } },
                { field: 'tempDiff', title: '温度偏差', align: 'center', editRender: { name: 'VxeNumberInput', props: { type: 'float', digits: 1 } } },
            ],
        },
    };

    // 确保选择的模式有效
    if (!modeConfig[mode]) {
        console.error(`无效的模式: ${mode}，使用默认模式 mode1`);
        mode = 'mode1';
    }

    // 获取当前模式的配置
    const config = modeConfig[mode];
    const columns = config.columns;

    const rows = [];
    for (let i = 0; i < levels; i++) {
        const row = {};
        if (mode === 'mode1') {
            row.ventilationTime = { key: 'ventilationTime', value: '1', sort: 1 };
            row.controlTime = { key: 'controlTime', value: '2', sort: 2 };
            row.tempDiff = { key: 'tempDiff', value: '3', sort: 3 };
            row.nitrogenLimit = { key: 'nitrogenLimit', value: '4', sort: 4 };
            row.nitrogenSpeed = { key: 'nitrogenSpeed', value: '5', sort: 5 };
            row.co2Switch = { key: 'co2Switch', value: '6', sort: 6 };
            row.co2Speed = { key: 'co2Speed', value: '7', sort: 7 };
        } else if (mode === 'mode2') {
            row.controlSwitch = { key: 'controlSwitch', value: '1', sort: 1 };
            row.co2Switch = { key: 'co2Switch', value: '2', sort: 2 };
            row.co2Speed = { key: 'co2Speed', value: '3', sort: 3 };
            row.nitrogenLimit = { key: 'nitrogenLimit', value: '4', sort: 4 };
            row.nitrogenSpeed = { key: 'nitrogenSpeed', value: '5', sort: 5 };
            row.controlTime = { key: 'controlTime', value: '6', sort: 6 };
            row.ventilationTime = { key: 'ventilationTime', value: '7', sort: 7 };
            row.tempDiff = { key: 'tempDiff', value: '8', sort: 8 };
        }
        rows.push(row);
    }

    rows.forEach((item, idx) => {
        const _arr = valueIDs[idx];
        for (const key in item) {
            const sort = item[key].sort; // 获取 sort 值
            if (sort !== undefined && _arr[sort - 1] !== undefined) {
                item[key].key = _arr[sort - 1]; // 将 key 赋值给 arr 的对应位置
                item[key].sort = sort;
            }
        }
    });
    return {
        columns: columns,
        defaultData: rows.map((item, idx) => {
            return {
                level: { key: 'level', value: idx + 1 },
                ...item,
            };
        }),
    };
}

// 加氧设置
export function generateAddOxygenTable(mode, levels, valueIDs) {
    // 定义模式的列和字段配置
    const modeConfig = {
        mode1: {
            columns: [
                { field: 'startNitrogenTime', title: '关闭加氧设备的氧气含量值', align: 'center', editRender: { name: 'input' } },
                { field: 'endNitrogenTime', title: '开启加氧设备的氧气含量值', align: 'center', editRender: { name: 'input' } },
                { field: 'startControlTime', title: '加氧设备开启最长时间', align: 'center', editRender: { name: 'VxeNumberInput', props: { type: 'float', digits: 1 } } },
                { field: 'endControlTime', title: '加氧设备开启最短时间', align: 'center', editRender: { name: 'VxeNumberInput', props: { type: 'float', digits: 1 } } },
                { field: 'nitrogenSpeed', title: '延时时长', align: 'center', editRender: { name: 'VxeNumberInput', props: { type: 'float', digits: 1 } } },
                { field: 'openInterval', title: '间隔时长', align: 'center', editRender: { name: 'VxeNumberInput', props: { type: 'float', digits: 1 } } },
            ],
        },
    };

    // 确保选择的模式有效
    if (!modeConfig[mode]) {
        console.error(`无效的模式: ${mode}，使用默认模式 mode1`);
        mode = 'mode1';
    }

    // 获取当前模式的配置
    const config = modeConfig[mode];
    const columns = config.columns;
    // 生成表格行数据

    const rows = [];
    for (let i = 0; i < levels; i++) {
        const row = {};
        if (mode === 'mode1') {
            row.startNitrogenTime = { key: 'startNitrogenTime', value: '1', sort: 1 };
            row.endNitrogenTime = { key: 'endNitrogenTime', value: '2', sort: 2 };
            row.startControlTime = { key: 'startControlTime', value: '3', sort: 3 };
            row.endControlTime = { key: 'endControlTime', value: '4', sort: 4 };
            row.nitrogenSpeed = { key: 'nitrogenSpeed', value: '5', sort: 5 };
            row.openInterval = { key: 'openInterval', value: '6', sort: 6 };
        }
        rows.push(row);
    }

    rows.forEach((item, idx) => {
        const _arr = valueIDs[idx];
        for (const key in item) {
            const sort = item[key].sort; // 获取 sort 值
            if (sort !== undefined && _arr[sort - 1] !== undefined) {
                item[key].key = _arr[sort - 1]; // 将 key 赋值给 arr 的对应位置
                item[key].sort = sort;
            }
        }
    });

    return {
        columns: columns,
        defaultData: rows.map((item, idx) => {
            return {
                ...item,
            };
        }),
    };
}

export function generateTemperatureTable(mode, levels, valueIDs) {
    // 定义模式的列和字段配置
    const modeConfig = {
        mode1: {
            columns: [
                { field: 'level', title: '', width: 120, align: 'center' },
                { field: 'livingDate', title: '日龄', align: 'center', editRender: { name: 'input' } },
                { field: 'temperature', title: '温度', align: 'center', editRender: { name: 'VxeNumberInput', props: { type: 'float', digits: 1 } } },
            ],
        },
    };

    // 确保选择的模式有效
    if (!modeConfig[mode]) {
        console.error(`无效的模式: ${mode}，使用默认模式 mode1`);
        mode = 'mode1';
    }

    // 获取当前模式的配置
    const config = modeConfig[mode];
    const columns = config.columns;

    // 生成表格行数据
    const rows = [];
    for (let i = 0; i < levels; i++) {
        const row = {};
        if (mode === 'mode1') {
            row.livingDate = { key: 'startNitrogenTime', value: '1', sort: 1 };
            row.temperature = { key: 'endNitrogenTime', value: '2', sort: 2 };
        }
        rows.push(row);
    }

    rows.forEach((item, idx) => {
        const _arr = valueIDs[idx];
        for (const key in item) {
            const sort = item[key].sort; // 获取 sort 值
            if (sort !== undefined && _arr[sort - 1] !== undefined) {
                item[key].key = _arr[sort - 1]; // 将 key 赋值给 arr 的对应位置
                item[key].sort = sort;
            }
        }
    });
    return {
        columns: columns,
        defaultData: rows.map((item, idx) => {
            return {
                level: { key: 'level', value: idx + 1 },
                ...item,
            };
        }),
    };
}

// 报警设置
export function generateAlarmTable(mode, levels, valueIDs, title) {
    // 定义不同模式的列和字段配置
    const modeConfig = {
        mode1: {
            columns: [
                { field: 'type', title: '类型', width: 120, align: 'center' },
                { field: 'alarmUpperLimit', title: '上限', width: 120, align: 'center', editRender: { name: 'input' } },
                { field: 'alarmLowerLimit', title: '下限', width: 120, align: 'center', editRender: { name: 'input' } },
            ],
            fields: ['upperLimit', 'lowerLimit'],
        },
        mode2: {
            columns: [
                { field: 'type', title: '类型', width: 120, align: 'center' },
                { field: 'alarmUpperLimit', title: '上限', align: 'center', editRender: { name: 'VxeNumberInput', props: { type: 'float', digits: 1 } } },
                { field: 'alarmLowerLimit', title: '下限', align: 'center', editRender: { name: 'VxeNumberInput', props: { type: 'float', digits: 1 } } },
                {
                    field: 'alarmSwitch',
                    title: '开关',

                    align: 'center',
                    editRender: {
                        name: 'select',
                        options: [
                            { label: '开启', value: 1 },
                            { label: '关闭', value: 0 },
                        ],
                    },
                },
            ],
        },
    };

    // 确保选择的模式有效
    if (!modeConfig[mode]) {
        console.error(`无效的模式: ${mode}，使用默认模式 mode1`);
        mode = 'mode1';
    }

    // 获取当前模式的配置
    const config = modeConfig[mode];
    const columns = config.columns;

    // 生成表格行数据
    // 生成表格行数据
    const rows = [];
    for (let i = 0; i < levels; i++) {
        const row = {};
        if (mode === 'mode1') {
            row.alarmUpperLimit = { key: 'upperLimit', value: '1', sort: 1 };
            row.alarmLowerLimit = { key: 'lowerLimit', value: '2', sort: 2 };
            row.alarmSwitch = { key: 'switch', value: '1', sort: 3 };
        } else if (mode === 'mode2') {
            row.alarmUpperLimit = { key: 'upperLimit', value: '1', sort: 1 };
            row.alarmLowerLimit = { key: 'lowerLimit', value: '2', sort: 2 };
            row.alarmSwitch = { key: 'switch', value: '1', sort: 3 };
        }
        rows.push(row);
    }

    rows.forEach((item, idx) => {
        const _arr = valueIDs[idx];
        for (const key in item) {
            const sort = item[key].sort; // 获取 sort 值
            if (sort !== undefined && _arr[sort - 1] !== undefined) {
                item[key].key = _arr[sort - 1]; // 将 key 赋值给 arr 的对应位置
                item[key].sort = sort;
            }
        }
    });
    return {
        columns: columns,
        defaultData: rows.map((item, idx) => {
            return {
                type: { key: 'type', value: title[idx] },
                ...item,
            };
        }),
    };
}

// 小窗设置
export function generateWindowTable(mode, levels, valueIDs) {
    // 定义模式的列和字段配置
    const modeConfig = {
        mode1: {
            columns: [
                { field: 'level', title: '', width: 80, align: 'center' },
                { field: 'window1', title: '小窗1', align: 'center', editRender: { name: 'input' } },
                { field: 'window2', title: '小窗2', align: 'center', editRender: { name: 'input' } },
                { field: 'window3', title: '小窗3', align: 'center', editRender: { name: 'input' } },
                { field: 'window4', title: '小窗4', align: 'center', editRender: { name: 'input' } },
                { field: 'window5', title: '小窗5', align: 'center', editRender: { name: 'input' } },
                { field: 'window6', title: '小窗6', align: 'center', editRender: { name: 'input' } },
                { field: 'window7', title: '小窗7', align: 'center', editRender: { name: 'input' } },
                { field: 'window8', title: '小窗8', align: 'center', editRender: { name: 'input' } },
            ],
        },
    };

    // 确保选择的模式有效
    if (!modeConfig[mode]) {
        console.error(`无效的模式: ${mode}，使用默认模式 mode1`);
        mode = 'mode1';
    }

    // 获取当前模式的配置
    const config = modeConfig[mode];
    const columns = config.columns;

    // 生成表格行数据
    const rows = [];
    for (let i = 0; i < levels; i++) {
        const row = {};
        if (mode === 'mode1') {
            row.window1 = { key: 'window1', value: '1', sort: 1 };
            row.window2 = { key: 'window2', value: '2', sort: 2 };
            row.window3 = { key: 'window3', value: '3', sort: 3 };
            row.window4 = { key: 'window4', value: '4', sort: 4 };
            row.window5 = { key: 'window5', value: '5', sort: 5 };
            row.window6 = { key: 'window6', value: '6', sort: 6 };
            row.window7 = { key: 'window7', value: '7', sort: 7 };
            row.window8 = { key: 'window8', value: '8', sort: 8 };
        }
        rows.push(row);
    }

    rows.forEach((item, idx) => {
        const _arr = valueIDs[idx];
        for (const key in item) {
            const sort = item[key].sort; // 获取 sort 值
            if (sort !== undefined && _arr[sort - 1] !== undefined) {
                item[key].key = _arr[sort - 1]; // 将 key 赋值给 arr 的对应位置
            }
        }
    });
    return {
        columns: columns,
        defaultData: rows.map((item, idx) => {
            return {
                level: { key: 'level', value: idx + 1 },
                ...item,
            };
        }),
    };
}

// 区域报警设置
export function generateZoneAlarmTable(mode, levels, valueIDs, title) {
    const modeConfig = {
        mode1: {
            columns: [
                { field: 'type', title: '类型', width: 120, align: 'center' },
                { field: 'leftFront', title: '上限', align: 'center', editRender: { name: 'VxeNumberInput', props: { type: 'float', digits: 1 } } },
                { field: 'leftMiddle', title: '下限', align: 'center', editRender: { name: 'VxeNumberInput', props: { type: 'float', digits: 1 } } },
                {
                    field: 'leftBack',
                    title: '使能',
                    align: 'center',
                    editRender: {
                        name: 'select',
                        options: [
                            { label: '开启', value: 1 },
                            { label: '关闭', value: 0 },
                        ],
                    },
                },
            ],
        },
    };

    // 确保选择的模式有效
    if (!modeConfig[mode]) {
        console.error(`无效的模式: ${mode}，使用默认模式 mode1`);
        mode = 'mode1';
    }

    // 获取当前模式的配置
    const config = modeConfig[mode];
    const columns = config.columns;

    // 生成表格行数据
    const rows = [];
    for (let i = 0; i < levels; i++) {
        const row = {};
        if (mode === 'mode1') {
            row.leftFront = { key: 'leftFront', value: '1', sort: 1 };
            row.leftMiddle = { key: 'leftMiddle', value: '1', sort: 2 };
            row.leftBack = { key: 'leftBack', value: '1', sort: 3 };
        }
        rows.push(row);
    }

    rows.forEach((item, idx) => {
        const _arr = valueIDs[idx];
        for (const key in item) {
            const sort = item[key].sort; // 获取 sort 值
            if (sort !== undefined && _arr[sort - 1] !== undefined) {
                item[key].key = _arr[sort - 1]; // 将 key 赋值给 arr 的对应位置
                item[key].sort = sort;
            }
        }
    });
    return {
        columns: columns,
        defaultData: rows.map((item, idx) => {
            return {
                type: { key: 'type', value: title[idx] },
                ...item,
            };
        }),
    };
}

export function generateCustomTable(mode, levels, valueIDs) {
    // 定义不同模式的列和字段配置
    const modeConfig = {
        mode1: {
            columns: [
                {
                    field: 'tempMode',
                    title: '温度模式',
                    width: 120,
                    align: 'center',
                    editRender: {
                        name: 'select',
                        options: [
                            { label: '自设模式', value: 0 },
                            { label: '曲线模式', value: 1 },
                        ],
                    },
                },
                { field: 'targetTemp', title: '目标温度', width: 120, align: 'center', editRender: { name: 'VxeNumberInput', props: { type: 'float', digits: 1 } } },
                { field: 'date', title: '日龄', width: 120, align: 'center', editRender: { name: 'input' } },
            ],
        },
        mode2: {
            columns: [
                {
                    field: 'tempMode',
                    title: '温度模式',
                    align: 'center',
                    editRender: {
                        name: 'select',
                        options: [
                            { label: '自设模式', value: 0 },
                            { label: '曲线模式', value: 1 },
                        ],
                    },
                },
                { field: 'date', title: '日龄', align: 'center', editRender: { name: 'VxeNumberInput' } },
                { field: 'temp', title: '温度', align: 'center', editRender: { name: 'VxeNumberInput', props: { type: 'float', digits: 1 } } },
                { field: 'adjustTemp', title: '校准值', align: 'center', editRender: { name: 'VxeNumberInput', props: { type: 'float', digits: 1 } } },
            ],
        },
    };

    // 确保选择的模式有效
    if (!modeConfig[mode]) {
        console.error(`无效的模式: ${mode}，使用默认模式 mode1`);
        mode = 'mode1';
    }

    // 获取当前模式的配置
    const config = modeConfig[mode];
    const columns = config.columns;

    // 生成表格行数据
    const rows = [];
    for (let i = 0; i < levels; i++) {
        const row = {};
        if (mode === 'mode1') {
            row.tempMode = { key: 'tempMode', value: 1, sort: i + 1 };
            row.date = { key: 'date', value: 1, sort: i + 2 };
        } else if (mode === 'mode2') {
            row.tempMode = { key: 'tempMode', value: 2, sort: 1 };
            row.date = { key: 'date', value: 1, sort: 2 };
            row.temp = { key: 'temp', value: 1, sort: 3 };
            row.adjustTemp = { key: 'adjustTemp', value: 1, sort: 4 };
        }
        rows.push(row);
    }

    rows.forEach((item, idx) => {
        const _arr = valueIDs[idx];
        for (const key in item) {
            const sort = item[key].sort; // 获取 sort 值
            if (sort !== undefined && _arr[sort - 1] !== undefined) {
                item[key].key = _arr[sort - 1]; // 将 key 赋值给 arr 的对应位置
                item[key].sort = sort;
            }
        }
    });
    return {
        columns: columns,
        defaultData: rows.map((item, idx) => {
            return {
                ...item,
            };
        }),
    };
}
