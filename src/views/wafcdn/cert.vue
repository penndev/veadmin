<template>
  <el-form :inline="true">
    <el-form-item label="备注">
      <el-input v-model="table.query.remark" placeholder="备注" clearable />
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

  <el-main class="ea-table">
    <el-button type="primary" icon="Plus" @click="dialog.handleDialogAdd">
      新增
    </el-button>

    <el-table :data="table.data">
      <el-table-column label="ID" prop="id" width="80" />
      <el-table-column label="备注" prop="remark" min-width="140" />
      <el-table-column label="覆盖域名" min-width="220">
        <template #default="scope">
          <div class="cert-names">
            <el-tag v-if="scope.row.wildcard" size="small" type="warning">
              *.{{ scope.row.domain }}
            </el-tag>
            <el-tag
              v-for="name in scope.row.certInfo?.dns_names || []"
              :key="name"
              size="small"
            >
              {{ name }}
            </el-tag>
            <span
              v-if="
                !scope.row.wildcard &&
                !(scope.row.certInfo?.dns_names || []).length
              "
              >未解析</span
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column label="到期时间" min-width="170">
        <template #default="scope">
          {{ scope.row.certInfo?.not_after || "-" }}
        </template>
      </el-table-column>
      <el-table-column label="邮箱" prop="email" min-width="160" />
      <el-table-column fixed="right" label="操作" width="150">
        <template #default="scope">
          <div>
            <el-link type="primary" @click="dialog.handleDialogEdit(scope.row)">
              编辑
            </el-link>
          </div>
          <div>
            <el-link type="primary" @click="table.handleAcmeAction(scope.row)">
              申请证书
            </el-link>
          </div>
          <div>
            <el-link
              type="danger"
              @click="dialog.handleDialogDelete(scope.row.id)"
            >
              删除
            </el-link>
          </div>
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

  <el-dialog
    v-model="dialog.visible"
    :title="dialog.title"
    :close-on-click-modal="false"
    destroy-on-close
    width="720px"
  >
    <el-form ref="dialogRef" label-width="auto" :model="dialog.form">
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dialog.form.remark" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="dialog.form.email" placeholder="申请证书时使用" />
      </el-form-item>
      <el-form-item label="域名" prop="domain">
        <el-input v-model="dialog.form.domain" placeholder="example.com" />
      </el-form-item>
      <el-form-item label="泛解析" prop="wildcard">
        <el-switch
          v-model="dialog.form.wildcard"
          inline-prompt
          active-icon="Check"
          inactive-icon="Close"
        />
        <small>&nbsp; 开启后这张证书同时包含域名和 *.域名</small>
      </el-form-item>
      <el-form-item label="证书" prop="publicKey">
        <el-input
          v-model="dialog.form.publicKey"
          :autosize="{ minRows: 4, maxRows: 16 }"
          type="textarea"
        />
      </el-form-item>
      <el-form-item label="私钥" prop="privateKey">
        <el-input
          v-model="dialog.form.privateKey"
          :autosize="{ minRows: 4, maxRows: 16 }"
          type="textarea"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialog.visible = false">取消</el-button>
      <el-button type="primary" @click="dialog.handleSubmitForm"
        >确定</el-button
      >
    </template>
  </el-dialog>
</template>

<script setup>
import { h, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getCert,
  postCert,
  putCert,
  deleteCert,
  postCertAcme,
} from "@/apis/wafcdn/cert";

const dialogRef = ref(null);

const table = ref({
  total: 0,
  query: {
    limit: 20,
    page: 1,
    remark: null,
  },
  data: [],
  handleTableData: () => {
    getCert(table.value.query).then((result) => {
      table.value.data = result.data;
      table.value.total = result.total;
    });
  },
  handleQueryRefresh: () => {
    table.value.query.remark = null;
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
  handleAcmeAction: (row) => {
    if (!row.email || !row.domain) {
      ElMessage.warning("请先填写邮箱和域名");
      return;
    }
    postCertAcme({
      id: row.id,
      remark: row.remark,
      email: row.email,
      wildcard: row.wildcard,
      domain: row.domain,
    }).then((result) => {
      if (result && result.dns) {
        const text = (result.records || [])
          .map((item) => item.name + "\nTXT " + item.value)
          .join("\n\n");
        ElMessageBox.confirm(
          h(
            "div",
            { style: "white-space: pre-wrap; word-break: break-all" },
            text,
          ),
          "添加 DNS TXT 后继续",
          {
            confirmButtonText: "已添加，继续",
            cancelButtonText: "取消",
          },
        ).then(() => {
          postCertAcme({ session: result.session }).then((done) => {
            ElMessage.success(done.message || done);
            table.value.handleTableData();
          });
        });
        return;
      }
      ElMessage.success(result.message || result);
      table.value.handleTableData();
    });
  },
});

const dialog = ref({
  visible: false,
  title: "",
  form: {},
  formAction: "add",
  handleDialogAdd: () => {
    dialog.value.title = "新增证书";
    dialog.value.formAction = "add";
    dialog.value.form = {
      remark: "",
      email: "",
      wildcard: false,
      domain: "",
      publicKey: "",
      privateKey: "",
    };
    dialog.value.visible = true;
  },
  handleDialogEdit: (row) => {
    dialog.value.title = "编辑证书";
    dialog.value.formAction = "edit";
    dialog.value.form = JSON.parse(JSON.stringify(row));
    dialog.value.visible = true;
  },
  handleSubmitForm: () => {
    dialog.value.form.domain = String(dialog.value.form.domain || "")
      .trim()
      .replace(/^\*\./, "");
    if (!dialog.value.form.domain) {
      ElMessage.warning("请填写域名");
      return;
    }
    const request = dialog.value.formAction === "add" ? postCert : putCert;
    request(dialog.value.form).then((result) => {
      dialog.value.visible = false;
      ElMessage.info(result);
      table.value.handleTableData();
    });
  },
  handleDialogDelete: (id) => {
    ElMessageBox.confirm(`请仔细确认是否删除证书[${id}]?`, "警告", {
      confirmButtonText: "删除",
      cancelButtonText: "取消",
      type: "warning",
    }).then(() => {
      deleteCert({ id }).then((result) => {
        ElMessage.warning(result);
        table.value.handleTableData();
      });
    });
  },
});

table.value.handleTableData();
</script>

<style scoped>
.cert-names {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
</style>
