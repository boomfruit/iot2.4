export function generateFanSettingTable(fans, frequency, level, valueIDs, options) {
    const _columns = []; // 用于存储风机列
    const header = [
        { field: 'level', title: '等级', width: 80, align: 'center' }, // 表头：等级列
    ];
    const endcolumns = [
        {
            field: 'startTime',
            title: '开启时间',
            width: 160,
            align: 'center',
            editRender: {
                name: 'input',
            }, // 可编辑的输入框
        },
        {
            field: 'endTime',
            title: '关闭时间',
            width: 160,
            align: 'center',
            editRender: { name: 'input' }, // 可编辑的输入框
        },
        {
            field: 'temperature',
            title: '温差',
            width: 100,
            align: 'center',
            editRender: { name: 'input' }, // 可编辑的输入框
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
                name: 'select', // 下拉菜单
                options: options,
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
            row[`frequencyFan${z + 1}`] = { key: `frequencyFan${z + 1}`, value: 0, sort: fans + z + 1 }; // 默认值为 "0"（关闭）
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
export function generateLightTable(mode = lightSettings.mode, levels = lightSettings.lightLevels, customKeys = null) {
    const lightSettings = {
        lightLevels: 10, // 光照等级数量
        mode: 'mode1', // 默认模式：'mode1'或'mode2'
    };
    // 定义不同模式的列配置
    const modeColumns = {
        mode1: [
            { field: 'level', title: '光照', width: 80, align: 'center' },
            { field: 'light', title: '光照', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'startTime1', title: '开启时间', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'endTime1', title: '关闭时间', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'time', title: '时长', width: 120, align: 'center', editRender: { name: 'input' } },
        ],
        mode2: [
            { field: 'level', title: '光照时间段', width: 100, align: 'center' },
            { field: 'lightStartTime', title: '光照开始时间', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'lightStartIntensity', title: '光照开始时间强度', width: 140, align: 'center', editRender: { name: 'input' } },
            { field: 'lightEndTime', title: '光照结束时间', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'lightEndIntensity', title: '光照结束时间强度', width: 140, align: 'center', editRender: { name: 'input' } },
            { field: 'lightDuration', title: '光照持续时间', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'lightMaxIntensity', title: '光照最大强度', width: 120, align: 'center', editRender: { name: 'input' } },
            { field: 'lightMinIntensity', title: '光照最小强度', width: 120, align: 'center', editRender: { name: 'input' } },
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
        // 创建基本行对象
        const row = {
            key: 'level',
            value: i + 1, // 可选：设置等级值
        };

        // 根据模式添加不同的字段
        if (mode === 'mode1') {
            row.light = { key: customKeys ? customKeys[i]?.light || 'light' : 'light', value: '' };
            row.startTime1 = { key: customKeys ? customKeys[i]?.startTime1 || 'startTime1' : 'startTime1', value: '' };
            row.endTime1 = { key: customKeys ? customKeys[i]?.endTime1 || 'endTime1' : 'endTime1', value: '' };
            row.time = { key: customKeys ? customKeys[i]?.time || 'time' : 'time', value: '' };
        } else if (mode === 'mode2') {
            row.lightStartTime = { key: customKeys ? customKeys[i]?.lightStartTime || 'lightStartTime' : 'lightStartTime', value: '' };
            row.lightStartIntensity = { key: customKeys ? customKeys[i]?.lightStartIntensity || 'lightStartIntensity' : 'lightStartIntensity', value: '' };
            row.lightEndTime = { key: customKeys ? customKeys[i]?.lightEndTime || 'lightEndTime' : 'lightEndTime', value: '' };
            row.lightEndIntensity = { key: customKeys ? customKeys[i]?.lightEndIntensity || 'lightEndIntensity' : 'lightEndIntensity', value: '' };
            row.lightDuration = { key: customKeys ? customKeys[i]?.lightDuration || 'lightDuration' : 'lightDuration', value: '' };
            row.lightMaxIntensity = { key: customKeys ? customKeys[i]?.lightMaxIntensity || 'lightMaxIntensity' : 'lightMaxIntensity', value: '' };
            row.lightMinIntensity = { key: customKeys ? customKeys[i]?.lightMinIntensity || 'lightMinIntensity' : 'lightMinIntensity', value: '' };
        }

        rows.push(row);
    }

    // 返回完整的表格配置
    const result = {};
    result[mode] = {
        columns: columns,
        defaultData: rows,
    };

    return result;
}

export function generateSystemTable(mode = systemSettings.mode, rows = systemSettings.rows, customKeys = null) {
    const systemSettings = {
        mode: 'mode1', // 默认模式：'mode1'或'mode2'
        rows: 1, // 默认行数
    };

    // 定义不同模式的列和字段配置
    const modeConfig = {
        mode1: {
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
            fields: ['tempDiff', 'windDirection', 'ventTime', 'tempRange', 'defrostTime', 'tempControl', 'initialTemp', 'openingTime'],
        },
        mode2: {
            columns: [
                { field: 'tempControl', title: '温度调节', width: 120, align: 'center', editRender: { name: 'input' } },
                { field: 'openingTime', title: '开启时间', width: 120, align: 'center', editRender: { name: 'input' } },
                { field: 'ventTime', title: '降温时间', width: 120, align: 'center', editRender: { name: 'input' } },
                { field: 'tempRange', title: '降温温度', width: 120, align: 'center', editRender: { name: 'input' } },
                { field: 'initialTempRange', title: '初始降温温度', width: 140, align: 'center', editRender: { name: 'input' } },
                { field: 'tempControlRange', title: '温度调节范围', width: 140, align: 'center', editRender: { name: 'input' } },
                { field: 'defrostTime', title: '默认时间', width: 120, align: 'center', editRender: { name: 'input' } },
            ],
            fields: ['tempControl', 'openingTime', 'ventTime', 'tempRange', 'initialTempRange', 'tempControlRange', 'defrostTime'],
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
    const fields = config.fields;

    // 生成表格行数据
    const defaultData = [];
    for (let i = 0; i < rows; i++) {
        const row = {};

        // 为每个字段创建对象
        fields.forEach((field) => {
            // 如果提供了自定义键值，则使用自定义键值，否则使用默认字段名
            const customKey = customKeys && customKeys[i] && customKeys[i][field];
            row[field] = {
                key: customKey || field,
                value: '',
            };
        });

        defaultData.push(row);
    }

    // 返回完整的表格配置
    const result = {};
    result[mode] = {
        columns: columns,
        defaultData: defaultData,
    };

    return result;
}

export function generateHumidityTable(mode = humiditySettings.mode, rows = humiditySettings.rows, customKeys = null) {
    const humiditySettings = {
        mode: 'mode1', // 默认模式：'mode1'或'mode2'
        rows: 1, // 默认行数
    };
    // 定义不同模式的列和字段配置
    const modeConfig = {
        mode1: {
            columns: [
                { field: 'humiditySwitch', title: '湿度开关', width: 120, align: 'center', editRender: { name: 'input' } },
                { field: 'startHumidity', title: '开启湿度', width: 120, align: 'center', editRender: { name: 'input' } },
                { field: 'startTemp', title: '开启温度', width: 120, align: 'center', editRender: { name: 'input' } },
                { field: 'protectTemp', title: '保护温度', width: 120, align: 'center', editRender: { name: 'input' } },
                { field: 'controlTime', title: '控制时间', width: 120, align: 'center', editRender: { name: 'input' } },
            ],
            fields: ['humiditySwitch', 'startHumidity', 'startTemp', 'protectTemp', 'controlTime'],
        },
        mode2: {
            columns: [
                { field: 'humiditySwitch', title: '湿度开关', width: 120, align: 'center', editRender: { name: 'input' } },
                { field: 'startHumidity', title: '开启湿度', width: 120, align: 'center', editRender: { name: 'input' } },
                { field: 'startTemp', title: '开启温度', width: 120, align: 'center', editRender: { name: 'input' } },
                { field: 'protectTemp', title: '保护温度', width: 120, align: 'center', editRender: { name: 'input' } },
                { field: 'controlTime', title: '控制时间', width: 120, align: 'center', editRender: { name: 'input' } },
                { field: 'humidityRange', title: '湿度调节率', width: 120, align: 'center', editRender: { name: 'input' } },
            ],
            fields: ['humiditySwitch', 'startHumidity', 'startTemp', 'protectTemp', 'controlTime', 'humidityRange'],
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
    const fields = config.fields;

    // 生成表格行数据
    const defaultData = [];
    for (let i = 0; i < rows; i++) {
        const row = {};

        // 为每个字段创建对象
        fields.forEach((field) => {
            // 如果提供了自定义键值，则使用自定义键值，否则使用默认字段名
            const customKey = customKeys && customKeys[i] && customKeys[i][field];
            row[field] = {
                key: customKey || field,
                value: '',
            };
        });

        defaultData.push(row);
    }

    // 返回完整的表格配置
    const result = {};
    result[mode] = {
        columns: columns,
        defaultData: defaultData,
    };

    return result;
}

export function generateHeatingTable(mode = heatingSettings.mode, rows = heatingSettings.rows, customKeys = null) {
    const heatingSettings = {
        mode: 'mode1', // 默认模式：'mode1'或'mode2'
        rows: 3, // 默认行数
    };

    // 定义不同模式的列和字段配置
    const modeConfig = {
        mode1: {
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
            fields: ['startTime1', 'endTime1', 'startTemp', 'endTemp', 'openTime', 'closeTime', 'lowTemp', 'highTemp'],
        },
        mode2: {
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
            fields: ['openTime', 'closeTime', 'lowTemp', 'highTemp', 'startTemp', 'endTemp', 'addHeat1', 'addHeat2', 'addHeat3'],
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
    const fields = config.fields;

    // 生成表格行数据
    const defaultData = [];
    for (let i = 0; i < rows; i++) {
        const row = {
            key: 'level',
            value: i + 1, // 可选：设置等级值
        };

        // 为每个字段创建对象
        fields.forEach((field) => {
            // 如果提供了自定义键值，则使用自定义键值，否则使用默认字段名
            const customKey = customKeys && customKeys[i] && customKeys[i][field];
            row[field] = {
                key: customKey || field,
                value: '',
            };
        });

        defaultData.push(row);
    }

    // 返回完整的表格配置
    const result = {};
    result[mode] = {
        columns: columns,
        defaultData: defaultData,
    };

    return result;
}

export function generateCoolingTable(mode = coolingSettings.mode, rows = coolingSettings.rows, customKeys = null) {
    const coolingSettings = {
        mode: 'mode1', // 默认模式：'mode1'
        rows: 3, // 默认行数
    };

    // 定义模式的列和字段配置
    const modeConfig = {
        mode1: {
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
            fields: ['startTime1', 'endTime1', 'startTemp', 'endTemp', 'openTime', 'closeTime', 'lowTemp', 'highTemp'],
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
    const fields = config.fields;

    // 生成表格行数据
    const defaultData = [];
    for (let i = 0; i < rows; i++) {
        const row = {
            key: 'level',
            value: i + 1, // 可选：设置等级值
        };

        // 为每个字段创建对象
        fields.forEach((field) => {
            // 如果提供了自定义键值，则使用自定义键值，否则使用默认字段名
            const customKey = customKeys && customKeys[i] && customKeys[i][field];
            row[field] = {
                key: customKey || field,
                value: '',
            };
        });

        defaultData.push(row);
    }

    // 返回完整的表格配置
    const result = {};
    result[mode] = {
        columns: columns,
        defaultData: defaultData,
    };

    return result;
}

export function generateGasTable(mode = gasSettings.mode, rows = gasSettings.rows, customKeys = null) {
    const gasSettings = {
        mode: 'mode1', // 默认模式：'mode1'或'mode2'
        rows: 1, // 默认行数
    };
    // 定义不同模式的列和字段配置
    const modeConfig = {
        mode1: {
            columns: [
                { field: 'ventilationTime', title: '换气时间', width: 120, align: 'center', editRender: { name: 'input' } },
                { field: 'controlTime', title: '控制时间', width: 120, align: 'center', editRender: { name: 'input' } },
                { field: 'tempDiff', title: '温度差异', width: 120, align: 'center', editRender: { name: 'input' } },
                { field: 'nitrogenLimit', title: '氮气下限', width: 120, align: 'center', editRender: { name: 'input' } },
                { field: 'nitrogenSpeed', title: '氮气速度', width: 120, align: 'center', editRender: { name: 'input' } },
                { field: 'co2Switch', title: 'CO2开关', width: 120, align: 'center', editRender: { name: 'input' } },
                { field: 'co2Speed', title: 'CO2速度', width: 120, align: 'center', editRender: { name: 'input' } },
            ],
            fields: ['ventilationTime', 'controlTime', 'tempDiff', 'nitrogenLimit', 'nitrogenSpeed', 'co2Switch', 'co2Speed'],
        },
        mode2: {
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
            fields: ['controlSwitch', 'co2Switch', 'co2Speed', 'nitrogenLimit', 'nitrogenSpeed', 'controlTime', 'ventilationTime', 'tempDiff'],
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
    const fields = config.fields;

    // 生成表格行数据
    const defaultData = [];
    for (let i = 0; i < rows; i++) {
        const row = {};

        // 为每个字段创建对象
        fields.forEach((field) => {
            // 如果提供了自定义键值，则使用自定义键值，否则使用默认字段名
            const customKey = customKeys && customKeys[i] && customKeys[i][field];
            row[field] = {
                key: customKey || field,
                value: '',
            };
        });

        defaultData.push(row);
    }

    // 返回完整的表格配置
    const result = {};
    result[mode] = {
        columns: columns,
        defaultData: defaultData,
    };

    return result;
}

export function generateAddOxygenTable(mode = addOxygenSettings.mode, rows = addOxygenSettings.rows, customKeys = null) {
    const addOxygenSettings = {
        mode: 'mode1', // 默认模式：'mode1'
        rows: 1, // 默认行数
    };
    // 定义模式的列和字段配置
    const modeConfig = {
        mode1: {
            columns: [
                { field: 'startNitrogenTime', title: '加氧设备启动时间量', width: 160, align: 'center', editRender: { name: 'input' } },
                { field: 'endNitrogenTime', title: '加氧设备结束时间量', width: 160, align: 'center', editRender: { name: 'input' } },
                { field: 'startControlTime', title: '加氧设备开启量控制时间', width: 180, align: 'center', editRender: { name: 'input' } },
                { field: 'endControlTime', title: '加氧设备关闭量控制时间', width: 180, align: 'center', editRender: { name: 'input' } },
                { field: 'nitrogenSpeed', title: '加氧设备开启频率', width: 140, align: 'center', editRender: { name: 'input' } },
                { field: 'openInterval', title: '开启间隔', width: 120, align: 'center', editRender: { name: 'input' } },
            ],
            fields: ['startNitrogenTime', 'endNitrogenTime', 'startControlTime', 'endControlTime', 'nitrogenSpeed', 'openInterval'],
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
    const fields = config.fields;

    // 生成表格行数据
    const defaultData = [];
    for (let i = 0; i < rows; i++) {
        const row = {};

        // 为每个字段创建对象
        fields.forEach((field) => {
            // 如果提供了自定义键值，则使用自定义键值，否则使用默认字段名
            const customKey = customKeys && customKeys[i] && customKeys[i][field];
            row[field] = {
                key: customKey || field,
                value: '',
            };
        });

        defaultData.push(row);
    }

    // 返回完整的表格配置
    const result = {};
    result[mode] = {
        columns: columns,
        defaultData: defaultData,
    };

    return result;
}

export function generateTemperatureTable(mode = temperatureSettings.mode, rows = temperatureSettings.rows, customKeys = null) {
    const temperatureSettings = {
        mode: 'mode1', // 默认模式：'mode1'
        rows: 3, // 默认行数
    };

    // 定义模式的列和字段配置
    const modeConfig = {
        mode1: {
            columns: [
                { field: 'mode', title: '模式', width: 80, align: 'center' },
                { field: 'date', title: '日龄', width: 120, align: 'center', editRender: { name: 'input' } },
                { field: 'temperature', title: '温度', width: 120, align: 'center', editRender: { name: 'input' } },
            ],
            fields: ['date', 'temperature'],
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
    const fields = config.fields;

    // 生成表格行数据
    const defaultData = [];
    for (let i = 0; i < rows; i++) {
        const row = {
            key: 'mode', // 每行的模式字段
        };

        // 为每个字段创建对象
        fields.forEach((field) => {
            // 如果提供了自定义键值，则使用自定义键值，否则使用默认字段名
            const customKey = customKeys && customKeys[i] && customKeys[i][field];
            row[field] = {
                key: customKey || field,
                value: '',
            };
        });

        defaultData.push(row);
    }

    // 返回完整的表格配置
    const result = {};
    result[mode] = {
        columns: columns,
        defaultData: defaultData,
    };

    return result;
}

export function generateAlarmTable(mode = alarmSettings.mode, rows = alarmSettings.rows, customKeys = null) {
    const alarmSettings = {
        mode: 'mode1', // 默认模式：'mode1'或'mode2'
        rows: 4, // 默认行数
    };
    // 定义不同模式的列和字段配置
    const modeConfig = {
        mode1: {
            columns: [
                { field: 'type', title: '类型', width: 120, align: 'center' },
                { field: 'upperLimit', title: '上限', width: 120, align: 'center', editRender: { name: 'input' } },
                { field: 'lowerLimit', title: '下限', width: 120, align: 'center', editRender: { name: 'input' } },
            ],
            fields: ['upperLimit', 'lowerLimit'],
        },
        mode2: {
            columns: [
                { field: 'type', title: '类型', width: 120, align: 'center' },
                { field: 'upperLimit', title: '上限', width: 120, align: 'center', editRender: { name: 'input' } },
                { field: 'lowerLimit', title: '下限', width: 120, align: 'center', editRender: { name: 'input' } },
                { field: 'switch', title: '开关', width: 120, align: 'center', editRender: { name: 'input' } },
            ],
            fields: ['upperLimit', 'lowerLimit', 'switch'],
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
    const fields = config.fields;

    // 生成表格行数据
    const defaultData = [];
    const types = ['报警类型', '室内温度', '室外温度', '二氧化碳']; // 默认类型

    for (let i = 0; i < rows; i++) {
        const row = {
            key: 'type',
            value: types[i] || '类型', // 使用默认类型
        };

        // 为每个字段创建对象
        fields.forEach((field) => {
            // 如果提供了自定义键值，则使用自定义键值，否则使用默认字段名
            const customKey = customKeys && customKeys[i] && customKeys[i][field];
            row[field] = {
                key: customKey || field,
                value: '',
            };
        });

        defaultData.push(row);
    }

    // 返回完整的表格配置
    const result = {};
    result[mode] = {
        columns: columns,
        defaultData: defaultData,
    };

    return result;
}

export function generateWindowTable(mode = windowSettings.mode, rows = windowSettings.rows, customKeys = null) {
    const windowSettings = {
        mode: 'mode1', // 默认模式：'mode1'
        rows: 3, // 默认行数
    };
    // 定义模式的列和字段配置
    const modeConfig = {
        mode1: {
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
            fields: ['window1', 'window2', 'window3', 'window4', 'window5', 'window6', 'window7', 'window8'],
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
    const fields = config.fields;

    // 生成表格行数据
    const defaultData = [];
    for (let i = 0; i < rows; i++) {
        const row = {
            key: 'level', // 每行的光照字段
        };

        // 为每个字段创建对象
        fields.forEach((field) => {
            // 如果提供了自定义键值，则使用自定义键值，否则使用默认字段名
            const customKey = customKeys && customKeys[i] && customKeys[i][field];
            row[field] = {
                key: customKey || field,
                value: '',
            };
        });

        defaultData.push(row);
    }

    // 返回完整的表格配置
    const result = {};
    result[mode] = {
        columns: columns,
        defaultData: defaultData,
    };

    return result;
}

export function generateZoneAlarmTable(mode = zoneAlarmSettings.mode, rows = zoneAlarmSettings.rows, customKeys = null) {
    const zoneAlarmSettings = {
        mode: 'mode1', // 默认模式：'mode1'
        rows: 3, // 默认行数
    };
    // 定义模式的列和字段配置
    const modeConfig = {
        mode1: {
            columns: [
                { field: 'type', title: '类型', width: 120, align: 'center' },
                { field: 'leftFront', title: '左前温度', width: 120, align: 'center', editRender: { name: 'input' } },
                { field: 'leftMiddle', title: '左中温度', width: 120, align: 'center', editRender: { name: 'input' } },
                { field: 'leftBack', title: '左后温度', width: 120, align: 'center', editRender: { name: 'input' } },
                { field: 'rightFront', title: '右前温度', width: 120, align: 'center', editRender: { name: 'input' } },
                { field: 'rightMiddle', title: '右中温度', width: 120, align: 'center', editRender: { name: 'input' } },
                { field: 'rightBack', title: '右后温度', width: 120, align: 'center', editRender: { name: 'input' } },
            ],
            fields: ['leftFront', 'leftMiddle', 'leftBack', 'rightFront', 'rightMiddle', 'rightBack'],
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
    const fields = config.fields;

    // 生成表格行数据
    const defaultData = [];
    const types = ['上限', '下限', '使能']; // 默认类型

    for (let i = 0; i < rows; i++) {
        const row = {
            key: 'type',
            value: types[i] || '类型', // 使用默认类型
        };

        // 为每个字段创建对象
        fields.forEach((field) => {
            // 如果提供了自定义键值，则使用自定义键值，否则使用默认字段名
            const customKey = customKeys && customKeys[i] && customKeys[i][field];
            row[field] = {
                key: customKey || field,
                value: '',
            };
        });

        defaultData.push(row);
    }

    // 返回完整的表格配置
    const result = {};
    result[mode] = {
        columns: columns,
        defaultData: defaultData,
    };

    return result;
}

export function generateCustomTable(mode = customSettings.mode, rows = customSettings.rows, customKeys = null) {
    const customSettings = {
        mode: 'mode1', // 默认模式：'mode1'或'mode2'
        rows: 1, // 默认行数
    };

    // 定义不同模式的列和字段配置
    const modeConfig = {
        mode1: {
            columns: [
                { field: 'tempMode', title: '温度模式', width: 120, align: 'center', editRender: { name: 'input' } },
                { field: 'date', title: '日龄', width: 120, align: 'center', editRender: { name: 'input' } },
            ],
            fields: ['tempMode', 'date'],
        },
        mode2: {
            columns: [
                { field: 'tempMode', title: '温度模式', width: 120, align: 'center', editRender: { name: 'input' } },
                { field: 'date', title: '日龄', width: 120, align: 'center', editRender: { name: 'input' } },
                { field: 'temp', title: '温度', width: 120, align: 'center', editRender: { name: 'input' } },
                { field: 'adjustTemp', title: '改变量', width: 120, align: 'center', editRender: { name: 'input' } },
            ],
            fields: ['tempMode', 'date', 'temp', 'adjustTemp'],
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
    const fields = config.fields;

    // 生成表格行数据
    const defaultData = [];
    for (let i = 0; i < rows; i++) {
        const row = {};

        // 为每个字段创建对象
        fields.forEach((field) => {
            // 如果提供了自定义键值，则使用自定义键值，否则使用默认字段名
            const customKey = customKeys && customKeys[i] && customKeys[i][field];
            row[field] = {
                key: customKey || field,
                value: '',
            };
        });

        defaultData.push(row);
    }

    // 返回完整的表格配置
    const result = {};
    result[mode] = {
        columns: columns,
        defaultData: defaultData,
    };

    return result;
}
