<template>
  <div>
    <el-dialog v-bind="$attrs" :close-on-click-modal="false" :modal-append-to-body="false" v-on="$listeners"
               @open="onOpen" @close="onClose">
      <el-row :gutter="0">
        <el-form ref="elForm" :model="formData" :rules="rules" size="small" label-width="100px">
          <el-col :span="24">
            <el-form-item :label="$t('build.index.2090840-101')" prop="label">
              <el-input v-model="formData.label" :placeholder="$t('build.tree.897735-0')" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('build.index.2090840-102')" prop="value">
              <el-input v-model="formData.value" :placeholder="$t('build.tree.897735-1')" clearable>
                <el-select slot="append" v-model="dataType" :style="{ width: '100px' }">
                  <el-option v-for="(item, index) in dataTypeOptions" :key="index" :label="item.label"
                             :value="item.value" :disabled="item.disabled" />
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer">
        <el-button type="primary" @click="handleConfirm">
          {{ $t('confirm') }}
        </el-button>
        <el-button @click="close">
          {{ $t('cancel') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { isNumberStr } from '@/utils/index'

export default {
  components: {},
  inheritAttrs: false,
  props: [],
  data() {
    return {
      id: 100,
      formData: {
        label: undefined,
        value: undefined
      },
      rules: {
        label: [
          {
            required: true,
            message: this.$t('build.tree.897735-0'),
            trigger: 'blur'
          }
        ],
        value: [
          {
            required: true,
            message: this.$t('build.tree.897735-1'),
            trigger: 'blur'
          }
        ]
      },
      dataType: 'string',
      dataTypeOptions: [
        {
          label: this.$t('build.tree.897735-2'),
          value: 'string'
        },
        {
          label: this.$t('build.tree.897735-3'),
          value: 'number'
        }
      ]
    }
  },
  computed: {},
  watch: {
    // eslint-disable-next-line func-names
    'formData.value': function (val) {
      this.dataType = isNumberStr(val) ? 'number' : 'string'
    }
  },
  created() { },
  mounted() { },
  methods: {
    onOpen() {
      this.formData = {
        label: undefined,
        value: undefined
      }
    },
    onClose() { },
    close() {
      this.$emit('update:visible', false)
    },
    handleConfirm() {
      this.$refs.elForm.validate(valid => {
        if (!valid) return
        if (this.dataType === 'number') {
          this.formData.value = parseFloat(this.formData.value)
        }
        this.formData.id = this.id++
        this.$emit('commit', this.formData)
        this.close()
      })
    }
  }
}
</script>
