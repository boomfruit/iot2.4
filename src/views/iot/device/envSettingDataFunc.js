// 生成风机设置数据列表
// originData 原始数据
// isArray 是否是数组
export function generateFanSettingDatalist(originData, isArray) {
    let dataList = [];
    if (isArray) {
        // 使用 filter 和 map 简化数组处理
        const closeTimeArr = originData.filter((item) => item.id.startsWith('FanSettingCloseTime')).map((item) => item.value);
        const openTimeArr = originData.filter((item) => item.id.startsWith('FanSettingOpenTime')).map((item) => item.value);
        const templateDiffArr = originData.filter((item) => item.id.startsWith('FanSettingTemperatureDiff')).map((item) => item.value);
        // 处理 datatype.type 为 'array' 的情况
        const arrayItems = originData.filter((item) => item.datatype.type === 'array').map((item) => item.datatype.arrayParams.map((item1) => parseInt(item1[0].value)));
        const maxLength = Math.max(closeTimeArr.length, openTimeArr.length, templateDiffArr.length);
        for (let i = 0; i < maxLength; i++) {
            const row = [];
            if (i < templateDiffArr.length) {
                row.push(templateDiffArr[i]);
            }
            if (i < closeTimeArr.length) {
                row.push(openTimeArr[i]);
            }
            if (i < openTimeArr.length) {
                row.push(closeTimeArr[i]);
            }

            arrayItems[i] = [...arrayItems[i], ...row];
        }
        dataList.push(...arrayItems); // 将数组项添加到 dataList

        const frequencyConversion = originData
            .filter((item) => item.id.startsWith('ScaleSettingFrequencyConversion'))
            .map((item) => {
                return item.value;
            });
        const groupedFrequencyConversion = [];
        for (let i = 0; i < frequencyConversion.length; i += 8) {
            groupedFrequencyConversion.push(frequencyConversion.slice(i, i + 8));
        }
        console.log(groupedFrequencyConversion, 'groupedFrequencyConversion');
        for (let i = 0; i < groupedFrequencyConversion.length; i++) {
            dataList[i][18] = groupedFrequencyConversion[i][0];
            dataList[i][19] = groupedFrequencyConversion[i][1];
            dataList[i][20] = groupedFrequencyConversion[i][2];
            dataList[i][21] = groupedFrequencyConversion[i][3];
        }
    }
    return dataList;
}

// 生成比例设置数据列表
// originData 原始数据
// num 一组数量
export function generateRatioSettingDatalist(originData, num) {
    let dataList = [];
    const frequencyConversion = originData
        .filter((item) => item.id.startsWith('ScaleSettingFrequencyConversion'))
        .map((item) => {
            return item.value;
        });
    const groupedFrequencyConversion = [];
    for (let i = 0; i < frequencyConversion.length; i += num) {
        groupedFrequencyConversion.push(frequencyConversion.slice(i, i + num));
    }
    dataList.push(...groupedFrequencyConversion);
    return dataList;
}

// 生成加热设置数据列表
// originData 原始数据
// type 类型
export function generateHeatingSettingDatalist(originData, type) {
    if (type !== 'mode2') return []; // 如果不是 mode2，直接返回空数组

    const keys = [
        'HeatingSettingStartTimeH',
        'HeatingSettingStartTimeS',
        'HeatingSettingEndTimeH',
        'HeatingSettingEndTimeS',
        'HeatingSettingStartTemperature',
        'HeatingSettingEndTemperature',
        'HeatingSetting01Switch',
        'HeatingSetting02Switch',
        'HeatingSetting03Switch',
    ];

    const dataArrays = keys.map((key) => originData.filter((item) => item.id.startsWith(key)).map((item) => item.value));

    const maxLength = Math.max(...dataArrays.map((arr) => arr.length));
    const dataList = [];

    for (let i = 0; i < maxLength; i++) {
        const row = dataArrays.map((arr) => (arr[i] !== undefined ? arr[i] : null));
        dataList.push(row);
    }
    console.log(dataList, 'dataList');
    return dataList;
}

