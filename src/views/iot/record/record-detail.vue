<template>
  <div id="recordDetail">
    <el-container>
      <div style="width: 250px">
        <div class="record-list-box-box">
          <div style="margin: 12px 20px 10px">
            <el-date-picker size="mini" style="width: 230px" v-model="chooseDate" :picker-options="pickerOptions"
              type="date" value-format="yyyy-MM-dd" :placeholder="$t('record.239091-6')"
              @change="dateChange()"></el-date-picker>
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
                  :href="`${getFileBasePath()}/download.html?url=file/download/${recordFile.app}/${recordFile.stream}/${chooseDate}/${item}`"
                  target="_blank" />
                <a class="el-icon-upload" style="color: #409eff; font-weight: 600; margin-left: 10px"
                  @click="uploadOss(item)" />
              </li>
            </ul>
            <div v-if="detailFiles.length == 0" class="record-list-no-val">{{ $t('sip.mediaServer.998535-6') }}</div>
            <div class="page-wrap">
              <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize" small layout="prev, pager, next" @pagination="queryRecordDetails"
                style="margin-top: 30px;" :pager-count="5" v-if="this.chooseDate != null" />
            </div>
          </div>

        </div>
      </div>
      <el-main>
        <div style="margin: 0px 10px 10px 0;height:30px">
        </div>
        <div class="playBox" :style="playerStyle">
          <player ref="recordVideoPlayer" :videoUrl="videoUrl" :height="true"></player>
        </div>
      </el-main>
    </el-container>
  </div>
</template>


<script>
import moment from 'moment';
import { getServerRecordByDate, getServerRecordByFile, uploadRecord } from '@/api/iot/record';
import player from '@/views/components/player/easyplayer.vue';
export default {
  name: 'ReocrdDetail',
  components: {
    player,
  },
  props: ['recordFile', 'mediaServerId', 'recordApi', 'dateFiles'],
  data() {
    return {
      recordListStyle: {
        height: this.winHeight + 'px',
        margin: '10px 20px',
      },
      playerStyle: {
        margin: 'auto',
        'margin-bottom': '0px',
        height: this.winHeight + 'px',
      },
      winHeight: window.innerHeight - 220,
      dateFilesObj: [],
      detailFiles: [],
      chooseDate: '',
      videoUrl: null,
      choosedFile: null,
      queryDate: new Date(),
      currentPage: 1,
      count: 1000000,
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 15,
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
  mounted() {
    this.recordListStyle.height = this.winHeight + 'px';
    this.playerStyle['height'] = this.winHeight + 'px';
    this.getDateInYear(() => {
      if (Object.values(this.dateFilesObj).length > 0) {
        this.chooseDate = Object.values(this.dateFilesObj)[Object.values(this.dateFilesObj).length - 1];
        this.dateChange();
      }
    });
  },
  methods: {
    dateChange() {
      this.detailFiles = [];
      this.currentPage = 1;
      this.queryRecordDetails();
    },
    infiniteScroll() {
      if (this.total > this.detailFiles.length) {
        this.currentPage++;
        this.queryRecordDetails();
      }
    },
    queryRecordDetails: function () {
      if (this.chooseDate != null) {
        const query = {
          recordApi: this.recordApi,
          app: this.recordFile.app,
          stream: this.recordFile.stream,
          startTime: this.chooseDate + ' 00:00:00',
          endTime: this.chooseDate + ' 23:59:59',
          pageNum: this.queryParams.pageNum,
          pageSize: this.queryParams.pageSize,
        };
        getServerRecordByFile(query).then((res) => {
          console.log(res);
          if (res.code === 200) {
            this.total = res.data.total;
            this.detailFiles = res.data.list;
          }
        });
      }
    },
    chooseFile(file) {
      this.choosedFile = file;
      if (file == null) {
        this.videoUrl = '';
      } else {
        this.videoUrl = `${this.getFileBasePath()}/file/download/${this.recordFile.app}/${this.recordFile.stream}/${this.chooseDate}/${this.choosedFile}`;
        console.log(this.videoUrl);
      }
    },
    uploadOss(item) {
      const query = {
        recordApi: this.recordApi,
        file: '/' + this.recordFile.app + '/' + this.recordFile.stream + '/' + this.chooseDate + '/' + item,
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
    getDateInYear() {
      const query = {
        recordApi: this.recordApi,
        app: this.recordFile.app,
        stream: this.recordFile.stream,
      };
      getServerRecordByDate(query).then((res) => {
        if (res.code === 200) {
          if (res.data.length > 0) {
            for (let i = 0; i < res.data.length; i++) {
              this.dateFilesObj[res.data[i]] = res.data[i];
            }
            console.log(this.dateFilesObj);
          }
        }
      });
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
  position: absolute;
  width: 230px;
  list-style: none;
  border: 1px solid #d2dae1;
  margin: 10px 20px;
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
  left: 90px;
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
