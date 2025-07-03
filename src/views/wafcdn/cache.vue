<template>
  <!-- 顶部筛选框 -->
  <div>
    <el-form :inline="true">
      <el-form-item label="路径">
        <el-input v-model="table.query.path" placeholder="/url" clearable />
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
    <el-button
      :icon="table.selectStat ? 'Select' : 'SemiSelect'"
      @click="
        (table.selectStat = !table.selectStat) ? '' : tableRef.clearSelection()
      "
    />

    <el-button
      v-if="table.selectStat"
      size="small"
      @click="tableRef.toggleAllSelection"
    >
      全选/全不选
    </el-button>
    <el-button
      v-if="table.selectStat"
      size="small"
      @click="handleInvertSelection"
    >
      反选
    </el-button>
    <el-button
      v-if="table.selectStat"
      size="small"
      @click="tableRef.clearSelection"
    >
      清空
    </el-button>
    <el-button
      v-if="table.selectStat"
      size="small"
      type="danger"
      @click="handleDeleteMore"
    >
      删除选中
    </el-button>
    <!-- 数据table -->
    <el-table ref="tableRef" :data="table.data" @sort-change="handleSortChange">
      <el-table-column v-if="table.selectStat" type="selection" width="50" />
      <el-table-column label="ID" prop="id" />
      <el-table-column label="站点ID" prop="site_id" />
      <el-table-column label="方法" prop="method"> </el-table-column>
      <el-table-column prop="路径" label="请求地址">
        <template #default="{ row }">
          <el-tooltip placement="top" :content="row.uri" effect="dark">
            <el-text truncated>{{ row.uri }}</el-text>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="缓存日期" align="center">
        <template #default="scope">
          <el-link>{{ timeFormat("Y-m-d H:i:s", scope.row.time) }}</el-link>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="65">
        <template #default="scope">
          <el-button link type="danger" @click="handleDialogDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <br />
    <el-pagination
      background
      layout="total, sizes, prev, pager, next"
      :total="table.total"
      :default-page-size="table.query.limit"
      @current-change="handleChangePage"
      @size-change="handleChangeLimit"
    />
  </el-main>
</template>

<script setup>
import { ref } from "vue";

// import api
import { getCache, deleteCache } from "@/apis/wafcdn/cache";
import { ElMessage, ElMessageBox } from "element-plus";
import { timeFormat } from "penndev/utils";

const tableRef = ref();

const handleInvertSelection = () => {
  table.value.data.forEach((row) => {
    tableRef.value.toggleRowSelection(row);
  });
};

const table = ref({
  selectStat: false,
  total: 0,
  query: {
    limit: 20,
    page: 1,
    order: null,
    path: null,
  },
  data: [],
});

const handleQueryRefresh = (_value) => {
  table.value.query.name = null;
  table.value.query.order = null;
  handleTableData();
};

const handleChangePage = (value) => {
  table.value.query.page = value;
  handleTableData();
};

const handleChangeLimit = (value) => {
  table.value.query.limit = value;
  handleTableData();
};

const handleSortChange = ({ _column, prop, order }) => {
  let orderSymbol = "";
  if (order === "descending") {
    orderSymbol = "-";
  } else if (order === "ascending") {
    orderSymbol = "+";
  }
  table.value.query.order = orderSymbol + prop;
  handleTableData();
};

const handleTableData = () => {
  getCache(table.value.query).then((result) => {
    table.value.data = result.data;
    table.value.total = result.total;
  });
};

const handleDialogDelete = (row) => {
  ElMessageBox.confirm(`请仔细确认是否删除数据[${row.id}]?`, "警告", {
    confirmButtonText: "删除",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    deleteCache({ ids: [row.id] }).then((result) => {
      ElMessage.warning(result);
      handleTableData();
    });
  });
};

const handleDeleteMore = () => {
  const rows = tableRef.value.getSelectionRows();
  let ids = [];
  rows.forEach((row) => {
    ids.push(row.id);
  });
  ElMessageBox.confirm(`请仔细确认是否删除 ${ids.length} 条数据?`, "警告", {
    confirmButtonText: "删除",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    deleteCache({ ids }).then((result) => {
      ElMessage.warning(result);
      handleTableData();
    });
  });
};

handleTableData();
</script>
