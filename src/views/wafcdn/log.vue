<template>
  <!-- 顶部筛选框 -->
  <el-form :inline="true">
    <el-form-item label="名称">
      <el-input v-model="table.query.name" placeholder="名称" clearable />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" icon="search" @click="table.handleTableData">
        查询
      </el-button>
      <el-button type="info" icon="Refresh" @click="table.handleQueryRefresh">
        重置
      </el-button>
    </el-form-item>
  </el-form>

  <!-- 数据展示框 -->
  <el-main class="ea-table">
    <!-- 数据table -->
    <el-table
      ref="tableRef"
      :data="table.data"
      @sort-change="table.handleSortChange"
    >
      <el-table-column v-if="table.selectStat" type="selection" width="50" />
      <el-table-column label="ID" prop="id" width="80" sortable="custom" />
      <el-table-column label="站点ID" prop="site_id" align="center" />
      <el-table-column label="域名" prop="host" align="center" />
      <el-table-column label="客户端IP" prop="remote_addr" align="center" />
      <el-table-column-truncated label="访问来源" prop="http_referer" />
      <el-table-column-truncated label="访问设备" prop="http_user_agent" />
      <el-table-column label="请求网址" prop="request" align="center" />
      <el-table-column label="请求方法" prop="request_method" align="center" />
      <el-table-column label="请求时间" prop="request_time" align="center" />
      <el-table-column label="响应状态" prop="status" align="center" />
      <el-table-column label="请求大小" prop="bytes_received" align="center" />
      <el-table-column label="返回大小" prop="bytes_sent" align="center" />
      <el-table-column prop="createdAt" label="创建日期" />
    </el-table>

    <br />

    <el-pagination-plus
      v-model:default-page-size="table.query.limit"
      :total="table.total"
      @current-change="table.handleChangePage"
      @size-change="table.handleChangeLimit"
    />
  </el-main>

  <!-- 处理数据|新增编辑 -->
  <el-dialog
    v-model="dialog.visible"
    :title="dialog.title"
    :close-on-click-modal="false"
    destroy-on-close
    close-on-press-escape
    center
  >
    <el-form
      ref="dialogRef"
      label-position="left"
      :model="dialog.form"
      :rules="dialog.formRule"
    >
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="dialog.form.email" />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialog.visible = false">取消</el-button>
        <el-button type="primary" @click="dialog.handleSubmitForm"
          >确定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from "vue";
import { getLog } from "@/apis/wafcdn/log";

const tableRef = ref();

const table = ref({
  selectStat: false,
  total: 0,
  query: {
    limit: 20,
    page: 1,
    order: null,
    name: null,
  },
  data: [],
  handleTableData: () => {
    getLog(table.value.query).then((result) => {
      table.value.data = result.data;
      table.value.total = result.total;
    });
  },
  handleQueryRefresh: () => {
    table.value.query.name = null;
    table.value.query.order = null;
    table.value.handleTableData();
  },
  handleChangePage: (value) => {
    table.value.query.page = value;
    table.value.handleTableData();
  },
  handleChangeLimit: (value) => {
    table.value.query.limit = value;
    table.value.handleTableData();
  },
  handleSortChange: ({ _, prop, order }) => {
    let orderSymbol = "";
    if (order === "descending") {
      orderSymbol = "-";
    } else if (order === "ascending") {
      orderSymbol = "+";
    }
    table.value.query.order = orderSymbol + prop;
    table.value.handleTableData();
  },
  handleAllSelection: () => {
    table.value.data.forEach((row) => {
      tableRef.value.toggleAllSelection(row);
    });
  },
  handleInvertSelection: () => {
    table.value.data.forEach((row) => {
      tableRef.value.toggleRowSelection(row);
    });
  },
});

// dialog 的 element 实例
const dialogRef = ref(null);

const dialog = ref({
  visible: false,
  title: "dialog",
  form: {},
  formRule: {
    email: [
      { required: true, message: "邮箱", trigger: "blur" },
      { min: 5, message: "用户名最少为5个字符", trigger: "blur" },
    ],
  },
  formAction: "add", // add|edit
  handleDialogAdd: () => {
    dialog.value.title = "创建数据";
    dialog.value.visible = true;
    dialog.value.formAction = "add";
    dialog.value.form = {};
  },
  handleDialogEdit: (row) => {
    dialog.value.title = "编辑数据";
    dialog.value.visible = true;
    dialog.value.formAction = "edit";
    dialog.value.form = row;
  },
});

table.value.handleTableData();
</script>
