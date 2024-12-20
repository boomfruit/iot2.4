<template>
    <div class="scene-list-edit">
        <el-row>
            <el-col :span="24" class="l-card-box">
                <el-card>
                    <div slot="header">
                        <span>{{ $t('scene.edit.202832-0') }}</span>
                    </div>
                    <div class="el-table el-table--enable-row-hover el-table--medium">
                        <el-form ref="form" :model="form" :rules="rules" label-width="120px" style="width: 100%">
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item :label="$t('scene.edit.202832-1')" prop="sceneModelName">
                                        <el-input style="width: 310px" v-model="form.sceneModelName" :placeholder="$t('scene.edit.202832-5')" clearable></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item :label="$t('scene.edit.202832-2')" prop="deptId">
                                        <treeselect v-model="form.deptId" :options="deptOptions" :clearable="true" :searchable="true" :placeholder="$t('scene.edit.202832-6')" @input="handleTreeselectInput" />
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item :label="$t('scene.edit.202832-3')">
                                        <image-upload v-model="form.imgUrl" :multiple="false" :file-list="[baseUrl + form.imgUrl]" :class="{ disable: uploadDisabled }" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item :label="$t('scene.edit.202832-4')">
                                        <el-input style="width: 310px" v-model="form.desc" :placeholder="$t('scene.edit.202832-7')" clearable></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </div>
                </el-card>
            </el-col>

            <el-col :span="24" class="l-card-box">
                <el-card>
                    <div slot="header">
                        <span>{{ $t('scene.edit.202832-8') }}</span>
                    </div>
                    <div class="el-table--enable-row-hover el-table--medium scene-setting">
                        <el-radio-group v-model="congigType" size="small">
                            <el-radio-button :label="1">{{ $t('scene.edit.202832-9') }}</el-radio-button>
                            <el-radio-button :label="2">{{ $t('scene.edit.202832-10') }}</el-radio-button>
                            <el-radio-button :label="3">{{ $t('scene.edit.202832-11') }}</el-radio-button>
                        </el-radio-group>
                        <div v-show="congigType === 1" class="device-setting">
                            <el-col :span="8" style="padding-right: 7.5px">
                                <el-card shadow="never">
                                    <div slot="header">
                                        <span>{{ $t('scene.edit.202832-12') }}</span>
                                    </div>
                                    <div class="el-table--enable-row-hover el-table--medium device-select" style="height: 581px">
                                        <el-table ref="deviceTable" :data="selectDeviceList" style="width: 100%" :border="false" max-height="529" highlight-current-row @current-change="handleCurrentDeviceItemChange">
                                            <el-table-column type="index" :label="$t('scene.edit.202832-13')" width="50"></el-table-column>
                                            <el-table-column prop="cusDeviceId" :label="$t('scene.edit.202832-14')" width="220">
                                                <template slot-scope="scope">
                                                    <el-select
                                                        style="width: 210px"
                                                        v-model="scope.row.cusDeviceId"
                                                        size="small"
                                                        :placeholder="$t('scene.edit.202832-15')"
                                                        filterable
                                                        @change="handleUpdateDeviceItem(scope.row, $event)"
                                                    >
                                                        <el-option v-for="(item, index) in deviceList" :key="index" :label="item.deviceName" :value="item.deviceId" :disabled="!isSelectDevice"></el-option>
                                                    </el-select>
                                                </template>
                                            </el-table-column>
                                            <el-table-column :label="$t('opation')" align="center" class-name="small-padding fixed-width" width="80">
                                                <template slot-scope="scope">
                                                    <el-button style="color: #f56c6c" size="mini" type="text" @click="handleDeleteDeviceItem(scope.row)" v-hasPermi="['scene:modelDevice:remove']">
                                                        {{ $t('del') }}
                                                    </el-button>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                        <div class="tools-wrap">
                                            <el-button style="width: 100px" size="small" type="primary" @click="handleAddDeviceItem" v-hasPermi="['scene:modelDevice:add']">{{ $t('add') }}</el-button>
                                        </div>
                                    </div>
                                </el-card>
                            </el-col>
                            <el-col :span="16" style="padding-left: 7.5px">
                                <el-card shadow="never">
                                    <div slot="header">
                                        <span>{{ $t('scene.edit.202832-16') }}</span>
                                    </div>
                                    <div class="el-table--enable-row-hover el-table--medium">
                                        <div class="variable-list">
                                            <el-form :model="devConfigQueryParams" ref="devConfigQueryForm" size="small" :inline="true" label-width="68px">
                                                <el-form-item :label="$t('scene.overview.324354-11')" prop="sourceName">
                                                    <el-input v-model="devConfigQueryParams.sourceName" :placeholder="$t('scene.overview.324354-12')" clearable />
                                                </el-form-item>
                                                <el-form-item>
                                                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleDevConfigQuery">{{ $t('search') }}</el-button>
                                                </el-form-item>
                                            </el-form>
                                            <div class="switch-wrap">
                                                {{ $t('scene.edit.202832-17') }}
                                                <el-switch v-model="devConfigEnable" :active-value="1" :inactive-value="0" @change="devConfigEnableChange" v-hasPermi="['scene:modelData:editEnable']"></el-switch>
                                            </div>
                                        </div>
                                        <el-table v-loading="devConfigLoading" :data="devConfigList" style="width: 100%; margin-top: 15px" :border="false" height="484">
                                            <el-table-column type="index" :label="$t('scene.edit.202832-13')" width="80"></el-table-column>
                                            <el-table-column prop="slaveName" :label="$t('scene.overview.324354-9')"></el-table-column>
                                            <el-table-column prop="sourceName" :label="$t('scene.overview.324354-11')"></el-table-column>
                                            <el-table-column prop="name" :label="$t('scene.edit.202832-18')" width="100">
                                                <template slot-scope="scope">
                                                    <el-switch v-model="scope.row.enable" :active-value="1" :inactive-value="0" @change="devConfigItemEnableChange(scope.row)" :disabled="!isEnableSwitch"></el-switch>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                        <pagination
                                            v-show="devConfigTotal > 0"
                                            :total="devConfigTotal"
                                            :page.sync="devConfigQueryParams.pageNum"
                                            :limit.sync="devConfigQueryParams.pageSize"
                                            @pagination="getDevConfigVariableList"
                                        />
                                    </div>
                                </el-card>
                            </el-col>
                        </div>

                        <div v-show="congigType === 2" class="input-variable">
                            <el-col :span="24">
                                <el-card shadow="never">
                                    <div slot="header">
                                        <span>{{ $t('scene.edit.202832-16') }}</span>
                                    </div>
                                    <div class="el-table--enable-row-hover el-table--medium">
                                        <div class="variable-list">
                                            <el-form :model="inputVariableQueryParams" ref="inputVariableQueryForm" size="small" :inline="true" label-width="68px">
                                                <el-form-item :label="$t('scene.overview.324354-11')" prop="name">
                                                    <el-input v-model="inputVariableQueryParams.name" :placeholder="$t('scene.overview.324354-12')" clearable />
                                                </el-form-item>
                                                <el-form-item>
                                                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleInputVariableQuery">{{ $t('search') }}</el-button>
                                                </el-form-item>
                                            </el-form>
                                            <div class="switch-wrap">
                                                <el-button size="mini" icon="el-icon-plus" type="primary" style="margin-right: 10px" @click="handleAddInputVariable" v-hasPermi="['scene:modelTag:add']">
                                                    {{ $t('add') }}
                                                </el-button>
                                                {{ $t('scene.edit.202832-17') }}
                                                <el-switch v-model="inputVariableEnable" :active-value="1" :inactive-value="0" @change="inputVariableEnableChange" v-hasPermi="['scene:modelData:editEnable']"></el-switch>
                                            </div>
                                        </div>
                                        <el-table v-loading="inputVariableLoading" :data="inputVariableList" style="width: 100%; margin-top: 15px" :border="false" max-height="539">
                                            <el-table-column type="index" :label="$t('scene.edit.202832-13')" width="50"></el-table-column>
                                            <el-table-column prop="name" :label="$t('scene.overview.324354-11')"></el-table-column>
                                            <el-table-column prop="unit" :label="$t('scene.edit.202832-19')" width="100"></el-table-column>
                                            <el-table-column prop="dataType" :label="$t('scene.edit.202832-20')" width="100">
                                                <template slot-scope="scope">
                                                    <span v-if="scope.row.dataType === '0'">{{ $t('scene.edit.202832-21') }}</span>
                                                    <span v-if="scope.row.dataType === '1'">{{ $t('scene.edit.202832-22') }}</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column prop="defaultValue" :label="$t('scene.edit.202832-32')" width="120"></el-table-column>
                                            <el-table-column prop="enable" :label="$t('scene.edit.202832-18')" width="100">
                                                <template slot-scope="scope">
                                                    <el-switch v-model="scope.row.enable" :active-value="1" :inactive-value="0" :disabled="!isEnableSwitch" @change="inputVariableItemEnableChange(scope.row)"></el-switch>
                                                </template>
                                            </el-table-column>
                                            <el-table-column :label="$t('opation')" align="center" class-name="small-padding fixed-width" width="150">
                                                <template slot-scope="scope">
                                                    <el-button size="mini" type="text" icon="el-icon-edit-outline" @click="handleEditInputVariable(scope.row)" v-hasPermi="['scene:modelTag:query']">
                                                        {{ $t('look') }}
                                                    </el-button>
                                                    <el-button style="color: #f56c6c" size="mini" type="text" v-hasPermi="['scene:modelTag:remove']" icon="el-icon-delete" @click="handleDeleteInputVariable(scope.row)">
                                                        {{ $t('del') }}
                                                    </el-button>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                        <pagination
                                            v-show="inputVariableTotal > 0"
                                            :total="inputVariableTotal"
                                            :page.sync="inputVariableQueryParams.pageNum"
                                            :limit.sync="inputVariableQueryParams.pageSize"
                                            @pagination="getInputVariableList"
                                        />
                                    </div>
                                </el-card>
                            </el-col>
                        </div>

                        <div v-show="congigType === 3" class="operation-variable">
                            <el-col :span="24">
                                <el-card shadow="never">
                                    <div slot="header">
                                        <span>{{ $t('scene.edit.202832-16') }}</span>
                                    </div>
                                    <div class="el-table--enable-row-hover el-table--medium">
                                        <div class="variable-list">
                                            <el-form :model="operationVariableQueryParams" ref="operationVariableQueryForm" size="small" :inline="true" label-width="68px">
                                                <el-form-item :label="$t('scene.overview.324354-11')" prop="modelName">
                                                    <el-input v-model="operationVariableQueryParams.name" :placeholder="$t('scene.overview.324354-12')" clearable />
                                                </el-form-item>
                                                <el-form-item>
                                                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleOperationVariableQuery">{{ $t('search') }}</el-button>
                                                </el-form-item>
                                            </el-form>
                                            <div class="switch-wrap">
                                                <el-button size="mini" icon="el-icon-plus" type="primary" style="margin-right: 10px" @click="handleAddOperationVariable" v-hasPermi="['scene:modelTag:add']">
                                                    {{ $t('add') }}
                                                </el-button>
                                                {{ $t('scene.edit.202832-17') }}
                                                <el-switch
                                                    v-model="operationVariableEnable"
                                                    :active-value="1"
                                                    v-hasPermi="['scene:modelData:editEnable']"
                                                    :inactive-value="0"
                                                    @change="operationVariableEnableChange"
                                                ></el-switch>
                                            </div>
                                        </div>
                                        <el-table v-loading="inputVariableLoading" :data="operationVariableList" style="width: 100%; margin-top: 15px" :border="false" max-height="539">
                                            <el-table-column type="index" :label="$t('scene.edit.202832-13')" width="50"></el-table-column>
                                            <el-table-column prop="name" :label="$t('scene.overview.324354-11')"></el-table-column>
                                            <el-table-column prop="unit" :label="$t('scene.edit.202832-19')" width="100"></el-table-column>
                                            <el-table-column prop="storage" :label="$t('scene.edit.202832-23')" width="100">
                                                <template slot-scope="scope">
                                                    <span v-if="scope.row.storage === 0">{{ $t('scene.edit.202832-24') }}</span>
                                                    <span v-if="scope.row.storage === 1">{{ $t('scene.edit.202832-25') }}</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column prop="isReadonly" :label="$t('scene.edit.202832-26')" width="120">
                                                <template slot-scope="scope">
                                                    <span v-if="scope.row.isReadonly === 0">{{ $t('scene.edit.202832-27') }}</span>
                                                    <span v-if="scope.row.isReadonly === 1">{{ $t('scene.edit.202832-28') }}</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column prop="enable" :label="$t('scene.edit.202832-18')" width="100">
                                                <template slot-scope="scope">
                                                    <el-switch
                                                        v-model="scope.row.enable"
                                                        :active-value="1"
                                                        :inactive-value="0"
                                                        @change="operationVariableItemEnableChange(scope.row)"
                                                        :disabled="!isEnableSwitch"
                                                    ></el-switch>
                                                </template>
                                            </el-table-column>
                                            <el-table-column :label="$t('opation')" align="center" class-name="small-padding fixed-width" width="150">
                                                <template slot-scope="scope">
                                                    <el-button size="mini" type="text" icon="el-icon-edit-outline" @click="handleEditOperationVariable(scope.row)" v-hasPermi="['scene:modelTag:query']">
                                                        {{ $t('look') }}
                                                    </el-button>
                                                    <el-button
                                                        style="color: #f56c6c"
                                                        size="mini"
                                                        type="text"
                                                        icon="el-icon-delete"
                                                        @click="handleDeleteOperationVariable(scope.row)"
                                                        v-hasPermi="['scene:modelTag:remove']"
                                                    >
                                                        {{ $t('del') }}
                                                    </el-button>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                        <pagination
                                            v-show="operationVariableTotal > 0"
                                            :total="operationVariableTotal"
                                            :page.sync="operationVariableQueryParams.pageNum"
                                            :limit.sync="operationVariableQueryParams.pageSize"
                                            @pagination="getOperationVariableList"
                                        />
                                    </div>
                                </el-card>
                            </el-col>
                        </div>
                    </div>
                </el-card>
            </el-col>

            <el-col :span="24" class="l-card-box save-wrap">
                <el-button style="width: 200px" size="small" type="primary" @click="handleSave" v-hasPermi="['scene:model:edit']">{{ $t('save') }}</el-button>
            </el-col>
        </el-row>

        <!-- 添加或修改录入型变量对话框 -->
        <el-dialog :title="inputVariableTitle" :visible.sync="isInputVariable" width="600px" append-to-body>
            <div class="el-divider el-divider--horizontal" style="margin-top: -25px"></div>
            <el-form ref="inputVariableForm" :model="inputVariableForm" :rules="inputVariableRules" label-width="120px">
                <el-form-item :label="$t('scene.overview.324354-11')" prop="name">
                    <el-input style="width: 400px" v-model="inputVariableForm.name" :placeholder="$t('scene.overview.324354-12')" clearable />
                </el-form-item>
                <el-form-item :label="$t('scene.edit.202832-19')">
                    <el-input style="width: 400px" v-model="inputVariableForm.unit" :placeholder="$t('scene.edit.202832-29')" clearable />
                </el-form-item>
                <el-form-item :label="$t('scene.edit.202832-30')" prop="dataType">
                    <el-select style="width: 400px" v-model="inputVariableForm.dataType" :placeholder="$t('scene.edit.202832-31')" clearable>
                        <el-option :label="$t('scene.edit.202832-21')" value="0"></el-option>
                        <el-option :label="$t('scene.edit.202832-22')" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('scene.edit.202832-32')" prop="defaultValue">
                    <el-input style="width: 400px" v-model="inputVariableForm.defaultValue" :placeholder="$t('scene.edit.202832-33')" clearable />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleInputVariableSubmit" v-hasPermi="['scene:modelTag:edit']" v-show="inputVariableForm.id">{{ $t('update') }}</el-button>
                <el-button type="primary" @click="handleInputVariableSubmit" v-hasPermi="['scene:modelTag:add']" v-show="!inputVariableForm.id">{{ $t('add') }}</el-button>
                <el-button @click="isInputVariable = false">{{ $t('cancel') }}</el-button>
            </div>
        </el-dialog>

        <!-- 添加或修改运算型型变量对话框 -->
        <el-dialog class="operation-variable-dialog" :title="operationVariableTitle" :visible.sync="isOperationVariable" width="948px" append-to-body>
            <div class="el-divider el-divider--horizontal" style="margin-top: -25px"></div>
            <el-form ref="operationVariableForm" :model="operationVariableForm" :rules="operationVariableRules" label-width="146px">
                <el-form-item :label="$t('scene.overview.324354-11')" prop="name">
                    <el-input style="width: 763px" v-model="operationVariableForm.name" :placeholder="$t('scene.overview.324354-12')" clearable />
                </el-form-item>
                <el-form-item :label="$t('scene.edit.202832-19')">
                    <el-input style="width: 763px" v-model="operationVariableForm.unit" :placeholder="$t('scene.edit.202832-29')" clearable />
                </el-form-item>
                <el-form-item :label="$t('scene.edit.202832-34')" prop="cycleType">
                    <div class="timer-wrap">
                        <el-radio-group v-model="operationVariableForm.cycleType" @input="handleCycleTypeInput">
                            <el-radio :label="1" style="display: block">
                                {{ $t('scene.edit.202832-35') }}
                                <el-tooltip placement="right">
                                    <div slot="content">
                                        {{ $t('scene.edit.202832-36') }}
                                        <br />
                                        {{ $t('scene.edit.202832-37') }}
                                    </div>
                                    <i class="el-icon-question" style="color: #909399"></i>
                                </el-tooltip>
                                <div class="timer-period">
                                    <span>{{ $t('scene.edit.202832-38') }}</span>
                                    <el-select style="width: 100px; margin-left: 10px" v-model="cycles1[0].interval" size="mini" :disabled="operationVariableForm.cycleType === 2" @change="handleCycleInterval">
                                        <el-option v-for="dict in dict.type.variable_operation_interval" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                                    </el-select>
                                    <el-select v-if="cycles1[0].interval === 'week'" style="width: 100px; margin-left: 5px" v-model="cycles1[0].week" size="mini" :disabled="operationVariableForm.cycleType === 2">
                                        <el-option v-for="dict in dict.type.variable_operation_week" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                                    </el-select>
                                    <el-select v-if="cycles1[0].interval === 'month'" style="width: 100px; margin-left: 5px" v-model="cycles1[0].day" size="mini" :disabled="operationVariableForm.cycleType === 2">
                                        <el-option v-for="dict in dict.type.variable_operation_day" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                                    </el-select>
                                    <el-select
                                        v-if="cycles1[0].interval === 'day' || cycles1[0].interval === 'week' || cycles1[0].interval === 'month'"
                                        style="width: 100px; margin-left: 5px"
                                        v-model="cycles1[0].time"
                                        size="mini"
                                        :disabled="operationVariableForm.cycleType === 2"
                                        @change="handleCycleTime"
                                    >
                                        <el-option v-for="dict in dict.type.variable_operation_time" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                                    </el-select>
                                    <span style="margin-left: 10px">{{ $t('scene.edit.202832-39') }}</span>
                                </div>
                            </el-radio>
                            <el-radio :label="2" style="display: block; margin-top: 20px">
                                {{ $t('scene.edit.202832-40') }}
                                <el-tooltip placement="right">
                                    <div slot="content">
                                        {{ $t('scene.edit.202832-41') }}
                                        <br />
                                        {{ $t('scene.edit.202832-42') }}
                                    </div>
                                    <i class="el-icon-question" style="color: #909399"></i>
                                </el-tooltip>
                                <div class="timer-custom" v-for="(item, index) in cycles2" :key="index">
                                    <span>{{ $t('scene.edit.202832-38') }}</span>
                                    <el-select
                                        style="width: 100px; margin-left: 10px"
                                        v-model="cycles2[index].type"
                                        size="mini"
                                        :disabled="operationVariableForm.cycleType === 1"
                                        @change="handleCustomInterval(index, $event)"
                                    >
                                        <el-option :label="$t('scene.edit.202832-43')" value="day"></el-option>
                                        <el-option :label="$t('scene.edit.202832-44')" value="week"></el-option>
                                        <el-option :label="$t('scene.edit.202832-45')" value="month"></el-option>
                                    </el-select>
                                    <el-select v-if="cycles2[index].type === 'week'" style="width: 100px; margin-left: 5px" v-model="cycles2[index].week" size="mini" :disabled="operationVariableForm.cycleType === 1">
                                        <el-option v-for="dict in dict.type.variable_operation_week" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                                    </el-select>
                                    <el-select v-if="cycles2[index].type === 'month'" style="width: 100px; margin-left: 5px" v-model="cycles2[index].day" size="mini" :disabled="operationVariableForm.cycleType === 1">
                                        <el-option v-for="dict in dict.type.variable_operation_day" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                                    </el-select>
                                    <el-select
                                        v-if="cycles2[index].type === 'day' || cycles2[index].type === 'week' || cycles2[index].type === 'month'"
                                        style="width: 100px; margin-left: 5px"
                                        v-model="cycles2[index].time"
                                        size="mini"
                                        :disabled="operationVariableForm.cycleType === 1"
                                    >
                                        <el-option v-for="dict in dict.type.variable_operation_time" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                                    </el-select>
                                    <span style="margin-left: 5px">{{ $t('scene.edit.202832-46') }}</span>
                                    <el-select v-if="cycles2[index].type === 'day'" style="width: 100px; margin-left: 5px" v-model="cycles2[index].toType" size="mini" :disabled="operationVariableForm.cycleType === 1">
                                        <el-option :label="$t('scene.edit.202832-47')" value="1"></el-option>
                                        <el-option :label="$t('scene.edit.202832-48')" value="2"></el-option>
                                    </el-select>
                                    <el-select v-if="cycles2[index].type === 'week'" style="width: 100px; margin-left: 5px" v-model="cycles2[index].toType" size="mini" :disabled="operationVariableForm.cycleType === 1">
                                        <el-option :label="$t('scene.edit.202832-49')" value="3"></el-option>
                                    </el-select>
                                    <el-select v-if="cycles2[index].type === 'month'" style="width: 100px; margin-left: 5px" v-model="cycles2[index].toType" size="mini" :disabled="operationVariableForm.cycleType === 1">
                                        <el-option :label="$t('scene.edit.202832-50')" value="4"></el-option>
                                    </el-select>
                                    <el-select v-if="cycles2[index].type === 'week'" style="width: 100px; margin-left: 5px" v-model="cycles2[index].toWeek" size="mini" :disabled="operationVariableForm.cycleType === 1">
                                        <el-option v-for="dict in dict.type.variable_operation_week" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                                    </el-select>
                                    <el-select v-if="cycles2[index].type === 'month'" style="width: 100px; margin-left: 5px" v-model="cycles2[index].toDay" size="mini">
                                        <el-option v-for="dict in dict.type.variable_operation_day" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                                    </el-select>
                                    <el-select
                                        v-if="cycles2[index].type === 'day' || cycles2[index].type === 'week' || cycles2[index].type === 'month'"
                                        style="width: 100px; margin-left: 5px"
                                        v-model="cycles2[index].toTime"
                                        size="mini"
                                        :disabled="operationVariableForm.cycleType === 1"
                                    >
                                        <el-option v-for="dict in dict.type.variable_operation_time" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                                    </el-select>
                                    <span style="margin-left: 10px">{{ $t('scene.edit.202832-51') }}</span>
                                    <el-button style="color: #f56c6c; margin-left: 15px" size="mini" type="text" :disabled="operationVariableForm.cycleType === 1" @click="handleCustomIntervalDelete(index)">
                                        {{ $t('del') }}
                                    </el-button>
                                </div>
                                <el-button style="margin-top: 10px" size="mini" type="text" icon="el-icon-circle-plus-outline" :disabled="operationVariableForm.cycleType === 1" @click="handleCustomIntervalAdd">
                                    {{ $t('scene.edit.202832-52') }}
                                </el-button>
                            </el-radio>
                        </el-radio-group>
                    </div>
                </el-form-item>
                <el-form-item class="comp-add-edit" prop="aliasFormule" :show-message="false">
                    <span slot="label">
                        {{ $t('scene.edit.202832-53') }}
                        <el-tooltip placement="right">
                            <div slot="content">
                                {{ $t('scene.edit.202832-54') }}
                                <br />
                                {{ $t('scene.edit.202832-55') }}
                                <br />
                                {{ $t('scene.edit.202832-56') }}
                                <br />
                                {{ $t('scene.edit.202832-57') }}
                                <br />
                                {{ $t('scene.edit.202832-58') }}
                                <br />
                                {{ $t('scene.edit.202832-59') }}
                                <br />
                                {{ $t('scene.edit.202832-60') }}
                                <br />
                                {{ $t('scene.edit.202832-61') }}
                                <br />
                                {{ $t('scene.edit.202832-62') }}
                                <br />
                                {{ $t('scene.edit.202832-63') }}
                                <br />
                                {{ $t('scene.edit.202832-64') }}
                            </div>
                            <i class="el-icon-question" style="color: #909399"></i>
                        </el-tooltip>
                    </span>
                    <div class="comput-formula-box">
                        <div class="title">{{ $t('scene.edit.202832-65') }}</div>
                        <div class="content">
                            <el-form-item prop="aliasFormule">
                                <el-input style="width: 733px !important" v-model="operationVariableForm.aliasFormule" :placeholder="$t('scene.edit.202832-76')" type="textarea" :rows="1" clearable />
                            </el-form-item>
                            <el-form-item>
                                <el-table v-if="operationVariableForm.tagPointsList.length > 0" :data="operationVariableForm.tagPointsList" style="width: 100%; margin-top: 15px" :border="false">
                                    <el-table-column prop="alias" :label="$t('scene.edit.202832-13')" width="80">
                                        <template slot-scope="scope">
                                            <div class="alias-wrap">
                                                {{ scope.row.alias }}
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="sceneModelDeviceId" :label="$t('scene.overview.324354-7')">
                                        <template slot-scope="scope">
                                            <el-select v-model="scope.row.sceneModelDeviceId" :placeholder="$t('scene.overview.324354-8')" size="small" @change="handleFormulaDataSourcesChange(scope, $event)">
                                                <el-option v-for="item in formulaDataSourcesList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                            </el-select>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="sceneModelDataId" :label="$t('scene.edit.202832-66')">
                                        <template slot-scope="scope">
                                            <el-select v-model="scope.row.sceneModelDataId" :placeholder="$t('scene.edit.202832-67')" size="small" @change="handleFormulaVariableChange(scope, $event)">
                                                <el-option v-for="item in formulaVariableLists[scope.$index]" :key="item.id" :label="item.sourceName" :value="item.id"></el-option>
                                            </el-select>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="operation" :label="$t('scene.edit.202832-68')">
                                        <template slot-scope="scope">
                                            <el-select v-model="scope.row.operation" :placeholder="$t('scene.edit.202832-69')" size="small">
                                                <el-option v-for="dict in dict.type.variable_operation_type" :key="dict.value" :label="dict.label" :value="parseInt(dict.value)"></el-option>
                                            </el-select>
                                        </template>
                                    </el-table-column>
                                    <el-table-column :label="$t('opation')" align="center" class-name="small-padding fixed-width" width="100">
                                        <template slot-scope="scope">
                                            <el-button style="color: #f56c6c" size="mini" type="text" icon="el-icon-delete" @click="handleDeleteFormula(scope.$index)">{{ $t('del') }}</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <el-button style="margin-top: 20px" size="mini" type="text" icon="el-icon-circle-plus-outline" @click="handleAddFormula">{{ $t('scene.edit.202832-70') }}</el-button>
                            </el-form-item>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item :label="$t('scene.edit.202832-71')" prop="storage">
                    <el-radio-group v-model="operationVariableForm.storage">
                        <el-radio :label="1">{{ $t('scene.edit.202832-72') }}</el-radio>
                        <el-radio :label="0">{{ $t('scene.edit.202832-73') }}</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleOperationVariableSubmit" v-hasPermi="['scene:modelTag:edit']" v-show="operationVariableForm.id">{{ $t('update') }}</el-button>
                <el-button type="primary" @click="handleOperationVariableSubmit" v-hasPermi="['scene:modelTag:add']" v-show="!operationVariableForm.id">{{ $t('add') }}</el-button>
                <el-button @click="isOperationVariable = false">{{ $t('cancel') }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';

import { deptsTreeSelect } from '@/api/system/user';
import { listDeviceShort } from '@/api/iot/device';
import { checkPermi } from '@/utils/permission';
import {
    getSceneModelDetail,
    getSceneModelDeviceList,
    addModelDevice,
    deleteModelDevice,
    updateModelDevice,
    getSceneModelDataListByType,
    enableModelDevice,
    enableModelData,
    getSceneModelTagList,
    addSceneModelTag,
    updateSceneModelTag,
    deleteSceneModelTag,
    getSceneModelTag,
    getSceneModelDataList,
    updateSceneModel,
} from '@/api/scene/list.js';

export default {
    name: 'SceneListEdit',
    dicts: ['variable_operation_interval', 'variable_operation_time', 'variable_operation_week', 'variable_operation_day', 'variable_operation_type'],
    components: { Treeselect },
    computed: {
        uploadDisabled: function () {
            return this.form.imgUrl !== '';
        },
    },
    data() {
        return {
            baseUrl: process.env.VUE_APP_BASE_API,
            deptOptions: [], // 机构树
            // 表单参数
            form: {
                sceneModelName: '',
                deptId: '',
                imgUrl: '',
                desc: '',
            },
            isSelectDevice: false, // 假设当前用户拥有的权限
            isEnableSwitch: false,
            // 表单校验
            rules: {
                sceneModelName: [{ required: true, message: this.$t('scene.edit.202832-5'), trigger: 'blur' }],
                deptId: [{ required: true, message: this.$t('scene.edit.202832-6'), trigger: 'change' }],
            },
            congigType: 1, // 场景配置类型
            selectDeviceList: [], // 选择设备列表
            deviceList: [],
            devConfigLoading: true, // 遮罩层,
            devConfigQueryParams: {
                sceneModelId: null,
                variableType: 1,
                sceneModelDeviceId: null,
                sourceName: '',
                pageNum: 1,
                pageSize: 10,
            },
            devConfigEnable: 0, // 全部启动
            devConfigTotal: 0,
            devConfigList: [], // 设备配置变量列表数据
            inputVariableLoading: true, // 遮罩层,
            inputVariableQueryParams: {
                sceneModelId: null,
                variableType: 2,
                name: '',
                pageNum: 1,
                pageSize: 10,
            },
            inputVariableEnable: 0, // 全部启动
            inputVariableTotal: 0,
            inputVariableList: [], // 录入型变量列表数据
            isInputVariable: false, // 录入型变量对话框
            inputVariableTitle: this.$t('scene.edit.202832-74'),
            inputVariableForm: {
                name: '',
                unit: '',
                dataType: null,
                defaultValue: '',
            },
            inputVariableRules: {
                name: [{ required: true, message: this.$t('scene.overview.324354-12'), trigger: 'blur' }],
                dataType: [{ required: true, message: this.$t('scene.edit.202832-31'), trigger: 'change' }],
            },
            operationVariableLoading: true, // 遮罩层,
            operationVariableQueryParams: {
                sceneModelId: null,
                variableType: 3,
                name: '',
                pageNum: 1,
                pageSize: 10,
            },
            operationVariableEnable: 0, // 全部启动
            operationVariableTotal: 0,
            operationVariableList: [], // 运算型变量列表数据
            isOperationVariable: false, // 运算型变量对话框
            operationVariableTitle: this.$t('scene.edit.202832-74'),
            operationVariableForm: {
                name: '',
                unit: '',
                cycleType: 1, // 1周期,2自定义
                cycle: '', // json 内容
                aliasFormule: '',
                formule: '',
                tagPointsList: [],
                storage: 0,
                isReadonly: 1,
            },
            operationVariableRules: {
                name: [{ required: true, message: this.$t('scene.overview.324354-12'), trigger: 'blur' }],
                cycleType: [{ required: true, message: this.$t('scene.edit.202832-75'), trigger: 'change' }],
                aliasFormule: [
                    { required: true, message: this.$t('scene.edit.202832-76'), trigger: 'change' },
                    {
                        validator: this.validateAliasFormule,
                        trigger: 'change',
                    },
                ],
                storage: [{ required: true, message: this.$t('scene.edit.202832-77'), trigger: 'change' }],
            },
            cycles1: [{ interval: 'hour', time: '', week: '', day: '' }],
            cycles2: [{ type: 'day', time: '00', week: '', day: '', toType: '1', toTime: '02', toWeek: '', toDay: '' }],
            formulaDataSourcesList: [], // 计算公式数据源
            formulaVariableLists: [], // 计算公式变量数组
            // 使用内存
            queryParams: {},
        };
    },
    mounted() {
        this.getDeptTree(); // 获取机构树
        this.getSceneDetail(); // 获取场景详情
        this.getDeviceList(); // 获取设备列表
        this.getSelectDeviceList(); // 获取选择设备
        this.getInputVariableList(); // 录入型变量列表
        this.getOperationVariableList(); // 运算型变量列表
    },
    created() {
        // 判断是否有启用权限
        let hasPermission = checkPermi(['scene:modelData:editEnable']);
        if (hasPermission) {
            this.isEnableSwitch = true;
        }
        let userPermissions = checkPermi(['scene:modelDevice:edit']);
        if (userPermissions) {
            this.isSelectDevice = true;
        }
    },
    methods: {
        // 获取机构树
        getDeptTree() {
            deptsTreeSelect().then((res) => {
                if (res.code === 200) {
                    this.deptOptions = res.data;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        // 选中Treeselect触发
        handleTreeselectInput(items) {
            if (items) {
                this.$refs.form.clearValidate('deptId'); // 自动不起效果，所以手动
            }
        },
        // 获取场景详情
        getSceneDetail() {
            this.$modal.loading(this.$t('scene.detail.index.209809-3'));
            const id = this.$route.query.id;
            getSceneModelDetail(id).then((res) => {
                if (res.code === 200) {
                    this.form = res.data;
                } else {
                    this.$message.error(res.msg);
                }
                this.$modal.closeLoading();
            });
        },
        // 获取设备列表
        getDeviceList() {
            const params = {
                showChild: true,
                pageNum: 1,
                pageSize: 9999,
            };
            listDeviceShort(params).then((res) => {
                if (res.code === 200) {
                    this.deviceList = res.rows;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        // 获取选择设备
        getSelectDeviceList() {
            const { id } = this.$route.query;
            const params = {
                sceneModelId: Number(id),
                variableType: this.congigType,
                pageNum: 1,
                pageSize: 9999,
            };
            getSceneModelDeviceList(params).then((res) => {
                if (res.code === 200) {
                    this.selectDeviceList = res.rows;
                    this.$refs.deviceTable.setCurrentRow(res.rows[0]);
                } else {
                    this.$message.error(res.msg);
                }
                this.$modal.closeLoading();
            });
        },
        // 新增选择设备
        handleAddDeviceItem() {
            const { id } = this.$route.query;
            const params = { sceneModelId: Number(id) };
            addModelDevice(params).then((res) => {
                if (res.code === 200) {
                    this.getSelectDeviceList();
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        // 删除选择设备
        handleDeleteDeviceItem(item) {
            deleteModelDevice(item.id).then((res) => {
                if (res.code === 200) {
                    this.getSelectDeviceList();
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        // 编辑选择设备
        handleUpdateDeviceItem(item, val) {
            const device = this.deviceList.find((f) => f.deviceId === val);
            const { id } = this.$route.query;
            const params = {
                sceneModelId: Number(id),
                id: item.id,
                name: device.deviceName,
                cusDeviceId: device.deviceId,
            };
            updateModelDevice(params).then((res) => {
                if (res.code === 200) {
                    this.getSelectDeviceList();
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        // 选择某行设备数据
        handleCurrentDeviceItemChange(row) {
            this.devConfigQueryParams.sceneModelDeviceId = row.id;
            this.getDevConfigVariableList();
        },
        // 获取变量列表
        getDevConfigVariableList() {
            this.devConfigLoading = true;
            const { id } = this.$route.query;
            this.devConfigQueryParams.sceneModelId = Number(id);
            getSceneModelDataListByType(this.devConfigQueryParams).then((res) => {
                if (res.code === 200) {
                    this.devConfigList = res.rows;
                    this.devConfigEnable = res.allEnable;
                    this.devConfigTotal = res.total;
                } else {
                    this.$message.error(res.msg);
                }
                this.devConfigLoading = false;
            });
        },
        // 查询
        handleDevConfigQuery() {
            this.getDevConfigVariableList();
        },
        // 全部启用
        devConfigEnableChange() {
            const { id } = this.$route.query;
            let params = {
                id: this.devConfigQueryParams.sceneModelDeviceId,
                sceneModelId: Number(id),
                variableType: this.congigType,
                allEnable: this.devConfigEnable,
            };
            enableModelDevice(params).then((res) => {
                if (res.code === 200) {
                    this.getDevConfigVariableList();
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        // 单个启用
        devConfigItemEnableChange(item) {
            let params = {
                id: item.id,
                variableType: 1,
                sceneModelDeviceId: item.sceneModelDeviceId,
                enable: item.enable,
            };
            enableModelData(params).then((res) => {
                if (res.code === 200) {
                    this.getDevConfigVariableList();
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        // 获取变量列表
        getInputVariableList() {
            this.inputVariableLoading = true;
            const { id } = this.$route.query;
            this.inputVariableQueryParams.sceneModelId = Number(id);
            getSceneModelTagList(this.inputVariableQueryParams).then((res) => {
                if (res.code === 200) {
                    this.inputVariableList = res.rows;
                    this.inputVariableEnable = res.allEnable;
                    this.inputVariableTotal = res.total;
                } else {
                    this.$message.error(res.msg);
                }
                this.inputVariableLoading = false;
            });
        },
        // 查询
        handleInputVariableQuery() {
            this.getInputVariableList();
        },
        // 全部启用
        inputVariableEnableChange() {
            const { id } = this.$route.query;
            let params = {
                sceneModelId: Number(id),
                variableType: this.congigType,
                allEnable: this.inputVariableEnable,
            };
            enableModelDevice(params).then((res) => {
                if (res.code === 200) {
                    this.getInputVariableList();
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        // 单个启用
        inputVariableItemEnableChange(item) {
            let params = {
                id: item.id,
                variableType: 2,
                sceneModelDeviceId: item.sceneModelDeviceId,
                enable: item.enable,
            };
            enableModelData(params).then((res) => {
                if (res.code === 200) {
                    this.getInputVariableList();
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        // 新增录入型变量
        handleAddInputVariable() {
            this.resetInputVariable();
            this.inputVariableTitle = this.$t('scene.edit.202832-78');
            this.isInputVariable = true;
        },
        // 表单重置
        resetInputVariable() {
            this.inputVariableForm = {
                name: '',
                unit: '',
                dataType: null,
                defaultValue: '',
            };
            this.resetForm('inputVariableForm');
        },
        //录入型变量编辑
        handleEditInputVariable(item) {
            this.inputVariableTitle = this.$t('scene.edit.202832-79');
            getSceneModelTag(item.id).then((res) => {
                if (res.code === 200) {
                    this.inputVariableForm = res.data;
                    this.isInputVariable = true;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        // 保存录入型变量
        handleInputVariableSubmit() {
            this.$refs['inputVariableForm'].validate((valid) => {
                if (valid) {
                    if (this.inputVariableForm.id != null) {
                        updateSceneModelTag(this.inputVariableForm).then((res) => {
                            if (res.code === 200) {
                                this.$modal.msgSuccess(this.$t('updateSuccess'));
                                this.isInputVariable = false;
                                this.getInputVariableList();
                            } else {
                                this.$message.error(res.msg);
                            }
                        });
                    } else {
                        const { id } = this.$route.query;
                        this.inputVariableForm = { sceneModelId: Number(id), variableType: this.congigType, ...this.inputVariableForm };
                        addSceneModelTag(this.inputVariableForm).then((res) => {
                            if (res.code === 200) {
                                this.$modal.msgSuccess(this.$t('addSuccess'));
                                this.isInputVariable = false;
                                this.getInputVariableList();
                            } else {
                                this.$message.error(res.msg);
                            }
                        });
                    }
                }
            });
        },
        // 删除
        handleDeleteInputVariable(item) {
            deleteSceneModelTag(item.id).then((res) => {
                if (res.code === 200) {
                    this.getInputVariableList();
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        // 获取运算型变量列表
        getOperationVariableList() {
            this.operationVariableLoading = true;
            const { id } = this.$route.query;
            this.operationVariableQueryParams.sceneModelId = Number(id);
            getSceneModelTagList(this.operationVariableQueryParams).then((res) => {
                if (res.code === 200) {
                    this.operationVariableList = res.rows;
                    this.operationVariableEnable = res.allEnable;
                    this.operationVariableTotal = res.total;
                } else {
                    this.$message.error(res.msg);
                }
                this.operationVariableLoading = false;
            });
        },
        // 查询
        handleOperationVariableQuery() {
            this.getOperationVariableList();
        },
        // 全部启用
        operationVariableEnableChange() {
            const { id } = this.$route.query;
            let params = {
                sceneModelId: Number(id),
                variableType: this.congigType,
                allEnable: this.operationVariableEnable,
            };
            enableModelDevice(params).then((res) => {
                if (res.code === 200) {
                    this.getOperationVariableList();
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        // 单个启用
        operationVariableItemEnableChange(item) {
            let params = {
                id: item.id,
                variableType: 3,
                sceneModelDeviceId: item.sceneModelDeviceId,
                enable: item.enable,
            };
            enableModelData(params).then((res) => {
                if (res.code === 200) {
                    this.getOperationVariableList();
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        // 新增运算型变量
        handleAddOperationVariable() {
            this.resetOperationVariable();
            this.getFormulaDataSources(); // 获取运算公式数据源
            this.operationVariableTitle = this.$t('scene.edit.202832-78');
            this.isOperationVariable = true;
        },
        // 表单重置运算
        resetOperationVariable() {
            this.operationVariableForm = {
                name: '',
                unit: '',
                cycleType: 1,
                cycle: '',
                aliasFormule: '',
                formule: '',
                tagPointsList: [],
                storage: 0,
                isReadonly: 1,
            };
            this.resetForm('operationVariableForm');
        },
        // 时间周期类型切换
        handleCycleTypeInput(val) {
            if (val === 1) {
                this.cycles2 = [{ type: 'day', time: '00', week: '', day: '', toType: '1', toTime: '02', toWeek: '', toDay: '' }];
            } else {
                this.cycles1 = [{ interval: 'hour', time: '', week: '', day: '' }];
            }
        },
        // 时间周期-周期循环
        handleCycleInterval(val) {
            if (val === 'hour') {
                this.$set(this.cycles1, 0, { interval: val, time: '', week: '', day: '' });
            } else if (val === 'day') {
                this.$set(this.cycles1, 0, { interval: val, time: '01', week: '', day: '' });
            } else if (val === 'week') {
                this.$set(this.cycles1, 0, { interval: val, time: '01', week: '1', day: '' });
            } else if (val === 'month') {
                this.$set(this.cycles1, 0, { interval: val, time: '01', week: '', day: '1' });
            } else {
                this.$set(this.cycles1, 0, { interval: val, time: '', week: '', day: '' });
            }
        },
        // 时间周期-自定义
        handleCustomInterval(index, val) {
            if (val === 'day') {
                this.$set(this.cycles2, index, { type: val, time: '00', week: '', day: '', toType: '1', toTime: '02', toWeek: '', toDay: '' });
            } else if (val === 'week') {
                this.$set(this.cycles2, index, { type: val, time: '00', week: '1', day: '', toType: '3', toTime: '02', toWeek: '2', toDay: '' });
            } else if (val === 'month') {
                this.$set(this.cycles2, index, { type: val, time: '00', week: '', day: '1', toType: '4', toTime: '02', toWeek: '', toDay: '2' });
            }
        },
        // 时间周期-自定义-添加
        handleCustomIntervalAdd() {
            this.cycles2.push({ type: 'day', time: '00', week: '', day: '', toType: '1', toTime: '02', toWeek: '', toDay: '' });
        },
        handleCustomIntervalDelete(index) {
            this.cycles2.splice(index, 1);
        },
        // 获取运算公式数据源
        getFormulaDataSources() {
            const { id } = this.$route.query;
            const params = {
                sceneModelId: Number(id),
                pageNum: 1,
                pageSize: 9999,
            };
            getSceneModelDeviceList(params).then((res) => {
                if (res.code === 200) {
                    this.formulaDataSourcesList = res.rows;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        // 获取运算公式变量
        handleFormulaDataSourcesChange(scope, val) {
            this.$set(this.operationVariableForm.tagPointsList, scope.$index, { ...scope.row, sceneModelDataId: null });
            const params = {
                sceneModelId: this.$route.query.id,
                sceneModelDeviceId: val,
                pageNum: 1,
                pageSize: 9999,
            };
            getSceneModelDataList(params).then((res) => {
                if (res.code === 200) {
                    this.$set(this.formulaVariableLists, scope.$index, res.rows);
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        // 计算公式变量选择
        handleFormulaVariableChange(scope, val) {
            const vari = this.formulaVariableLists[scope.$index].find((f) => f.id === val);
            this.$set(this.operationVariableForm.tagPointsList, scope.$index, { ...scope.row, name: vari.sourceName, variableType: vari.variableType });
            this.$refs.operationVariableForm.clearValidate('aliasFormule'); // 自动不起效果，所以手动
        },
        // 新增计算条件
        handleAddFormula() {
            const length = this.operationVariableForm.tagPointsList.length;
            let alias = 'A';
            if (length > 0) {
                let item = this.operationVariableForm.tagPointsList[length - 1];
                const num = item.alias.charCodeAt() + 1;
                alias = String.fromCharCode(num);
            }
            this.operationVariableForm.tagPointsList.push({
                alias: alias,
                sceneModelDeviceId: '',
                sceneModelDataId: null,
                name: '',
                variableType: '',
                operation: 1,
            });
            this.formulaVariableLists.push([]);
            // 自动填充公式
            const aliasList = this.operationVariableForm.tagPointsList.map((item) => item.alias);
            this.operationVariableForm.aliasFormule = aliasList.join('');
        },
        // 删除计算条件
        handleDeleteFormula(index) {
            this.operationVariableForm.tagPointsList.splice(index, 1);
            this.formulaVariableLists.splice(index, 1);
            // 自动填充公式
            const aliasList = this.operationVariableForm.tagPointsList.map((item) => item.alias);
            this.operationVariableForm.aliasFormule = aliasList.join('');
        },
        // 保存运算变量
        handleOperationVariableSubmit() {
            this.$refs['operationVariableForm'].validate((valid) => {
                if (valid) {
                    const { id, cycleType, ...pres } = this.operationVariableForm;
                    let cycle = '';
                    if (cycleType === 1) {
                        const c = this.cycles1.map((item) => {
                            if (item.interval === 'hour') {
                                return { type: 'hour' };
                            } else if (item.interval === 'day') {
                                return { type: 'day', time: item.time };
                            } else if (item.interval === 'week') {
                                return { type: 'week', week: item.week, time: item.time };
                            } else if (item.interval === 'month') {
                                return { type: 'month', day: item.day, time: item.time };
                            } else {
                                return { interval: item.interval };
                            }
                        });
                        cycle = JSON.stringify(c);
                    } else {
                        const c = this.cycles2.map((item) => {
                            if (item.type === 'day') {
                                return { type: 'day', time: item.time, toType: item.toType, toTime: item.toTime };
                            } else if (item.type === 'week') {
                                return { type: 'week', week: item.week, time: item.time, toType: item.toType, toWeek: item.toWeek, toTime: item.toTime };
                            } else if (item.type === 'month') {
                                return { type: 'month', day: item.day, time: item.time, toType: item.toType, toDay: item.toDay, toTime: item.toTime };
                            }
                        });
                        cycle = JSON.stringify(c);
                    }
                    let params = { ...pres, id, cycleType, cycle };
                    if (id != null) {
                        updateSceneModelTag(params).then((res) => {
                            if (res.code === 200) {
                                this.$modal.msgSuccess(this.$t('updateSuccess'));
                                this.isOperationVariable = false;
                                this.getOperationVariableList();
                            } else {
                                this.$message.error(res.msg);
                            }
                        });
                    } else {
                        const { id } = this.$route.query;
                        params = { sceneModelId: Number(id), variableType: this.congigType, ...params };
                        addSceneModelTag(params).then((res) => {
                            if (res.code === 200) {
                                this.$modal.msgSuccess(this.$t('addSuccess'));
                                this.isOperationVariable = false;
                                this.getOperationVariableList();
                            } else {
                                this.$message.error(res.msg);
                            }
                        });
                    }
                }
            });
        },
        // 运算变量编辑
        handleEditOperationVariable(item) {
            this.operationVariableTitle = this.$t('scene.edit.202832-79');
            this.getFormulaDataSources(); // 获取运算公式数据源
            getSceneModelTag(item.id).then((res) => {
                if (res.code === 200) {
                    const { data } = res;
                    // 时间周期
                    if (data.cycleType === 1) {
                        const c = JSON.parse(data.cycle).map((item) => {
                            if (item.type) {
                                if (item.type === 'hour') {
                                    return { interval: item.type, time: '', week: '', day: '' };
                                } else if (item.type === 'day') {
                                    return { interval: item.type, time: item.time, week: '', day: '' };
                                } else if (item.type === 'week') {
                                    return { interval: item.type, time: item.time, week: item.week, day: '' };
                                } else if (item.type === 'month') {
                                    return { interval: item.type, time: item.time, week: '', day: item.day };
                                }
                            } else {
                                return { interval: item.interval, time: '', week: '', day: '' };
                            }
                        });
                        this.cycles1 = c;
                    } else {
                        const c = JSON.parse(data.cycle).map((item) => {
                            if (item.type === 'day') {
                                return { type: 'day', time: item.time, week: '', day: '', toType: item.toType, toTime: item.toTime, toWeek: '', toDay: '' };
                            } else if (item.type === 'week') {
                                return { type: 'week', time: item.time, week: item.week, day: '', toType: item.toType, toTime: item.toTime, toWeek: item.toWeek, toDay: '' };
                            } else if (item.type === 'month') {
                                return { type: 'month', time: item.time, week: '', day: item.day, toType: item.toType, toTime: item.toTime, toWeek: item.toWeek, toDay: item.toDay };
                            }
                        });
                        this.cycles2 = c;
                    }
                    // 计算公式变量
                    data.tagPointsList.forEach((item) => {
                        const params = {
                            sceneModelId: this.$route.query.id,
                            sceneModelDeviceId: item.sceneModelDeviceId,
                            pageNum: 1,
                            pageSize: 9999,
                        };
                        getSceneModelDataList(params).then((res) => {
                            if (res.code === 200) {
                                this.formulaVariableLists.push(res.rows);
                            } else {
                                this.$message.error(res.msg);
                            }
                        });
                    });
                    this.operationVariableForm = data;
                    this.isOperationVariable = true;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        // 删除
        handleDeleteOperationVariable(item) {
            deleteSceneModelTag(item.id).then((res) => {
                if (res.code === 200) {
                    this.getOperationVariableList();
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        // 保存
        handleSave() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    if (this.form.sceneModelId != null) {
                        updateSceneModel(this.form).then((res) => {
                            if (res.code === 200) {
                                this.$modal.msgSuccess(this.$t('updateSuccess'));
                                this.$router.push({
                                    path: '/scene/list/index',
                                });
                            } else {
                                this.$message.error(res.msg);
                            }
                        });
                    }
                }
            });
        },
        validateAliasFormule(rule, value, callback) {
            var _this = this;
            _this.operationVariableForm.formule = value;
            if (0 === _this.operationVariableForm.tagPointsList.length) {
                callback(new Error(this.$t('scene.edit.202832-80')));
            } else if (value) {
                if (String(value).length < 200) {
                    var isFormule = true;
                    try {
                        var letters = [];
                        _this.operationVariableForm.tagPointsList.forEach(function (e) {
                            var t = '${' + e.sceneModelDataId + '}';
                            letters.push(e.alias);
                            _this.operationVariableForm.formule = _this.replaceAll(_this.operationVariableForm.formule, e.alias, t);
                        });
                        var evalFormule = _this.operationVariableForm.formule.replace(/\$\{[0-9]*\}/g, '1');
                        evalFormule = String(eval(evalFormule));
                        var reg = /[0-9]{1}[A-Za-z]{1}|[A-Za-z]{2}|[A-Za-z]{1}[0-9]{1}/g;
                        if (reg.test(_this.operationVariableForm.aliasFormule)) {
                            isFormule = false;
                        } else {
                            var beforeReg = /^(?:[+]|[-]|[*]|[/]){1}$/;
                            isFormule = !beforeReg.test(evalFormule.slice(0, 1));
                        }
                        var isInclude = letters.some(function (e) {
                            return value.includes(e);
                        });
                        isInclude || (isFormule = false);
                    } catch (e) {
                        isFormule = false;
                    }
                    if (isFormule) {
                        callback();
                    } else {
                        callback(new Error(this.$t('scene.edit.202832-81')));
                    }
                } else {
                    callback(new Error(this.$t('scene.edit.202832-82')));
                }
            } else {
                callback(new Error(this.$t('scene.edit.202832-83')));
            }
        },
        replaceAll(str, s1, s2) {
            return str.replace(new RegExp(s1, 'gm'), s2);
        },
    },
};
</script>

<style lang="scss" scoped>
.scene-list-edit {
    width: 100%;

    .l-card-box {
        padding: 0 15px;
        margin: 15px 0 0;
    }

    .v-card-box {
    }

    ::v-deep label {
        font-weight: normal;
    }

    .scene-setting {
        overflow: hidden;
        font-size: 14px;
        color: #606266;

        .device-setting {
            margin-top: 20px;

            .device-select {
                .tools-wrap {
                    text-align: center;
                    margin-top: 20px;
                }
            }
        }

        .device-setting,
        .operation-variable,
        .input-variable {
            margin-top: 20px;

            .variable-list {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;

                ::v-deep .el-form-item {
                    margin-bottom: 0px;
                }

                .switch-wrap {
                    font-size: 14px;
                }
            }
        }
    }

    .save-wrap {
        text-align: center;
        margin-bottom: 15px;
    }

    ::v-deep .vue-treeselect {
        width: 182.5px;
        height: 34.5px;
        line-height: 34.5px;
        font-size: inherit;
        color: #606266;
    }

    ::v-deep .vue-treeselect__control {
        height: 34.5px;
    }

    ::v-deep .vue-treeselect__placeholder,
    ::v-deep .vue-treeselect__single-value {
        line-height: 34.5px;
    }
}

.operation-variable-dialog {
    .timer-wrap {
        .timer-period {
            display: inline-block;
            margin-left: 30px;
            color: #000000;
            font-size: 12px;
            font-weight: normal;
        }

        .timer-custom {
            display: block;
            margin-top: 12px;
            color: #000000;
            font-size: 12px;
            font-weight: normal;
        }
    }

    .comp-add-edit {
        display: flex;
        flex-direction: column;

        ::v-deep .el-form-item__content {
            margin-left: 0 !important;
        }

        .comput-formula-box {
            padding: 20px 0;
            border: 1px solid #e7e9f1;
            margin-left: 50px;
            display: flex;

            .title {
                text-align: right;
                width: 96px;
                padding-right: 16px;
            }

            .content {
                font-size: 12px;
                line-height: 32px;

                .alias-wrap {
                    width: 28px;
                    height: 28px;
                    background-image: linear-gradient(180deg, #6fb0ff, #3c78ff);
                    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.2);
                    font-size: 12px;
                    font-weight: 400;
                    line-height: 28px;
                    text-align: center;
                    margin-top: 2px;
                    color: #fff;
                }
            }
        }
    }
}

.disable {
    ::v-deep .el-upload--picture-card {
        display: none !important;
    }
}
</style>
