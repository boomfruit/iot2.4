<template>
  <div id="recordOss">
    <el-container>
      <div style="width: 250px;">
        <div class="record-list-box-box">
          <div style="margin: 5px 10px 10px">
            <el-date-picker size="mini" style="width: 230px" v-model="chooseDate" :picker-options="pickerOptions"
              type="date" value-format="yyyy-MM-dd" placeholder="请选择日期" @change="changeDate()"></el-date-picker>
          </div>
          <div class="record-list-box" :style="recordListStyle">
            <ul v-if="detailFiles.length > 0" class="record-list" v-infinite-scroll="infiniteScroll">
              <li v-for="(item, index) in detailFiles" :key="index" class="record-list-item">
                <el-tag v-if="choosedFile != item" @click="chooseFile(item)">
                  <i class="el-icon-video-camera"></i>
                  {{ item.substring(0, 17) }}
                </el-tag>
                <el-tag type="danger" v-if="choosedFile == item">
                  <i class="el-icon-video-camera"></i>
                  {{ item.substring(0, 17) }}
                </el-tag>
                <a class="el-icon-download" style="color: #409eff; font-weight: 600; margin-left: 10px"
                  :href="`${getFileBasePath()}/download.html?url=file/download/rtp/${stream}/${chooseDate}/${item}`"
                  target="_blank" />
                <a class="el-icon-upload" style="color: #409eff; font-weight: 600; margin-left: 10px"
                  @click="uploadOss(item)" />
              </li>
            </ul>
            <div v-if="detailFiles.length == 0" class="record-list-no-val">暂无数据</div>
            <div class="page-wrap">
              <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize" small layout="prev, pager, next" @pagination="queryRecordDetails"
                style="margin-bottom: 10px;" :pager-count="5" v-if="this.chooseDate !== null" />
            </div>
          </div>
        </div>
      </div>
      <div style="width: 80%;">
        <div style="margin: 0px 10px 10px 0">
          <span style="margin-left: 10px" prop="channelName">通道：</span>
          <el-select v-model="channelId" placeholder="请选择" @change="changeChannel"
            style="width: 200px; margin-right: 10px" size="small">
            <el-option v-for="option in channelList" :key="option.value" :label="option.label"
              :value="option.value"></el-option>
          </el-select>
        </div>
        <el-main style="margin: -20px 0;">
          <div :style="playerStyle">
            <player ref="recordVideoPlayer" :videoUrl="videoUrl" :height="true"></player>
          </div>
        </el-main>
      </div>
    </el-container>
  </div>
</template>


<script>
import moment from 'moment';
import { getServerRecordByDevice, uploadRecord } from '@/api/iot/record';
import player from '@/views/components/player/easyplayer.vue';
import { listChannel } from "@/api/iot/channel";

export default {
  name: 'ReocrdOss',
  components: {
    player,
  },
  props: ['device'],
  data() {
    return {
      recordListStyle: {
        height: this.winHeight + '20px',
      },
      playerStyle: {
        margin: 'auto',
        'margin-bottom': '0px',
        height: this.winHeight + 'px',
      },
      winHeight: window.innerHeight - 320,
      dateFilesObj: [],
      detailFiles: [],
      chooseDate: '',
      videoUrl: null,
      choosedFile: null,
      deviceId: '',
      channelId: '',
      channelList: [],
      stream: '',
      queryDate: new Date(),
      currentPage: 1,
      count: 1000000,
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 15,
        deviceSipId: null,
        channelSipId: null,
      },
      pickerOptions: {
        cellClassName: (date) => {
          // 通过显示一个点标识这一天有录像
          let time = moment(date).format('YYYY-MM-DD');
          if (this.dateFilesObj[time]) {
            return 'data-picker-true';
          } else {
            return 'data-picker-false';
          }
        },
      },
    };
  },
  watch: {
    // 获取到父组件传递的device后
    device: function (newVal, oldVal) {
      const deviceInfo = newVal;
      if (deviceInfo && deviceInfo.deviceId !== 0) {
        this.deviceId = this.device.serialNumber;
      }
    },
  },
  mounted() {
    this.recordListStyle.height = this.winHeight + 'px';
    this.playerStyle['height'] = this.winHeight + 'px';
  },
  created() {
    this.deviceId = this.device.serialNumber;
    this.getList();
  },
  methods: {
    /** 查询监控设备通道信息列表 */
    getList() {
      this.queryParams.deviceSipId = this.deviceId;
      listChannel(this.queryParams).then((response) => {
        this.channelList = response.rows.map((item) => {
          return { value: item.channelSipId, label: item.channelName };
        });
      });
    },
    changeDate() {
      this.detailFiles = [];
      this.currentPage = 1;
      if (this.channelId !== '') {
        this.queryRecordDetails();
      }
    },
    // 改变通道
    changeChannel() {
      this.detailFiles = [];
      this.currentPage = 1;
      this.channelId = this.channelId;
      this.stream = "gb_playrecord_" + this.deviceId + "_" + this.channelId;
      if (this.chooseDate !== '') {
        this.queryRecordDetails();
      }
    },
    infiniteScroll() {
      if (this.total > this.detailFiles.length) {
        this.currentPage++;
        this.queryRecordDetails();
      }
    },
    queryRecordDetails: function () {
      const query = {
        deviceId: this.deviceId,
        channelId: this.channelId,
        startTime: this.chooseDate + ' 00:00:00',
        endTime: this.chooseDate + ' 23:59:59',
        pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize,
      };
      getServerRecordByDevice(query).then((res) => {
        console.log(res);
        if (res.code === 200) {
          this.total = res.data.total;
          console.log(this.total);
          this.detailFiles = res.data.list;
          this.recordApi = res.data.recordApi;
        }
      });
    },
    chooseFile(file) {
      this.choosedFile = file;
      if (file == null) {
        this.videoUrl = '';
      } else {
        this.videoUrl = `${this.getFileBasePath()}/file/download/rtp/${this.stream}/${this.chooseDate}/${this.choosedFile}`;
        console.log(this.videoUrl);
      }
    },
    uploadOss(item) {
      console.log(item);
      const query = {
        recordApi: this.recordApi,
        file: '/rtp/' + this.stream + '/' + this.chooseDate + '/' + item,
      };
      console.log(query);
      uploadRecord(query).then((res) => {
        if (res.code === 200) {
          console.log(res);
          this.$modal.msgSuccess('上传成功');
        }
      });
    },
    getFileBasePath() {
      return this.recordApi;
    },
  },
};
</script>

<style>
.record-list-box-box {
  width: 230px;
  align-items: center;
}

.page-wrap {
  position: absolute;
  width: 220px;
  bottom: 10px;
}

.record-list-box {
  position: relative;
  width: 230px;
  list-style: none;
  border: 1px solid #d2dae1;
  margin: 5px 10px 10px;
  overflow: auto;
  background-color: #fff;
}

.record-list {
  list-style: none;
  padding: 0;
  margin: 0;
  background-color: #fff;
}

.record-list-no-val {
  position: absolute;
  color: #9f9f9f;
  top: 230px;
  left: 80px;
}

.record-list-item {
  padding: 0;
  margin: 10px 10px;
  cursor: pointer;
}

.data-picker-true:after {
  content: '';
  position: absolute;
  width: 4px;
  height: 4px;
  background-color: #606060;
  border-radius: 4px;
  left: 45%;
  top: 74%;
}
</style>
