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
  <!-- 数据table -->
  <el-main class="ea-table">
    <el-row>
      <el-button type="primary" icon="Plus" @click="dialog.handleDialogAdd">
        新建任务
      </el-button>
      <el-button type="danger" @click="dialog.handleDialogDelete">
        清空记录
      </el-button>
    </el-row>
    <br />
    <el-table
      ref="tableRef"
      :data="table.data"
      @sort-change="table.handleSortChange"
    >
      <el-table-column v-if="table.selectStat" type="selection" width="50" />
      <el-table-column label="ID" prop="id" width="80" sortable="custom" />
      <el-table-column label="站点" prop="site_id" />
      <el-table-column label="路径" prop="uri" />
      <el-table-column label="完成状态" prop="status" />
      <el-table-column-truncated label="日志" prop="log" />
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
      <el-form-item label="站点" prop="site_id">
        <el-input-number v-model="dialog.form.site_id" />
      </el-form-item>
      <el-form-item label="链接" prop="uri">
        <el-input v-model="dialog.form.uri" />
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
import {
  clearCache,
  getCacheDelete,
  putCacheDelete,
} from "@/apis/wafcdn/cache";
import { ElMessage, ElMessageBox } from "element-plus";

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
    getCacheDelete(table.value.query).then((result) => {
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
    site_id: [{ required: true, message: "站点ID", trigger: "blur" }],
    url: [{ required: true, message: "任务链接", trigger: "blur" }],
  },
  formAction: "add", // add|edit
  handleDialogAdd: () => {
    dialog.value.title = "创建数据";
    dialog.value.visible = true;
    dialog.value.formAction = "add";
    dialog.value.form = {};
  },
  handleSubmitForm: () => {
    // 提交数据
    dialogRef.value.validate((validate) => {
      if (validate) {
        // 判断表单是否验证通过。
        putCacheDelete(dialog.value.form).then((result) => {
          dialog.value.visible = false;
          ElMessage.info(result);
          table.value.handleTableData();
        });
      } else {
        ElMessage.error("请输入正确的数据！");
      }
    });
  },
  handleDialogDelete: () => {
    ElMessageBox.confirm(`请仔细确认是否清空全部记录?`, "警告", {
      confirmButtonText: "清空",
      cancelButtonText: "取消",
      type: "warning",
    }).then(() => {
      clearCache().then((result) => {
        ElMessage.warning(result);
        table.value.handleTableData();
      });
    });
  },
});

table.value.handleTableData();
</script>
