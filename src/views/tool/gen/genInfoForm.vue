<template>
  <el-form ref="genInfoForm" :model="info" :rules="rules" label-width="150px">
    <el-row>
      <el-col :span="12">
        <el-form-item prop="tplCategory">
          <span slot="label">{{ $t('gen.genInfoForm.432422-0') }}</span>
          <el-select v-model="info.tplCategory" @change="tplSelectChange">
            <el-option :label="$t('gen.genInfoForm.432422-1')" value="crud" />
            <el-option :label="$t('gen.genInfoForm.432422-2')" value="tree" />
            <el-option :label="$t('gen.genInfoForm.432422-3')" value="sub" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="packageName">
          <span slot="label">
            {{ $t('gen.genInfoForm.432422-4') }}
            <el-tooltip :content="$t('gen.genInfoForm.432422-5')" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <el-input v-model="info.packageName" />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="moduleName">
          <span slot="label">
            {{ $t('gen.genInfoForm.432422-6') }}
            <el-tooltip :content="$t('gen.genInfoForm.432422-7')" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <el-input v-model="info.moduleName" />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="businessName">
          <span slot="label">
            {{ $t('gen.genInfoForm.432422-8') }}
            <el-tooltip :content="$t('gen.genInfoForm.432422-9')" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <el-input v-model="info.businessName" />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="functionName">
          <span slot="label">
            {{ $t('gen.genInfoForm.432422-10') }}
            <el-tooltip :content="$t('gen.genInfoForm.432422-11')" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <el-input v-model="info.functionName" />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item>
          <span slot="label">
            {{ $t('gen.genInfoForm.432422-12') }}
            <el-tooltip :content="$t('gen.genInfoForm.432422-13')" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <treeselect :append-to-body="true" v-model="info.parentMenuId" :options="menus" :normalizer="normalizer"
                      :show-count="true" :placeholder="$t('gen.genInfoForm.432422-14')" />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="genType">
          <span slot="label">
            {{ $t('gen.genInfoForm.432422-15') }}
            <el-tooltip :content="$t('gen.genInfoForm.432422-16')" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <el-radio v-model="info.genType" label="0">{{ $t('gen.genInfoForm.432422-17') }}</el-radio>
          <el-radio v-model="info.genType" label="1">{{ $t('gen.genInfoForm.432422-18') }}</el-radio>
        </el-form-item>
      </el-col>

      <el-col :span="24" v-if="info.genType == '1'">
        <el-form-item prop="genPath">
          <span slot="label">
            {{ $t('gen.genInfoForm.432422-19') }}
            <el-tooltip ：content="$t('gen.genInfoForm.432422-20')" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <el-input v-model="info.genPath">
            <el-dropdown slot="append">
              <el-button type="primary">
                {{ $t('gen.genInfoForm.432422-21') }}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  @click.native="info.genPath = '/'">{{ $t('gen.genInfoForm.432422-22') }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row v-show="info.tplCategory == 'tree'">
      <h4 class="form-header">{{ $t('gen.genInfoForm.432422-23') }}</h4>
      <el-col :span="12">
        <el-form-item>
          <span slot="label">
            {{ $t('gen.genInfoForm.432422-24') }}
            <el-tooltip :content="$t('gen.genInfoForm.432422-25')" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <el-select v-model="info.treeCode" :placeholder="$t('pleaseSelect')">
            <el-option v-for="(column, index) in info.columns" :key="index"
                       :label="column.columnName + '：' + column.columnComment" :value="column.columnName"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item>
          <span slot="label">
            {{ $t('gen.genInfoForm.432422-26') }}
            <el-tooltip :content="$t('gen.genInfoForm.432422-27')" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <el-select v-model="info.treeParentCode" :placeholder="$t('pleaseSelect')">
            <el-option v-for="(column, index) in info.columns" :key="index"
                       :label="column.columnName + '：' + column.columnComment" :value="column.columnName"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item>
          <span slot="label">
            {{ $t('gen.genInfoForm.432422-28') }}
            <el-tooltip :content="$t('gen.genInfoForm.432422-29')" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <el-select v-model="info.treeName" :placeholder="$t('pleaseSelect')">
            <el-option v-for="(column, index) in info.columns" :key="index"
                       :label="column.columnName + '：' + column.columnComment" :value="column.columnName"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-show="info.tplCategory == 'sub'">
      <h4 class="form-header">{{ $t('gen.genInfoForm.432422-30') }}</h4>
      <el-col :span="12">
        <el-form-item>
          <span slot="label">
            {{ $t('gen.genInfoForm.432422-31') }}
            <el-tooltip :content="$t('gen.genInfoForm.432422-32')" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <el-select v-model="info.subTableName" :placeholder="$t('pleaseSelect')" @change="subSelectChange">
            <el-option v-for="(table, index) in tables" :key="index" :label="table.tableName + '：' + table.tableComment"
                       :value="table.tableName"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item>
          <span slot="label">
            {{ $t('gen.genInfoForm.432422-33') }}
            <el-tooltip :content="$t('gen.genInfoForm.432422-34')" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <el-select v-model="info.subTableFkName" :placeholder="$t('pleaseSelect')">
            <el-option v-for="(column, index) in subColumns" :key="index"
                       :label="column.columnName + '：' + column.columnComment" :value="column.columnName"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  components: { Treeselect },
  props: {
    info: {
      type: Object,
      default: null
    },
    tables: {
      type: Array,
      default: null
    },
    menus: {
      type: Array,
      default: []
    },
  },
  data() {
    return {
      subColumns: [],
      rules: {
        tplCategory: [
          { required: true, message: this.$t('gen.genInfoForm.432422-35'), trigger: "blur" }
        ],
        packageName: [
          { required: true, message: this.$t('gen.genInfoForm.432422-36'), trigger: "blur" }
        ],
        moduleName: [
          { required: true, message: this.$t('gen.genInfoForm.432422-37'), trigger: "blur" }
        ],
        businessName: [
          { required: true, message: this.$t('gen.genInfoForm.432422-38'), trigger: "blur" }
        ],
        functionName: [
          { required: true, message: this.$t('gen.genInfoForm.432422-39'), trigger: "blur" }
        ],
      }
    };
  },
  created() { },
  watch: {
    'info.subTableName': function (val) {
      this.setSubTableColumns(val);
    }
  },
  methods: {
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.menuId,
        label: node.menuName,
        children: node.children
      };
    },
    /** 选择子表名触发 */
    subSelectChange(value) {
      this.info.subTableFkName = '';
    },
    /** 选择生成模板触发 */
    tplSelectChange(value) {
      if (value !== 'sub') {
        this.info.subTableName = '';
        this.info.subTableFkName = '';
      }
    },
    /** 设置关联外键 */
    setSubTableColumns(value) {
      for (var item in this.tables) {
        const name = this.tables[item].tableName;
        if (value === name) {
          this.subColumns = this.tables[item].columns;
          break;
        }
      }
    }
  }
};
</script>
