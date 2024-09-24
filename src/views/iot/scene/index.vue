<template>
    <div class="scene-wrap">
        <el-card v-show="showSearch" class="search-wrap">
            <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" style="margin-bottom: -20px">
                <el-form-item :label="$t('alert.scene-list.591934-1')" prop="sceneName">
                    <el-input v-model="queryParams.sceneName" :placeholder="$t('alert.scene-list.591934-2')" clearable size="small" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">{{ $t('search') }}</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="handleResetQuery">{{ $t('reset') }}</el-button>
                </el-form-item>
                <el-form-item style="float: right">
                    <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['iot:scene:add']">{{ $t('add') }}</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <el-card class="content-wrap">
            <el-table v-loading="loading" :data="sceneList" @selection-change="handleSelectionChange" border>
                <el-table-column :label="$t('alert.scene-list.591934-1')" align="center" prop="sceneName" />
                <el-table-column :label="$t('alert.index.236501-44')" align="center" prop="enable" width="">
                    <template slot-scope="scope">
                        <el-tag type="success" size="small" v-if="scope.row.enable == 1">{{ $t('alert.index.236501-45') }}</el-tag>
                        <el-tag type="danger" size="small" v-if="scope.row.enable == 2 || scope.row.enable == 0">{{ $t('alert.index.236501-46') }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('scene.index.670805-0')" align="center" prop="hasAlert">
                    <template slot-scope="scope">
                        <span v-if="scope.row.hasAlert == 1">{{ $t('scene.index.670805-1') }}</span>
                        <span v-if="scope.row.hasAlert == 2">{{ $t('scene.index.670805-2') }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('alert.index.236501-19')" align="center" prop="cond">
                    <template slot-scope="scope">
                        <span v-if="scope.row.cond == 1">{{ $t('alert.index.236501-20') }}</span>
                        <span v-if="scope.row.cond == 2">{{ $t('alert.index.236501-21') }}</span>
                        <span v-if="scope.row.cond == 3">{{ $t('alert.index.236501-22') }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('alert.index.236501-23')" align="center" prop="executeMode">
                    <template slot-scope="scope">
                        <span v-if="scope.row.executeMode == 1">{{ $t('alert.index.236501-24') }}</span>
                        <span v-if="scope.row.executeMode == 2">{{ $t('alert.index.236501-25') }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('scene.index.670805-3')" align="center" prop="silentPeriod" width="">
                    <template slot-scope="scope">
                        <span>{{ scope.row.silentPeriod }} {{ $t('scene.index.670805-4') }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('scene.index.670805-6')" align="center" prop="executeDelay" width="">
                    <template slot-scope="scope">
                        <span>{{ scope.row.executeDelay }} {{ $t('scene.index.670805-5') }}</span>
                    </template>
                </el-table-column>

                <el-table-column :label="$t('creatTime')" align="center" prop="createTime" width="">
                    <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('opation')" align="center" width="140">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" icon="el-icon-view" @click="handleUpdate(scope.row)" v-hasPermi="['iot:scene:query']">{{ $t('look') }}</el-button>
                        <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['iot:scene:remove']">{{ $t('del') }}</el-button>
                        <el-button size="mini" type="text" icon="el-icon-caret-right" @click="handleRun(scope.row)" v-hasPermi="['iot:scene:run']">{{ $t('scene.index.670805-7') }}</el-button>
                        <el-button size="mini" type="text" icon="el-icon-view" @click="handleLog(scope.row)" v-hasPermi="['iot:scene:run']">{{ $t('script.349087-36') }}</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

            <!-- 添加或修改场景联动对话框 -->
            <el-dialog class="scene-config-dialog" :title="title" :visible.sync="open" width="900px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
                <div class="el-divider el-divider--horizontal" style="margin-top: -25px"></div>
                <el-form ref="form" :model="form" :rules="rules" label-width="90px">
                    <el-row :gutter="50">
                        <el-col :span="12">
                            <el-form-item :label="$t('alert.index.236501-18')" prop="sceneName">
                                <el-input v-model="form.sceneName" :placeholder="$t('alert.scene-list.591934-2')" />
                            </el-form-item>
                            <el-form-item :label="$t('scene.index.670805-8')">
                                <el-switch v-model="form.enable" :active-value="1" :inactive-value="2" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item :label="$t('alert.index.236501-11')" prop="remark">
                                <el-input v-model="form.remark" type="textarea" rows="4" :placeholder="$t('plzInput')" />
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <div style="height: 1px; background-color: #ddd; margin: 0 0 20px 0"></div>
                    <div class="condition-wrap">
                        <el-form-item :label="$t('scene.index.670805-9')" prop="triggers">
                            <div class="item-wrap" style="background-color: #eef3f7">
                                <el-row :gutter="16">
                                    <el-col :span="24">
                                        <span>{{ $t('scene.index.670805-10') }}</span>
                                        <el-select v-model="form.cond" :placeholder="$t('scene.index.670805-11')" size="small" style="width: 160px">
                                            <el-option key="1" :label="$t('alert.index.236501-20')" :value="1" />
                                            <el-option key="2" :label="$t('alert.index.236501-21')" :value="2" />
                                            <el-option key="3" :label="$t('scene.index.670805-12')" :value="3" :disabled="formJson.triggers.length > 1" />
                                        </el-select>
                                        <span style="margin-left: 20px; font-size: 12px">{{ $t('scene.index.670805-13') }}</span>
                                    </el-col>
                                </el-row>
                            </div>
                            <div class="item-wrap" v-for="(item, index) in formJson.triggers" :key="index">
                                <el-row :gutter="16">
                                    <el-col :span="5">
                                        <el-select v-model="item.source" :placeholder="$t('pleaseSelect')" size="small" @change="handleTriggerSource($event, index)">
                                            <el-option v-for="subItem in triggerSource" :key="subItem.value" :label="subItem.label" :value="subItem.value"></el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="10" v-if="item.source == 1">
                                        <el-input readonly v-model="item.deviceCount" size="small" :placeholder="$t('product.product-things-model.142341-83')" style="margin-top: 3px">
                                            <span slot="prepend" disabled>{{ $t('scene.index.670805-14') }}</span>
                                            <el-button slot="append" @click="handleSelectDevice('trigger', item, index)" size="small">{{ $t('firmware.index.222541-31') }}</el-button>
                                        </el-input>
                                    </el-col>
                                    <el-col :span="10" v-if="item.source == 3">
                                        <el-input readonly v-model="item.productName" size="small" :placeholder="$t('device.allot-import-dialog.060657-1')" style="margin-top: 3px">
                                            <el-button slot="append" @click="handleSelectProduct('trigger', item, index)" size="small">{{ $t('sip.product-list.998536-0') }}</el-button>
                                        </el-input>
                                    </el-col>
                                    <div class="delete-wrap" v-if="index != 0">
                                        <el-button size="small" plain type="danger" style="padding: 5px" icon="el-icon-delete" @click="handleRemoveTrigger(index)">{{ $t('del') }}</el-button>
                                    </div>
                                </el-row>

                                <!--定时-->
                                <el-row v-if="item.source == 2" :gutter="16">
                                    <el-col :span="5">
                                        <el-time-picker
                                            style="width: 100%"
                                            v-model="item.timerTimeValue"
                                            size="small"
                                            value-format="HH:mm"
                                            format="HH:mm"
                                            :placeholder="$t('device.device-timer.433369-19')"
                                            @change="timeChange($event, index)"
                                            :disabled="item.isAdvance == 1"
                                        ></el-time-picker>
                                    </el-col>
                                    <el-col :span="19">
                                        <el-select
                                            v-model="item.timerWeekValue"
                                            :placeholder="$t('pleaseSelect')"
                                            multiple
                                            style="width: 100%"
                                            @change="weekChange($event, index)"
                                            size="small"
                                            :disabled="item.isAdvance == 1"
                                        >
                                            <el-option v-for="subItem in timerWeeks" :key="subItem.value" :label="subItem.label" :value="subItem.value"></el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="5" style="margin-top: 5px">
                                        <el-checkbox v-model="item.isAdvance" :true-label="1" :false-label="0" @change="customerCronChange(($event, index))" border size="small" style="width: 100%">
                                            {{ $t('scene.index.670805-15') }}
                                        </el-checkbox>
                                    </el-col>
                                    <el-col :span="19" style="margin-top: 10px">
                                        <el-input v-model="item.cronExpression" :placeholder="$t('scene.index.670805-16')" :disabled="item.isAdvance == 0" size="small">
                                            <template slot="append">
                                                <el-button type="primary" @click="handleShowCron(item, index)" :disabled="item.isAdvance == 0">
                                                    {{ $t('scene.index.670805-17') }}
                                                    <i class="el-icon-time el-icon--right"></i>
                                                </el-button>
                                            </template>
                                        </el-input>
                                    </el-col>
                                </el-row>

                                <div v-if="item.thingsModel">
                                    <!--类型和父级物模型-->
                                    <el-row :gutter="16">
                                        <el-col :span="5">
                                            <el-select v-model="item.type" :placeholder="$t('scene.index.670805-18')" size="small" @change="handleTriggerTypeChange($event, index)">
                                                <el-option v-for="(subItem, subIndex) in triggerTypes" :key="subIndex + 'type'" :label="subItem.label" :value="subItem.value"></el-option>
                                            </el-select>
                                        </el-col>

                                        <el-col :span="10">
                                            <el-select
                                                style="width: 100%"
                                                v-model="item.parentId"
                                                :placeholder="$t('scene.index.670805-19')"
                                                size="small"
                                                v-if="item.type == 1"
                                                @change="handleTriggerParentModelChange($event, index)"
                                            >
                                                <el-option v-for="(subItem, subIndex) in item.thingsModel.properties" :key="subIndex + 'triggerProperty'" :label="subItem.name" :value="subItem.id"></el-option>
                                            </el-select>
                                            <el-select
                                                style="width: 100%"
                                                v-model="item.parentId"
                                                :placeholder="$t('scene.index.670805-19')"
                                                size="small"
                                                v-else-if="item.type == 2"
                                                @change="handleTriggerParentModelChange($event, index)"
                                            >
                                                <el-option v-for="(subItem, subIndex) in item.thingsModel.functions" :key="subIndex + 'triggerFunc'" :label="subItem.name" :value="subItem.id"></el-option>
                                            </el-select>
                                            <el-select
                                                style="width: 100%"
                                                v-model="item.parentId"
                                                :placeholder="$t('scene.index.670805-19')"
                                                size="small"
                                                v-else-if="item.type == 3"
                                                @change="handleTriggerParentModelChange($event, index)"
                                            >
                                                <el-option v-for="(subItem, subIndex) in item.thingsModel.events" :key="subIndex + 'triggerEvents'" :label="subItem.name" :value="subItem.id"></el-option>
                                            </el-select>
                                        </el-col>
                                    </el-row>

                                    <!--数组索引/物模型/操作符和值-->
                                    <el-row :gutter="16">
                                        <el-col :span="5" v-if="item.parentModel && item.parentModel.datatype.type === 'array'">
                                            <el-select v-model="item.arrayIndex" :placeholder="$t('pleaseSelect')" size="small" @change="handleTriggerIndexChange($event, index)">
                                                <el-option v-for="subItem in item.parentModel.datatype.arrayModel" :key="subItem.id" :label="subItem.name" :value="subItem.id"></el-option>
                                            </el-select>
                                        </el-col>
                                        <el-col :span="5" v-if="item.parentModel && item.parentModel.datatype.type === 'array' && item.parentModel.datatype.arrayType === 'object'">
                                            <el-select v-model="item.id" :placeholder="$t('pleaseSelect')" size="small" @change="handleTriggerModelChange($event, index)">
                                                <el-option v-for="(subItem, subIndex) in item.parentModel.datatype.params" :key="subIndex" :label="subItem.name" :value="subItem.id"></el-option>
                                            </el-select>
                                        </el-col>
                                        <el-col :span="5" v-if="item.parentModel && item.parentModel.datatype.type === 'object'">
                                            <el-select v-model="item.id" :placeholder="$t('pleaseSelect')" size="small" @change="handleTriggerModelChange($event, index)">
                                                <el-option v-for="(subItem, subIndex) in item.parentModel.datatype.params" :key="subIndex" :label="subItem.name" :value="subItem.id"></el-option>
                                            </el-select>
                                        </el-col>
                                        <el-col :span="5" v-if="item.model && (item.model.datatype.type === 'integer' || item.model.datatype.type === 'decimal' || item.model.datatype.type === 'string')">
                                            <el-select v-model="item.operator" :placeholder="$t('scene.index.670805-20')" size="small">
                                                <el-option key="=" label="等于（=）" value="=" />
                                                <el-option key="!=" label="不等于（!=）" value="!=" />
                                                <el-option key=">" label="大于（>）" value=">" v-if="item.model.datatype.type === 'integer' || item.model.datatype.type === 'decimal'" />
                                                <el-option key="<" label="小于（<）" value="<" v-if="item.model.datatype.type === 'integer' || item.model.datatype.type === 'decimal'" />
                                                <el-option key=">=" label="大于等于（>=）" value=">=" v-if="item.model.datatype.type === 'integer' || item.model.datatype.type === 'decimal'" />
                                                <el-option key="<=" label="小于等于（<=）" value="<=" v-if="item.model.datatype.type === 'integer' || item.model.datatype.type === 'decimal'" />
                                                <el-option key="between" label="在...之间（between）" value="between" v-if="item.model.datatype.type === 'integer' || item.model.datatype.type === 'decimal'" />
                                                <el-option key="notBetween" label="不在...之间（notBetween）" value="notBetween" v-if="item.model.datatype.type === 'integer' || item.model.datatype.type === 'decimal'" />
                                                <el-option key="contain" label="包含（contain）" value="contain" v-if="item.model.datatype.type === 'string'" />
                                                <el-option key="notContain" label="不包含（notContain）" value="notContain" v-if="item.model.datatype.type === 'string'" />
                                            </el-select>
                                        </el-col>
                                        <el-col :span="9" v-if="item.model">
                                            <div v-if="item.model.datatype.type === 'integer' || item.model.datatype.type === 'decimal'" v-show="item.operator === 'between' || item.operator === 'notBetween'">
                                                <el-input
                                                    style="width: 95px; vertical-align: baseline"
                                                    @input="valueChange($event, item)"
                                                    v-model="item.valueA"
                                                    :placeholder="$t('scene.index.670805-21')"
                                                    :max="item.model.datatype.max"
                                                    :min="item.model.datatype.min"
                                                    type="number"
                                                    size="small"
                                                ></el-input>
                                                <span style="padding: 0 3px; color: #999">-</span>
                                                <el-input
                                                    style="width: 165px; vertical-align: baseline"
                                                    @input="valueChange($event, item)"
                                                    v-model="item.valueB"
                                                    :placeholder="$t('scene.index.670805-21')"
                                                    :max="item.model.datatype.max"
                                                    :min="item.model.datatype.min"
                                                    type="number"
                                                    size="small"
                                                >
                                                    <template slot="append">{{ item.model.datatype.unit }}</template>
                                                </el-input>
                                            </div>

                                            <div v-if="item.model.datatype.type === 'integer' || item.model.datatype.type === 'decimal'" v-show="item.operator !== 'between' && item.operator !== 'notBetween'">
                                                <el-input style="vertical-align: baseline" v-model="item.value" :placeholder="$t('scene.index.670805-21')" size="small">
                                                    <template slot="append">{{ item.model.datatype.unit }}</template>
                                                </el-input>
                                            </div>
                                            <div v-else-if="item.model.datatype.type === 'bool'">
                                                <el-switch
                                                    style="vertical-align: sub"
                                                    v-model="item.value"
                                                    :active-text="item.model.datatype.trueText"
                                                    :inactive-text="item.model.datatype.falseText"
                                                    active-value="1"
                                                    inactive-value="0"
                                                    size="mini"
                                                ></el-switch>
                                            </div>
                                            <div v-else-if="item.model.datatype.type === 'enum'">
                                                <el-select v-model="item.value" :placeholder="$t('pleaseSelect')" style="width: 100%" size="small">
                                                    <el-option v-for="(subItem, subIndex) in item.model.datatype.enumList" :key="subIndex + 'things'" :label="subItem.text" :value="subItem.value"></el-option>
                                                </el-select>
                                            </div>
                                            <div v-else-if="item.model.datatype.type === 'string'">
                                                <el-input v-model="item.value" :placeholder="$t('scene.index.670805-22')" size="small" :max="item.model.datatype.maxLength" />
                                            </div>
                                        </el-col>
                                    </el-row>
                                </div>
                            </div>
                            <div v-if="!(form.cond == 3 && formJson.triggers.length > 0)">
                                +
                                <a style="color: #409eff" @click="handleAddTrigger()">{{ $t('scene.index.670805-23') }}</a>
                            </div>
                        </el-form-item>
                    </div>

                    <el-divider></el-divider>
                    <div class="action-wrap">
                        <el-form-item :label="$t('scene.index.670805-24')">
                            <div class="item-wrap" style="background-color: #eef3f7">
                                <el-row :gutter="16">
                                    <el-col :span="8">
                                        <span>
                                            <el-tooltip class="item" effect="dark" :content="$t('scene.index.670805-25')" placement="top">
                                                <i class="el-icon-question"></i>
                                            </el-tooltip>
                                            {{ $t('scene.index.670805-26') }}
                                        </span>
                                        <el-input v-model="form.silentPeriod" size="small" :placeholder="$t('scene.index.670805-4')" type="number" style="width: 140px">
                                            <template slot="append">{{ $t('scene.index.670805-4') }}</template>
                                        </el-input>
                                    </el-col>
                                    <el-col :span="8">
                                        <span>{{ $t('scene.index.670805-27') }}</span>
                                        <el-select v-model="form.executeMode" :placeholder="$t('scene.index.670805-28')" size="small" style="width: 160px">
                                            <el-option key="1" :label="$t('scene.index.670805-29')" :value="1" />
                                            <el-option key="2" :label="$t('scene.index.670805-30')" :value="2" />
                                        </el-select>
                                    </el-col>
                                    <el-col :span="8">
                                        <span>
                                            <el-tooltip class="item" effect="dark" c:content="$t('scene.index.670805-31')" placement="top">
                                                <i class="el-icon-question"></i>
                                            </el-tooltip>
                                            {{ $t('scene.index.670805-32') }}
                                        </span>
                                        <el-input
                                            v-model="form.executeDelay"
                                            size="small"
                                            prop="executeDelay"
                                            :placeholder="$t('scene.index.670805-5')"
                                            :max="90"
                                            :min="0"
                                            oninput="if(value>90)value=90;if(value<0)value=0"
                                            type="number"
                                            style="width: 140px"
                                        >
                                            <template slot="append">{{ $t('scene.index.670805-5') }}</template>
                                        </el-input>
                                    </el-col>
                                </el-row>
                            </div>

                            <div class="item-wrap" v-for="(item, index) in formJson.actions" :key="index">
                                <el-row :gutter="16">
                                    <el-col :span="4">
                                        <el-select v-model="item.source" :placeholder="$t('pleaseSelect')" size="small" @change="handleActionSourceChange($event, index)">
                                            <el-option v-for="subItem in actionSource" :key="subItem.value" :label="subItem.label" :value="subItem.value"></el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="10" v-if="item.source == 1">
                                        <el-input readonly v-model="item.deviceCount" size="small" :placeholder="$t('scene.index.670805-33')" style="margin-top: 3px">
                                            <span slot="prepend" disabled>{{ $t('scene.index.670805-14') }}</span>
                                            <el-button slot="append" @click="handleSelectDevice('action', item, index)" size="small">{{ $t('scene.index.670805-34') }}</el-button>
                                        </el-input>
                                    </el-col>
                                    <el-col :span="10" v-if="item.source == 3">
                                        <el-input readonly v-model="item.productName" size="small" :placeholder="$t('scene.index.670805-35')" style="margin-top: 3px">
                                            <el-button slot="append" @click="handleSelectProduct('action', item, index)" size="small">{{ $t('scene.index.670805-36') }}</el-button>
                                        </el-input>
                                    </el-col>
                                    <el-col :span="10" v-if="item.source == 5">
                                        <el-input readonly v-model="item.name" size="small" :placeholder="$t('scene.index.670805-75')" style="margin-top: 3px">
                                            <el-button slot="append" @click="handleSelectRecoverScenes('action', item, index)" size="small">{{ $t('scene.index.670805-76') }}</el-button>
                                        </el-input>
                                    </el-col>
                                    <div class="delete-wrap">
                                        <el-button size="small" v-if="index != 0" plain type="danger" style="padding: 5px" icon="el-icon-delete" @click="handleRemoveAction(index)">{{ $t('del') }}</el-button>
                                    </div>
                                </el-row>

                                <div v-if="item.thingsModel">
                                    <!--类型和父级物模型-->
                                    <el-row :gutter="16">
                                        <el-col :span="5">
                                            <el-select v-model="item.type" :placeholder="$t('scene.index.670805-1')" size="small" @change="handleActionTypeChange($event, index)">
                                                <el-option v-for="(subItem, subIndex) in actionTypes" :key="subIndex + 'type'" :label="subItem.label" :value="subItem.value"></el-option>
                                            </el-select>
                                        </el-col>
                                        <el-col :span="10">
                                            <el-select
                                                style="width: 100%"
                                                v-model="item.parentId"
                                                :placeholder="$t('scene.index.670805-19')"
                                                v-if="item.type == 1"
                                                size="small"
                                                @change="handleActionParentModelChange($event, index)"
                                            >
                                                <el-option v-for="(subItem, subIndex) in item.thingsModel.properties" :key="subIndex + 'actionProperty'" :label="subItem.name" :value="subItem.id"></el-option>
                                            </el-select>
                                            <el-select
                                                style="width: 100%"
                                                v-model="item.parentId"
                                                :placeholder="$t('scene.index.670805-19')"
                                                v-else-if="item.type == 2"
                                                size="small"
                                                @change="handleActionParentModelChange($event, index)"
                                            >
                                                <el-option v-for="(subItem, subIndex) in item.thingsModel.functions" :key="subIndex + 'actionFunc'" :label="subItem.name" :value="subItem.id"></el-option>
                                            </el-select>
                                        </el-col>
                                    </el-row>

                                    <!--数组索引/物模型/值-->
                                    <el-row :gutter="16">
                                        <el-col :span="5" v-if="item.parentModel && item.parentModel.datatype.type === 'array'">
                                            <el-select v-model="item.arrayIndex" :placeholder="$t('pleaseSelect')" size="small" @change="handleActionIndexChange($event, index)">
                                                <el-option v-for="subItem in item.parentModel.datatype.arrayModel" :key="subItem.id" :label="subItem.name" :value="subItem.id"></el-option>
                                            </el-select>
                                        </el-col>
                                        <el-col :span="5" v-if="item.parentModel && item.parentModel.datatype.type === 'array' && item.parentModel.datatype.arrayType === 'object'">
                                            <el-select v-model="item.id" :placeholder="$t('pleaseSelect')" size="small" @change="handleActionModelChange($event, index)">
                                                <el-option v-for="(subItem, subIndex) in item.parentModel.datatype.params" :key="subIndex" :label="subItem.name" :value="subItem.id"></el-option>
                                            </el-select>
                                        </el-col>
                                        <el-col :span="5" v-if="item.parentModel && item.parentModel.datatype.type === 'object'">
                                            <el-select v-model="item.id" :placeholder="$t('pleaseSelect')" size="small" @change="handleActionModelChange($event, index)">
                                                <el-option v-for="(subItem, subIndex) in item.parentModel.datatype.params" :key="subIndex" :label="subItem.name" :value="subItem.id"></el-option>
                                            </el-select>
                                        </el-col>
                                        <el-col :span="10" v-if="item.model">
                                            <div v-if="item.model.datatype.type === 'integer' || item.model.datatype.type === 'decimal'">
                                                <el-input
                                                    style="vertical-align: baseline"
                                                    v-model="item.value"
                                                    :placeholder="$t('scene.index.670805-21')"
                                                    :max="item.model.datatype.max"
                                                    :min="item.model.datatype.min"
                                                    type="number"
                                                    size="small"
                                                >
                                                    <template slot="append">{{ item.model.datatype.unit }}</template>
                                                </el-input>
                                            </div>
                                            <div v-else-if="item.model.datatype.type === 'bool'">
                                                <el-switch
                                                    style="vertical-align: baseline"
                                                    v-model="item.value"
                                                    :active-text="item.model.datatype.trueText"
                                                    :inactive-text="item.model.datatype.falseText"
                                                    active-value="1"
                                                    inactive-value="0"
                                                ></el-switch>
                                            </div>
                                            <div v-else-if="item.model.datatype.type === 'enum'">
                                                <el-select v-model="item.value" :placeholder="$t('pleaseSelect')" style="width: 100%" size="small">
                                                    <el-option v-for="(subItem, subIndex) in item.model.datatype.enumList" :key="subIndex + 'things'" :label="subItem.text" :value="subItem.value"></el-option>
                                                </el-select>
                                            </div>
                                            <div v-else-if="item.model.datatype.type === 'string'">
                                                <el-input v-model="item.value" :placeholder="$t('scene.index.670805-22')" size="small" :max="item.model.datatype.maxLength" />
                                            </div>
                                        </el-col>
                                    </el-row>
                                </div>
                            </div>
                            <div>
                                +
                                <a style="color: #409eff" @click="handleAddAction()">{{ $t('scene.index.670805-37') }}</a>
                            </div>
                        </el-form-item>
                    </div>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="handleSubmitForm" :disabled="updateBtnDisabled" :loading="confirmLoading" v-hasPermi="['iot:scene:edit']" v-show="form.sceneId">{{ $t('update') }}</el-button>
                    <el-button type="primary" @click="handleSubmitForm" :disabled="updateBtnDisabled" :loading="confirmLoading" v-hasPermi="['iot:scene:add']" v-show="!form.sceneId">{{ $t('add') }}</el-button>
                    <el-button @click="cancel">{{ $t('cancel') }}</el-button>
                </div>
            </el-dialog>

            <el-dialog :title="title" :visible.sync="openLog" width="800px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
                <div
                    ref="logContainer"
                    v-loading="logLoading"
                    :element-loading-text="$t('script.349087-39')"
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                    style="border: 1px solid #ccc; border-radius: 5px; height: 500px; background-color: #181818; color: #fff; padding: 0 5px; line-height: 20px; overflow: auto"
                >
                    <pre>
            {{ logs }}
        </pre
                    >
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancelLog">{{ $t('script.349087-38') }}</el-button>
                </div>
            </el-dialog>
        </el-card>

        <!-- 设备列表 -->
        <deviceList ref="deviceList" @deviceEvent="getSelectProductDevice($event, 1)"></deviceList>
        <!-- 产品列表 -->
        <productList ref="productList" @productEvent="getSelectProductDevice($event, 2)"></productList>
        <!-- 选择场景对话框 -->
        <scene-list ref="sceneList" @sceneEvent="getSceneData($event)" />

        <!-- CRON表达式生成器 -->
        <el-dialog :title="$t('scene.index.670805-38')" :visible.sync="openCron" append-to-body destroy-on-close class="scrollbar">
            <crontab @hide="openCron = false" @fill="crontabFill" :expression="expression" style="padding-bottom: 10px"></crontab>
        </el-dialog>
    </div>
</template>

<script>
import { listScene, getScene, delScene, addScene, updateScene, runScene, openPublishLog, closePublishLog } from '@/api/iot/scene';
import { cacheJsonThingsModel } from '@/api/iot/model';
import Crontab from '@/components/Crontab';
import deviceList from './device-list';
import productList from './product-list';
import sceneList from './scene-list';
import AceEditor from '@/views/components/editor/editor.vue';

export default {
    name: 'scene',
    components: {
        AceEditor,
        deviceList,
        productList,
        sceneList,
        Crontab,
    },
    data() {
        return {
            // 确认按钮加载
            confirmLoading: false,
            // 更新按钮
            updateBtnDisabled: false,
            // 当前选择设备时的类型（trigger/action）
            currentType: null,
            // 当前选择设备时的类型索引
            currentIndex: null,
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
            // 场景联动表格数据
            sceneList: [],
            // 弹出层标题
            title: '',
            // 是否显示弹出层
            open: false,
            logs: '',
            logChainID: '',
            // 是否显示Cron表达式弹出层
            openCron: false,
            openLog: false,
            logLoading: false,
            // 传入的表达式
            expression: '',
            // 触发器的索引，用于接收传入的表达式
            triggerIndex: 0,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                sceneName: null,
                userId: null,
                userName: null,
            },
            timerWeeks: [
                {
                    value: 1,
                    label: this.$t('scene.index.670805-39'),
                },
                {
                    value: 2,
                    label: this.$t('scene.index.670805-40'),
                },
                {
                    value: 3,
                    label: this.$t('scene.index.670805-41'),
                },
                {
                    value: 4,
                    label: this.$t('scene.index.670805-42'),
                },
                {
                    value: 5,
                    label: this.$t('scene.index.670805-43'),
                },
                {
                    value: 6,
                    label: this.$t('scene.index.670805-44'),
                },
                {
                    value: 7,
                    label: this.$t('scene.index.670805-45'),
                },
            ],
            // 触发器源 1=设备，2=定时
            triggerSource: [
                {
                    value: 1,
                    label: this.$t('scene.index.670805-46'),
                },
                {
                    value: 2,
                    label: this.$t('scene.index.670805-47'),
                },
                {
                    value: 3,
                    label: this.$t('scene.index.670805-48'),
                },
                {
                    value: 4,
                    label: this.$t('scene.index.670805-49'),
                },
            ],
            // 触发器类别
            triggerTypes: [
                {
                    value: 1,
                    label: this.$t('scene.index.670805-50'),
                },
                {
                    value: 2,
                    label: this.$t('scene.index.670805-51'),
                },
                {
                    value: 3,
                    label: this.$t('scene.index.670805-52'),
                },
                {
                    value: 5,
                    label: this.$t('scene.index.670805-53'),
                },
                {
                    value: 6,
                    label: this.$t('scene.index.670805-54'),
                },
            ],
            // 动作源 1=设备，3=产品执行，4=告警执行，5=告警恢复
            actionSource: [
                {
                    value: 1,
                    label: this.$t('scene.index.670805-55'),
                },
                {
                    value: 3,
                    label: this.$t('scene.index.670805-56'),
                },
                {
                    value: 4,
                    label: this.$t('scene.index.670805-57'),
                },
                {
                    value: 5,
                    label: this.$t('scene.index.670805-58'),
                },
            ],
            // 动作类别
            actionTypes: [
                {
                    value: 1,
                    label: this.$t('scene.index.670805-50'),
                },
                {
                    value: 2,
                    label: this.$t('scene.index.670805-51'),
                },
            ],
            // 表单参数
            formJson: {
                triggers: [
                    {
                        // 时间
                        timerTimeValue: '',
                        // 星期
                        timerWeekValue: [1, 2, 3, 4, 5, 6, 7],
                    },
                ],
                actions: [],
            },
            form: {},
            // 表单校验
            rules: {
                sceneName: [
                    {
                        required: true,
                        message: this.$t('scene.index.670805-59'),
                        trigger: 'blur',
                    },
                ],
                executeDelay: [
                    {
                        required: true,
                        max: 90,
                        min: 0,
                        message: this.$t('scene.index.670805-60'),
                        trigger: 'blur',
                    },
                ],
                checkDelay: [
                    {
                        required: true,
                        max: 600,
                        min: 0,
                        message: this.$t('scene.index.670805-61'),
                        trigger: 'blur',
                    },
                ],
            },
        };
    },
    created() {
        this.connectMqtt();
        this.getList();
    },
    methods: {
        /* 连接Mqtt消息服务器 */
        async connectMqtt() {
            if (this.$mqttTool.client == null) {
                await this.$mqttTool.connect();
            }
            // 删除所有message事件监听器
            this.$mqttTool.client.removeAllListeners('message');
            // 添加message事件监听器
            this.mqttCallback();
        },
        /** 查询场景联动列表 */
        getList() {
            this.loading = true;
            listScene(this.queryParams).then((response) => {
                this.sceneList = response.rows;
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
                sceneId: null,
                recoverId: null,
                recoverSceneName: null,
                sceneName: null,
                userId: null,
                userName: null,
                remark: null,
                enable: 1,
                cond: 1,
                silentPeriod: 0,
                executeMode: 1,
                executeDelay: 0,
                checkDelay: 0,
                hasAlert: 2, // 1=包含告警，2=不包含告警
                applicationName: 'fastbee', // 固定值
            };
            this.formJson = {
                triggers: [
                    {
                        productId: 0,
                        productName: '',
                        deviceCount: 0,
                        deviceNums: [],
                        source: 1, //1=设备，2=定时，3=产品
                        type: 1, // 类型1=属性/2=功能，3=事件
                        parentId: '', // 物模父级id
                        parentName: '',
                        parentModel: null,
                        model: null,
                        operator: '',
                        id: '',
                        name: '',
                        value: '', // between操作符时，值=值A-值B
                        valueA: '',
                        valueB: '',
                        arrayIndex: '', // 索引，数组才有
                        arrayIndexName: '',
                        isAdvance: 0, // 自定义CRON
                        cronExpression: '', // cron表达式
                        timerTimeValue: '', // 时间
                        timerWeekValue: [1, 2, 3, 4, 5, 6, 7], // 星期
                        scriptPurpose: 3, // scriptPurpose:脚本用途(1=数据流，2=触发器，3=执行动作)
                    },
                ],
                actions: [
                    {
                        productId: 0,
                        productName: '',
                        deviceCount: 0,
                        deviceNums: [],
                        source: 1, //1=设备，3=产品，4=告警，5=告警恢复
                        type: 2, // 类型1=属性 /2=功能，3=事件
                        parentId: '', // 物模父级id
                        parentName: '',
                        parentModel: null, // 父级物模型
                        model: null, // 物模型
                        id: '',
                        name: '',
                        value: '',
                        arrayIndex: '', // 索引，数组才有
                        arrayIndexName: '',
                        scriptPurpose: 3, // scriptPurpose:脚本用途(1=数据流，2=触发器，3=执行动作)
                    },
                ],
            };
            this.confirmLoading = false;
            this.updateBtnDisabled = false;
            this.resetForm('form');
        },
        // 触发器中，选择between操作符，值是A值和B值用中划线分割
        valueChange(value, item) {
            item.value = item.valueA + '-' + item.valueB;
        },
        // 搜索按钮操作value,item
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },
        // 重置按钮操作
        handleResetQuery() {
            this.resetForm('queryForm');
            this.handleQuery();
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map((item) => item.sceneId);
            this.single = selection.length !== 1;
            this.multiple = !selection.length;
        },
        // 新增按钮操
        handleAdd() {
            this.reset();
            this.open = true;
            this.title = this.$t('scene.index.670805-62');
        },
        // 修改按钮操作
        handleUpdate(row) {
            this.reset();
            const sceneId = row.sceneId || this.ids;
            getScene(sceneId).then((response) => {
                this.form = response.data;
                // triggers赋值
                this.formJson.triggers = this.form.triggers;
                for (let i = 0; i < this.formJson.triggers.length; i++) {
                    // 定时
                    if (this.formJson.triggers[i].source == 2) {
                        if (this.formJson.triggers[i].isAdvance == 0) {
                            let arrayValue = this.formJson.triggers[i].cronExpression.substring(12).split(',').map(Number);
                            this.formJson.triggers[i].timerWeekValue = arrayValue;
                            let timerTimeValue = this.formJson.triggers[i].cronExpression.substring(5, 7) + ':' + this.formJson.triggers[i].cronExpression.substring(2, 4);
                            // 解决时间选择器不能编辑问题
                            this.$set(this.formJson.triggers[i], 'timerTimeValue', timerTimeValue);
                        }
                    } else if (this.formJson.triggers[i].source == 4) {
                    } else {
                        // 获取设备和物模型详情
                        this.formatSceneScript(this.formJson.triggers[i], i);
                    }
                }
                // actions赋值
                this.formJson.actions = this.form.actions;
                for (let i = 0; i < this.formJson.actions.length; i++) {
                    // 获取设备和物模型详情
                    this.formatSceneScript(this.formJson.actions[i], i);
                }
                // 按钮可用
                setTimeout(() => {
                    this.updateBtnDisabled = false;
                }, 2000);
                this.open = true;
                this.title = this.$t('scene.index.670805-63');
            });
        },
        /**
         * 格式化显示场景脚本（触发器和执行动作）
         * sceneScript:触发器或动作
         * sceneScript.scriptPurpose：脚本用途(1=数据流，2=触发器，3=执行动作)
         */
        formatSceneScript(sceneScript, index) {
            if (sceneScript.scriptPurpose == 2) {
                // 获取物模型
                cacheJsonThingsModel(sceneScript.productId).then((response) => {
                    let data = JSON.parse(response.data);
                    sceneScript.thingsModel = this.formatArrayIndex(data);
                    // value赋值，value=valueA-valueB
                    if (sceneScript.value.indexOf('-') != -1) {
                        let values = sceneScript.value.split('-');
                        sceneScript.valueA = values[0];
                        sceneScript.valueB = values[1];
                    }
                    let sceneScripts = [];
                    if (sceneScript.type == 1) {
                        // 属性
                        sceneScripts = sceneScript.thingsModel.properties;
                    } else if (sceneScript.type == 2) {
                        // 功能
                        sceneScripts = sceneScript.thingsModel.functions;
                    } else if (sceneScript.type == 3) {
                        // 事件
                        sceneScripts = sceneScript.thingsModel.events;
                    }
                    // 父级物模型和物模型赋值
                    this.setParentAndModelData(sceneScript, sceneScripts);
                    // 解决数组在界面中不更新问题
                    this.$set(this.formJson.triggers, index, this.formJson.triggers[index]);
                });
            } else if (sceneScript.scriptPurpose == 3) {
                // 执行告警，没有物模型
                if (sceneScript.source == 4 || sceneScript.source == 5) {
                    return;
                }
                // 获取物模型
                cacheJsonThingsModel(sceneScript.productId).then((response) => {
                    let data = JSON.parse(response.data);
                    sceneScript.thingsModel = this.formatArrayIndex(data);
                    // 过滤监测数据和只读数据
                    if (sceneScript.thingsModel.properties) {
                        sceneScript.thingsModel.properties = sceneScript.thingsModel.properties.filter((item) => item.isMonitor == 0 && item.isReadonly == 0);
                        for (let i = 0; i < sceneScript.thingsModel.properties.length; i++) {
                            if (sceneScript.thingsModel.properties[i].datatype.params) {
                                sceneScript.thingsModel.properties[i].datatype.params = sceneScript.thingsModel.properties[i].datatype.params.filter((item) => item.isReadonly == 0);
                            }
                        }
                    }
                    if (sceneScript.thingsModel.functions) {
                        sceneScript.thingsModel.functions = sceneScript.thingsModel.functions.filter((item) => item.isReadonly == 0);
                        for (let i = 0; i < sceneScript.thingsModel.functions.length; i++) {
                            if (sceneScript.thingsModel.functions[i].datatype.params) {
                                sceneScript.thingsModel.functions[i].datatype.params = sceneScript.thingsModel.functions[i].datatype.params.filter((item) => item.isReadonly == 0);
                            }
                        }
                    }

                    let sceneScripts = [];
                    if (sceneScript.type == 1) {
                        // 属性
                        sceneScripts = sceneScript.thingsModel.properties;
                    } else if (sceneScript.type == 2) {
                        // 功能
                        sceneScripts = sceneScript.thingsModel.functions;
                    }
                    // 父级物模型和物模型赋值
                    this.setParentAndModelData(sceneScript, sceneScripts);
                    // 解决数组在界面中不更新问题
                    this.$set(this.formJson.actions, index, this.formJson.actions[index]);
                });
            }
        },
        // 设置父级物模型和物模型值
        setParentAndModelData(sceneScript, sceneScripts) {
            for (let i = 0; i < sceneScripts.length; i++) {
                if (sceneScript.parentId == sceneScripts[i].id) {
                    sceneScript.parentModel = sceneScripts[i];
                    if (sceneScript.parentModel.datatype.type === 'object') {
                        // 对象类型，物模型赋值
                        for (let j = 0; j < sceneScript.parentModel.datatype.params.length; j++) {
                            if (sceneScript.id == sceneScript.parentModel.datatype.params[j].id) {
                                sceneScript.model = sceneScript.parentModel.datatype.params[j];
                            }
                        }
                    } else if (sceneScript.parentModel.datatype.arrayType === 'object' && sceneScript.parentModel.datatype.type === 'array') {
                        // 对象数组类型，物模型集合移除索引前缀
                        if (sceneScript.id.indexOf('array_') != -1) {
                            sceneScript.id = sceneScript.id.substring(9);
                        }
                        // 物模型赋值
                        for (let j = 0; j < sceneScript.parentModel.datatype.params.length; j++) {
                            if (sceneScript.id == sceneScript.parentModel.datatype.params[j].id) {
                                sceneScript.model = sceneScript.parentModel.datatype.params[j];
                            }
                        }
                    } else if (sceneScript.parentModel.datatype.arrayType !== 'object' && sceneScript.parentModel.datatype.type === 'array') {
                        // 普通数组类型，物模型集合移除索引前缀
                        if (sceneScript.id.indexOf('array_') != -1) {
                            sceneScript.id = sceneScript.id.substring(9);
                        }
                        sceneScript.model = {
                            datatype: {
                                type: sceneScript.parentModel.datatype.arrayType,
                                maxLength: -1,
                                min: -1,
                                max: -1,
                                unit: this.$t('scene.index.670805-64'),
                            },
                        };
                    } else {
                        // 普通类型
                        sceneScript.model = sceneScript.parentModel;
                    }
                    break;
                }
            }
        },
        // 删除按钮操作
        handleDelete(row) {
            const sceneIds = row.sceneId || this.ids;
            this.$modal
                .confirm(this.$t('scene.index.670805-65', [sceneIds]))
                .then(function () {
                    return delScene(sceneIds);
                })
                .then(() => {
                    this.getList();
                    this.$modal.msgSuccess(this.$t('scene.index.670805-66'));
                })
                .catch(() => {});
        },
        // 执行一次
        handleRun(data) {
            const params = { sceneId: data.sceneId };
            runScene(params).then((res) => {
                this.$modal.msgSuccess(res.msg);
            });
        },

        /* Mqtt回调处理  */
        mqttCallback() {
            this.$mqttTool.client.on('message', (topic, message, buffer) => {
                if (message instanceof Uint8Array) {
                    // 创建TextDecoder对象来转换Uint8Array到字符串
                    const decoder = new TextDecoder('utf-8');
                    const str = decoder.decode(message);
                    message = str; //转换后的字符串
                }
                console.log('🚀 ~ this.$mqttTool.client.on ~ message:', message);
                console.log('🚀 ~ this.$mqttTool.client.on ~ topic:', topic);
                if (topic.indexOf('/' + this.logChainID + '/ruleengine/test') != -1) {
                    message = JSON.parse(message.toString());
                    this.logs += '[' + message.time + ']' + '-' + '[' + message.requestId + ']:' + message.log + '\n';
                }
            });
        },
        handleLog(data) {
            this.logLoading = true;
            openPublishLog(data.chainName).then((response) => {
                this.openLog = true;
                this.title = this.$t('scene.index.670805-67');
                this.logLoading = false;
                this.logChainID = data.chainName;
                let topic = '/' + c + '/ruleengine/test';
                this.$mqttTool.subscribe(topic);
            });
        },
        // 取消日志按钮
        cancelLog() {
            this.logs = '';
            this.openLog = false;
            closePublishLog(this.logChainID).then((response) => {
                let topic = '/' + this.logChainID + '/ruleengine/test';
                this.$mqttTool.unsubscribe(topic);
                this.logChainID = '';
            });
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download(
                'iot/scene/export',
                {
                    ...this.queryParams,
                },
                `scene_${new Date().getTime()}.xlsx`
            );
        },
        // 触发器源改变事件
        handleTriggerSource(source, index) {
            this.formJson.triggers[index].deviceCount = 0;
            this.formJson.triggers[index].productId = '';
            this.formJson.triggers[index].productName = '';
            this.formJson.triggers[index].thingsModel = null;
            this.formJson.triggers[index].id = '';
            this.formJson.triggers[index].name = '';
            this.formJson.triggers[index].value = '';
            this.formJson.triggers[index].valueA = '';
            this.formJson.triggers[index].valueB = '';
            this.formJson.triggers[index].parentId = '';
            this.formJson.triggers[index].parentName = '';
            this.formJson.triggers[index].model = null;
            this.formJson.triggers[index].parentModel = null;
            this.formJson.triggers[index].operator = '';
            this.formJson.triggers[index].deviceNums = [];
            // 定时
            this.formJson.triggers[index].timerTimeValue = ''; // 时间
            this.formJson.triggers[index].timerWeekValue = [1, 2, 3, 4, 5, 6, 7]; // 星期
        },
        handleActionSourceChange(source, index) {
            console.log('this.formJson.actions[index]', this.formJson.actions[index]);
            this.formJson.actions[index].deviceCount = 0;
            this.formJson.actions[index].productId = '';
            this.formJson.actions[index].productName = '';
            this.formJson.actions[index].thingsModel = null;
            this.formJson.actions[index].id = '';
            this.formJson.actions[index].name = '';
            this.formJson.actions[index].value = '';
            this.formJson.actions[index].valueA = '';
            this.formJson.actions[index].valueB = '';
            this.formJson.actions[index].parentId = '';
            this.formJson.actions[index].parentName = '';
            this.formJson.actions[index].model = null;
            this.formJson.actions[index].parentModel = null;
            this.formJson.actions[index].operator = '';
            this.formJson.actions[index].deviceNums = [];
            // 定时
            this.formJson.actions[index].timerTimeValue = ''; // 时间
            this.formJson.actions[index].timerWeekValue = [1, 2, 3, 4, 5, 6, 7]; // 星期
        },
        /* 选择设备
         *  type : 'trigger','action'
         */
        handleSelectDevice(type, item, index) {
            this.currentType = type;
            this.currentIndex = index;
            // 刷新子组件
            this.$refs.deviceList.queryParams.pageNum = 1;
            this.$refs.deviceList.openDeviceList = true;
            this.$refs.deviceList.selectDeviceNums = item.deviceNums;
            this.$refs.deviceList.productId = item.productId;
            this.$refs.deviceList.productName = item.productName;
            this.$refs.deviceList.queryParams.productId = item.productId;
            this.$refs.deviceList.getList();
        },
        /**选择产品 */
        handleSelectProduct(type, item, index) {
            this.currentType = type;
            this.currentIndex = index;
            // 刷新子组建
            this.$refs.productList.queryParams.pageNum = 1;
            this.$refs.productList.open = true;
            this.$refs.productList.selectProductId = item.productId;
            this.$refs.productList.getList();
        },
        /**添加场景*/
        handleSelectRecoverScenes(type, item, index) {
            this.currentType = type;
            this.currentIndex = index;
            this.$refs.sceneList.queryParams.pageNum = 1;
            this.$refs.sceneList.openScene = true;
            this.$refs.sceneList.selectSceneId = item.id;
            this.$refs.sceneList.getList();
        },
        /**获取选中的产品或设备
         * type 1=设备集合，2=产品
         */
        getSelectProductDevice(data, type) {
            if (this.currentType == null) {
                return;
            }
            if (this.currentType == 'trigger') {
                if (type == 1) {
                    this.formJson.triggers[this.currentIndex].deviceNums = data.deviceNums;
                    this.formJson.triggers[this.currentIndex].deviceCount = data.deviceNums.length;
                    this.formJson.triggers[this.currentIndex].productId = data.productId;
                    this.formJson.triggers[this.currentIndex].productName = data.productName;
                } else if (type == 2) {
                    this.formJson.triggers[this.currentIndex].deviceNums = [];
                    this.formJson.triggers[this.currentIndex].deviceCount = 0;
                    this.formJson.triggers[this.currentIndex].productId = data.productId;
                    this.formJson.triggers[this.currentIndex].productName = data.productName;
                }

                // 获取物模型
                cacheJsonThingsModel(data.productId).then((response) => {
                    let data = JSON.parse(response.data);
                    this.formJson.triggers[this.currentIndex].thingsModel = this.formatArrayIndex(data);
                    // 清楚之前数据
                    this.formJson.triggers[this.currentIndex].type = 1;
                    this.formJson.triggers[this.currentIndex].parentId = '';
                    this.formJson.triggers[this.currentIndex].parentName = '';
                    this.formJson.triggers[this.currentIndex].parentModel = null;
                    this.formJson.triggers[this.currentIndex].model = null;
                    this.formJson.triggers[this.currentIndex].operator = '';
                    this.formJson.triggers[this.currentIndex].id = '';
                    this.formJson.triggers[this.currentIndex].name = '';
                    this.formJson.triggers[this.currentIndex].value = '';
                    this.formJson.triggers[this.currentIndex].arrayIndex = '';
                    this.formJson.triggers[this.currentIndex].arrayIndexName = '';
                    // 解决数组在界面中不更新问题
                    this.$set(this.formJson.triggers, this.currentIndex, this.formJson.triggers[this.currentIndex]);
                });
            } else if (this.currentType == 'action') {
                if (type == 1) {
                    this.formJson.actions[this.currentIndex].deviceNums = data.deviceNums;
                    this.formJson.actions[this.currentIndex].deviceCount = data.deviceNums.length;
                    this.formJson.actions[this.currentIndex].productId = data.productId;
                    this.formJson.actions[this.currentIndex].productName = data.productName;
                } else if (type == 2) {
                    this.formJson.actions[this.currentIndex].deviceNums = [];
                    this.formJson.actions[this.currentIndex].deviceCount = 0;
                    this.formJson.actions[this.currentIndex].productId = data.productId;
                    this.formJson.actions[this.currentIndex].productName = data.productName;
                }

                // 获取物模型
                cacheJsonThingsModel(data.productId).then((response) => {
                    let data = JSON.parse(response.data);
                    this.formJson.actions[this.currentIndex].thingsModel = this.formatArrayIndex(data);
                    // 清楚之前数据
                    this.formJson.actions[this.currentIndex].type = 1;
                    this.formJson.actions[this.currentIndex].parentId = '';
                    this.formJson.actions[this.currentIndex].parentModel = null;
                    this.formJson.actions[this.currentIndex].parentName = '';
                    this.formJson.actions[this.currentIndex].model = null;
                    this.formJson.actions[this.currentIndex].operator = '';
                    this.formJson.actions[this.currentIndex].id = '';
                    this.formJson.actions[this.currentIndex].name = '';
                    this.formJson.actions[this.currentIndex].value = '';
                    this.formJson.actions[this.currentIndex].arrayIndex = '';
                    this.formJson.actions[this.currentIndex].arrayIndexName = '';
                    // 过滤监测数据和只读数据
                    if (this.formJson.actions[this.currentIndex].thingsModel.properties) {
                        this.formJson.actions[this.currentIndex].thingsModel.properties = this.formJson.actions[this.currentIndex].thingsModel.properties.filter((item) => item.isMonitor == 0 && item.isReadonly == 0);
                        for (let i = 0; i < this.formJson.actions[this.currentIndex].thingsModel.properties.length; i++) {
                            if (this.formJson.actions[this.currentIndex].thingsModel.properties[i].datatype.params) {
                                this.formJson.actions[this.currentIndex].thingsModel.properties[i].datatype.params = this.formJson.actions[this.currentIndex].thingsModel.properties[i].datatype.params.filter(
                                    (item) => item.isMonitor == 0 && item.isReadonly == 0
                                );
                            }
                        }
                    }
                    if (this.formJson.actions[this.currentIndex].thingsModel.functions) {
                        this.formJson.actions[this.currentIndex].thingsModel.functions = this.formJson.actions[this.currentIndex].thingsModel.functions.filter((item) => item.isReadonly == 0);
                        for (let i = 0; i < this.formJson.actions[this.currentIndex].thingsModel.functions.length; i++) {
                            if (this.formJson.actions[this.currentIndex].thingsModel.functions[i].datatype.params) {
                                this.formJson.actions[this.currentIndex].thingsModel.functions[i].datatype.params = this.formJson.actions[this.currentIndex].thingsModel.functions[i].datatype.params.filter(
                                    (item) => item.isMonitor == 0 && item.isReadonly == 0
                                );
                            }
                        }
                    }
                    // 解决数组在界面中不更新问题
                    this.$set(this.formJson.actions, this.currentIndex, this.formJson.actions[this.currentIndex]);
                });
            }
        },
        getSceneData(data) {
            this.formJson.actions[this.currentIndex].id = data.sceneId;
            this.formJson.actions[this.currentIndex].name = data.sceneName;
        },
        // 物模型格式化处理
        formatArrayIndex(data) {
            let obj = { ...data };
            for (let o in obj) {
                obj[o] = obj[o].map((item) => {
                    if (item.datatype.type === 'array') {
                        let arrayModel = [];
                        for (let k = 0; k < item.datatype.arrayCount; k++) {
                            let index = k > 9 ? String(k) : '0' + k;
                            if (item.datatype.arrayType === 'object') {
                                arrayModel.push({
                                    id: index,
                                    name: item.name + ' ' + (k + 1),
                                });
                            } else {
                                arrayModel.push({
                                    id: index,
                                    name: item.name + ' ' + (k + 1),
                                });
                            }
                        }
                        item.datatype.arrayModel = arrayModel;
                    }
                    return item;
                });
            }
            return obj;
        },
        // 触发器类型改变事件
        handleTriggerTypeChange(source, index) {
            this.formJson.triggers[index].id = '';
            this.formJson.triggers[index].name = '';
            this.formJson.triggers[index].model = null;
            this.formJson.triggers[index].operator = '';
            this.formJson.triggers[index].value = '';
            this.formJson.triggers[index].valueA = '';
            this.formJson.triggers[index].valueB = '';
            this.formJson.triggers[index].parentId = '';
            this.formJson.triggers[index].parentName = '';
            this.formJson.triggers[index].parentModel = null;
            this.formJson.triggers[index].arrayIndex = '';
            this.formJson.triggers[index].arrayIndexName = '';
        },
        // 触发器父级物模型选择
        handleTriggerParentModelChange(identifier, index) {
            this.formJson.triggers[index].operator = '';
            this.formJson.triggers[index].value = '';
            this.formJson.triggers[index].valueA = '';
            this.formJson.triggers[index].valueB = '';
            this.formJson.triggers[index].arrayIndex = '';
            this.formJson.triggers[index].arrayIndexName = '';
            this.formJson.triggers[index].model = null;

            let sceneScripts = [];
            if (this.formJson.triggers[index].type == 1) {
                // 属性
                sceneScripts = this.formJson.triggers[index].thingsModel.properties;
            } else if (this.formJson.triggers[index].type == 2) {
                //功能
                sceneScripts = this.formJson.triggers[index].thingsModel.functions;
            } else if (this.formJson.triggers[index].type == 3) {
                //事件
                sceneScripts = this.formJson.triggers[index].thingsModel.events;
            }
            // 物模型赋值
            for (let i = 0; i < sceneScripts.length; i++) {
                if (sceneScripts[i].id == identifier) {
                    this.formJson.triggers[index].parentName = sceneScripts[i].name;
                    this.formJson.triggers[index].parentModel = sceneScripts[i];
                    if (sceneScripts[i].datatype.type === 'object') {
                        // 对象类型
                        this.formJson.triggers[index].id = '';
                        this.formJson.triggers[index].name = '';
                    } else if (sceneScripts[i].datatype.type === 'array' && sceneScripts[i].datatype.arrayType === 'object') {
                        // 对象数组类型
                        this.formJson.triggers[index].id = '';
                        this.formJson.triggers[index].name = '';
                    } else if (sceneScripts[i].datatype.type === 'array' && sceneScripts[i].datatype.arrayType !== 'object') {
                        // 普通类型，数组类
                        this.formJson.triggers[index].id = sceneScripts[i].id;
                        this.formJson.triggers[index].name = sceneScripts[i].name;
                        // 用于减少界面判断
                        this.formJson.triggers[index].model = {
                            datatype: {
                                type: this.formJson.triggers[index].parentModel.datatype.arrayType,
                                maxLength: -1,
                                min: -1,
                                max: -1,
                                unit: this.$t('scene.index.670805-64'),
                            },
                        };
                    } else {
                        // 普通类型,不包含数组类型
                        this.formJson.triggers[index].id = sceneScripts[i].id;
                        this.formJson.triggers[index].name = sceneScripts[i].name;
                        this.formJson.triggers[index].model = sceneScripts[i];
                    }
                    break;
                }
            }
        },
        // 触发器-物模数组索引选择
        handleTriggerIndexChange(id, index) {
            this.formJson.triggers[index].arrayIndexName = this.formJson.triggers[index].parentModel.datatype.arrayModel.find((x) => x.id == id).name;
            this.formJson.triggers[index].value = '';
            this.formJson.triggers[index].valueA = '';
            this.formJson.triggers[index].valueB = '';
            this.formJson.triggers[index].operator = '';
            // 数组类型保留id和name
            if (this.formJson.triggers[index].parentModel.datatype.arrayType === 'object') {
                this.formJson.triggers[index].id = '';
                this.formJson.triggers[index].name = '';
            }
        },
        // 触发器物模选择
        handleTriggerModelChange(id, index) {
            this.formJson.triggers[index].operator = '';
            this.formJson.triggers[index].value = '';
            this.formJson.triggers[index].valueA = '';
            this.formJson.triggers[index].valueB = '';
            let model = null;
            if (this.formJson.triggers[index].parentModel.datatype.type === 'array' || this.formJson.triggers[index].parentModel.datatype.type === 'object') {
                model = this.formJson.triggers[index].parentModel.datatype.params.find((item) => item.id == id);
                this.formJson.triggers[index].name = model.name;
                this.formJson.triggers[index].model = model;
            }
        },
        // 添加触发器
        handleAddTrigger() {
            this.formJson.triggers.push({
                source: 1, //1=设备，2=定时,3=产品
                type: 1, // 类型
                id: '',
                name: '',
                operator: '',
                value: '',
                // between操作符时，值=值A-值B
                valueA: '',
                valueB: '',
                model: null,
                parentModel: null,
                parentId: '', // 物模父级id
                parentName: '',
                arrayIndex: '', // 索引，数组才有
                arrayIndexName: '',
                isAdvance: 0, // 自定义CRON
                cronExpression: '', // cron表达式
                timerTimeValue: '', // 时间
                timerWeekValue: [1, 2, 3, 4, 5, 6, 7], // 星期
                productId: 0,
                productName: '',
                deviceNums: [],
                deviceCount: 0,
                scriptPurpose: 2, // scriptPurpose:脚本用途(1=数据流，2=触发器，3=执行动作)
            });
        },
        // 添加动作
        handleAddAction() {
            this.formJson.actions.push({
                source: 1, //1=设备，3=产品，4=告警
                type: 2, // 类型
                id: '',
                name: '',
                value: '',
                model: null,
                parentId: '', // 物模id
                parentName: '',
                parentModel: null,
                arrayIndex: '', // 索引，数组才有
                arrayIndexName: '',
                productId: 0,
                productName: '',
                deviceNums: [],
                deviceCount: 0,
                scriptPurpose: 3, // scriptPurpose:脚本用途(1=数据流，2=触发器，3=执行动作)
            });
        },
        // 删除触发器
        handleRemoveTrigger(index) {
            this.formJson.triggers.splice(index, 1);
        },
        // 删除动作
        handleRemoveAction(index) {
            this.formJson.actions.splice(index, 1);
        },
        /** cron表达式按钮操作 */
        handleShowCron(item, index) {
            this.expression = item.cronExpression;
            this.triggerIndex = index;
            this.openCron = true;
        },
        /** 确定后回传值 */
        crontabFill(value) {
            this.formJson.triggers[this.triggerIndex].cronExpression = value;
        },
        /** 星期改变事件 **/
        weekChange(data, index) {
            this.gentCronExpression(index);
        },
        /** 时间改变事件 **/
        timeChange(data, index) {
            this.gentCronExpression(index);
        },
        /**自定义cron表达式选项改变事件 */
        customerCronChange(data, index) {},
        /** 生成cron表达式**/
        gentCronExpression(index) {
            let hour = '00';
            let minute = '00';
            if (this.formJson.triggers[index].timerTimeValue != null && this.formJson.triggers[index].timerTimeValue != '') {
                hour = this.formJson.triggers[index].timerTimeValue.substring(0, 2);
                minute = this.formJson.triggers[index].timerTimeValue.substring(3);
            }
            let week = '*';
            if (this.formJson.triggers[index].timerWeekValue.length > 0) {
                let order = this.formJson.triggers[index].timerWeekValue.slice().sort();
                for (let i = 0; i < order.length; i++) {
                    if (order[i] != 7) {
                        order[i] = order[i] + 1;
                    } else {
                        order[i] = 1;
                    }
                }
                console.log(order);
                week = order;
                //week = this.formJson.triggers[index].timerWeekValue.sort();
                console.log(week);
            }
            this.formJson.triggers[index].cronExpression = '0 ' + minute + ' ' + hour + ' ? * ' + week;
        },
        // 动作类型改变事件
        handleActionTypeChange(data, index) {
            this.formJson.actions[index].id = '';
            this.formJson.actions[index].name = '';
            this.formJson.actions[index].value = '';
            this.formJson.actions[index].model = null;
            this.formJson.actions[index].parentId = '';
            this.formJson.actions[index].parentName = '';
            this.formJson.actions[index].arrayIndex = '';
            this.formJson.actions[index].arrayIndexName = '';
            this.formJson.actions[index].parentModel = null;
        },
        // 动作物模型项改变事件
        handleActionParentModelChange(identifier, index) {
            this.formJson.actions[index].model = null;
            this.formJson.actions[index].value = '';
            this.formJson.actions[index].arrayIndex = '';
            this.formJson.actions[index].arrayIndexName = '';

            let sceneScripts = [];
            if (this.formJson.actions[index].type == 1) {
                //属性
                sceneScripts = this.formJson.actions[index].thingsModel.properties;
            } else if (this.formJson.actions[index].type == 2) {
                //功能
                sceneScripts = this.formJson.actions[index].thingsModel.functions;
            }
            for (let i = 0; i < sceneScripts.length; i++) {
                if (sceneScripts[i].id == identifier) {
                    this.formJson.actions[index].parentName = sceneScripts[i].name;
                    this.formJson.actions[index].parentModel = sceneScripts[i];
                    if (sceneScripts[i].datatype.type === 'object') {
                        // 对象类型
                        this.formJson.actions[index].id = '';
                        this.formJson.actions[index].name = '';
                    } else if (sceneScripts[i].datatype.type === 'array' && sceneScripts[i].datatype.arrayType === 'object') {
                        // 对象数组类型
                        this.formJson.actions[index].id = '';
                        this.formJson.actions[index].name = '';
                    } else if (sceneScripts[i].datatype.type === 'array' && sceneScripts[i].datatype.arrayType !== 'object') {
                        // 普通类型，数组类
                        this.formJson.actions[index].id = sceneScripts[i].id;
                        this.formJson.actions[index].name = sceneScripts[i].name;
                        // 用于减少界面判断
                        this.formJson.actions[index].model = {
                            datatype: {
                                type: this.formJson.actions[index].parentModel.datatype.arrayType,
                                maxLength: -1,
                                min: -1,
                                max: -1,
                                unit: this.$t('scene.index.670805-64'),
                            },
                        };
                    } else {
                        // 普通类型,不包含数组类型
                        this.formJson.actions[index].id = sceneScripts[i].id;
                        this.formJson.actions[index].name = sceneScripts[i].name;
                        this.formJson.actions[index].model = sceneScripts[i];
                    }
                    break;
                }
            }
        },
        // 执行动作物模型数组索引选择
        handleActionIndexChange(id, index) {
            this.formJson.actions[index].arrayIndexName = this.formJson.actions[index].parentModel.datatype.arrayModel.find((x) => x.id == id).name;
            this.formJson.actions[index].value = '';
            this.formJson.actions[index].valueA = '';
            this.formJson.actions[index].valueB = '';
            this.formJson.actions[index].operator = '';
            // 数组类型保留id和name
            if (this.formJson.actions[index].parentModel.datatype.arrayType === 'object') {
                this.formJson.actions[index].id = '';
                this.formJson.actions[index].name = '';
            }
        },
        // 执行动作物模型选择
        handleActionModelChange(id, index) {
            this.formJson.actions[index].operator = '';
            this.formJson.actions[index].value = '';
            let model = null;
            if (this.formJson.actions[index].parentModel.datatype.type === 'array' || this.formJson.actions[index].parentModel.datatype.type === 'object') {
                model = this.formJson.actions[index].parentModel.datatype.params.find((item) => item.id == id);
                this.formJson.actions[index].name = model.name;
                this.formJson.actions[index].model = model;
            }
        },
        // 提交按钮
        handleSubmitForm() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    let triggers = [];
                    let actions = [];
                    // 触发器验证和构建
                    for (let i = 0; i < this.formJson.triggers.length; i++) {
                        // 类型为属性/功能/事件
                        if (this.formJson.triggers[i].type == 1 || this.formJson.triggers[i].type == 2 || this.formJson.triggers[i].type == 3) {
                            // 值不能为空
                            if (this.formJson.triggers[i].source == 1) {
                                if (this.formJson.triggers[i].value == '') {
                                    this.$modal.alertError(this.$t('scene.index.670805-67'));
                                    return;
                                } else if (this.formJson.triggers[i].value.indexOf('-') != -1) {
                                    // 区间格式10-50
                                    if (this.formJson.triggers[i].valueA == '' || this.formJson.triggers[i].valueB == '') {
                                        this.$modal.alertError(this.$t('scene.index.670805-68'));
                                        return;
                                    }
                                }
                            }
                            // 定时时间不能为空
                            if (this.formJson.triggers[i].source == 2) {
                                if (this.formJson.triggers[i].isAdvance == 0) {
                                    if (this.formJson.triggers[i].timerTimeValue == '' || this.formJson.triggers[i].timerTimeValue == null) {
                                        this.$modal.alertError(this.$t('scene.index.670805-69'));
                                        return;
                                    }
                                    if (this.formJson.triggers[i].timerWeekValue == null || this.formJson.triggers[i].timerWeekValue == '') {
                                        this.$modal.alertError(this.$t('scene.index.670805-70'));
                                        return;
                                    }
                                } else if (this.formJson.triggers[i].isAdvance == 1) {
                                    if (this.formJson.triggers[i].cronExpression == '') {
                                        this.$modal.alertError(this.$t('scene.index.670805-71'));
                                        return;
                                    }
                                }
                            }
                        }
                        // 数据重组
                        let item = this.formJson.triggers[i];
                        // id拼接array索引
                        if (item.arrayIndex != '') {
                            item.id = 'array_' + item.arrayIndex + '_' + item.id;
                        }
                        // 只传需要的数据
                        triggers[i] = {
                            productId: item.productId,
                            productName: item.productName,
                            deviceNums: item.deviceNums,
                            deviceCount: item.deviceCount,
                            source: item.source,
                            type: item.type,
                            id: item.id,
                            name: item.name,
                            operator: item.operator,
                            value: item.value,
                            isAdvance: item.isAdvance,
                            cronExpression: item.cronExpression,
                            parentId: item.parentId,
                            parentName: item.parentName,
                            arrayIndex: item.arrayIndex,
                            arrayIndexName: item.arrayIndexName,
                            scriptPurpose: 2, // scriptPurpose:脚本用途(1=数据流，2=触发器，3=执行动作)
                        };
                    }
                    // 动作验证和构建
                    for (let i = 0; i < this.formJson.actions.length; i++) {
                        if (this.formJson.actions[i].value === '' && this.formJson.actions[i].source !== 4 && this.formJson.actions[i].source !== 5) {
                            this.$modal.alertError(this.$t('scene.index.670805-72'));
                            return;
                        }
                        // 数据重组
                        let item = this.formJson.actions[i];
                        // id拼接array索引
                        if (item.arrayIndex != '') {
                            item.id = 'array_' + item.arrayIndex + '_' + item.id;
                        }
                        // 只传需要的数据
                        actions[i] = {
                            productId: item.productId,
                            productName: item.productName,
                            deviceCount: item.deviceCount,
                            source: item.source,
                            deviceNums: item.deviceNums,
                            type: item.type,
                            id: item.id,
                            name: item.name,
                            value: item.value,
                            parentId: item.parentId,
                            parentName: item.parentName,
                            arrayIndex: item.arrayIndex,
                            arrayIndexName: item.arrayIndexName,
                            scriptPurpose: 3, // scriptPurpose:脚本用途(1=数据流，2=触发器，3=执行动作)
                        };
                    }
                    // 判断是否包含告警(1=包含，2=不包含)
                    if (actions.filter((x) => x.source === 4).length > 0) {
                        this.form.hasAlert = 1;
                    } else {
                        this.form.hasAlert = 2;
                    }
                    this.form.triggers = triggers;
                    this.form.actions = actions;
                    this.confirmLoading = true;
                    if (this.form.sceneId != null) {
                        updateScene(this.form).then(() => {
                            this.$modal.msgSuccess(this.$t('scene.index.670805-73'));
                            this.open = false;
                            this.confirmLoading = false;
                            this.getList();
                        });
                    } else {
                        addScene(this.form).then(() => {
                            this.$modal.msgSuccess(this.$t('scene.index.670805-74'));
                            this.open = false;
                            this.confirmLoading = false;
                            this.getList();
                        });
                    }
                }
            });
        },
    },
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/tableView.scss';
.scene-wrap {
    padding: 6px;

    .search-wrap {
        margin-bottom: 6px;
    }

    .content-wrap {
        padding-bottom: 100px;
    }
}

.scene-config-dialog {
    .condition-wrap,
    .action-wrap {
        position: relative;

        .trigger-type-wrap {
            margin-bottom: 10px;

            ::v-deep .el-input__inner {
                /**border: none;*/
                box-shadow: none;
            }
        }

        .item-wrap {
            margin-bottom: 15px;
            padding: 10px;
            background-color: #d9e5f6;
            border-radius: 5px;

            .delete-wrap {
                position: absolute;
                right: 10px;
                top: 0;
            }
        }
    }
}
</style>