// 生成制冷设置数据列表
// originData 原始数据
// type 类型
export function generateCoolingSettingDatalist(originData, type) {
    if (type !== 'mode1') return []; // 如果不是 mode2，直接返回空数组

    const keys = [
        'CoolingSettingStartTimeH',
        'CoolingSettingStartTimeS',
        'CoolingSettingEndTimeH',
        'CoolingSettingEndTimeS',
        'CoolingSettingStartTemperature',
        'CoolingSettingEndTemperature',
        'CoolingSettingOpenTime',
        'CoolingSettingCloseTime',
    ];

    const dataArrays = keys.map((key) => originData.filter((item) => item.id.startsWith(key)).map((item) => (item.value > 1000 || item.value < -50 ? 0 : item.value)));

    const maxLength = Math.max(...dataArrays.map((arr) => arr.length));
    const dataList = [];

    for (let i = 0; i < maxLength; i++) {
        const row = dataArrays.map((arr) => (arr[i] !== undefined ? arr[i] : null));
        dataList.push(row);
    }

    return dataList;
}

// 生成光照设置数据列表
// originData 原始数据
// type 类型
export function generateLightSettingDatalist(originData, type) {
    if (type !== 'mode2') return []; // 如果不是 mode2，直接返回空数组

    const keys = [
        'IlluminationDayLive',
        'IlluminationSettingTimeH',
        'IlluminationSettingTimeS',
        'IlluminationSettingTimeEndH',
        'IlluminationSettingTimeEndS',
        'IlluminationSettingDimming',
        'IlluminationSettingDimmingEnd',
        'IlluminationSettingEnable',
    ];

    const dataArrays = keys.map((key) => originData.filter((item) => item.id.startsWith(key)).map((item) => (item.value > 1000 || item.value < -50 ? 0 : item.value)));

    const maxLength = Math.max(...dataArrays.map((arr) => arr.length));
    const dataList = [];

    for (let i = 0; i < maxLength; i++) {
        const row = dataArrays.map((arr) => (arr[i] !== undefined ? arr[i] : null));
        dataList.push(row);
    }

    return dataList;
}

// 生成湿度设置数据列表
// originData 原始数据
// type 类型
export function generateHumiditySettingDatalist(originData, type) {
    if (type !== 'mode2') return []; // 如果不是 mode2，直接返回空数组

    const keys = ['HumiditySettingEnable', 'HumiditySettingStartHumidity', 'HumiditySettingEndHumidity', 'HumiditySettingControlDuration', 'HumiditySettingControlInterval', 'HumiditySettingTemDiff'];

    const dataArrays = keys.map((key) => originData.filter((item) => item.id.startsWith(key)).map((item) => (item.value > 1000 || item.value < -50 ? 0 : item.value)));

    const maxLength = Math.max(...dataArrays.map((arr) => arr.length));
    const dataList = [];

    for (let i = 0; i < maxLength; i++) {
        const row = dataArrays.map((arr) => (arr[i] !== undefined ? arr[i] : null));
        dataList.push(row);
    }
    return dataList;
}

// 生成有害气体设置数据列表
// originData 原始数据
// type 类型
export function generateGasSettingDatalist(originData, type) {
    if (type !== 'mode2') return []; // 如果不是 mode2，直接返回空数组

    const keys = ['ControlSwitch01', 'HarmfulGasCO2Start', 'HarmfulGasCO2End', 'HarmfulGasNH3Start', 'HarmfulGasNH3End', 'HarmfulGasControlDuration', 'HarmfulGasControlInterval', 'HarmfulGasTemperatureDeviation'];

    const dataArrays = keys.map((key) => originData.filter((item) => item.id.startsWith(key)).map((item) => item.value));

    const maxLength = Math.max(...dataArrays.map((arr) => arr.length));
    const dataList = [];

    for (let i = 0; i < maxLength; i++) {
        const row = dataArrays.map((arr) => (arr[i] !== undefined ? arr[i] : null));
        dataList.push(row);
    }
    return dataList;
}

