<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-people">
          <el-icon class="card-panel-icon">
            <User />
          </el-icon>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            新增用户
          </div>
          <span class="card-panel-num">{{total1}}</span>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-message">
          <el-icon class="card-panel-icon">
            <Message />
          </el-icon>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            未读消息
          </div>
          <span class="card-panel-num">{{total2}}</span>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-money">
          <el-icon class="card-panel-icon">
            <Money />
          </el-icon>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            昨日营收
          </div>
          <span class="card-panel-num">{{total3}}</span>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-shopping">
          <el-icon class="card-panel-icon">
            <ShoppingCart />
          </el-icon>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            昨日销量
          </div>
          <span class="card-panel-num">{{total4}}</span>
        </div>
      </div>
    </el-col>
  </el-row>

  <TableCharts></TableCharts>
</template>

<script setup>
import TableCharts from './components/TableCharts.vue'
import { ref } from 'vue'

// import 接口
import { getDashboardTotal } from '@/apis/dashboard'

const total1 = ref(0)
const total2 = ref(0)
const total3 = ref(0)
const total4 = ref(0)
getDashboardTotal().then((result) => {
  total1.value = result.total1
  total2.value = result.total2
  total3.value = result.total3
  total4.value = result.total4
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
