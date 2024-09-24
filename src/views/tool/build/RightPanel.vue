<template>
  <div class="right-board">
    <el-tabs v-model="currentTab" class="center-tabs">
      <el-tab-pane :label="$t('build.index.2090840-20')" name="field"/>
      <el-tab-pane :label="$t('build.index.2090840-21')" name="form"/>
    </el-tabs>
    <div class="field-box">
      <a class="document-link" target="_blank" :href="documentLink" :title="$t('build.index.2090840-22')">
        <i class="el-icon-link"/>
      </a>
      <el-scrollbar class="right-scrollbar">
        <!-- 组件属性 -->
        <el-form v-show="currentTab === 'field' && showField" size="small" label-width="90px">
          <el-form-item v-if="activeData.changeTag" :label="$t('build.index.2090840-23')">
            <el-select v-model="activeData.tagIcon" :placeholder="$t('build.index.2090840-24')"
                       :style="{ width: '100%' }" @change="tagChange">
              <el-option-group v-for="group in tagList" :key="group.label" :label="group.label">
                <el-option v-for="item in group.options" :key="item.label" :label="item.label" :value="item.tagIcon">
                  <svg-icon class="node-icon" :icon-class="item.tagIcon"/>
                  <span> {{ item.label }}</span>
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
          <el-form-item v-if="activeData.vModel !== undefined" :label="$t('build.index.2090840-25')">
            <el-input v-model="activeData.vModel" :placeholder="$t('build.index.2090840-26')"/>
          </el-form-item>
          <el-form-item v-if="activeData.componentName !== undefined" :label="$t('build.index.2090840-27')">
            {{ activeData.componentName }}
          </el-form-item>
          <el-form-item v-if="activeData.label !== undefined" :label="$t('build.index.2090840-28')">
            <el-input v-model="activeData.label" :placeholder="$t('build.index.2090840-29')"/>
          </el-form-item>
          <el-form-item v-if="activeData.placeholder !== undefined" :label="$t('build.index.2090840-30')">
            <el-input v-model="activeData.placeholder" :placeholder="$t('build.index.2090840-31')"/>
          </el-form-item>
          <el-form-item v-if="activeData['start-placeholder'] !== undefined" :label="$t('build.index.2090840-32')">
            <el-input v-model="activeData['start-placeholder']" :placeholder="$t('build.index.2090840-31')"/>
          </el-form-item>
          <el-form-item v-if="activeData['end-placeholder'] !== undefined" :label="$t('build.index.2090840-33')">
            <el-input v-model="activeData['end-placeholder']" :placeholder="$t('build.index.2090840-31')"/>
          </el-form-item>
          <el-form-item v-if="activeData.span !== undefined" :label="$t('build.index.2090840-34')">
            <el-slider v-model="activeData.span" :max="24" :min="1" :marks="{ 12: '' }" @change="spanChange"/>
          </el-form-item>
          <el-form-item v-if="activeData.layout === 'rowFormItem'" :label="$t('build.index.2090840-35')">
            <el-input-number v-model="activeData.gutter" :min="0" :placeholder="$t('build.index.2090840-35')"/>
          </el-form-item>
          <el-form-item v-if="activeData.layout === 'rowFormItem'" :label="$t('build.index.2090840-36')">
            <el-radio-group v-model="activeData.type">
              <el-radio-button label="default"/>
              <el-radio-button label="flex"/>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="activeData.justify !== undefined && activeData.type === 'flex'"
                        :label="$t('build.index.2090840-37')">
            <el-select v-model="activeData.justify" :placeholder="$t('build.index.2090840-38')"
                       :style="{ width: '100%' }">
              <el-option v-for="(item, index) in justifyOptions" :key="index" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item v-if="activeData.align !== undefined && activeData.type === 'flex'"
                        :label="$t('build.index.2090840-39')">
            <el-radio-group v-model="activeData.align">
              <el-radio-button label="top"/>
              <el-radio-button label="middle"/>
              <el-radio-button label="bottom"/>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="activeData.labelWidth !== undefined" :label="$t('build.index.2090840-39')">
            <el-input v-model.number="activeData.labelWidth" type="number"
                      :placeholder="$t('build.index.2090840-40')"/>
          </el-form-item>
          <el-form-item v-if="activeData.style && activeData.style.width !== undefined"
                        :label="$t('build.index.2090840-41')">
            <el-input v-model="activeData.style.width" :placeholder="$t('build.index.2090840-42')" clearable/>
          </el-form-item>
          <el-form-item v-if="activeData.vModel !== undefined" :label="$t('build.index.2090840-43')">
            <el-input :value="setDefaultValue(activeData.defaultValue)" :placeholder="$t('build.index.2090840-44')"
                      @input="onDefaultValueInput"/>
          </el-form-item>
          <el-form-item v-if="activeData.tag === 'el-checkbox-group'" :label="$t('build.index.2090840-45')">
            <el-input-number :value="activeData.min" :min="0" :placeholder="$t('build.index.2090840-45')"
                             @input="$set(activeData, 'min', $event ? $event : undefined)"/>
          </el-form-item>
          <el-form-item v-if="activeData.tag === 'el-checkbox-group'" :label="$t('build.index.2090840-46')">
            <el-input-number :value="activeData.max" :min="0" :placeholder="$t('build.index.2090840-46')"
                             @input="$set(activeData, 'max', $event ? $event : undefined)"/>
          </el-form-item>
          <el-form-item v-if="activeData.prepend !== undefined" :label="$t('build.index.2090840-47')">
            <el-input v-model="activeData.prepend" :placeholder="$t('build.index.2090840-48')"/>
          </el-form-item>
          <el-form-item v-if="activeData.append !== undefined" :label="$t('build.index.2090840-49')">
            <el-input v-model="activeData.append" :placeholder="$t('build.index.2090840-50')"/>
          </el-form-item>
          <el-form-item v-if="activeData['prefix-icon'] !== undefined" :label="$t('build.index.2090840-51')">
            <el-input v-model="activeData['prefix-icon']" :placeholder="$t('build.index.2090840-52')">
              <el-button slot="append" icon="el-icon-thumb" @click="openIconsDialog('prefix-icon')">
                {{ $t('select') }}
              </el-button>
            </el-input>
          </el-form-item>
          <el-form-item v-if="activeData['suffix-icon'] !== undefined" :label="$t('build.index.2090840-53')">
            <el-input v-model="activeData['suffix-icon']" :placeholder="$t('build.index.2090840-54')">
              <el-button slot="append" icon="el-icon-thumb" @click="openIconsDialog('suffix-icon')">
                {{ $t('select') }}
              </el-button>
            </el-input>
          </el-form-item>
          <el-form-item v-if="activeData.tag === 'el-cascader'" :label="$t('build.index.2090840-55')">
            <el-input v-model="activeData.separator" :placeholder="$t('build.index.2090840-56')"/>
          </el-form-item>
          <el-form-item v-if="activeData.autosize !== undefined" :label="$t('build.index.2090840-57')">
            <el-input-number v-model="activeData.autosize.minRows" :min="1"
                             :placeholder="$t('build.index.2090840-57')"/>
          </el-form-item>
          <el-form-item v-if="activeData.autosize !== undefined" :label="$t('build.index.2090840-58')">
            <el-input-number v-model="activeData.autosize.maxRows" :min="1"
                             :placeholder="$t('build.index.2090840-58')"/>
          </el-form-item>
          <el-form-item v-if="activeData.min !== undefined" :label="$t('build.index.2090840-59')">
            <el-input-number v-model="activeData.min" :placeholder="$t('build.index.2090840-59')"/>
          </el-form-item>
          <el-form-item v-if="activeData.max !== undefined" :label="$t('build.index.2090840-60')">
            <el-input-number v-model="activeData.max" :placeholder="$t('build.index.2090840-60')"/>
          </el-form-item>
          <el-form-item v-if="activeData.step !== undefined" :label="$t('build.index.2090840-61')">
            <el-input-number v-model="activeData.step" :placeholder="$t('build.index.2090840-62')"/>
          </el-form-item>
          <el-form-item v-if="activeData.tag === 'el-input-number'" :label="$t('build.index.2090840-63')">
            <el-input-number v-model="activeData.precision" :min="0" :placeholder="$t('build.index.2090840-63')"/>
          </el-form-item>
          <el-form-item v-if="activeData.tag === 'el-input-number'" :label="$t('build.index.2090840-64')">
            <el-radio-group v-model="activeData['controls-position']">
              <el-radio-button label="">
                {{ $t('build.index.2090840-65') }}
              </el-radio-button>
              <el-radio-button label="right">
                {{ $t('build.index.2090840-66') }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="activeData.maxlength !== undefined" :label="$t('build.index.2090840-67')">
            <el-input v-model="activeData.maxlength" :placeholder="$t('build.index.2090840-68')">
              <template slot="append">
                {{ $t('build.index.2090840-69') }}
              </template>
            </el-input>
          </el-form-item>
          <el-form-item v-if="activeData['active-text'] !== undefined" :label="$t('build.index.2090840-70')">
            <el-input v-model="activeData['active-text']" :placeholder="$t('build.index.2090840-71')"/>
          </el-form-item>
          <el-form-item v-if="activeData['inactive-text'] !== undefined" :label="$t('build.index.2090840-72')">
            <el-input v-model="activeData['inactive-text']" :placeholder="$t('build.index.2090840-73')"/>
          </el-form-item>
          <el-form-item v-if="activeData['active-value'] !== undefined" :label="$t('build.index.2090840-74')">
            <el-input :value="setDefaultValue(activeData['active-value'])" :placeholder="$t('build.index.2090840-75')"
                      @input="onSwitchValueInput($event, 'active-value')"/>
          </el-form-item>
          <el-form-item v-if="activeData['inactive-value'] !== undefined" :label="$t('build.index.2090840-76')">
            <el-input :value="setDefaultValue(activeData['inactive-value'])" :placeholder="$t('build.index.2090840-77')"
                      @input="onSwitchValueInput($event, 'inactive-value')"/>
          </el-form-item>
          <el-form-item v-if="activeData.type !== undefined && 'el-date-picker' === activeData.tag"
                        :label="$t('build.index.2090840-78')">
            <el-select v-model="activeData.type" :placeholder="$t('build.index.2090840-79')" :style="{ width: '100%' }"
                       @change="dateTypeChange">
              <el-option v-for="(item, index) in dateOptions" :key="index" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item v-if="activeData.name !== undefined" :label="$t('build.index.2090840-80')">
            <el-input v-model="activeData.name" :placeholder="$t('build.index.2090840-81')"/>
          </el-form-item>
          <el-form-item v-if="activeData.accept !== undefined" :label="$t('build.index.2090840-82')">
            <el-select v-model="activeData.accept" :placeholder="$t('build.index.2090840-83')"
                       :style="{ width: '100%' }" clearable>
              <el-option :label="$t('build.index.2090840-84')" value="image/*"/>
              <el-option :label="$t('build.index.2090840-85')" value="video/*"/>
              <el-option :label="$t('build.index.2090840-86')" value="audio/*"/>
              <el-option label="excel" value=".xls,.xlsx"/>
              <el-option label="word" value=".doc,.docx"/>
              <el-option label="pdf" value=".pdf"/>
              <el-option label="txt" value=".txt"/>
            </el-select>
          </el-form-item>
          <el-form-item v-if="activeData.fileSize !== undefined" :label="$t('build.index.2090840-87')">
            <el-input v-model.number="activeData.fileSize" :placeholder="$t('build.index.2090840-88')">
              <el-select slot="append" v-model="activeData.sizeUnit" :style="{ width: '66px' }">
                <el-option label="KB" value="KB"/>
                <el-option label="MB" value="MB"/>
                <el-option label="GB" value="GB"/>
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item v-if="activeData.action !== undefined" :label="$t('build.index.2090840-89')">
            <el-input v-model="activeData.action" :placeholder="$t('build.index.2090840-90')" clearable/>
          </el-form-item>
          <el-form-item v-if="activeData['list-type'] !== undefined" :label="$t('build.index.2090840-91')">
            <el-radio-group v-model="activeData['list-type']" size="small">
              <el-radio-button label="text">
                text
              </el-radio-button>
              <el-radio-button label="picture">
                picture
              </el-radio-button>
              <el-radio-button label="picture-card">
                picture-card
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="activeData.buttonText !== undefined" v-show="'picture-card' !== activeData['list-type']"
                        :label="$t('build.index.2090840-92')">
            <el-input v-model="activeData.buttonText" :placeholder="$t('build.index.2090840-93')"/>
          </el-form-item>
          <el-form-item v-if="activeData['range-separator'] !== undefined" :label="$t('build.index.2090840-94')">
            <el-input v-model="activeData['range-separator']" :placeholder="$t('build.index.2090840-95')"/>
          </el-form-item>
          <el-form-item v-if="activeData['picker-options'] !== undefined" :label="$t('build.index.2090840-96')">
            <el-input v-model="activeData['picker-options'].selectableRange"
                      :placeholder="$t('build.index.2090840-97')"/>
          </el-form-item>
          <el-form-item v-if="activeData.format !== undefined" :label="$t('build.index.2090840-98')">
            <el-input :value="activeData.format" :placeholder="$t('build.index.2090840-99')"
                      @input="setTimeValue($event)"/>
          </el-form-item>
          <template v-if="['el-checkbox-group', 'el-radio-group', 'el-select'].indexOf(activeData.tag) > -1">
            <el-divider>{{ $t('build.index.2090840-100') }}</el-divider>
            <draggable :list="activeData.options" :animation="340" group="selectItem" handle=".option-drag">
              <div v-for="(item, index) in activeData.options" :key="index" class="select-item">
                <div class="select-line-icon option-drag">
                  <i class="el-icon-s-operation"/>
                </div>
                <el-input v-model="item.label" :placeholder="$t('build.index.2090840-101')" size="small"/>
                <el-input :placeholder="$t('build.index.2090840-102')" size="small" :value="item.value"
                          @input="setOptionValue(item, $event)"/>
                <div class="close-btn select-line-icon" @click="activeData.options.splice(index, 1)">
                  <i class="el-icon-remove-outline"/>
                </div>
              </div>
            </draggable>
            <div style="margin-left: 20px;">
              <el-button style="padding-bottom: 0" icon="el-icon-circle-plus-outline" type="text"
                         @click="addSelectItem">
                {{ $t('build.index.2090840-103') }}
              </el-button>
            </div>
            <el-divider/>
          </template>

          <template v-if="['el-cascader'].indexOf(activeData.tag) > -1">
            <el-divider>{{ $t('build.index.2090840-100') }}</el-divider>
            <el-form-item :label="$t('build.index.2090840-104')">
              <el-radio-group v-model="activeData.dataType" size="small">
                <el-radio-button label="dynamic">
                  {{ $t('build.index.2090840-105') }}
                </el-radio-button>
                <el-radio-button label="static">
                  {{ $t('build.index.2090840-106') }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>

            <template v-if="activeData.dataType === 'dynamic'">
              <el-form-item :label="$t('build.index.2090840-107')">
                <el-input v-model="activeData.labelKey" :placeholder="$t('build.index.2090840-108')"/>
              </el-form-item>
              <el-form-item :label="$t('build.index.2090840-109')">
                <el-input v-model="activeData.valueKey" :placeholder="$t('build.index.2090840-110')"/>
              </el-form-item>
              <el-form-item :label="$t('build.index.2090840-111')">
                <el-input v-model="activeData.childrenKey" :placeholder="$t('build.index.2090840-112')"/>
              </el-form-item>
            </template>

            <el-tree v-if="activeData.dataType === 'static'" draggable :data="activeData.options" node-key="id"
                     :expand-on-click-node="false" :render-content="renderContent"/>
            <div v-if="activeData.dataType === 'static'" style="margin-left: 20px">
              <el-button style="padding-bottom: 0" icon="el-icon-circle-plus-outline" type="text" @click="addTreeItem">
                {{ $t('build.index.2090840-113') }}
              </el-button>
            </div>
            <el-divider/>
          </template>

          <el-form-item v-if="activeData.optionType !== undefined" :label="$t('build.index.2090840-114')">
            <el-radio-group v-model="activeData.optionType">
              <el-radio-button label="default">
                {{ $t('build.index.2090840-115') }}
              </el-radio-button>
              <el-radio-button label="button">
                {{ $t('build.index.2090840-116') }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="activeData['active-color'] !== undefined" :label="$t('build.index.2090840-117')">
            <el-color-picker v-model="activeData['active-color']"/>
          </el-form-item>
          <el-form-item v-if="activeData['inactive-color'] !== undefined" :label="$t('build.index.2090840-118')">
            <el-color-picker v-model="activeData['inactive-color']"/>
          </el-form-item>

          <el-form-item v-if="activeData['allow-half'] !== undefined" :label="$t('build.index.2090840-119')">
            <el-switch v-model="activeData['allow-half']"/>
          </el-form-item>
          <el-form-item v-if="activeData['show-text'] !== undefined" :label="$t('build.index.2090840-120')">
            <el-switch v-model="activeData['show-text']" @change="rateTextChange"/>
          </el-form-item>
          <el-form-item v-if="activeData['show-score'] !== undefined" :label="$t('build.index.2090840-121')">
            <el-switch v-model="activeData['show-score']" @change="rateScoreChange"/>
          </el-form-item>
          <el-form-item v-if="activeData['show-stops'] !== undefined" :label="$t('build.index.2090840-122')">
            <el-switch v-model="activeData['show-stops']"/>
          </el-form-item>
          <el-form-item v-if="activeData.range !== undefined" :label="$t('build.index.2090840-123')">
            <el-switch v-model="activeData.range" @change="rangeChange"/>
          </el-form-item>
          <el-form-item v-if="activeData.border !== undefined && activeData.optionType === 'default'"
                        :label="$t('build.index.2090840-124')">
            <el-switch v-model="activeData.border"/>
          </el-form-item>
          <el-form-item v-if="activeData.tag === 'el-color-picker'" :label="$t('build.index.2090840-125')">
            <el-select v-model="activeData['color-format']" :placeholder="$t('build.index.2090840-126')"
                       :style="{ width: '100%' }" @change="colorFormatChange">
              <el-option v-for="(item, index) in colorFormatOptions" :key="index" :label="item.label"
                         :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item v-if="activeData.size !== undefined &&
            (activeData.optionType === 'button' ||
              activeData.border ||
              activeData.tag === 'el-color-picker')" :label="$t('build.index.2090840-127')">
            <el-radio-group v-model="activeData.size">
              <el-radio-button label="medium">
                {{ $t('build.index.2090840-128') }}
              </el-radio-button>
              <el-radio-button label="small">
                {{ $t('build.index.2090840-129') }}
              </el-radio-button>
              <el-radio-button label="mini">
                {{ $t('build.index.2090840-130') }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="activeData['show-word-limit'] !== undefined" :label="$t('build.index.2090840-131')">
            <el-switch v-model="activeData['show-word-limit']"/>
          </el-form-item>
          <el-form-item v-if="activeData.tag === 'el-input-number'" :label="$t('build.index.2090840-132')">
            <el-switch v-model="activeData['step-strictly']"/>
          </el-form-item>
          <el-form-item v-if="activeData.tag === 'el-cascader'" :label="$t('build.index.2090840-133')">
            <el-switch v-model="activeData.props.props.multiple"/>
          </el-form-item>
          <el-form-item v-if="activeData.tag === 'el-cascader'" :label="$t('build.index.2090840-134')">
            <el-switch v-model="activeData['show-all-levels']"/>
          </el-form-item>
          <el-form-item v-if="activeData.tag === 'el-cascader'" :label="$t('build.index.2090840-135')">
            <el-switch v-model="activeData.filterable"/>
          </el-form-item>
          <el-form-item v-if="activeData.clearable !== undefined" :label="$t('build.index.2090840-136')">
            <el-switch v-model="activeData.clearable"/>
          </el-form-item>
          <el-form-item v-if="activeData.showTip !== undefined" :label="$t('build.index.2090840-137')">
            <el-switch v-model="activeData.showTip"/>
          </el-form-item>
          <el-form-item v-if="activeData.multiple !== undefined" :label="$t('build.index.2090840-138')">
            <el-switch v-model="activeData.multiple"/>
          </el-form-item>
          <el-form-item v-if="activeData['auto-upload'] !== undefined" :label="$t('build.index.2090840-139')">
            <el-switch v-model="activeData['auto-upload']"/>
          </el-form-item>
          <el-form-item v-if="activeData.readonly !== undefined" :label="$t('build.index.2090840-140')">
            <el-switch v-model="activeData.readonly"/>
          </el-form-item>
          <el-form-item v-if="activeData.disabled !== undefined" :label="$t('build.index.2090840-141')">
            <el-switch v-model="activeData.disabled"/>
          </el-form-item>
          <el-form-item v-if="activeData.tag === 'el-select'" :label="$t('build.index.2090840-142')">
            <el-switch v-model="activeData.filterable"/>
          </el-form-item>
          <el-form-item v-if="activeData.tag === 'el-select'" :label="$t('build.index.2090840-143')">
            <el-switch v-model="activeData.multiple" @change="multipleChange"/>
          </el-form-item>
          <el-form-item v-if="activeData.required !== undefined" :label="$t('build.index.2090840-144')">
            <el-switch v-model="activeData.required"/>
          </el-form-item>

          <template v-if="activeData.layoutTree">
            <el-divider>{{ $t('build.index.2090840-145') }}</el-divider>
            <el-tree :data="[activeData]" :props="layoutTreeProps" node-key="renderKey" default-expand-all draggable>
              <span slot-scope="{ node, data }">
                <span class="node-label">
                  <svg-icon class="node-icon" :icon-class="data.tagIcon"/>
                  {{ node.label }}
                </span>
              </span>
            </el-tree>
          </template>

          <template v-if="activeData.layout === 'colFormItem' && activeData.tag !== 'el-button'">
            <el-divider>{{ $t('build.index.2090840-146') }}</el-divider>
            <div v-for="(item, index) in activeData.regList" :key="index" class="reg-item">
              <span class="close-btn" @click="activeData.regList.splice(index, 1)">
                <i class="el-icon-close"/>
              </span>
              <el-form-item :label="$t('build.index.2090840-147')">
                <el-input v-model="item.pattern" :placeholder="$t('build.index.2090840-148')"/>
              </el-form-item>
              <el-form-item :label="$t('build.index.2090840-149')" style="margin-bottom:0">
                <el-input v-model="item.message" :placeholder="$t('build.index.2090840-150')"/>
              </el-form-item>
            </div>
            <div style="margin-left: 20px">
              <el-button icon="el-icon-circle-plus-outline" type="text" @click="addReg">
                {{ $t('build.index.2090840-151') }}
              </el-button>
            </div>
          </template>
        </el-form>
        <!-- 表单属性 -->
        <el-form v-show="currentTab === 'form'" size="small" label-width="90px">
          <el-form-item :label="$t('build.index.2090840-152')">
            <el-input v-model="formConf.formRef" :placeholder="$t('build.index.2090840-153')"/>
          </el-form-item>
          <el-form-item :label="$t('build.index.2090840-154')">
            <el-input v-model="formConf.formModel" :placeholder="$t('build.index.2090840-155')"/>
          </el-form-item>
          <el-form-item :label="$t('build.index.2090840-156')">
            <el-input v-model="formConf.formRules" :placeholder="$t('build.index.2090840-157')"/>
          </el-form-item>
          <el-form-item :label="$t('build.index.2090840-168')">
            <el-radio-group v-model="formConf.size">
              <el-radio-button label="medium">
                {{ $t('build.index.2090840-128') }}
              </el-radio-button>
              <el-radio-button label="small">
                {{ $t('build.index.2090840-129') }}
              </el-radio-button>
              <el-radio-button label="mini">
                {{ $t('build.index.2090840-130') }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('build.index.2090840-158')">
            <el-radio-group v-model="formConf.labelPosition">
              <el-radio-button label="left">
                {{ $t('build.index.2090840-159') }}
              </el-radio-button>
              <el-radio-button label="right">
                {{ $t('build.index.2090840-160') }}
              </el-radio-button>
              <el-radio-button label="top">
                {{ $t('build.index.2090840-161') }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('build.index.2090840-162')">
            <el-input-number v-model="formConf.labelWidth" :placeholder="$t('build.index.2090840-162')"/>
          </el-form-item>
          <el-form-item :label="$t('build.index.2090840-163')">
            <el-input-number v-model="formConf.gutter" :min="0" :placeholder="$t('build.index.2090840-163')"/>
          </el-form-item>
          <el-form-item :label="$t('build.index.2090840-164')">
            <el-switch v-model="formConf.disabled"/>
          </el-form-item>
          <el-form-item :label="$t('build.index.2090840-165')">
            <el-switch v-model="formConf.formBtns"/>
          </el-form-item>
          <el-form-item :label="$t('build.index.2090840-166')">
            <el-switch v-model="formConf.unFocusedComponentBorder"/>
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </div>

    <treeNode-dialog :visible.sync="dialogVisible" :title="$t('build.index.2090840-167')" @commit="addNode"/>
    <icons-dialog :visible.sync="iconsVisible" :current="activeData[currentIconModel]" @select="setIcon"/>
  </div>
</template>

<script>
import {isArray} from 'util'
import draggable from 'vuedraggable'
import TreeNodeDialog from './TreeNodeDialog'
import {isNumberStr} from '@/utils/index'
import IconsDialog from './IconsDialog'
import {
  inputComponents,
  selectComponents,
  layoutComponents
} from '@/utils/generator/config'

const dateTimeFormat = {
  date: 'yyyy-MM-dd',
  week: 'yyyy 第 WW 周',
  month: 'yyyy-MM',
  year: 'yyyy',
  datetime: 'yyyy-MM-dd HH:mm:ss',
  daterange: 'yyyy-MM-dd',
  monthrange: 'yyyy-MM',
  datetimerange: 'yyyy-MM-dd HH:mm:ss'
}

export default {
  components: {
    draggable,
    TreeNodeDialog,
    IconsDialog
  },
  props: ['showField', 'activeData', 'formConf'],
  data() {
    return {
      currentTab: 'field',
      currentNode: null,
      dialogVisible: false,
      iconsVisible: false,
      currentIconModel: null,
      dateTypeOptions: [
        {
          label: '日(date)',
          value: 'date'
        },
        {
          label: '周(week)',
          value: 'week'
        },
        {
          label: '月(month)',
          value: 'month'
        },
        {
          label: '年(year)',
          value: 'year'
        },
        {
          label: '日期时间(datetime)',
          value: 'datetime'
        }
      ],
      dateRangeTypeOptions: [
        {
          label: '日期范围(daterange)',
          value: 'daterange'
        },
        {
          label: '月范围(monthrange)',
          value: 'monthrange'
        },
        {
          label: '日期时间范围(datetimerange)',
          value: 'datetimerange'
        }
      ],
      colorFormatOptions: [
        {
          label: 'hex',
          value: 'hex'
        },
        {
          label: 'rgb',
          value: 'rgb'
        },
        {
          label: 'rgba',
          value: 'rgba'
        },
        {
          label: 'hsv',
          value: 'hsv'
        },
        {
          label: 'hsl',
          value: 'hsl'
        }
      ],
      justifyOptions: [
        {
          label: 'start',
          value: 'start'
        },
        {
          label: 'end',
          value: 'end'
        },
        {
          label: 'center',
          value: 'center'
        },
        {
          label: 'space-around',
          value: 'space-around'
        },
        {
          label: 'space-between',
          value: 'space-between'
        }
      ],
      layoutTreeProps: {
        label(data, node) {
          return data.componentName || `${data.label}: ${data.vModel}`
        }
      }
    }
  },
  computed: {
    documentLink() {
      return (
        this.activeData.document
        || 'https://element.eleme.cn/#/zh-CN/component/installation'
      )
    },
    dateOptions() {
      if (
        this.activeData.type !== undefined
        && this.activeData.tag === 'el-date-picker'
      ) {
        if (this.activeData['start-placeholder'] === undefined) {
          return this.dateTypeOptions
        }
        return this.dateRangeTypeOptions
      }
      return []
    },
    tagList() {
      return [
        {
          label: this.$t('build.index.2090840-0'),
          options: inputComponents
        },
        {
          label: this.$t('build.index.2090840-1'),
          options: selectComponents
        }
      ]
    }
  },
  methods: {
    addReg() {
      this.activeData.regList.push({
        pattern: '',
        message: ''
      })
    },
    addSelectItem() {
      this.activeData.options.push({
        label: '',
        value: ''
      })
    },
    addTreeItem() {
      ++this.idGlobal
      this.dialogVisible = true
      this.currentNode = this.activeData.options
    },
    renderContent(h, {node, data, store}) {
      return (
        <div class="custom-tree-node">
          <span>{node.label}</span>
          <span class="node-operation">
            <i on-click={() => this.append(data)}
               class="el-icon-plus"
               title="添加"
            ></i>
            <i on-click={() => this.remove(node, data)}
               class="el-icon-delete"
               title="删除"
            ></i>
          </span>
        </div>
      )
    },
    append(data) {
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      this.dialogVisible = true
      this.currentNode = data.children
    },
    remove(node, data) {
      const {parent} = node
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
    },
    addNode(data) {
      this.currentNode.push(data)
    },
    setOptionValue(item, val) {
      item.value = isNumberStr(val) ? +val : val
    },
    setDefaultValue(val) {
      if (Array.isArray(val)) {
        return val.join(',')
      }
      if (['string', 'number'].indexOf(val) > -1) {
        return val
      }
      if (typeof val === 'boolean') {
        return `${val}`
      }
      return val
    },
    onDefaultValueInput(str) {
      if (isArray(this.activeData.defaultValue)) {
        // 数组
        this.$set(
          this.activeData,
          'defaultValue',
          str.split(',').map(val => (isNumberStr(val) ? +val : val))
        )
      } else if (['true', 'false'].indexOf(str) > -1) {
        // 布尔
        this.$set(this.activeData, 'defaultValue', JSON.parse(str))
      } else {
        // 字符串和数字
        this.$set(
          this.activeData,
          'defaultValue',
          isNumberStr(str) ? +str : str
        )
      }
    },
    onSwitchValueInput(val, name) {
      if (['true', 'false'].indexOf(val) > -1) {
        this.$set(this.activeData, name, JSON.parse(val))
      } else {
        this.$set(this.activeData, name, isNumberStr(val) ? +val : val)
      }
    },
    setTimeValue(val, type) {
      const valueFormat = type === 'week' ? dateTimeFormat.date : val
      this.$set(this.activeData, 'defaultValue', null)
      this.$set(this.activeData, 'value-format', valueFormat)
      this.$set(this.activeData, 'format', val)
    },
    spanChange(val) {
      this.formConf.span = val
    },
    multipleChange(val) {
      this.$set(this.activeData, 'defaultValue', val ? [] : '')
    },
    dateTypeChange(val) {
      this.setTimeValue(dateTimeFormat[val], val)
    },
    rangeChange(val) {
      this.$set(
        this.activeData,
        'defaultValue',
        val ? [this.activeData.min, this.activeData.max] : this.activeData.min
      )
    },
    rateTextChange(val) {
      if (val) this.activeData['show-score'] = false
    },
    rateScoreChange(val) {
      if (val) this.activeData['show-text'] = false
    },
    colorFormatChange(val) {
      this.activeData.defaultValue = null
      this.activeData['show-alpha'] = val.indexOf('a') > -1
      this.activeData.renderKey = +new Date() // 更新renderKey,重新渲染该组件
    },
    openIconsDialog(model) {
      this.iconsVisible = true
      this.currentIconModel = model
    },
    setIcon(val) {
      this.activeData[this.currentIconModel] = val
    },
    tagChange(tagIcon) {
      let target = inputComponents.find(item => item.tagIcon === tagIcon)
      if (!target) target = selectComponents.find(item => item.tagIcon === tagIcon)
      this.$emit('tag-change', target)
    }
  }
}
</script>

<style lang="scss" scoped>
.right-board {
  width: 350px;
  position: absolute;
  right: 0;
  top: 0;
  padding-top: 3px;

  .field-box {
    position: relative;
    height: calc(100vh - 42px);
    box-sizing: border-box;
    overflow: hidden;
  }

  .el-scrollbar {
    height: 100%;
  }
}

.select-item {
  display: flex;
  border: 1px dashed #fff;
  box-sizing: border-box;

  & .close-btn {
    cursor: pointer;
    color: #f56c6c;
  }

  & .el-input + .el-input {
    margin-left: 4px;
  }
}

.select-item + .select-item {
  margin-top: 4px;
}

.select-item.sortable-chosen {
  border: 1px dashed #409eff;
}

.select-line-icon {
  line-height: 32px;
  font-size: 22px;
  padding: 0 4px;
  color: #777;
}

.option-drag {
  cursor: move;
}

.time-range {
  .el-date-editor {
    width: 227px;
  }

  ::v-deep .el-icon-time {
    display: none;
  }
}

.document-link {
  position: absolute;
  display: block;
  width: 26px;
  height: 26px;
  top: 0;
  left: 0;
  cursor: pointer;
  background: #409eff;
  z-index: 1;
  border-radius: 0 0 6px 0;
  text-align: center;
  line-height: 26px;
  color: #fff;
  font-size: 18px;
}

.node-label {
  font-size: 14px;
}

.node-icon {
  color: #bebfc3;
}
</style>