// 生成系统设置数据列表
// originData 原始数据
// type 类型
export function generateSystemSettingDatalist(originData, type) {
    if (type !== 'mode2') return []; // 如果不是 mode2，直接返回空数组
    const keys = ['SystemSettingVentilationLevel', 'SystemSettingUpgradeDelay', 'SystemSettingDowngradingDelay', 'SystemSettingInitialLevelOfTunnel', 'SystemSettingInitialLessTime', 'SystemSettingDefaultStartup'];
    const dataArrays = keys.map((key) => originData.filter((item) => item.id.startsWith(key)).map((item) => item.value));
    const maxLength = Math.max(...dataArrays.map((arr) => arr.length));
    const dataList = [];
    for (let i = 0; i < maxLength; i++) {
        const row = dataArrays.map((arr) => (arr[i] !== undefined ? arr[i] : null));
        dataList.push(row);
    }
    return dataList;
}

// 生成加氧设置数据列表
// originData 原始数据
// type 类型
export function generateAddOxygenSettingDatalist(originData, type) {
    if (type !== 'mode1') return []; // 如果不是 mode1，直接返回空数组
    const keys = ['SettingTurnOffOxygenNums', 'SettingTurnOnOxygenNums', 'SettingOnOxygenMaxTime', 'SettingOnOxygenMinTime', 'SettingOnOxygenDelay', 'SettingOnOxygenInterval'];
    const dataArrays = keys.map((key) => originData.filter((item) => item.id.startsWith(key)).map((item) => item.value));
    console.log(dataArrays, 'dataArrays');
    const maxLength = Math.max(...dataArrays.map((arr) => arr.length));
    const dataList = [];
    for (let i = 0; i < maxLength; i++) {
        const row = dataArrays.map((arr) => (arr[i] !== undefined ? arr[i] : null));
        dataList.push(row);
    }
    return dataList;
}

// 生成温度设置数据列表
// originData 原始数据
// type 类型
export function generateTemperatureSettingDatalist(originData, type) {
    if (type !== 'mode1') return []; // 如果不是 mode1，直接返回空数组
    const keys = [
        'TemperatureSettingDay02',
        'TemperatureSettingTemperature02',
        'TemperatureSettingDay03',
        'TemperatureSettingTemperature03',
        'TemperatureSettingDay04',
        'TemperatureSettingTemperature04',
        'TemperatureSettingDay05',
        'TemperatureSettingTemperature05',
        'TemperatureSettingDay06',
        'TemperatureSettingTemperature06',
        'TemperatureSettingDay07',
        'TemperatureSettingTemperature07',
        'TemperatureSettingDay08',
        'TemperatureSettingTemperature08',
        'TemperatureSettingDay09',
        'TemperatureSettingTemperature09',
        'TemperatureSettingDay10',
        'TemperatureSettingTemperature10',
    ];

    const dataArrays = keys.map((key) => originData.filter((item) => item.id.startsWith(key)).map((item) => item.value)).flat();

    const groupedDataArrays = [];
    for (let i = 0; i < dataArrays.length; i += 2) {
        groupedDataArrays.push(dataArrays.slice(i, i + 2));
    }
    console.log(groupedDataArrays, 'groupedDataArrays');

    return groupedDataArrays;
}

