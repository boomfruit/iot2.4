<template>
  <div style="padding-left:20px;">
    <el-row :gutter="10">
      <el-col :span="14">
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="warning" plain icon="el-icon-refresh" size="mini" @click="getList">{{
              $t('product.product-app.045891-0') }}</el-button>
          </el-col>
          <el-tag type="danger" style="margin-left:15px;">{{ $t('product.product-app.045891-1') }}</el-tag>
        </el-row>
        <el-table v-loading="loading" :data="modelList" border style="margin-bottom:60px;margin-top:20px;" size="small">
          <el-table-column :label="$t('product.product-app.045891-2')" align="center" prop="modelName" />
          <el-table-column :label="$t('product.product-app.045891-3')" align="center" prop="identifier" />
          <el-table-column :label="$t('product.product-app.045891-4')" align="center" prop="type">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.iot_things_type" :value="scope.row.type" />
            </template>
          </el-table-column>
          <el-table-column :label="$t('product.product-app.045891-5')" align="center" prop="datatype">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.iot_data_type" :value="scope.row.datatype" />
            </template>
          </el-table-column>
          <el-table-column :label="$t('product.product-app.045891-6')" align="center" prop="part">
            <template slot-scope="scope">
              {{ scope.row.part }} {{ $t('product.product-app.045891-7') }}
            </template>
          </el-table-column>
        </el-table>

        <el-divider>{{ $t('product.product-app.045891-8') }}</el-divider>
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item :label="$t('product.product-app.045891-9')" prop="page">
            <el-input v-model="form.page" :placeholder="$t('product.product-app.045891-10')" />
          </el-form-item>
        </el-form>

      </el-col>
      <el-col :span="8" :offset="2">
        <div class="phone">
          <div class="phone-container"></div>
        </div>
        <div style="text-align:center;margin-top:15px;width:370px;">{{ $t('product.product-app.045891-11') }}</div>
      </el-col>

    </el-row>
  </div>
</template>

<script>
import {
  listModel,
} from "@/api/iot/model";
export default {
    name: "device-log",
    dicts: ["iot_things_type", "iot_data_type", "iot_yes_no"],
    props: {
        product: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            // 遮罩层
            loading: false,
            // 产品物模型表格数据
            modelList: [],
            // 弹出层标题
            title: "",
            // 查询参数
            queryParams: {
                productId: 0,
                // 1-属性，2-功能，3-事件，4-属性和功能
                type: 4,
            },
            form: {},
            // 产品
            productInfo: {},
        };
    },
    watch: {
        // 获取到父组件传递的productId后，刷新列表
        product: function (newVal, oldVal) {
            this.productInfo = newVal;
            if (this.productInfo && this.productInfo.productId != 0) {
                this.queryParams.productId = this.productInfo.productId;
                this.getList();
            }
        }
    },
    created() {

  },
  methods: {
    /** 查询产品物模型列表 */
    getList() {
      this.loading = true;
      listModel(this.queryParams).then((response) => {
        this.modelList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
  }
};
</script>

<style scoped>
.phone {
  height: 700px;
  width: 370px;
  background-image: url("../../../assets/images/phone.jpg");
  background-size: cover;
  top: 0px;
}

.phone-container {
  height: 620px;
  width: 345px;
  border-radius: 20px;
  position: relative;
  top: 45px;
  left: 12px;
  border: 1px solid #888;
  background: linear-gradient(303deg, #b2e9fc 50%, #b5c4f8 50%);

}
</style>
