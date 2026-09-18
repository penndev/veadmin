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
            {{ (item.wildcard ? "*." : "") + item.domain }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark" align="center" />
      <el-table-column label="返回头" align="center">
        <template #default="scope">
          <el-popover placement="top" trigger="hover" width="350">
            <template #reference>
              <el-button type="primary" plain>查看</el-button>
            </template>
            <div v-for="(item, index) in scope.row.header" :key="index">
              <span>{{ item.name }}: {{ item.value }}</span>
            </div>
          </el-popover>
          <!-- <pre>{{ JSON.stringify(scope.row.header, 4) }}</pre> -->
        </template>
      </el-table-column>
      <el-table-column label="配置" align="center" min-width="280">
        <template #default="scope">
          <div v-if="scope.row.type === 'static'" class="site-cfg">
            <div class="site-cfg-row">
              <span class="site-cfg-label">静态目录</span>
              <el-link type="primary" @click="handleOpenDir(scope.row)">
                {{ scope.row.static?.root }}
              </el-link>
            </div>
          </div>
          <div v-else class="site-cfg">
            <div class="site-cfg-row">
              <span class="site-cfg-label">回源地址</span>
              <el-link type="primary">
                {{ scope.row.proxy.server }}
              </el-link>
            </div>
            <div class="site-cfg-row">
              <span class="site-cfg-label">回源域名</span>
              <el-link type="warning">
                {{ scope.row.proxy.host }}
              </el-link>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="dialog.handleDialogEdit(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            v-if="scope.row.type === 'static'"
            link
            type="success"
            @click="handleOpenDir(scope.row)"
          >
            目录
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
import { useRouter } from "vue-router";

// import api
import { getSite } from "@/apis/wafcdn/site";
import OpenResty from "./components/OpenResty.vue";
import SiteDialog from "./components/SiteDialog.vue";

const router = useRouter();
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

const handleOpenDir = (row) => {
  router.push({
    name: "WafCdnFiles",
    query: { path: row.static?.root || "" },
  });
};

const handleTableData = () => {
  getSite(table.value.query).then((result) => {
    table.value.data = result.data;
    table.value.total = result.total;
  });
};

handleTableData();
</script>

<style scoped>
.site-cfg {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  text-align: left;
}
.site-cfg-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.site-cfg-label {
  width: 4.5em;
  flex-shrink: 0;
  color: var(--el-text-color-secondary);
  text-align: right;
}
</style>
