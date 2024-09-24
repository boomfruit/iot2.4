<template>
  <div class="instruction-parsing">
    <el-row>
      <el-col :span="16" class="left">
        <div class="head">
          <span style="color:#909399">{{ $t('device.instruction-parsing.830424-0') }}</span>
          <span>{{ device.serialNumber }}</span>
          <el-dropdown style="margin-left:auto">
            <span class="el-dropdown-link">
              {{ format }}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(item, index) in formatList" :key="index">{{ item }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="content">
          <div v-for="(item, index) in logList" :key="index" class="item-class"
            :class="{ 'send-class': item.type == 0, 'receive-class': item.type == 1, 'report-class': item.type == 2 }">
            <div class="item-head">
              <div>
                {{ item.type == 0 ? $t('device.instruction-parsing.830424-1') : item.type == 1 ?
                  $t('device.instruction-parsing.830424-2') : $t('device.instruction-parsing.830424-3') }}
              </div>
              <div class="head-time">{{ item.time }}</div>
              <div class="analysis-btn right-btn" v-if="item.type != 0 && !item.analysis" v-loading="item.loading"
                @click.stop="analysisData(item, index)">
                {{ $t('device.instruction-parsing.830424-4') }}
              </div>
              <div class="analysised right-btn" v-if="item.type != 0 && item.analysis">
                {{ $t('device.instruction-parsing.830424-5') }}</div>
            </div>
            <div class="item-content">
              <div class="content-value">{{ item.value }}</div>
            </div>
            <div class="analysis-data" v-if="item.type != 0 && item.analysis">
              <div class="data-col left-col">
                <div class="label">{{ $t('device.instruction-parsing.830424-6') }}</div>
                <div class="value">{{ item.analysisVal.name || '--' }}</div>
              </div>
              <div class="data-col right-col">
                <div class="label">{{ $t('device.instruction-parsing.830424-7') }}</div>
                <div class="value">{{ item.analysisVal.id || '--' }}</div>
              </div>
              <div class="data-col left-col">
                <div class="label">{{ $t('device.instruction-parsing.830424-8') }}</div>
                <div class="value">{{ item.analysisVal.value || '--' }}</div>
              </div>
              <div class="data-col right-col" v-if="item.analysisList.length > 1">
                <el-button type="text" size="mini" @click.stop="openMore(item)">{{
                  $t('device.instruction-parsing.830424-9') }}</el-button>
              </div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <el-input :placeholder="$t('device.instruction-parsing.830424-10')" v-model="sendVal"
            class="input-with-select" size="medium">
            <el-select v-model="dataType" slot="prepend" :placeholder="$t('device.instruction-parsing.830424-11')">
              <el-option :label="hex" value="hex"></el-option>
              <el-option :label="json" value="hex"></el-option>
            </el-select>
          </el-input>
          <el-button round type="primary" class="send-btn" size="mini" @click.stop="sendMessage">{{
            $t('device.instruction-parsing.830424-14') }}</el-button>
        </div>
      </el-col>
      <el-col :span="8" class="right">
        <div class="head right-head">{{ $t('device.instruction-parsing.830424-15') }}</div>
        <div class="content beautify-scroll-def">
          <div v-for="(item, index) in quickParsing" :key="index" class="quick-item" @click.stop="quickClick(item)"
            @contextmenu.prevent="onContextmenu($event, item)">
            {{ item.name }}
          </div>
        </div>
        <div class="right-bottom" @click.stop="openEdit">{{ $t('device.instruction-parsing.830424-16') }}</div>
      </el-col>
    </el-row>
    <el-dialog
      :title="editName ? $t('device.instruction-parsing.830424-17') : $t('device.instruction-parsing.830424-18')"
      :visible.sync="editDialog" :width="editName ? '30%' : '40%'">
      <div class="dialog-content beautify-scroll-def" v-show="!editName">
        <el-form :model="createForm" label-position="top">
          <el-row :gutter="40">
            <!-- 从机地址 -->
            <el-col :span="24">
              <el-form-item :label="$t('device.instruction-parsing.830424-19')" prop="path">
                <el-input v-model="createForm.path" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <!-- 指令类型 -->
            <el-col :span="12">
              <el-form-item :label="$t('device.instruction-parsing.830424-20')" prop="start">
                <el-select v-model="createForm.start" @change="changeNum">
                  <el-option :label="start.label" :value="start.value" v-for="start in startList"
                    :key="start.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- 功能码 -->
            <el-col :span="12">
              <el-form-item :label="$t('device.instruction-parsing.830424-21')" prop="functionCode">
                <el-select v-model="createForm.functionCode" @change="changeNum"
                  :disabled="createForm.start == '0xFFAA'">
                  <el-option :label="functionCode.label" :value="functionCode.value"
                    v-for="functionCode in functionCodeList" :key="functionCode.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!--起始寄存器地址-->
            <el-col :span="12">
              <el-form-item prop="startPath">
                <div slot="label" class="form-item-label">
                  <div style="margin-right:auto">{{ $t('device.instruction-parsing.830424-22') }}</div>
                  <el-tooltip :content="createForm.startPathSwitch" placement="top">
                    <el-switch v-model="createForm.startPathSwitch" size="mini" active-color="#13ce66"
                      inactive-color="#ff4949" active-value="Dec" inactive-value="Hex" />
                  </el-tooltip>
                </div>
                <el-input v-model="createForm.startPath" type="number" v-show="createForm.startPathSwitch == 'Dec'"
                  :min="0" @change="() => { createForm.startPath16 = int2hex(createForm.startPath) }"
                  @input="() => { createForm.startPath16 = int2hex(createForm.startPath) }">
                  <div slot="append">0x{{ createForm.startPath16 }}</div>
                </el-input>
                <el-input v-model="createForm.startPath16" v-show="createForm.startPathSwitch != 'Dec'"
                  @input="() => { createForm.startPath = hex2int(createForm.startPath16) }">
                  <div slot="append">{{ createForm.startPath }}</div>
                </el-input>
              </el-form-item>
            </el-col>
            <!-- 个数或写值 -->
            <el-col :span="12">
              <!-- 个数 -->
              <el-form-item :label="registerNumTitle" prop="registerNum"
                v-show="!['05', '06'].includes(createForm.functionCode)">
                <el-input-number v-model="createForm.registerNum" controls-position="right" :min="0"
                  @change="changeNum" />
              </el-form-item>
              <!-- 写值 -->
              <el-form-item prop="setValue" v-show="['05', '06'].includes(createForm.functionCode)">
                <div slot="label" class="form-item-label">
                  <div style="margin-right:auto">{{ registerNumTitle }}</div>
                  <el-tooltip :content="createForm.setValueSwitch" placement="top">
                    <el-switch v-model="createForm.setValueSwitch" size="mini" active-color="#13ce66"
                      inactive-color="#ff4949" active-value="Dec" inactive-value="Hex" />
                  </el-tooltip>
                </div>
                <el-input v-model="createForm.setValue" type="number" v-show="createForm.setValueSwitch == 'Dec'"
                  @change="() => { createForm.setValue16 = int2hex(createForm.setValue) }"
                  @input="() => { createForm.setValue16 = int2hex(createForm.setValue) }">
                  <div slot="append">0x{{ createForm.setValue16 }}</div>
                </el-input>
                <el-input v-model="createForm.setValue16" v-show="createForm.setValueSwitch != 'Dec'"
                  @input="() => { createForm.setValue = hex2int(createForm.setValue16) }">
                  <div slot="append">{{ createForm.setValue }}</div>
                </el-input>
              </el-form-item>
            </el-col>
            <!-- 批量写寄存器值  -->
            <el-col :span="12" v-for="(item, index) in registerValList" :key="'register' + index"
              v-show="createForm.functionCode == '16'">
              <el-form-item prop="registerValList">
                <div slot="label" class="form-item-label">
                  <div style="margin-right:auto">#{{ index }} {{ $t('device.instruction-parsing.830424-23') }}</div>
                  <el-tooltip :content="item.switch" placement="top">
                    <el-switch v-model="item.switch" size="mini" active-color="#13ce66"
                      @change="() => { refreshRegisterInpust(item, index) }" inactive-color="#ff4949" active-value="Dec"
                      inactive-value="Hex" />
                  </el-tooltip>
                </div>
                <el-input v-model="item.value" type="number" v-show="item.switch == 'Dec'" :min="0"
                  @change="() => { item.value16 = int2hex(item.value); refreshRegisterInpust(item, index) }"
                  @input="() => { item.value16 = int2hex(item.value); refreshRegisterInpust(item, index) }">
                  <div slot="append">0x{{ item.value16 }}</div>
                </el-input>
                <el-input v-model="item.value16" v-show="item.switch != 'Dec'"
                  @input="() => { item.value = hex2int(item.value16); refreshRegisterInpust(item, index) }">
                  <div slot="append">{{ item.value }}</div>
                </el-input>
              </el-form-item>
            </el-col>
            <!-- 批量上报值  -->
            <el-col :span="12" v-for="(item, index) in reportValList" :key="'report' + index"
              v-show="createForm.start == '0xFFAA'">
              <el-form-item prop="reportValList">
                <div slot="label" class="form-item-label">
                  <div style="margin-right:auto">#{{ index }} {{ $t('device.instruction-parsing.830424-24') }}</div>
                  <el-tooltip :content="item.switch" placement="top">
                    <el-switch v-model="item.switch" size="mini" active-color="#13ce66"
                      @change="() => { refreshReportValList(item, index) }" inactive-color="#ff4949" active-value="Dec"
                      inactive-value="Hex" />
                  </el-tooltip>
                </div>
                <el-input v-model="item.value" type="number" v-show="item.switch == 'Dec'" :min="0"
                  @change="() => { item.value16 = int2hex(item.value); refreshReportValList(item, index) }"
                  @input="() => { item.value16 = int2hex(item.value); refreshReportValList(item, index) }">
                  <div slot="append">0x{{ item.value16 }}</div>
                </el-input>
                <el-input v-model="item.value16" v-show="item.switch != 'Dec'"
                  @input="() => { item.value = hex2int(item.value16); refreshReportValList(item, index) }">
                  <div slot="append">{{ item.value }}</div>
                </el-input>
              </el-form-item>
            </el-col>
            <!-- 批量写线圈值  -->
            <el-col :span="6" v-for="(item, index) in IOValList" :key="'IO' + index"
              v-show="createForm.functionCode == '15'">
              <el-form-item prop="registerValList">
                <div slot="label" class="form-item-label">
                  <div style="margin-right:auto">#{{ index }} {{ $t('device.instruction-parsing.830424-25') }}</div>
                </div>
                <el-switch v-model="item.value" active-value="1" inactive-value="0"
                  @change="() => { refreshIOInpust(item, index) }" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div v-loading="createLoading">
          <div class="create-title">
            <el-button type="text" @click.stop="encode">{{ $t('device.instruction-parsing.830424-26') }}</el-button>
            <div class="title-right">
              <el-button type="" size="mini" :disabled="!canSend" @click="openEditName({ command: createCode })">{{
                $t('device.instruction-parsing.830424-27') }}</el-button>
              <el-button type="primary" :disabled="!canSend" size="mini" @click="copyText(createCode)">{{
                $t('device.instruction-parsing.830424-28') }}</el-button>
            </div>
          </div>
          <div class="create-code">{{ createCode }}</div>
        </div>
      </div>
      <div v-show="editName" class="dialog-content">
        <el-form :model="editNameForm">
          <el-form-item :label="$t('device.instruction-parsing.830424-29')">
            <el-input v-model="editNameForm.name" :placeholder="$t('device.instruction-parsing.830424-30')"
              style="width:60%"></el-input>
          </el-form-item>
          <el-form-item :label="$t('device.instruction-parsing.830424-31')">
            <el-input v-model="editNameForm.command" :disabled="true" style="width:60%"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-btn">
        <el-button type="" size="mini" @click="editDialog = false">{{ $t('device.instruction-parsing.830424-32')
          }}</el-button>
        <el-button type="primary" :disabled="!canSend" size="mini" @click="confrimBtn" v-loading="saveLoading">{{
          $t('device.instruction-parsing.830424-33') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="delDialog" :title="$t('device.instruction-parsing.830424-34')" width="30%">
      <div style="padding:20px">
        {{ $t('device.instruction-parsing.830424-35') }}{{ delItem.name }}{{ $t('device.instruction-parsing.830424-35')
        }}
      </div>
      <div slot="footer" class="dialog-btn">
        <el-button type="" size="mini" @click="delDialog = false">{{ $t('device.instruction-parsing.830424-37')
          }}</el-button>
        <el-button type="primary" size="mini" @click="delQuick">{{ $t('device.instruction-parsing.830424-38')
          }}</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="$t('device.instruction-parsing.830424-39')" width="40%" :visible.sync="moreDialog">
      <div class="dialog-content beautify-scroll-def">
        <el-table :data="analysisList" height="400" border style="width: 100%">
          <el-table-column type="index" :label="$t('device.instruction-parsing.830424-40')" />
          <el-table-column prop="name" :label="$t('device.instruction-parsing.830424-41')">
          </el-table-column>
          <el-table-column prop="id" :label="$t('device.instruction-parsing.830424-42')">
          </el-table-column>
          <el-table-column prop="value" :label="$t('device.instruction-parsing.830424-43')">
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { hex2int, int2hex, copyText, formatDate, deepClone } from '@/utils/common'
import { encode, decode, messagePost, addPreferences, editPreferences, delPreferences, preferencesList } from '@/api/iot/mqttTest'
export default {
  props: {
    device: {
      type: Object,
      default: null,
    },
  },
  created() {
    this.getPreferencesList()
  },
  watch: {
    device() {
      this.getPreferencesList()
    }
  },
  computed: {
    /**编辑寄存器个数显示的标题 */
    registerNumTitle() {
      switch (this.createForm.functionCode) {
        case '01':
        case '02':
        case '15':
          return this.$t('device.instruction-parsing.830424-44')
        case '03':
        case '04':
        case '16':
          return this.$t('device.instruction-parsing.830424-45')
        case '05':
          return this.$t('device.instruction-parsing.830424-46')
        case '06':
          return this.$t('device.instruction-parsing.830424-47')
      }
    }
  },
  data() {
    return {
      //选中的格式
      format: 'Hex',
      //格式列表
      formatList: ['Hex', 'JSON', 'Plaintext'],
      //数据列表
      logList: [],
      //发送的命令
      sendVal: '',
      //发送的主题
      topic: '/function/get',
      dataType: 'hex',
      //快捷指令数组
      quickParsing: [],
      //编辑框
      editDialog: false,
      //生成表单
      createForm: {},
      //功能码列表
      functionCodeList: [
        {
          label: this.$t('device.instruction-parsing.830424-48'),
          value: '01'
        }, {
          label: this.$t('device.instruction-parsing.830424-49'),
          value: '02'
        }, {
          label: this.$t('device.instruction-parsing.830424-50'),
          value: '03'
        }, {
          label: this.$t('device.instruction-parsing.830424-51'),
          value: '04'
        }, {
          label: this.$t('device.instruction-parsing.830424-52'),
          value: '05'
        }, {
          label: this.$t('device.instruction-parsing.830424-53'),
          value: '06'
        }, {
          label: this.$t('device.instruction-parsing.830424-54'),
          value: '15'
        }, {
          label: this.$t('device.instruction-parsing.830424-55'),
          value: '16'
        }
      ],
      //上报下发列表
      startList: [
        {
          label: this.$t('device.instruction-parsing.830424-56'),
          value: '0xFFDD'
        },
        {
          label: this.$t('device.instruction-parsing.830424-57'),
          value: '0xFFAA'
        }
      ],
      //生成的指令码
      createCode: '',
      //批量写的寄存器值数组
      registerValList: [],
      //批量上报值数组
      reportValList: [],
      //批量写的线圈个数
      IOValList: [],
      //编辑名称
      editName: false,
      //编辑名称表单
      editNameForm: {},
      //生成刷新
      createLoading: false,
      //删除快捷指令
      delDialog: false,
      //选择删除的快捷指令
      delItem: {},
      //选择的解析组
      analysisList: [],
      //更多解析弹框
      moreDialog: false,
      //保存按钮loading
      saveLoading: false,
      canSend: false,
    }
  },
  methods: {
    /**打开编辑框 */
    openEdit() {
      this.resetCreateForm()
      this.editName = false
      this.editDialog = true
      this.canSend = false
    },
    /**打开更多解析框 */
    openMore(item) {
      this.analysisList = item.analysisList || []
      this.moreDialog = true
    },
    /**打开编辑名字的框 */
    openEditName(item) {
      this.editNameForm = {
        name: item.name || '',
        command: item.command
      }
      this.editName = true
      this.editDialog = true
    },
    /**重置编辑框 */
    resetCreateForm() {
      this.createForm = {
        path: '01',
        functionCode: '01',
        startPath: 0,
        startPath16: '0000',
        registerNum: 1,
        startPathSwitch: 'Dec',
        setValue: 0,
        setValue16: '0000',
        setValueSwitch: 'Dec',
        start: '0xFFDD'
      }
      this.createCode = ''
    },
    /**十进制变成十六进制 */
    int2hex(str) {
      return int2hex(str)
    },
    /**十六进制变成十进制 */
    hex2int(str) {
      return hex2int(str)
    },
    /**修改批量写的寄存器个数或者线圈个数 */
    changeNum() {
      //判断是不是上报
      if (this.createForm.start == '0xFFAA') {
        for (let index = 0; index < this.createForm.registerNum; index++) {
          const item = this.reportValList[index]
          if (!item) {
            this.reportValList[index] = {
              value: 0,
              value16: '0000',
              switch: 'Dec'
            }
          }
        }
        //如果编写数组大于他需要写的数字，就到写的个数
        if (this.registerValList.length > this.createForm.reportValList) {
          //多的个数
          const num = this.reportValList.length - this.createForm.reportValList
          this.registerValList.splice(this.createForm.reportValList, num)
        }
        //上报功能码是03
        this.createForm.functionCode = '03'
      } else {
        //批量写寄存器
        if (this.createForm.functionCode == '16') {
          for (let index = 0; index < this.createForm.registerNum; index++) {
            const item = this.registerValList[index]
            if (!item) {
              this.registerValList[index] = {
                value: 0,
                value16: '0000',
                switch: 'Dec'
              }
            }
          }
          //如果编写数组大于他需要写的数字，就到写的个数
          if (this.registerValList.length > this.createForm.registerNum) {
            //多的个数
            const num = this.registerValList.length - this.createForm.registerNum
            this.registerValList.splice(this.createForm.registerNum, num)
          }
        }
        //批量写线圈
        if (this.createForm.functionCode == '15') {
          for (let index = 0; index < this.createForm.registerNum; index++) {
            const item = this.IOValList[index]
            if (!item) {
              this.IOValList[index] = {
                value: '0'
              }
            }
          }
          //如果编写数组大于他需要写的数字，就到写的个数
          if (this.IOValList.length > this.createForm.registerNum) {
            //多的个数
            const num = this.IOValList.length - this.createForm.registerNum
            this.IOValList.splice(this.createForm.registerNum, num)
          }
        }
      }

    },
    /**刷新寄存器输入框 */
    refreshRegisterInpust(item, index) {
      this.$set(this.registerValList, index, item)
    },
    /**刷新上报读取设定的值 */
    refreshReportValList(item, index) {
      this.$set(this.reportValList, index, item)
    },
    /**刷新线圈值 */
    refreshIOInpust(item, index) {
      this.$set(this.IOValList, index, item)
    },
    /**确认按钮 */
    async confrimBtn() {
      if (this.editName) {
        try {
          this.saveLoading = true
          if (this.editNameForm.id) {
            await editPreferences({
              command: this.editNameForm.command,
              name: this.editNameForm.name,
              serialNumber: this.device.serialNumber,
              id: this.editNameForm.id
            })
          } else {
            await addPreferences({
              command: this.editNameForm.command,
              name: this.editNameForm.name,
              serialNumber: this.device.serialNumber
            })
          }
          this.$message({
            type: 'success',
            message: `${this.editNameForm.id ? this.$t('device.instruction-parsing.830424-58') : this.$t('device.instruction-parsing.830424-59')}this.$t('device.instruction-parsing.830424-60')`
          })
          this.getPreferencesList()
        } catch (err) {
          this.$message({
            type: 'error',
            message: err.message || `${this.editNameForm.id ? this.$t('device.instruction-parsing.830424-58') : this.$t('device.instruction-parsing.830424-59')}this.$t('device.instruction-parsing.830424-61')`
          })
        }
      } else {
        this.sendVal = this.createCode
      }
      this.saveLoading = false
      this.editDialog = false
    },
    /**获取指令列表 */
    async getPreferencesList() {
      try {
        const { rows } = await preferencesList({ serialNumber: this.device.serialNumber })
        this.quickParsing = rows
      } catch (err) {
        console.log("🚀 ~ getPreferencesList ~ err:", err)
      }
    },
    /**快捷按钮 */
    quickClick(item) {
      this.sendVal = item.command
    },
    /**复制 */
    copyText(command) {
      const res = copyText(command)
      this.$message({
        type: res.type,
        message: res.message
      })
    },
    /**编码 */
    async encode() {
      try {
        this.createLoading = true
        let params = {
          slaveId: parseInt(this.createForm.path),//从机地址
          address: this.createForm.startPath,//起始寄存器地址
          code: parseInt(this.createForm.functionCode),//功能码
          start: this.createForm.start
        }
        //判断是不是上报
        if (this.createForm.start == '0xFFAA') {
          params.address = this.createForm.startPath
          params.bitCount = this.createForm.registerNum * 2
          const reportValList = this.reportValList.map(item => { return item.value })
          params.data = reportValList
        } else {
          switch (this.createForm.functionCode) {
            case '01':
            case '02':
            case '03':
            case '04':
              //线圈个数/寄存器个数
              params.count = this.createForm.registerNum
              break;
            case '05':
            case '06':
              //线圈值/寄存器值
              params.writeData = this.createForm.setValue
              break;
            case '15':
              //线圈个数/寄存器个数
              params.count = this.createForm.registerNum
              //线圈值数组
              const IOValList = this.IOValList.map(item => { return item.value })
              params.bitString = IOValList.join('')
              break
            case '16':
              //线圈个数/寄存器个数
              params.count = this.createForm.registerNum
              //寄存器值数组
              const registerValList = this.registerValList.map(item => { return item.value })
              params.tenWriteData = registerValList
              break
          }
        }
        const res = await encode(params)
        this.createCode = res.msg
      } catch (err) {
        this.$message({
          type: 'error',
          message: err.message || this.$t('device.instruction-parsing.830424-62')
        })
      } finally {
        this.createLoading = false;
        this.canSend = true;
      }
    },

    /**发送指令 */
    sendMessage() {
      try {
        if (this.sendVal) {
          messagePost({
            message: this.sendVal,
            serialNumber: this.device.serialNumber,
            topicName: this.topic,
            dataType:this.dataType
          }).then(response => {
            this.logList.push({
              //0是下发，1是回复，2是上报
              type: 0,
              time: formatDate(new Date()),
              value: this.sendVal,
              loading: false,
              analysis: false,
              //解析的数据数组
              analysisList: []
            })
          })
        } else {
          throw ({ message: this.$t('device.instruction-parsing.830424-63') })
        }
      } catch (err) {
        this.$message({
          type: 'error',
          message: err.message || this.$t('device.instruction-parsing.830424-64')
        })
      }
    },

    /**解析数据 */
    analysisData(item, index) {
      try {
        item.loading = true
        item.analysis = true
        if (item.analysisList[0]) {
          item.analysisVal = {
            name: item.analysisList[0].name,
            value: item.analysisList[0].value,
            id: item.analysisList[0].id
          }
        } else {
          throw ({ message: this.$t('device.instruction-parsing.830424-65') })
        }
      } catch (err) {
        this.$message({
          type: 'error',
          message: err.message || this.$t('device.instruction-parsing.830424-66')
        })
      } finally {
        item.loading = false
      }
    },
    /**右击快捷指令 */
    onContextmenu(event, item) {
      const contextMenuData = [
        {
          label: this.$t('device.instruction-parsing.830424-67'),
          icon: "iconfont el-icon-edit-outline",
          onClick: () => {
            this.editNameForm = deepClone(item)
            this.editName = true
            this.editDialog = true
          },
        },
        {
          label: this.$t('device.instruction-parsing.830424-68'),
          icon: "iconfont el-icon-delete",
          onClick: () => {
            this.delItem = item
            this.delDialog = true
          },
        }
      ]
      this.$contextmenu({
        items: contextMenuData,
        event, // 鼠标事件信息
        zIndex: 3, // 菜单样式 z-index
        minWidth: 230 // 主菜单最小宽度
      });
      return false;
    },
    /**删除指令 */
    async delQuick() {
      try {
        await delPreferences(this.delItem)
        this.$message({
          type: 'success',
          message: this.$t('device.instruction-parsing.830424-69'),
        })
        this.delDialog = false
        this.getPreferencesList()
      } catch (err) {
        this.$message({
          type: 'error',
          message: err.message || this.$t('device.instruction-parsing.830424-70'),
        })
      }
    }
  },
  mounted() {
    this.resetCreateForm()
    this.$busEvent.$on("updateData", (params) => {
      const { serialNumber, productId, data } = params
      if (serialNumber == this.device.serialNumber) {
        this.logList.push({
          //0是下发，1是回复，2是上报
          type: 2,
          time: formatDate(new Date()),
          value: data.sources,
          loading: false,
          analysis: false,
          //解析的数据数组
          analysisList: data.message,
        })
      }
    })
  },
  beforeDestroy() {
    this.$busEvent.$off('updateMqttMessage')
  }
}
</script>

<style lang="scss" scoped>
$border-color: #DCDFE6;
$right-btn-color: #1890ff;

.instruction-parsing {
  border: 1px solid $border-color;
  width: 90%;
  margin: auto;

  .left {
    border-right: 1px solid $border-color;

    .bottom {
      display: flex;
      border-top: 1px solid $border-color;
      position: relative;
      height: 64px;
      align-items: center;

      ::v-deep .el-select .el-input {
        width: 80px;
      }

      ::v-deep .el-input-group--prepend .el-input__inner {
        border: 0px;
        background-color: #fff;
      }

      ::v-deep .el-input-group__prepend {
        border: 0;
        // border-right: 1px solid $border-color;
      }

      .send-btn {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 24px;
      }

      .input-with-select {
        max-width: calc(100% - 80px)
      }
    }
  }

  .head {
    line-height: 36px;
    display: flex;
    padding: 0 16px;
    align-items: center;
    font-size: 12px;
    border-bottom: 1px solid $border-color;

    .el-dropdown-link {
      cursor: pointer;
    }

    .el-icon-arrow-down {
      font-size: 12px;
    }
  }

  .right {
    .right-head {
      font-size: 14px;
      text-align: center;
      width: 100%;
      justify-content: center;
    }

    .quick-item {
      width: 80%;
      margin: auto;
      text-align: center;
      line-height: 36px;
      margin-top: 12px;
      border: 1px solid $right-btn-color;
      color: $right-btn-color;
      cursor: pointer;
      border-radius: 4px;

      &:last-child {
        margin-bottom: 12px
      }
    }

    .right-bottom {
      line-height: 64px;
      background-color: $right-btn-color;
      border-top: 1px solid $right-btn-color;
      font-size: 24px;
      color: #fff;
      text-align: center;
      cursor: pointer
    }
  }

  .content {
    height: 600px;
    width: 100%;
    overflow: auto;
    padding: 20px;

    .send-class {
      border-left: 4px solid #E6A23C;
      margin-left: auto;
      color: #E6A23C;

      .head-time {
        margin-left: auto !important;
        color: #C0C4CC
      }
    }

    .receive-class {
      border-left: 4px solid #67C23A;
      color: #67C23A
    }

    .report-class {
      border-left: 4px solid #409EFF;
      color: #409EFF
    }

    .item-class {
      width: 50%;
      box-sizing: border-box;
      border-radius: 4px;
      padding: 0 8px;
      background-color: #F2F6FC;
      margin-bottom: 16px;

      .item-head {
        display: flex;
        border-bottom: 1px solid $border-color;
        font-size: 14px;
        padding: 8px 0;
        align-items: center;

        .head-time {
          margin-left: 8px;
          color: #C0C4CC;
          font-size: 12px;
          margin-top: 3px;
        }

        .analysis-btn {
          background: #1890ff;
          color: #fff;
          cursor: pointer
        }

        .right-btn {
          margin-left: auto;
          padding: 8px 12px;
          border-radius: 4px;
          line-height: 12px;
          font-size: 14px;
        }

        .analysised {
          background: #909399;
          color: #E4E7ED;
        }
      }

      .item-content {
        padding: 8px 0;
        color: #303133;
        font-size: 14px;
        line-height: 20px;
        display: flex;
        align-items: center;

        .content-value {
          max-width: 100%;
          word-wrap: break-word;
        }
      }

      .analysis-data {
        margin-top: 12px;
        font-size: 12px;
        line-height: 18px;
        width: 100%;
        color: #303133;
        font-weight: 600;
        display: flex;
        flex-wrap: wrap;

        .data-col {
          // width:100%;
          display: flex;
          margin-bottom: 10px;

          .label {
            text-align: right;
            margin-right: 12px;
            color: #C0C4CC;
            font-weight: 400
          }
        }

        .left-col {
          width: 60%;

          .label {
            width: 64px
          }
        }

        .right-col {
          margin-left: auto
        }
      }
    }
  }

  ::v-deep .el-dialog__body {
    border-top: 1px solid $border-color;
    border-bottom: 1px solid $border-color;
    box-sizing: border-box;
    padding: 0;
  }

  .dialog-content {
    max-height: 500px;
    width: 100%;
    box-sizing: border-box;
    padding: 30px 20px;
    overflow: auto;

    .create-title {
      display: flex;
      line-height: 36px;
      margin-bottom: 16px;

      .title-right {
        margin-left: auto
      }
    }

    .create-code {
      font-size: 18px;
      line-height: 36px;
      font-weight: 800
    }

    .form-item-label {
      display: flex;
      align-items: center;
      width: 100%;

      ::v-deep .el-form-item__label {
        width: 100%
      }
    }
  }
}
</style>
