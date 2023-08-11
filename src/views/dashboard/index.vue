<template>
  <el-row
    :gutter="40"
    class="panel-group"
  >
    <el-col
      :xs="12"
      :sm="12"
      :lg="6"
      class="card-panel-col"
    >
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-people">
          <el-icon class="card-panel-icon">
            <FolderOpened />
          </el-icon>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            文件大小
          </div>
          <span class="card-panel-num">{{ fileSizeFormat(panelGroup.fileSize ?? 0) }}</span>
        </div>
      </div>
    </el-col>
    <el-col
      :xs="12"
      :sm="12"
      :lg="6"
      class="card-panel-col"
    >
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-message">
          <el-icon class="card-panel-icon">
            <Files />
          </el-icon>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            文件数量
          </div>
          <span class="card-panel-num">{{ panelGroup.fileTotal ?? 0 }}</span>
        </div>
      </div>
    </el-col>
    <el-col
      :xs="12"
      :sm="12"
      :lg="6"
      class="card-panel-col"
    >
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-money">
          <el-icon class="card-panel-icon">
            <DocumentCopy />
          </el-icon>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            任务数量
          </div>
          <span class="card-panel-num">{{ panelGroup.taskTotal ?? 0 }}</span>
        </div>
      </div>
    </el-col>
    <el-col
      :xs="12"
      :sm="12"
      :lg="6"
      class="card-panel-col"
    >
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-shopping">
          <el-icon class="card-panel-icon">
            <SetUp />
          </el-icon>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            编码器数量
          </div>
          <span class="card-panel-num">{{ panelGroup.transcodeTotal ?? 0 }}</span>
        </div>
      </div>
    </el-col>
  </el-row>

  <TableCharts />
</template>

<script setup>
import TableCharts from './components/TableCharts.vue'
import { ref } from 'vue'

// import 接口
import { getDashboardTotal } from '@/apis/dashboard'
import { fileSizeFormat } from '@/utils'

const panelGroup = ref({})
getDashboardTotal().then((result) => {
  panelGroup.value = result
})

</script>

<style lang="scss" scoped>
.panel-group {
  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

</style>
