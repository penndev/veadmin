<template>
  <div>
    <el-form :inline="true">
      <el-form-item label="名称">
        <el-input v-model="table.query.name" placeholder="名称" clearable />
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

  <el-main class="ea-table">
    <el-button type="primary" icon="Plus" @click="handleDialogAdd">
      新增
    </el-button>
    <el-table
      :data="table.data"
      style="width: 100%"
      @sort-change="handleSortChange"
    >
      <el-table-column prop="id" label="ID" width="80" sortable="custom" />
      <el-table-column prop="name" label="名称" width="160" />
      <el-table-column prop="status" label="状态" width="160">
        <template #default="scope">
          <el-link
            :type="scope.row.status > 0 ? 'success' : 'danger'"
            @click="handleDialogEditStatus(scope.row)"
          >
            {{
              scope.row.status > 0
                ? scope.row.status > 1
                  ? scope.row.status
                  : "开启"
                : "关闭"
            }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column prop="hits" label="热度" width="160" />
      <el-table-column prop="content" label="描述" width="160" />
      <el-table-column prop="updatedAt" label="最近更新" width="200" />
      <el-table-column prop="createdAt" label="创建日期" width="200" />
      <el-table-column fixed="right" label="操作" width="105">
        <template #default="scope">
          <el-button link type="primary" @click="handleDialogEdit(scope.row)">
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDialogDelete(scope.row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <br />

    <el-pagination-plus
      background
      layout="total, sizes, prev, pager, next"
      :total="table.total"
      :default-page-size="table.query.limit"
      @current-change="handleChangePage"
      @size-change="handleChangeLimit"
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
      <el-form-item label="名称" prop="name">
        <el-input v-model="dialog.form.name" />
      </el-form-item>
      <el-form-item label="状态">
        <el-switch
          v-model="dialog.form.status"
          size="large"
          active-text="开启"
          inactive-text="关闭"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>
      <el-form-item label="热度" prop="hits">
        <el-input v-model="dialog.form.hits" />
      </el-form-item>
      <el-form-item label="描述" prop="content">
        <el-input v-model="dialog.form.content" type="textarea" />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialog.visible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitForm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from "vue";

// import api
import { getTag, addTag, updateTag, deleteTag } from "@/apis/archive";
import { ElMessage, ElMessageBox } from "element-plus";

const table = ref({
  total: 0,
  query: {
    limit: 20,
    page: 1,
    order: null,
    name: null,
  },
  data: [],
});
const handleQueryRefresh = () => {
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
const handleSortChange = ({ _, prop, order }) => {
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
  getTag(table.value.query).then((result) => {
    table.value.data = result.data;
    table.value.total = result.total;
  });
};

// 新增编辑数据
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
});
const handleDialogAdd = () => {
  dialog.value.title = "创建数据";
  dialog.value.visible = true;
  dialog.value.formAction = "add";
  dialog.value.form = {};
};
const handleDialogEdit = (row) => {
  dialog.value.title = "创建数据";
  dialog.value.visible = true;
  dialog.value.formAction = "edit";
  dialog.value.form = row;
};
const handleSubmitForm = () => {
  // 提交数据
  dialogRef.value.validate((validate) => {
    if (validate) {
      // 判断表单是否验证通过。
      if (dialog.value.formAction === "add") {
        addTag(dialog.value.form).then((result) => {
          dialog.value.visible = false;
          ElMessage.info(result);
          handleTableData();
        });
      } else if (dialog.value.formAction === "edit") {
        updateTag(dialog.value.form).then((result) => {
          dialog.value.visible = false;
          ElMessage.info(result);
          handleTableData();
        });
        dialog.value.visible = false;
      } else {
        ElMessage.info("提交错误");
      }
    } else {
      ElMessage.error("请输入正确的数据！");
    }
  });
};
const handleDialogEditStatus = (row) => {
  const action = () => {
    updateTag({
      id: row.id,
      status: !row.status,
    }).then((result) => {
      row.status = !row.status;
      ElMessage.info(result);
    });
  };
  if (row.status) {
    ElMessageBox.confirm("请仔细确认是否下架 " + row.name + " ?", "警告", {
      confirmButtonText: "下架",
      cancelButtonText: "取消",
      type: "warning",
    }).then(() => {
      action();
    });
  } else {
    action();
  }
};
const handleDialogDelete = (id) => {
  ElMessageBox.confirm(`请仔细确认是否删除数据[${id}]?`, "警告", {
    confirmButtonText: "删除",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    deleteTag({ id }).then((result) => {
      ElMessage.warning(result);
      handleTableData();
    });
  });
};

handleTableData();
</script>
