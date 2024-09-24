<template>
    <div class="el-transfer-panel" style="width: 17.5rem">
        <p class="el-transfer-panel__header">
            <el-checkbox v-model="allChecked" :indeterminate="isIndeterminate" @change="handleAllCheckedChange">
                {{ title }}
                <span>{{ checkedSummary }}</span>
            </el-checkbox>
        </p>

        <div :class="['el-transfer-panel__body', 'is-with-footer']" style="height: 100%">
            <el-input v-if="filterable" v-model="query" class="el-transfer-panel__filter" size="small" :placeholder="placeholder" @mouseenter.native="inputHover = true" @mouseleave.native="inputHover = false">
                <i slot="prefix" :class="['el-input__icon', 'el-icon-search']" />
                <i v-if="query.length > 0 && inputHover" slot="suffix" :class="['el-input__icon', 'el-icon-circle-close']" @click="handleQuery('')" />
                <span v-if="query.length > 0 && inputHover" slot="suffix" class="pr-2 cursor-pointer text-blue-400 el-input__icon" @click="handleQuery(query)">搜索</span>
            </el-input>
            <el-checkbox-group v-show="!hasNoMatch && data.length > 0" v-model="checked" :class="{ 'is-filterable': filterable }" class="el-transfer-panel__list" style="">
                <el-checkbox v-for="item in data" :key="item[keyProp]" class="el-transfer-panel__item" :label="item[keyProp]" :disabled="item[disabledProp]">
                    <option-content :option="item"></option-content>
                </el-checkbox>
            </el-checkbox-group>
            <div v-show="hasNoMatch" v-loading="loading" element-loading-text="加载中" class="el-transfer-panel__empty" style="height: 12rem; display: flex; align-items: center; justify-content: center">
                {{ t('el.transfer.noMatch') }}
            </div>
            <p v-show="data.length === 0 && !hasNoMatch" class="el-transfer-panel__empty">
                {{ t('el.transfer.noData') }}
            </p>
        </div>
        <div class="el-transfer-panel__footer" style="display: flex; align-items: center; justify-content: center">
            <el-pagination small :page-size="pageSize" layout="prev, pager, next" :total="total" :pager-count="5" :current-page="page" @current-change="(val) => $emit('page-change', val)" />
        </div>
    </div>
</template>

<script>
import Locale from 'element-ui/src/mixins/locale';

export default {
    name: 'TransferPanel',
    components: {
        OptionContent: {
            props: {
                option: Object,
            },
            render(h) {
                const getParent = (vm) => {
                    if (vm.$options.componentName === 'TransferPanel') {
                        return vm;
                    } else if (vm.$parent) {
                        return getParent(vm.$parent);
                    } else {
                        return vm;
                    }
                };
                const panel = getParent(this);
                const transfer = panel.$parent || panel;
                return panel.renderContent ? (
                    panel.renderContent(h, this.option)
                ) : transfer.$scopedSlots.default ? (
                    transfer.$scopedSlots.default({ option: this.option })
                ) : (
                    <span>{this.option[panel.labelProp] || this.option[panel.keyProp]}</span>
                );
            },
        },
    },
    mixins: [Locale],
    componentName: 'TransferPanel',
    props: {
        data: {
            type: Array,
            default() {
                return [];
            },
        },
        renderContent: { type: Function, default: null },
        placeholder: { type: String, default: '' },
        title: { type: String, default: '' },
        filterable: { type: Boolean, default: false },
        loading: { type: Boolean, default: false },
        format: {
            type: Object,
            default() {
                return {};
            },
        },
        filterMethod: { type: Function, default: null },
        pageSize: { type: Number, default: 15 },
        page: { type: Number, default: 1 },
        total: { type: Number, default: 0 },
        defaultChecked: {
            type: Array,
            default() {
                return [];
            },
        },
        props: {
            type: Object,
            default() {
                return {};
            },
        },
    },

    data() {
        return {
            checked: [],
            allChecked: false,
            query: '',
            inputHover: false,
            checkChangeByUser: true,
        };
    },

    computed: {
        checkableData() {
            return this.data.filter((item) => !item[this.disabledProp]);
        },
        checkedSummary() {
            const checkedLength = this.checked.length;
            const dataLength = this.data.length;
            const { noChecked, hasChecked } = this.format;
            if (noChecked && hasChecked) {
                return checkedLength > 0 ? hasChecked.replace(/\${checked}/g, checkedLength).replace(/\${total}/g, dataLength) : noChecked.replace(/\${total}/g, dataLength);
            } else {
                return `${checkedLength}/${dataLength}`;
            }
        },

        isIndeterminate() {
            const checkedLength = this.checked.length;
            return checkedLength > 0 && checkedLength < this.checkableData.length;
        },
        hasNoMatch() {
            return this.data.length === 0;
        },
        labelProp() {
            return this.props.label || 'label';
        },
        keyProp() {
            return this.props.key || 'key';
        },
        disabledProp() {
            return this.props.disabled || 'disabled';
        },
    },
    watch: {
        checked(val, oldVal) {
            this.updateAllChecked();
            if (this.checkChangeByUser) {
                const movedKeys = val.concat(oldVal).filter((v) => !val.includes(v) || !oldVal.includes(v));
                this.$emit('checked-change', val, movedKeys);
            } else {
                this.$emit('checked-change', val);
                this.checkChangeByUser = true;
            }
        },
        data() {
            const checked = [];
            const dataKeys = this.data.map((item) => item[this.keyProp]);
            this.checked.forEach((item) => {
                if (dataKeys.includes(item)) checked.push(item);
            });
            this.checkChangeByUser = false;
            this.checked = checked;
        },
        checkableData() {
            this.updateAllChecked();
        },
        defaultChecked: {
            immediate: true,
            handler(val, oldVal) {
                if (oldVal && val.length === oldVal.length && val.every((item) => oldVal.includes(item))) return;
                const checked = [];
                const checkableDataKeys = this.checkableData.map((item) => item[this.keyProp]);
                val.forEach((item) => {
                    if (checkableDataKeys.includes(item)) {
                        checked.push(item);
                    }
                });
                this.checkChangeByUser = false;
                this.checked = checked;
            },
        },
    },
    methods: {
        updateAllChecked() {
            const checkableDataKeys = this.checkableData.map((item) => item[this.keyProp]);
            this.allChecked = checkableDataKeys.length > 0 && checkableDataKeys.every((item) => this.checked.includes(item));
        },
        handleAllCheckedChange(value) {
            this.checked = value ? this.checkableData.map((item) => item[this.keyProp]) : [];
        },
        handleQuery(query) {
            this.query = query;
            this.$emit('query-change', query);
        },
    },
};
</script>
