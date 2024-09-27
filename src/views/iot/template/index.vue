<template>
    <div style="padding: 6px">
        <el-card v-show="showSearch" style="margin-bottom: 5px">
            <el-row :gutter="0">
                <el-col :span="22">
                    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" size="mini" label-width="46px" style="margin-bottom: -20px">
                        <el-form-item :label="$t('template.index.891112-0')" prop="templateName">
                            <el-input v-model="queryParams.templateName" :placeholder="$t('template.index.891112-1')" clearable @keyup.enter.native="handleQuery" />
                        </el-form-item>

                        <!-- <template v-if="searchShow">
                            <el-form-item :label="$t('template.index.891112-2')" prop="type">
                                <el-select v-model="queryParams.type" :placeholder="$t('template.index.891112-3')" clearable>
                                    <el-option v-for="dict in dict.type.iot_things_type" :key="dict.value" :label="dict.label" :value="dict.value" />
                                </el-select>
                            </el-form-item>
                        </template> -->

                        <el-form-item>
                            <el-button class="el-button" type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                            <el-button class="el-button" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                            <!-- <el-button type="text" @click="searchChange">
                                {{ searchShow ? $t('template.index.891112-113') : $t('template.index.891112-112') }}
                                <i
                                    :class="{
                                        'el-icon-arrow-down': !searchShow,
                                        'el-icon-arrow-up': searchShow,
                                    }"
                                ></i>
                            </el-button> -->
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="2" style="text-align: right">
                    <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['iot:template:add']">{{ $t('add') }}</el-button>
                </el-col>
            </el-row>

            <!-- <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
            v-hasPermi="['iot:template:add']">新增</el-button>
        </el-col>

        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row> -->
        </el-card>

        <el-card style="padding-bottom: 100px">
            <el-table v-loading="loading" :data="templateList" border size="mini" highlight-current-row @selection-change="handleSelectionChange">
                <el-table-column :label="$t('template.index.891112-0')" align="center" prop="templateName" />
                <el-table-column :label="$t('template.index.891112-7')" align="center" prop="identifier" />
                <el-table-column :label="$t('template.index.891112-8')" align="center" prop="isMonitor" width="75">
                    <template slot-scope="scope">
                        <dict-tag :options="dict.type.iot_yes_no" :value="scope.row.isChart" />
                    </template>
                </el-table-column>
                <el-table-column :label="$t('template.index.891112-9')" align="center" prop="" width="75">
                    <template slot-scope="scope">
                        <dict-tag :options="dict.type.iot_yes_no" :value="scope.row.isMonitor" />
                    </template>
                </el-table-column>
                <el-table-column :label="$t('template.index.891112-10')" align="center" prop="" width="75">
                    <template slot-scope="scope">
                        <dict-tag :options="dict.type.iot_yes_no" :value="scope.row.isReadonly" />
                    </template>
                </el-table-column>
                <el-table-column :label="$t('template.index.891112-11')" align="center" prop="" width="75">
                    <template slot-scope="scope">
                        <dict-tag :options="dict.type.iot_yes_no" :value="scope.row.isHistory" />
                    </template>
                </el-table-column>
                <el-table-column :label="$t('template.index.891112-12')" align="center" prop="isSys" width="80">
                    <template slot-scope="scope">
                        <dict-tag :options="dict.type.iot_yes_no" :value="scope.row.isSys" />
                    </template>
                </el-table-column>
                <el-table-column :label="$t('template.index.891112-13')" align="center" prop="type" width="100">
                    <template slot-scope="scope">
                        <dict-tag :options="dict.type.iot_things_type" :value="scope.row.type" />
                    </template>
                </el-table-column>
                <el-table-column :label="$t('template.index.891112-14')" align="center" prop="datatype" width="80">
                    <template slot-scope="scope">
                        <dict-tag :options="dict.type.iot_data_type" :value="scope.row.datatype" />
                    </template>
                </el-table-column>
                <el-table-column :label="$t('template.index.891112-15')" align="left" header-align="center" prop="specs" min-width="150" class-name="specsColor">
                    <template slot-scope="scope">
                        <div v-html="formatSpecsDisplay(scope.row.specs)"></div>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('template.index.891112-16')" align="center" prop="modelOrder" width="80" />
                <el-table-column :label="$t('template.index.891112-17')" align="center" prop="createTime" width="100">
                    <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('opation')" align="center" class-name="small-padding fixed-width" width="150">
                    <template slot-scope="scope">
                        <el-button size="small" style="padding: 5px" icon="el-icon-view" @click="handleUpdate(scope.row)" v-hasPermi="['iot:template:query']" v-if="scope.row.isSys == '0' ? true : !isTenant">
                            {{ $t('look') }}
                        </el-button>
                        <el-button
                            size="small"
                            type="danger"
                            style="padding: 5px"
                            icon="el-icon-delete"
                            @click="handleDelete(scope.row)"
                            v-hasPermi="['iot:template:remove']"
                            v-if="scope.row.isSys == '0' ? true : !isTenant"
                        >
                            {{ $t('del') }}
                        </el-button>
                        <span style="font-size: 10px; color: #999" v-if="scope.row.isSys == '1' && isTenant">{{ $t('template.index.891112-21') }}</span>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

            <!-- 添加或修改通用物模型对话框 -->
            <el-dialog :title="title" :visible.sync="open" width="900px" append-to-body>
                <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                    <el-form-item :label="$t('template.index.891112-22')" prop="templateName">
                        <el-input v-model="form.templateName" :placeholder="$t('template.index.891112-23')" style="width: 385px" />
                    </el-form-item>
                    <el-form-item :label="$t('template.index.891112-24')" prop="identifier">
                        <el-input v-model="form.identifier" :placeholder="$t('template.index.891112-25')" style="width: 385px" />
                    </el-form-item>
                    <el-form-item :label="$t('template.index.891112-26')" prop="modelOrder">
                        <el-input-number controls-position="right" v-model="form.modelOrder" :placeholder="$t('template.index.891112-27')" type="number" style="width: 385px" />
                    </el-form-item>
                    <el-form-item :label="$t('template.index.891112-28')" prop="type">
                        <el-radio-group v-model="form.type" @change="typeChange(form.type)">
                            <el-radio-button label="1">{{ $t('template.index.891112-29') }}</el-radio-button>
                            <el-radio-button label="2">{{ $t('template.index.891112-30') }}</el-radio-button>
                            <el-radio-button label="3">{{ $t('template.index.891112-31') }}</el-radio-button>
                            <el-radio-button v-show="this.form.templateId == null || (this.form.type == '4' && changeTypeDisable)" label="4">类型</el-radio-button>
                            <el-radio-button v-show="this.form.templateId == null || (this.form.type == '5' && changeTypeDisable)" label="5">服务</el-radio-button>
                        </el-radio-group>
                    </el-form-item>

                    <el-form-item :label="$t('template.index.891112-32')" prop="property">
                        <el-row>
                            <el-col :span="6">
                                <el-tooltip effect="dark" :content="$t('template.index.891112-33')" placement="top">
                                    <el-checkbox
                                        name="isChart"
                                        :label="$t('template.index.891112-8')"
                                        @change="isChartChange"
                                        v-show="form.type == 1"
                                        v-model="form.isChart"
                                        :true-label="1"
                                        :false-label="0"
                                    ></el-checkbox>
                                </el-tooltip>
                            </el-col>
                            <el-col :span="6">
                                <el-tooltip effect="dark" :content="$t('template.index.891112-34')" placement="top">
                                    <el-checkbox
                                        name="isMonitor"
                                        :label="$t('template.index.891112-9')"
                                        @change="isMonitorChange"
                                        v-show="form.type == 1"
                                        v-model="form.isMonitor"
                                        :true-label="1"
                                        :false-label="0"
                                    ></el-checkbox>
                                </el-tooltip>
                            </el-col>
                            <el-col :span="6">
                                <el-tooltip effect="dark" :content="$t('template.index.891112-35')" placement="top">
                                    <el-checkbox
                                        name="isReadonly"
                                        :label="$t('template.index.891112-36')"
                                        @change="isReadonlyChange"
                                        :disabled="form.type == 3"
                                        v-model="form.isReadonly"
                                        :true-label="1"
                                        :false-label="0"
                                    ></el-checkbox>
                                </el-tooltip>
                            </el-col>
                            <el-col :span="6">
                                <el-tooltip effect="dark" :content="$t('template.index.891112-37')" placement="top">
                                    <el-checkbox name="isHistory" :label="$t('template.index.891112-11')" v-model="form.isHistory" :true-label="1" :false-label="0"></el-checkbox>
                                </el-tooltip>
                            </el-col>
                            <el-col :span="6">
                                <el-tooltip effect="dark" :content="$t('template.index.891112-38')" placement="top">
                                    <el-checkbox name="isSharePerm" :label="$t('template.index.891112-39')" v-model="form.isSharePerm" :true-label="1" :false-label="0"></el-checkbox>
                                </el-tooltip>
                            </el-col>
                        </el-row>
                    </el-form-item>

                    <el-divider></el-divider>
                    <div v-if="getShowModelProperties">
                        <el-form-item :label="$t('template.index.891112-14')" prop="datatype">
                            <el-select v-model="form.datatype" :placeholder="$t('template.index.891112-40')" @change="dataTypeChange" style="width: 175px">
                                <el-option key="integer" :label="$t('template.index.891112-41')" value="integer"></el-option>
                                <el-option key="decimal" :label="$t('template.index.891112-42')" value="decimal"></el-option>
                                <el-option key="bool" :label="$t('template.index.891112-43')" value="bool" :disabled="form.isChart == 1"></el-option>
                                <el-option key="enum" :label="$t('template.index.891112-44')" value="enum" :disabled="form.isChart == 1"></el-option>
                                <el-option key="string" :label="$t('template.index.891112-45')" value="string" :disabled="form.isChart == 1"></el-option>
                                <el-option key="array" :label="$t('template.index.891112-46')" value="array" :disabled="form.isChart == 1"></el-option>
                                <el-option key="object" :label="$t('template.index.891112-47')" value="object" :disabled="form.isChart == 1"></el-option>
                            </el-select>
                        </el-form-item>
                        <div v-if="form.datatype == 'integer' || form.datatype == 'decimal'">
                            <el-form-item :label="$t('template.index.891112-48')">
                                <el-row>
                                    <el-col :span="9">
                                        <el-input v-model="form.specs.min" :placeholder="$t('template.index.891112-49')" type="number" />
                                    </el-col>
                                    <el-col :span="2" align="center">{{ $t('template.index.891112-50') }}</el-col>
                                    <el-col :span="9">
                                        <el-input v-model="form.specs.max" :placeholder="$t('template.index.891112-51')" type="number" />
                                    </el-col>
                                </el-row>
                            </el-form-item>
                            <el-form-item :label="$t('template.index.891112-52')">
                                <el-input v-model="form.specs.unit" :placeholder="$t('template.index.891112-53')" style="width: 385px" />
                            </el-form-item>
                            <el-form-item :label="$t('template.index.891112-54')">
                                <el-input-number controls-position="right" v-model="form.specs.step" :placeholder="$t('template.index.891112-55')" type="number" style="width: 385px" />
                            </el-form-item>
                        </div>
                        <div v-if="form.datatype == 'bool'">
                            <el-form-item :label="$t('template.index.891112-56')" prop="">
                                <el-row style="margin-bottom: 10px">
                                    <el-col :span="9">
                                        <el-input v-model="form.specs.falseText" :placeholder="$t('template.index.891112-57')" />
                                    </el-col>
                                    <el-col :span="10" :offset="1">{{ $t('template.index.891112-58') }}</el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="9">
                                        <el-input v-model="form.specs.trueText" :placeholder="$t('template.index.891112-59')" />
                                    </el-col>
                                    <el-col :span="10" :offset="1">{{ $t('template.index.891112-60') }}</el-col>
                                </el-row>
                            </el-form-item>
                        </div>
                        <div v-if="form.datatype == 'enum'">
                            <el-form-item :label="$t('template.index.891112-61')">
                                <el-select v-model="form.specs.showWay" :placeholder="$t('template.index.891112-62')" style="width: 175px">
                                    <el-option key="select" :label="$t('template.index.891112-63')" value="select"></el-option>
                                    <el-option key="button" :label="$t('template.index.891112-64')" value="button"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="$t('template.index.891112-65')" prop="">
                                <el-row v-for="(item, index) in form.specs.enumList" :key="'enum' + index" style="margin-bottom: 10px">
                                    <el-col :span="9">
                                        <el-input v-model="item.value" :placeholder="$t('template.index.891112-66')" />
                                    </el-col>
                                    <el-col :span="11" :offset="1">
                                        <el-input v-model="item.text" :placeholder="$t('template.index.891112-67')" />
                                    </el-col>
                                    <el-col :span="2" :offset="1" v-if="index != 0">
                                        <a style="color: #f56c6c" @click="removeEnumItem(index)">{{ $t('del') }}</a>
                                    </el-col>
                                </el-row>
                                <div>
                                    +
                                    <a style="color: #409eff" @click="addEnumItem()">{{ $t('template.index.891112-68') }}</a>
                                </div>
                            </el-form-item>
                        </div>
                        <div v-if="form.datatype == 'string'">
                            <el-form-item :label="$t('template.index.891112-69')" prop="">
                                <el-row>
                                    <el-col :span="9">
                                        <el-input v-model="form.specs.maxLength" :placeholder="$t('template.index.891112-70')" type="number" />
                                    </el-col>
                                    <el-col :span="14" :offset="1">{{ $t('template.index.891112-71') }}</el-col>
                                </el-row>
                            </el-form-item>
                        </div>
                        <div v-if="form.datatype == 'array'">
                            <el-form-item :label="$t('template.index.891112-72')" prop="">
                                <el-row>
                                    <el-col :span="9">
                                        <el-input v-model="form.specs.arrayCount" :placeholder="$t('template.index.891112-73')" type="number" />
                                    </el-col>
                                </el-row>
                            </el-form-item>
                            <el-form-item :label="$t('template.index.891112-74')" prop="">
                                <el-radio-group v-model="form.specs.arrayType">
                                    <el-radio label="integer">{{ $t('template.index.891112-41') }}</el-radio>
                                    <el-radio label="decimal">{{ $t('template.index.891112-42') }}</el-radio>
                                    <el-radio label="string">{{ $t('template.index.891112-45') }}</el-radio>
                                    <el-radio label="object">{{ $t('template.index.891112-47') }}</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item :label="$t('template.index.891112-75')" v-if="form.specs.arrayType == 'object'"></el-form-item>
                        </div>
                        <div v-if="form.datatype == 'object'">
                            <el-form-item :label="$t('template.index.891112-75')" prop="">
                                <div style="background-color: #f8f8f8; border-radius: 5px">
                                    <el-row style="padding: 0 10px 5px" v-for="(item, index) in form.specs.params" :key="index">
                                        <div style="margin-top: 5px" v-if="index == 0"></div>
                                        <el-col :span="18">
                                            <el-input readonly v-model="item.name" size="mini" :placeholder="$t('template.index.891112-76')" style="margin-top: 3px">
                                                <template slot="prepend">
                                                    <el-tag size="mini" effect="dark" style="margin-left: -21px; height: 26px; line-height: 26px">{{ item.order }}</el-tag>
                                                    {{ form.identifier + '_' + item.id }}
                                                </template>
                                                <el-button slot="append" @click="editParameter(item, index)">{{ $t('edit') }}</el-button>
                                            </el-input>
                                        </el-col>
                                        <el-col :span="2" :offset="2">
                                            <el-button size="small" plain type="danger" style="padding: 5px" icon="el-icon-delete" @click="removeParameter(index)">{{ $t('del') }}</el-button>
                                        </el-col>
                                    </el-row>
                                </div>
                                <div>
                                    +
                                    <a style="color: #409eff" @click="addParameter()">{{ $t('template.index.891112-78') }}</a>
                                </div>
                            </el-form-item>
                        </div>
                    </div>
                    <div v-else>
                        <div v-if="form.type == '5'">
                            <el-form-item label="选择类型">
                                <el-card>
                                    <el-form :inline="true" label-width="68px" style="margin-bottom: 10px">
                                        <el-form-item label="模型名称" prop="templateName">
                                            <el-input v-model="left.templateName" placeholder="物模型名称" clearable size="small" @keyup.enter.native="handleQuery" />
                                        </el-form-item>
                                    </el-form>
                                    <Transfer
                                        ref="transfer"
                                        filter-placeholder="请输入名称"
                                        :props="{ key: 'key', label: 'label' }"
                                        :left="left"
                                        :right="right"
                                        :titles="['未绑定', '已绑定']"
                                        :button-texts="['解绑', '绑定']"
                                        :left-default-checked="left.checked"
                                        :right-default-checked="right.checked"
                                        :loading="transferLoading"
                                        @page-change="handleTransferPage"
                                        @query-change="handleTransferQuery"
                                        @checked-change="handleTransferCheck"
                                        @bind="updateBind"
                                    ></Transfer>
                                </el-card>
                            </el-form-item>
                            <el-form-item label="频率" v-show="!this.triggerCron">
                                <el-input-number v-model="form.frequency" :min="0" type="number" style="width: 185px"></el-input-number>
                            </el-form-item>
                            <el-form-item label="CRON表达式" v-show="!this.form.frequency">
                                <el-popover v-model="cronPopover" placement="top">
                                    <vueCron @change="onChangeCron" @close="cronPopover = false" />
                                    <el-input slot="reference" @click="cronPopover = true" v-model="triggerCron" placeholder="请输入定时策略" size="small" style="width: 185px" clearable></el-input>
                                </el-popover>
                            </el-form-item>
                        </div>
                        <div v-else>
                            <el-form-item label="结构类型" prop="datatype">
                                <el-select v-model="form.deviceSendDataType" style="width: 175px">
                                    <el-option key="integer" label="原数据结构" :value="1"></el-option>
                                    <el-option key="decimal" label="短JSON" :value="2"></el-option>
                                    <el-option key="bool" label="十六进制" :value="3"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </div>
                </el-form>

                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="submitForm" v-hasPermi="['iot:template:edit']" v-show="form.templateId">{{ $t('update') }}</el-button>
                    <el-button type="primary" @click="submitForm" v-hasPermi="['iot:template:add']" v-show="!form.templateId">{{ $t('add') }}</el-button>
                    <el-button @click="cancel">{{ $t('cancel') }}</el-button>
                </div>
            </el-dialog>

            <!--物模型参数类型-->
            <things-parameter :data="paramData" @dataEvent="getParamData($event)" />
        </el-card>
    </div>
