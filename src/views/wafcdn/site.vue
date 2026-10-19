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
            {{ item.domain }}
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
      <el-table-column label="配置" min-width="340">
        <template #default="scope">
          <div class="site-cfg">
            <el-tag
              size="small"
              :type="scope.row.type === 'static' ? 'success' : 'primary'"
            >
              {{ scope.row.type === "static" ? "静态站点" : "反向代理" }}
            </el-tag>
            <template v-if="scope.row.type === 'static'">
              <div class="site-cfg-line">
                <span class="site-cfg-label">目录</span>
                <el-link
                  class="site-cfg-value"
                  type="primary"
                  @click="handleOpenDir(scope.row)"
                >
                  {{ scope.row.static?.root || "未设置" }}
                </el-link>
              </div>
              <div
                v-for="(item, index) in scope.row.static?.locations || []"
                :key="index"
                class="site-cfg-line"
              >
                <span class="site-cfg-label">{{ item.path }}</span>
                <span class="site-cfg-value" :title="item.proxy?.server">
                  {{ item.proxy?.server || "未设置回源" }}
                </span>
              </div>
            </template>
            <template v-else>
              <div class="site-cfg-line">
                <span class="site-cfg-label">回源</span>
                <span class="site-cfg-value" :title="scope.row.proxy?.server">
                  {{ scope.row.proxy?.server || "未设置" }}
                </span>
              </div>
              <div v-if="scope.row.proxy?.host" class="site-cfg-line">
                <span class="site-cfg-label">Host</span>
                <span class="site-cfg-value">{{ scope.row.proxy.host }}</span>
              </div>
            </template>
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
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  padding: 4px 0;
}
.site-cfg-line {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-width: 0;
}
.site-cfg-label {
  width: 3.2em;
  flex-shrink: 0;
  color: var(--el-text-color-secondary);
}
.site-cfg-value {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.site-cfg-line :deep(.el-link) {
  min-width: 0;
}
.site-cfg-line :deep(.el-link__inner) {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