// 生成报警设置数据列表
// originData 原始数据
// type 类型
export function generateAlarmSettingDatalist(originData, type) {
    if (type !== 'mode2') return []; // 如果不是 mode2，直接返回空数组
    const keys = [
        'AlarmSettingAlarmEnable', //0
        'AlarmSettingAlarmEnable', //1
        'AlarmSettingAlarmEnable', //2
        'AlarmSettingTemperatureMax1', //3
        'AlarmSettingTemperatureMin1', //4
        'AlarmSettingEnable', //5
        'AlarmSettingTemperatureMax2', //6
        'AlarmSettingTemperatureMin2', //7
        'AlarmSettingEnable', //8
        'AlarmSettingHumidityMax1', //9
        'AlarmSettingHumidityMin1', //10
        'AlarmSettingEnable', //11
        'AlarmSettingHumidityMax2', //12
        'AlarmSettingHumidityMin2', //13
        'AlarmSettingEnable', //14
        'AlarmSettingCO2Max', //15
        'AlarmSettingCO2Min', //16
        'AlarmSettingEnable', //17
        'AlarmSettingAmmoniaMax', //18
        'AlarmSettingAmmoniaMin', //19
        'AlarmSettingEnable', //20
        'AlarmSettingSubpressureMax', //21
        'AlarmSettingSubpressureMin', //22
        'AlarmSettingEnable', //23
        'AlarmSettingWindSpeedMax', //24
        'AlarmSettingWindSpeedMin', //25
        'AlarmSettingEnable', //26
    ];
    const dataArrays = keys.map((key) => originData.filter((item) => item.id.startsWith(key)).map((item) => item.value)).flat();
    console.log(dataArrays, 'dataArrays');
    const _alarmEnable = parseInt(originData.find((item) => item.id === 'AlarmSettingEnable').value);
    const _alarmEnableList = _alarmEnable.toString(2).padStart(8, '0').split('').reverse();

    const groupedDataArrays = [];
    for (let i = 0; i < dataArrays.length; i += 3) {
        groupedDataArrays.push(dataArrays.slice(i, i + 3));
    }

    groupedDataArrays[1][2] = _alarmEnableList[0];
    groupedDataArrays[2][2] = _alarmEnableList[1];
    groupedDataArrays[3][2] = _alarmEnableList[2];
    groupedDataArrays[4][2] = _alarmEnableList[3];
    groupedDataArrays[5][2] = _alarmEnableList[4];
    groupedDataArrays[6][2] = _alarmEnableList[5];
    groupedDataArrays[7][2] = _alarmEnableList[6];
    groupedDataArrays[8][2] = _alarmEnableList[7];

    console.log(groupedDataArrays, 'groupedDataArrays');
    return groupedDataArrays;
}

// 生成小窗设置数据列表
// originData 原始数据
// type 类型
export function generateWindowSettingDatalist(originData, type) {
    if (type !== 'mode1') return []; // 如果不是 mode2，直接返回空数组
    const dataArrays = originData.filter((item) => item.id.startsWith('SettimgSmallWindowStatus')).map((item) => item.value);
    console.log(dataArrays, 'dataArrays');
    const groupedDataArrays = [];
    for (let i = 0; i < dataArrays.length; i += 8) {
        groupedDataArrays.push(dataArrays.slice(i, i + 8));
    }
    console.log(groupedDataArrays, 'groupedDataArrays');
    return groupedDataArrays;
}

// 生成分区报警设置数据列表
// originData 原始数据
// type 类型
export function generateZoneAlarmSettingDatalist(originData, type) {
    if (type !== 'mode1') return []; // 如果不是 mode1，直接返回空数组
    const dataArrays = originData.filter((item) => item.id.startsWith('SettingDataAlarmTempureUp')).map((item) => item.value);
    const dataArrays2 = originData.filter((item) => item.id.startsWith('SettingDataAlarmTempureDown')).map((item) => item.value);

    const _alarmEnable = parseInt(originData.find((item) => item.id === 'SettingDataRegionEnable').value);
    const _alarmEnableList = _alarmEnable.toString(2).padStart(8, '0').split('').reverse();

    let List = [[], [], [], [], [], [], [], [], [], []];
    for (let i = 0; i < dataArrays.length; i++) {
        List[i].push(dataArrays[i], dataArrays2[i], _alarmEnableList[i]);
    }
    console.log(List, 'List');
    return List;
}

// 生成自定义设置数据列表
// originData 原始数据
// type 类型
export function generateCustomSettingDatalist(originData, type) {
    if (type !== 'mode2') return []; // 如果不是 mode2，直接返回空数组
    let keys = ['TemperatureMode', 'DaySetting01', 'TemperatureSettingTemperature01', 'TemperatureSettingCalibrationValue01'];
    let dataArrays = keys.map((key) => originData.filter((item) => item.id === key).map((item) => item.value));
    console.log(dataArrays, 'dataArrays');
    return dataArrays;
}
