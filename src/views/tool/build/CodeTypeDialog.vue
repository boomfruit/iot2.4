<template>
  <div>
    <el-dialog v-bind="$attrs" width="500px" :close-on-click-modal="false" :modal-append-to-body="false"
      v-on="$listeners" @open="onOpen" @close="onClose">
      <el-row :gutter="15">
        <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
          <el-col :span="24">
            <el-form-item :label="$t('build.index.2090840-12')" prop="type">
              <el-radio-group v-model="formData.type">
                <el-radio-button v-for="(item, index) in typeOptions" :key="index" :label="item.value"
                  :disabled="item.disabled">
                  {{ item.label }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="showFileName" :label="$t('build.index.2090840-13')" prop="fileName">
              <el-input v-model="formData.fileName" :placeholder="$t('build.index.2090840-14')" clearable />
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>

      <div slot="footer">
        <el-button @click="close">
          {{ $t('cancel') }}
        </el-button>
        <el-button type="primary" @click="handleConfirm">
          {{ $t('confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  inheritAttrs: false,
  props: ['showFileName'],
  data() {
    return {
      formData: {
        fileName: undefined,
        type: 'file'
      },
      rules: {
        fileName: [{
          required: true,
          message: this.$t('build.index.2090840-14'),
          trigger: 'blur'
        }],
        type: [{
          required: true,
          message: this.$t('build.index.2090840-15'),
          trigger: 'change'
        }]
      },
      typeOptions: [{
        label: this.$t('build.index.2090840-16'),
        value: 'file'
      }, {
        label: this.$t('build.index.2090840-17'),
        value: 'dialog'
      }]
    }
  },
  computed: {
  },
  watch: {},
  mounted() { },
  methods: {
    onOpen() {
      if (this.showFileName) {
        this.formData.fileName = `${+new Date()}.vue`
      }
    },
    onClose() {
    },
    close(e) {
      this.$emit('update:visible', false)
    },
    handleConfirm() {
      this.$refs.elForm.validate(valid => {
        if (!valid) return
        this.$emit('confirm', { ...this.formData })
        this.close()
      })
    }
  }
}
</script>
