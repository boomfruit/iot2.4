const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
// example: npm run genrate:lang public/lang.xlsx(读取excel文件的路径) src/lang(输出文件路径)

function resolve(dir) {
  return path.resolve(__dirname, '..', dir);
}
const rawArgv = process.argv.slice(2);

let excelFilePath;
let jsonFilePath;
if (rawArgv.length === 0) {
  console.log('请输入Excel文件路径');
  process.exit(1);
}

if (rawArgv.length === 1) {
  console.log('请输入语言包导出的文件路径');
  process.exit(1);
}

// 文件路径
excelFilePath = resolve(rawArgv[0]);
jsonFilePath = resolve(rawArgv[1]);
const langFileNameEnum = {
  简体中文: 'zh-CN',
  English: 'en-US',
};
const keyIndex = 1; // 键值所在列
const headerRowIndex = 1; // 标题行所在行索引

// 创建一个新的工作簿实例
const workbook = new ExcelJS.Workbook();
// 读取Excel文件
workbook.xlsx
  .readFile(excelFilePath)
  .then(async () => {
    // 生成json映射文件，new Map(){sheetName:{ lang:jsonData}}
    const dataMap = getJsonDataMap(workbook)
    // 生成json文件
    await generateJsonFiles(dataMap)
  })
  .catch((error) => {
    console.error('Error reading Excel file:', error);
  });

/**
 * 从工作簿中获取JSON数据映射表
 * @param {object} workbook - Excel工作簿对象，用于遍历工作表和工作表数据
 * @returns {Map} dataMap - 包含工作表名称和对应数据对象的映射表，其中数据对象是语言文件名枚举和其键值对的映射
 */
function getJsonDataMap(workbook) {
  const dataMap = new Map();
  workbook.eachSheet(function (worksheet) {
    // 初始化工作表名和文件对象
    const sheetName = worksheet._name;
    const fileObjects = {};
    const cellIndexMap = {};
    // 遍历每一行，首先处理表头，然后处理数据行
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === headerRowIndex) {
        // 处理表头，建立语言文件名和列索引的映射
        row.eachCell((cell, colNumber) => {
          if (colNumber !== keyIndex) {
            fileObjects[langFileNameEnum[cell.value]] = {};
            cellIndexMap[colNumber] = langFileNameEnum[cell.value];
          }
        });
      } else {
        // 处理数据行，根据列索引映射填充语言文件的数据键值对
        Object.keys(cellIndexMap)
          .map((item) => Number(item))
          .map((colNumber) => {
            const key = row.getCell(keyIndex).value;
            const value = row.getCell(colNumber).value || '';
            const lang = cellIndexMap[colNumber];
            fileObjects[lang][key] = value;
          });
      }
    });
    // 将工作表数据对象映射到工作表名称
    dataMap.set(sheetName, fileObjects);
  });
  return dataMap;
}

// 导出语言包文件到指定目录
async function generateJsonFiles(dataMap) {
  // 清空文件输出目录
  const exist = fs.existsSync(jsonFilePath)
  exist && await fs.rmSync(jsonFilePath, { recursive: true }, () => { })
  // 逐个生成目录和文件
  for (const [modules, objs] of dataMap.entries()) {
    for (const [lang, jsonData] of Object.entries(objs)) {
      const path = resolve(jsonFilePath + `/${lang}/${modules}.json`);
      await writeJsonToFile(jsonData, path);
    }
  }
  console.log('Excel file has been converted to JSON and saved to', jsonFilePath);
}

// 异步创建文件夹并写入JSON数据
async function writeJsonToFile(jsonData, filePath) {
  const dirPath = path.dirname(filePath); // 获取文件路径的目录部分
  try {
    await fs.mkdirSync(dirPath, { recursive: true }, () => { }); // 如果目录不存在，会递归创建
    await fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), 'utf8', () => { }); // 异步写入JSON数据
    console.log(`JSON data written to ${filePath}`);
  } catch (err) {
    console.error(`Error writing JSON data to ${filePath}:`, err);
  }
}
