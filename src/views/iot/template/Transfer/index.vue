<template>
    <div v-loading="loading" class="el-transfer" element-loading-text="更新中">
        <transfer-panel
            v-bind="$props"
            ref="leftPanel"
            :data="left.data"
            :title="titles[0] || t('el.transfer.titles.0')"
            :page-size="left.pageSize || 15"
            :page="left.pageNum"
            :total="left.total"
            :loading="left.loading"
            :default-checked="leftDefaultChecked"
            :placeholder="filterPlaceholder || t('el.transfer.filterPlaceholder')"
            @checked-change="(val) => $emit('checked-change', 'left', val)"
            @query-change="(val) => $emit('query-change', 'left', val)"
            @page-change="(val) => $emit('page-change', 'left', val)"
        >
            <slot name="left-footer"></slot>
        </transfer-panel>
        <div class="el-transfer__buttons">
            <div style="display: flex; flex-direction: column">
                <el-button type="primary" size="small" :class="[hasButtonTexts ? 'is-with-texts' : '']" :disabled="rightDefaultChecked.length === 0" @click.native="$emit('bind', 'right', false)">
                    <i class="el-icon-arrow-left"></i>
                    <span v-if="buttonTexts[0] !== undefined">{{ buttonTexts[0] }}</span>
                </el-button>
                <el-button type="primary" size="small" style="margin: 0.5rem 0 0" :class="[hasButtonTexts ? 'is-with-texts' : '']" :disabled="leftDefaultChecked.length === 0" @click.native="$emit('bind', 'left', true)">
                    <span v-if="buttonTexts[1] !== undefined">{{ buttonTexts[1] }}</span>
                    <i class="el-icon-arrow-right"></i>
                </el-button>
            </div>
        </div>
        <transfer-panel
            v-bind="$props"
            ref="rightPanel"
            :data="right.data"
            :title="titles[1] || t('el.transfer.titles.1')"
            :page-size="right.pageSize || 15"
            :page="right.pageNum"
            :total="right.total"
            :loading="right.loading"
            :default-checked="rightDefaultChecked"
            :placeholder="filterPlaceholder || t('el.transfer.filterPlaceholder')"
            @checked-change="(val) => $emit('checked-change', 'right', val)"
            @query-change="(val) => $emit('query-change', 'right', val)"
            @page-change="(val) => $emit('page-change', 'right', val)"
        >
            <slot name="right-footer"></slot>
        </transfer-panel>
    </div>
</template>

<script>
import TransferPanel from '@/components/TransferPanel';

export default {
    name: 'Transfer',
    components: { TransferPanel },
    props: {
        data: {
            type: Array,
            default() {
                return [[], []];
            },
        },
        titles: {
            type: Array,
            default() {
                return [];
            },
        },
        buttonTexts: {
            type: Array,
            default() {
                return [];
            },
        },
        filterPlaceholder: {
            type: String,
            default: '',
        },
        filterMethod: { type: Function, default: null },
        leftDefaultChecked: {
            type: Array,
            default() {
                return [];
            },
        },
        rightDefaultChecked: {
            type: Array,
            default() {
                return [];
            },
        },
        renderContent: { type: Function, default: null },
        format: {
            type: Object,
            default() {
                return {};
            },
        },
        left: {
            type: Object,
            default() {
                return { data: [], page: 1, size: 15, loading: false, total: 0 };
            },
        },
        right: {
            type: Object,
            default() {
                return { data: [], page: 1, size: 15, loading: false, total: 0 };
            },
        },
        filterable: { type: Boolean, default: false },
        loading: { type: Boolean, default: false },
        props: {
            type: Object,
            default() {
                return {
                    label: 'label',
                    key: 'key',
                    disabled: 'disabled',
                };
            },
        },
        targetOrder: {
            type: String,
            default: 'original',
        },
    },
    computed: {
        hasButtonTexts() {
            return this.buttonTexts.length === 2;
        },
    },
    methods: {
        // 清空查询
        clearQuery(which) {
            const { leftPanel, rightPanel } = this.$refs;
            switch (which) {
                case 'left':
                    leftPanel.query = '';
                    break;
                case 'right':
                    rightPanel.query = '';
                    break;
            }
            this.$emit('query-change', which, '');
        },
    },
};
</script>
