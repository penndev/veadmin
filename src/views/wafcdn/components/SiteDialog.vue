<template>
  <el-drawer
    v-model="dialog.visible"
    :title="dialog.title"
    :close-on-click-modal="false"
    destroy-on-close
    size="80%"
  >
    <el-form
      ref="dialogRef"
      label-position="left"
      :model="dialog.form"
      :rules="dialog.formRule"
    >
      <el-tabs type="border-card">
        <el-tab-pane label="备注设置">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="dialog.form.remark" />
          </el-form-item>
          <el-form-item label="站点类型" prop="type">
            <el-select v-model="dialog.form.type" placeholder="站点类型">
              <el-option key="proxy" label="反向代理" value="proxy" />
            </el-select>
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane label="安全防护">
          <SiteSecurity v-model="dialog.form.security" />
        </el-tab-pane>

        <el-tab-pane label="返回头">
          <el-row
            v-for="(value, index) in dialog.form.header"
            :key="index"
            :gutter="10"
            style="margin: 12px auto"
          >
            <el-col :span="11">
              <el-input v-model="value.name" placeholder="名" />
            </el-col>
            <el-col :span="11">
              <el-input v-model="value.value" placeholder="值" />
            </el-col>
            <el-col :span="2" style="text-align: center">
              <el-button
                icon="Delete"
                type="danger"
                circle
                @click="dialog.form.header.splice(index, 1)"
              />
            </el-col>
          </el-row>
          <el-button
            type="primary"
            icon="Plus"
            circle
            @click="dialog.form.header.push({ name: null, value: null })"
          />
        </el-tab-pane>
        <!-- 反向代理配置 -->
        <el-tab-pane v-if="dialog.form.type === 'proxy'" label="反向代理">
          <SiteProxy v-model="dialog.form.proxy" />
        </el-tab-pane>
      </el-tabs>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialog.visible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitForm">确定</el-button>
      </span>
    </template>
  </el-drawer>
</template>

<script setup>
import { ref } from "vue";
import { postSite, putSite, deleteSite } from "@/apis/wafcdn/site";
import { ElMessage, ElMessageBox } from "element-plus";

import SiteSecurity from "./SiteDialogSecurity.vue";
import SiteProxy from "./SiteDialogProxy.vue";

const props = defineProps({
  handleTableData: {
    type: Function,
    required: true,
  },
});

// 2. 赋值给变量（可以换名字或封装）
const handleTableData = props.handleTableData;

const dialogRef = ref(null);

const dialog = ref({
  visible: false,
  title: "dialog",
  form: {},
  formRule: {
    remark: [{ required: true, message: "必须备注站点", trigger: "blur" }],
  },
  formAction: "add", // add|edit
});

const handleDialogAdd = () => {
  dialog.value.title = "绑定新域名";
  dialog.value.visible = true;
  dialog.value.formAction = "add";
  dialog.value.form = {
    header: [],
    type: "proxy",
    proxy: {
      service: null,
      host: null,
      keepalive_timeout: null,
      keepalive_requests: null,
      header: [],
      cache: [],
    },
    security: {
      ip: {
        status: false,
        region: [],
        allowed: true,
      },
      limit: {
        status: false,
        rate: null,
        queries: null,
        seconds: null,
      },
      sign: {
        status: false,
        method: null,
        key: null,
        expire_args: null,
        sign_args: null,
      },
      cors: {
        status: false,
        origin: null,
        method: null,
        header: null,
        credentials: null,
        age: null,
      },
    },
  };
};

const handleDialogEdit = (row) => {
  dialog.value.title = "修改 " + row.remark + " 的配置";
  dialog.value.visible = true;
  dialog.value.formAction = "edit";
  // 对对象进行copy
  dialog.value.form = JSON.parse(JSON.stringify(row));
};

const handleSubmitForm = () => {
  // 提交数据
  dialogRef.value.validate((validate) => {
    if (validate) {
      // 判断表单是否验证通过。
      if (dialog.value.formAction === "add") {
        postSite(dialog.value.form).then((_) => {
          dialog.value.visible = false;
          ElMessage.info("新增完成");
          handleTableData();
        });
      } else if (dialog.value.formAction === "edit") {
        putSite(dialog.value.form).then((_) => {
          dialog.value.visible = false;
          ElMessage.info("修改完成");
          handleTableData();
        });
      } else {
        ElMessage.error("提交错误");
      }
    } else {
      ElMessage.error("请输入正确的数据！");
    }
  });
};

const handleDialogDelete = (row) => {
  ElMessageBox.confirm(`请仔细确认是否删除数据[${row.remark}]?`, "警告", {
    confirmButtonText: "删除",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    deleteSite({ id: row.id }).then((_) => {
      ElMessage.info("删除完成");
      handleTableData();
    });
  });
};

defineExpose({
  handleDialogAdd,
  handleDialogEdit,
  handleDialogDelete,
});
</script>
