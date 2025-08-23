<template>
  <!-- 顶部筛选框 -->
  <el-form :inline="true">
    <el-form-item label="域名">
      <el-input v-model="table.query.domain" placeholder="域名" clearable />
    </el-form-item>
    <el-form-item label="备注">
      <el-input v-model="table.query.remark" placeholder="备注" clearable />
    </el-form-item>
    <el-form-item label="站点ID">
      <el-input
        v-model="table.query.SiteId"
        placeholder="绑定站点ID"
        clearable
      />
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
    <!-- 数据操作按钮 -->
    <el-row>
      <el-button type="primary" icon="Plus" @click="dialog.handleDialogAdd">
        新增
      </el-button>
    </el-row>

    <!-- 数据table -->
    <el-table
      ref="tableRef"
      :data="table.data"
      @sort-change="table.handleSortChange"
    >
      <el-table-column v-if="table.selectStat" type="selection" width="50" />
      <el-table-column label="ID" prop="id" width="80" sortable="custom" />
      <el-table-column label="域名" prop="domain" align="center" />
      <el-table-column label="备注" prop="remark" align="center" />
      <el-table-column label="站点ID" prop="SiteId" sortable="custom" />
      <el-table-column label="SSL证书配置" align="center">
        <template #default="scope">
          <div>
            <span>状态:</span>
            <el-text :type="scope.row.ssl ? 'success' : 'danger'">
              {{ scope.row.ssl ? "启用" : "禁用" }}
            </el-text>
          </div>
          <div>
            <span>跳转:</span>
            <el-text>
              {{ scope.row.sslForce ? "HTTP跳转HTTPS" : "允许HTTP访问" }}
            </el-text>
          </div>
          <div>
            <span>邮箱:</span>
            <span>
              {{ scope.row.sslEmail || "未设置" }}
            </span>
          </div>
          <div>
            <el-popover width="400">
              <template #reference>
                <el-link size="small">查看证书详情</el-link>
              </template>
              <template #default>
                <pre>{{ JSON.stringify(scope.row.certInfo, null, 2) }}</pre>
              </template>
            </el-popover>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="updatedAt" label="最近更新" />
      <el-table-column prop="createdAt" label="创建日期" />
      <el-table-column fixed="right" label="操作">
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
            type="primary"
            @click="table.handleAcmeAction(scope.row)"
          >
            申请免费证书
          </el-button>
          <el-button
            link
            type="danger"
            @click="dialog.handleDialogDelete(scope.row.id)"
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
      <el-form-item label="域名" prop="domain">
        <el-input v-model="dialog.form.domain" />
      </el-form-item>
      <el-form-item label="域名备注" prop="remark">
        <el-input v-model="dialog.form.remark" />
      </el-form-item>
      <el-form-item label="绑定站点" prop="SiteId">
        <el-input-number v-model="dialog.form.SiteId" />
      </el-form-item>
      <el-form-item label="HTTPS状态" prop="ssl">
        <el-switch
          v-model="dialog.form.ssl"
          inline-prompt
          active-icon="Check"
          inactive-icon="Close"
        />
      </el-form-item>
      <el-form-item label="强制HTTPS访问" prop="sslForce">
        <el-switch
          v-model="dialog.form.sslForce"
          inline-prompt
          active-icon="Check"
          inactive-icon="Close"
        />
      </el-form-item>
      <el-form-item label="证书邮箱" prop="sslEmail">
        <el-input v-model="dialog.form.sslEmail" />
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="私钥" prop="privateKey">
            <el-input
              v-model="dialog.form.privateKey"
              :autosize="{ minRows: 4, maxRows: 30 }"
              resize="vertical"
              type="textarea"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="证书" prop="publicKey">
            <el-input
              v-model="dialog.form.publicKey"
              :autosize="{ minRows: 4, maxRows: 30 }"
              resize="vertical"
              type="textarea"
            />
          </el-form-item>
        </el-col>
      </el-row>
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

// import api
import {
  getDomain,
  postDomain,
  putDomain,
  deleteDomain,
  postAcme,
} from "@/apis/wafcdn/domain";
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
    getDomain(table.value.query).then((result) => {
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
  handleInvertSelection: () => {
    table.value.data.forEach((row) => {
      tableRef.value.toggleRowSelection(row);
    });
  },
  handleAcmeAction: (row) => {
    // 申请免费证书
    ElMessageBox.confirm(`请仔细确认是否申请免费证书[${row.name}]?`, "警告", {
      confirmButtonText: "申请",
      cancelButtonText: "取消",
      type: "warning",
    }).then(() => {
      postAcme(row).then((result) => {
        ElMessage.success(result);
        table.value.handleTableData();
      });
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
    name: [
      { required: true, message: "域名", trigger: "blur" },
      { min: 3, message: "域名名最少为3个字符", trigger: "blur" },
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
  handleSubmitForm: () => {
    // 提交数据
    dialogRef.value.validate((validate) => {
      if (validate) {
        // 判断表单是否验证通过。
        if (dialog.value.formAction === "add") {
          postDomain(dialog.value.form).then((result) => {
            dialog.value.visible = false;
            ElMessage.info(result);
            table.value.handleTableData();
          });
        } else if (dialog.value.formAction === "edit") {
          putDomain(dialog.value.form).then((result) => {
            dialog.value.visible = false;
            ElMessage.info(result);
            table.value.handleTableData();
          });
        } else {
          ElMessage.error("提交错误");
        }
      } else {
        ElMessage.error("请输入正确的数据！");
      }
    });
  },
  handleDialogDelete: (id) => {
    ElMessageBox.confirm(`请仔细确认是否删除数据[${id}]?`, "警告", {
      confirmButtonText: "删除",
      cancelButtonText: "取消",
      type: "warning",
    }).then(() => {
      deleteDomain({ id }).then((result) => {
        ElMessage.warning(result);
        table.value.handleTableData();
      });
    });
  },
});

table.value.handleTableData();
</script>

<style scoped>
.el-textarea__inner {
  white-space: pre-wrap !important;
  overflow-x: auto !important;
}
</style>