</template>

<style>
.specsColor {
    background-color: #fcfcfc;
}
</style>

<script>
import { listTemplate, getTemplate, delTemplate, addTemplate, updateTemplate, getSelectTemplate } from '@/api/iot/template';
import thingsParameter from './parameter';
import Transfer from './Transfer';
import { getUserId } from '@/utils/auth';
export default {
    name: 'Template',
    dicts: ['iot_things_type', 'iot_data_type', 'iot_yes_no'],
    components: {
        thingsParameter,
        Transfer,
    },
    data() {
        return {
            searchShow: false, //搜索展开
            // 是否为租户
            isTenant: false,
            // 遮罩层
            loading: true,
            // 选中数组
            ids: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            // 通用物模型表格数据
            templateList: [],
            // 弹出层标题
            title: '',
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                templateName: null,
                type: null,
            },
            isSys: 0,
            owner: false,
            sysUserId: 0,
            // 表单参数
            form: {},
            // 对象类型参数
            paramData: {
                index: -1,
                parameter: {},
            },
            // 表单校验
            rules: {
                templateName: [
                    {
                        required: true,
                        message: this.$t('template.index.891112-84'),
                        trigger: 'blur',
                    },
                ],
                identifier: [
                    {
                        required: true,
                        message: this.$t('template.index.891112-85'),
                        trigger: 'blur',
                    },
                ],
                modelOrder: [
                    {
                        required: true,
                        message: this.$t('template.index.891112-86'),
                        trigger: 'blur',
                    },
                ],
                type: [
                    {
                        required: true,
                        message: this.$t('template.index.891112-87'),
                        trigger: 'change',
                    },
                ],
                datatype: [
                    {
                        required: true,
                        message: this.$t('template.index.891112-88'),
                        trigger: 'change',
                    },
                ],
            },
            // transfer
            left: {
                data: [], // 数据
                total: 0, // 数据总数
                loading: false, // 加载状态
                pageNum: 1, // 当前页
                pageSize: 1000, // 分页大小
                templateName: '', // 查询条件
                checked: [], // 默认选中
            },
            right: {
                data: [],
                total: 0,
                loading: false,
                pageNum: 1,
                pageSize: 1000,
                name: '',
                checked: [], // 默认选中
            },
            changeTypeDisable: false,
            transferLoading: false, // 更新时状态
            // Cron表达式
            triggerCron: '',
            cronPopover: false,
        };
    },
    created() {
        this.getList();
        this.init();
    },
    watch: {
        'left.templateName'() {
            // 查询条件改变，当前页值为1 执行查询 否则通过当前页执行查询
            if (this.left.pageNum === 1) {
                this.handleSearch('left');
            } else {
                this.left.pageNum = 1;
            }
        },
        'left.pageNum'() {
            this.handleSearch('left');
        },
        'right.name'() {
            if (this.right.pageNum === 1) {
                this.handleSearch('right');
            } else {
                this.right.pageNum = 1;
            }
        },
        'right.pageNum'() {
            this.handleSearch('right');
        },
    },
    computed: {
        getShowModelProperties() {
            if (this.form.type == '1' || this.form.type == '2' || this.form.type == '3') {
                return true;
            } else {
                return false;
            }
        },
    },
    methods: {
        // 搜索展开隐藏
        searchChange() {
            this.searchShow = !this.searchShow;
        },

        init() {
            if (this.$store.state.user.roles.indexOf('tenant') !== -1) {
                this.isTenant = true;
            }
            this.sysUserId = getUserId();
        },
        /** 查询通用物模型列表 */
        getList() {
            this.loading = true;
            listTemplate(this.queryParams).then((response) => {
                this.templateList = response.rows;

                this.transferData = response.rows.map((item) => {
                    let disabled = item.type == 4 || item.type == 5 ? true : false;
                    return {
                        key: item.identifier + '-' + item.type,
                        label: item.templateName,
                        type: item.type,
                        disabled: disabled,
                    };
                });
                this.templateList = response.rows;
                this.total = response.total;

                this.loading = false;
            });
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },
        // 表单重置
        reset() {
            this.form = {
                templateId: null,
                templateName: null,
                userId: null,
                userName: null,
                tenantId: null,
                tenantName: null,
                identifier: null,
                modelOrder: 0,
                type: 1,
                datatype: 'integer',
                isSys: null,
                isChart: 1,
                isHistory: 1,
                isMonitor: 1,
                isReadonly: 1,
                isSharePerm: 1,
                delFlag: null,
                createBy: null,
                createTime: null,
                updateBy: null,
                updateTime: null,
                remark: null,
                owner: null,
                specs: {
                    enumList: [
                        {
                            value: '',
                            text: '',
                        },
                    ],
                    arrayType: 'integer',
                    arrayCount: 5,
                    showWay: 'select', // 显示方式select=下拉选择框，button=按钮
                    params: [],
                },
            };
            this.resetForm('form');
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm('queryForm');
            this.handleQuery();
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map((item) => item.templateId);
            this.single = selection.length !== 1;
            this.multiple = !selection.length;
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.open = true;
            this.right.data = [];
            this.changeTypeDisable = false;
            this.title = this.$t('template.index.891112-89');
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.changeTypeDisable = true;
            this.reset();
            this.handleSearch('left');
            this.right.data = [];
            const templateId = row.templateId || this.ids;
            this.isSys = row.isSys;
            this.owner = row.owner;
            getTemplate(templateId).then((response) => {
                let tempForm = response.data;
                this.open = true;
                this.title = this.$t('template.index.891112-90');
                // Json转对象
                tempForm.specs = JSON.parse(tempForm.specs);
                if (!tempForm.specs.enumList) {
                    tempForm.specs.showWay = 'select';
                    tempForm.specs.enumList = [
                        {
                            value: '',
                            text: '',
                        },
                    ];
                }
                if (!tempForm.specs.arrayType) {
                    tempForm.specs.arrayType = 'integer';
                }
                if (!tempForm.specs.arrayCount) {
                    tempForm.specs.arrayCount = 5;
                }
                if (!tempForm.specs.params) {
                    tempForm.specs.params = [];
                }
                // 对象和数组中参数删除前缀
                if ((tempForm.specs.type == 'array' && tempForm.specs.arrayType == 'object') || tempForm.specs.type == 'object') {
                    for (let i = 0; i < tempForm.specs.params.length; i++) {
                        tempForm.specs.params[i].id = String(tempForm.specs.params[i].id).substring(String(tempForm.identifier).length + 1);
                    }
                }
                if (tempForm.attributeList) {
                    this.right.data = [];
                    let keyMap = {
                        property: 1,
                        function: 2,
                        event: 3,
                    };
                    let arr = JSON.parse(tempForm.attributeList).map((item) => {
                        return {
                            key: item.id + '-' + keyMap[item.type],
                            label: item.label,
                            type: keyMap[item.type],
                            disabled: false,
                        };
                    });
                    this.right.data = arr;
                }
                if (response.data.timing) {
                    this.triggerCron = response.data.timing;
                }

                this.form = tempForm;
            });
        },
        containsUnderscore(value) {
            // 使用正则表达式检查值中是否包含下划线
            return /_/.test(value);
        },
        /** 提交按钮 */
        submitForm() {
            // ----- 待优化
            if (this.form.type == '4' || this.form.type == '5') {
                const obj = {};
                obj.identifier = this.form.identifier;
                obj.templateName = this.form.templateName;
                obj.datatype = this.form.type == '4' ? 'integer' : 'string';
                obj.modelOrder = this.form.modelOrder;
                obj.type = parseInt(this.form.type);
                if (this.form.type == '5') {
                    let arr = [];
                    let keyMap = {
                        1: 'property',
                        2: 'function',
                        3: 'event',
                    };
                    console.log(this.transferValue);
                    arr = this.right.data.map((item) => {
                        return {
                            type: keyMap[item.key.split('-')[1]],
                            id: item.key.split('-')[0],
                            label: item.label,
                        };
                    });
                    obj.frequency = this.form.frequency === 0 ? null : this.form.frequency;
                    obj.attributeList = JSON.stringify(arr);
                    obj.timing = this.triggerCron;
                } else {
                    obj.deviceSendDataType = this.form.deviceSendDataType;
                }
                if (this.form.templateId != null) {
                    obj.templateId = this.form.templateId;
                    updateTemplate(obj).then((response) => {
                        this.$modal.msgSuccess('修改成功');
                        this.open = false;
                        this.getList();
                    });
                } else {
                    addTemplate(obj).then((response) => {
                        this.$modal.msgSuccess('新增成功');
                        this.open = false;
                        this.getList();
                    });
                }
            } else {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        // 验证对象或对象数组中的参数不能为空
                        if (this.form.datatype == 'object' || (this.form.datatype == 'array' && this.form.specs.arrayType == 'object')) {
                            if (!this.form.specs.params || this.form.specs.params == 0) {
                                this.$modal.msgError(this.$t('template.index.891112-91'));
                                return;
                            }
                            if (this.containsUnderscore(this.form.identifier)) {
                                this.$modal.msgError(this.$t('template.index.891112-92'));
                                return;
                            }
                        }
                        // 验证对象参数标识符不能相同
                        if (this.form.specs.params && this.form.specs.params.length > 0) {
                            let arr = this.form.specs.params.map((item) => item.id).sort();
                            for (let i = 0; i < arr.length; i++) {
                                if (arr[i] == arr[i + 1]) {
                                    this.$modal.msgError('参数标识 ' + arr[i] + ' 重复');
                                    return;
                                }
                            }
                        }
                        //验证模型特性为图表展示时，数据类型是否为整数或者小数
                        if (this.form.isChart == 1 && this.form.datatype != 'integer' && this.form.isChart == 1 && this.form.datatype != 'decimal') {
                            this.$modal.msgError(this.$t('template.index.891112-95'));
                        } else if (this.form.templateId != null) {
                            // 格式化specs
                            let tempForm = JSON.parse(JSON.stringify(this.form));
                            tempForm.specs = this.formatThingsSpecs();
                            if (this.form.type == 2) {
                                tempForm.isMonitor = 0;
                                tempForm.isChart = 0;
                            } else if (this.form.type == 3) {
                                tempForm.isMonitor = 0;
                                tempForm.isChart = 0;
                            }
                            // 修改通用物模型
                            tempForm.updateBy = this.$store.state.user.name;
                            updateTemplate(tempForm).then((response) => {
                                this.$modal.msgSuccess(this.$t('updateSuccess'));
                                this.open = false;
                                this.getList();
                            });
                        } else {
                            // 格式化specs
                            let tempForm = JSON.parse(JSON.stringify(this.form));
                            tempForm.specs = this.formatThingsSpecs();
                            if (this.form.type == 2) {
                                tempForm.isMonitor = 0;
                            } else if (this.form.type == 3) {
                                tempForm.isMonitor = 0;
                                tempForm.isChart = 0;
                            }
                            // 添加通用物模型
                            tempForm.createBy = this.$store.state.user.name;
                            addTemplate(tempForm).then((response) => {
                                this.$modal.msgSuccess(this.$t('addSuccess'));
                                this.open = false;
                                this.getList();
                            });
                        }
                    }
                });
            }
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const templateIds = row.templateId || this.ids;
            this.$modal
                .confirm(this.$t('template.index.891112-98', [templateIds]))
                .then(function () {
                    return delTemplate(templateIds);
                })
                .then(() => {
                    this.getList();
                    this.$modal.msgSuccess(this.$t('delSuccess'));
                })
                .catch(() => {});
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download(
                'iot/template/export',
                {
                    ...this.queryParams,
                },
                `template_${new Date().getTime()}.xlsx`
            );
        },
        // 类型改变
        typeChange(type) {
            console.log(type);
            if (type == 1) {
                this.form.isChart = 1;
                this.form.isHistory = 1;
                this.form.isMonitor = 1;
                this.form.isReadonly = 1;
                this.form.isSharePerm = 1;
                this.form.datatype = 'integer';
            } else if (type == 2) {
                this.form.isChart = 0;
                this.form.isHistory = 1;
                this.form.isSharePerm = 1;
                this.form.isMonitor = 0;
                this.form.isReadonly = 0;
            } else if (type == 3) {
                this.form.isChart = 0;
                this.form.isHistory = 1;
                this.form.isMonitor = 0;
                this.form.isReadonly = 1;
                this.form.isSharePerm = 0;
            }
            if (type == 5) {
                this.handleSearch('left');
            }
        },
        // 是否图表展示改变
        isChartChange() {
            if (this.form.isChart == 1) {
                this.form.isReadonly = 1;
            } else {
                this.form.isMonitor = 0;
            }
        },
        // 是否实时监测改变
        isMonitorChange() {
            if (this.form.isMonitor == 1) {
                this.form.isReadonly = 1;
                this.form.isChart = 1;
            }
        },
        // 是否只读数据改变
        isReadonlyChange() {
            if (this.form.isReadonly == 0) {
                this.form.isMonitor = 0;
                this.form.isChart = 0;
            }
        },
        // 格式化物模型
        formatThingsSpecs() {
            var data = {};
            data.type = this.form.datatype;
            if (this.form.datatype == 'integer' || this.form.datatype == 'decimal') {
                data.min = Number(this.form.specs.min ? this.form.specs.min : 0);
                data.max = Number(this.form.specs.max ? this.form.specs.max : 100);
                data.unit = this.form.specs.unit ? this.form.specs.unit : '';
                data.step = Number(this.form.specs.step ? this.form.specs.step : 1);
            } else if (this.form.datatype == 'string') {
                data.maxLength = Number(this.form.specs.maxLength ? this.form.specs.maxLength : 1024);
            } else if (this.form.datatype == 'bool') {
                data.falseText = this.form.specs.falseText ? this.form.specs.falseText : '关闭';
                data.trueText = this.form.specs.trueText ? this.form.specs.trueText : '打开';
            } else if (this.form.datatype == 'enum') {
                data.showWay = this.form.specs.showWay;
                if (this.form.specs.enumList && this.form.specs.enumList[0].text != '') {
                    data.enumList = this.form.specs.enumList;
                } else {
                    data.showWay = 'select';
                    data.enumList = [
                        {
                            value: '0',
                            text: this.$t('template.index.891112-103'),
                        },
                        {
                            value: '1',
                            text: this.$t('template.index.891112-104'),
                        },
                    ];
                }
            } else if (this.form.datatype == 'array') {
                data.arrayType = this.form.specs.arrayType;
                data.arrayCount = this.form.specs.arrayCount ? this.form.specs.arrayCount : 5;
                if (data.arrayType == 'object') {
                    data.params = this.form.specs.params;
                    // 物模型名称作为参数的标识符前缀
                    for (let i = 0; i < data.params.length; i++) {
                        data.params[i].id = this.form.identifier + '_' + data.params[i].id;
                    }
                }
            } else if (this.form.datatype == 'object') {
                data.params = this.form.specs.params;
                // 物模型名称作为参数的标识符前缀
                for (let i = 0; i < data.params.length; i++) {
                    data.params[i].id = this.form.identifier + '_' + data.params[i].id;
                }
            }
            return JSON.stringify(data);
        },
        /** 数据类型改变 */
        dataTypeChange(val) {},
        /** 添加枚举项 */
        addEnumItem() {
            this.form.specs.enumList.push({
                value: '',
                text: '',
            });
        },
        /** 删除枚举项 */
        removeEnumItem(index) {
            this.form.specs.enumList.splice(index, 1);
        },
        /** 格式化显示数据定义 */
        formatSpecsDisplay(json) {
            if (json == null || json == undefined) {
                return;
            }
            let specs = JSON.parse(json);
            if (specs.type === 'integer' || specs.type === 'decimal') {
                return (
                    `<span style=\'width:50%;display:inline-block;\'>${this.$t('template.index.891112-105')}<span style="color:#F56C6C">` +
                    specs.max +
                    `</span></span>${this.$t('template.index.891112-106')}<span style="color:#F56C6C">` +
                    specs.min +
                    `</span><br /><span style=\'width:50%;display:inline-block;\'>${this.$t('template.index.891112-107')}<span style="color:#F56C6C">` +
                    specs.step +
                    `</span></span>${this.$t('template.index.891112-108')}<span style="color:#F56C6C">` +
                    specs.unit
                );
            } else if (specs.type === 'string') {
                return '最大长度：<span style="color:#F56C6C">' + specs.maxLength + '</span>';
            } else if (specs.type === 'array') {
                return '<span style=\'width:50%;display:inline-block;\'>数组类型：<span style="color:#F56C6C">' + specs.arrayType + '</span></span>元素个数：<span style="color:#F56C6C">' + specs.arrayCount;
            } else if (specs.type === 'enum') {
                let items = '';
                for (let i = 0; i < specs.enumList.length; i++) {
                    items = items + "<span style='width:50%;display:inline-block;'>" + specs.enumList[i].value + "：<span style='color:#F56C6C'>" + specs.enumList[i].text + '</span></span>';
                    if (i > 0 && i % 2 != 0) {
                        items = items + '<br />';
                    }
                }
                return items;
            } else if (specs.type === 'bool') {
                return '<span>0：<span style="color:#F56C6C">' + specs.falseText + '</span><br /></span>1：<span style="color:#F56C6C">' + specs.trueText;
            } else if (specs.type === 'object') {
                let items = '';
                for (let i = 0; i < specs.params.length; i++) {
                    items = items + "<span style='width:50%;display:inline-block;'>" + specs.params[i].name + "：<span style='color:#F56C6C'>" + specs.params[i].datatype.type + '</span></span>';
                    if (i > 0 && i % 2 != 0) {
                        items = items + '<br />';
                    }
                }
                return items;
            }
        },
        /** 添加参数 */
        addParameter() {
            this.paramData = {
                index: -1,
                parameter: {},
            };
        },
        /** 编辑参数*/
        editParameter(data, index) {
            this.paramData = null;
            this.paramData = {
                index: index,
                parameter: data,
            };
        },
        /** 删除动作 */
        removeParameter(index) {
            this.form.specs.params.splice(index, 1);
        },
        /**获取设置的参数对象*/
        getParamData(data) {
            if (data.index == -1) {
                this.form.specs.params.push(data.parameter);
            } else {
                this.form.specs.params[data.index] = data.parameter;
                // 解决数组在界面中不更新问题
                this.$set(this.form.specs.params, data.index, this.form.specs.params[data.index]);
            }
        },
        // corm表达式
        onChangeCron(v) {
            this.triggerCron = v;
            console.log('vue-cron 设置定时任务：' + v);
        },
        // transfer
        handleTransferCheck(key, val) {
            this[key].checked = val;
        },
        handleTransferPage(key, val) {
            this[key].pageNum = val;
        },
        handleTransferQuery(key, val) {
            this[key].name = val;
        },
        // 根据key值判断 left 左边 right 右边
        async handleSearch(key) {
            // const { actId } = this; // 广告id
            const { templateName } = this[key];
            this[key].data = []; // 数据置空
            this[key].transferLoading = true; // 显示加载
            const bind = key === 'right' ? 1 : 0; // 查询条件 1 绑定数据 0 未绑定数据
            const params = {};
            params.templateName = templateName ? templateName : '';
            params.selectType = 1;
            const { count = 0, rows = [] } = await this.getData(params);
            this[key].data = rows; // 数据
            this[key].total = count; // 总数
            this[key].transferLoading = false;
        },
        // 数据获取，根据不同查询条件获取不同数据
        async getData(params) {
            const response = await getSelectTemplate(params);
            let result = { count: 0, rows: [] };
            let arr = response.map((item) => {
                // let disabled = item.type == 4 || item.type == 5 ? true : false;
                return {
                    key: item.identifier + '-' + item.type + '-' + item.templateId,
                    label: item.templateName + '【' + item.identifier + '】',
                    type: item.type,
                    disabled: false,
                };
            });
            result.count = response.length;
            result.rows = arr;
            return result;
        },
        // 绑定、解绑
        async updateBind(key, bind) {
            console.log(key, bind);
            if (key === 'left' && bind) {
                this.left.checked.forEach((item, idx) => {
                    const flag = this.right.data.some((checked) => {
                        return checked.key === item;
                    });
                    console.log(this.right.data);
                    console.log(flag);
                    if (!flag) {
                        const _i = this.left.data.find((itm) => {
                            return itm.key === item;
                        });
                        this.right.data.push(_i);
                    }
                });
            }
            if (key === 'right' && !bind) {
                this.right.data = this.getUniqueValuesFromArray(this.right.checked, this.right.data);
            }
        },
        getUniqueValuesFromArray(array1, array2) {
            const arr = array2.filter((item) => {
                return !array1.some((itm) => {
                    return itm === item.key;
                });
            });
            console.log(arr);
            return arr;
        },
    },
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/tableView.scss';
@import '@/assets/styles/sunseen-btn.scss';
// 字体
.numInputCss {
    width: 100%;
}

.numInputCss ::v-deep .el-input .el-input__inner {
    text-align: left;
}
::v-deep .el-input__inner {
    color: #fff !important;
    background: #0b1420 !important;
    border-radius: 5px 5px 5px 5px;
    border: 1px solid #24354b;
}
</style>
