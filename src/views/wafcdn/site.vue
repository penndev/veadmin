<template>
  <!-- 顶部筛选框 -->
  <div>
    <OpenResty />
    <br />
    <el-form :inline="true">
      <el-form-item>
        <el-input
          v-model="table.query.remark"
          placeholder="站点名称"
          clearable
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="search" @click="handleTableData">
          查询
        </el-button>
        <el-button type="info" icon="Refresh" @click="handleQueryRefresh">
          重置
        </el-button>
      </el-form-item>
    </el-form>
  </div>

  <!-- 数据展示框 -->
  <el-main class="ea-table">
    <!-- 数据操作按钮 -->
    <el-button type="primary" icon="Plus" @click="dialog.handleDialogAdd">
      新增
    </el-button>

    <!-- 数据table -->
    <el-table :data="table.data">
      <el-table-column label="ID" prop="id" align="center" />
      <el-table-column label="绑定域名" align="center">
        <template #default="scope">
          <p v-for="item of scope.row.Domains" :key="item.id">
            {{ item.name }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark" align="center" />
      <el-table-column label="返回头" align="center">
        <template #default="scope">
          <pre>{{ JSON.stringify(scope.row.header, 4) }}</pre>
        </template>
      </el-table-column>
      <el-table-column label="反向代理" align="center" width="300">
        <template #default="scope">
          <el-text type="info"> 回源地址: </el-text>
          <el-link type="primary">
            {{ scope.row.proxy.server }}
          </el-link>
          <br />
          <el-text type="info"> 回源域名: </el-text>
          <el-link type="warning">
            {{ scope.row.proxy.host }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="105">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="dialog.handleDialogEdit(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="dialog.handleDialogDelete(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <br />

    <el-pagination-plus
      v-model:default-page-size="table.query.limit"
      :total="table.total"
      @current-change="handleChangePage"
      @size-change="handleChangeLimit"
    />
  </el-main>

  <!-- 处理数据|新增编辑 -->
  <SiteDialog ref="dialog" :handleTableData="handleTableData" />
</template>

<script setup>
import { ref } from "vue";

// import api
import { getSite } from "@/apis/wafcdn/site";
import OpenResty from "./components/OpenResty.vue";
import SiteDialog from "./components/SiteDialog.vue";

const dialog = ref(Object);

const table = ref({
  query: {
    limit: 20,
    page: 1,
    remark: null,
  },
  data: [],
  total: 0,
});

const handleChangePage = (value) => {
  table.value.query.page = value;
  handleTableData();
};

const handleChangeLimit = (value) => {
  table.value.query.limit = value;
  handleTableData();
};

const handleQueryRefresh = () => {
  table.value.query.remark = null;
  handleTableData();
};

const handleTableData = () => {
  getSite(table.value.query).then((result) => {
    table.value.data = result.data;
    table.value.total = result.total;
  });
};

handleTableData();
</script>
