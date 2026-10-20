<template>
  <el-drawer
    v-model="dialog.visible"
    :title="dialog.title"
    :close-on-click-modal="false"
    destroy-on-close
    size="920px"
  >
    <el-form
      ref="dialogRef"
      label-position="left"
      label-width="140px"
      :model="dialog.form"
      :rules="dialog.formRule"
    >
      <el-tabs>
        <el-tab-pane label="站点配置">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="dialog.form.remark" />
          </el-form-item>
          <el-form-item
            label="站点目录"
            prop="root"
            :rules="[
              {
                required: true,
                message: '请填写站点目录',
                trigger: 'blur',
              },
            ]"
          >
            <el-input
              v-model="dialog.form.root"
              placeholder="例如 mysite，文件放在 static/mysite"
            />
          </el-form-item>
          <p class="site-hint">
            其余路径都读取这个目录。额外路径只能反向代理或重定向，要改范围直接改路径。
          </p>
          <div class="static-locations-bar">
            <span>额外路径</span>
            <el-button @click="dialog.form.locations.push(emptyLocation(''))">
              添加路径
            </el-button>
          </div>
          <el-card
            v-for="(item, index) in dialog.form.locations"
            :key="index"
            class="static-location"
            shadow="never"
          >
            <el-form-item
              label="路径"
              :prop="'locations.' + index + '.path'"
              :rules="locationPathRules"
            >
              <div class="static-location-head">
                <el-input v-model="item.path" placeholder="例如 / 或 /api" />
                <el-select v-model="item.action">
                  <el-option label="反向代理" value="proxy" />
                  <el-option label="重定向" value="redirect" />
                </el-select>
                <el-button
                  link
                  type="danger"
                  @click="dialog.form.locations.splice(index, 1)"
                >
                  删除
                </el-button>
              </div>
            </el-form-item>
            <SiteProxy
              v-if="item.action === 'proxy'"
              v-model="item.proxy"
              :prop-prefix="'locations.' + index + '.proxy'"
            />
            <template v-else>
              <el-form-item
                label="地址"
                :prop="'locations.' + index + '.redirect'"
                :rules="[{ required: true, message: '请填写重定向地址' }]"
              >
                <el-input
                  v-model="item.redirect"
                  placeholder="https://example.com/path 或 /path"
                />
              </el-form-item>
              <el-form-item label="状态码">
                <el-select v-model="item.code" style="width: 160px">
                  <el-option label="301 永久" :value="301" />
                  <el-option label="302 临时" :value="302" />
                </el-select>
              </el-form-item>
            </template>
          </el-card>
        </el-tab-pane>

        <el-tab-pane label="安全防护">
          <SiteSecurity v-model="dialog.form.security" />
        </el-tab-pane>

        <el-tab-pane label="返回头">
          <p class="sheet-hint">写到响应里。值留空表示删除这个头。</p>
          <div v-if="dialog.form.header.length" class="sheet-head">
            <span>名称</span>
            <span>值</span>
            <span></span>
          </div>
          <div
            v-for="(value, index) in dialog.form.header"
            :key="index"
            class="sheet-row"
          >
            <el-input v-model="value.name" placeholder="名称" />
            <el-input v-model="value.value" placeholder="值" />
            <el-button
              link
              type="danger"
              @click="dialog.form.header.splice(index, 1)"
            >
              删除
            </el-button>
          </div>
          <el-button @click="dialog.form.header.push({ name: '', value: '' })">
            添加返回头
          </el-button>
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

const emptyProxy = () => {
  return {
    server: null,
    host: null,
    keepalive_timeout: null,
    keepalive_requests: null,
    header: [],
    cache: [],
    cache_purge: false,
  };
};

const emptyLocation = (path) => {
  return {
    path,
    action: "proxy",
    redirect: "",
    code: 302,
    proxy: emptyProxy(),
  };
};

const locationPathRules = [
  { required: true, message: "请填写路径", trigger: "blur" },
  {
    validator: (_rule, value, callback) => {
      let path = String(value || "").trim();
      if (path !== "/") {
        path = path.replace(/\/+$/, "");
      }
      if (!path.startsWith("/")) {
        callback(new Error("路径必须以 / 开头"));
        return;
      }
      if (
        path === "" ||
        path.includes("..") ||
        path.includes("//") ||
        path.includes("?") ||
        path.includes("#") ||
        path.includes("\\")
      ) {
        callback(new Error("路径不合法"));
        return;
      }
      callback();
    },
    trigger: "blur",
  },
];

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
  dialog.value.title = "新增站点";
  dialog.value.visible = true;
  dialog.value.formAction = "add";
  dialog.value.form = {
    header: [],
    root: "",
    locations: [],
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
      captcha: false,
    },
  };
};

const handleDialogEdit = (row) => {
  dialog.value.title = "修改 " + row.remark + " 的配置";
  dialog.value.formAction = "edit";
  const form = JSON.parse(JSON.stringify(row));
  if (!form.header) {
    form.header = [];
  }
  if (!form.locations) {
    form.locations = [];
  }
  form.locations.forEach((item) => {
    if (item.action !== "redirect") {
      item.action = "proxy";
    }
    if (!item.code) {
      item.code = 302;
    }
    if (!item.proxy) {
      item.proxy = emptyProxy();
    }
    if (!item.proxy.header) {
      item.proxy.header = [];
    }
    if (!item.proxy.cache) {
      item.proxy.cache = [];
    }
  });
  dialog.value.form = form;
  dialog.value.visible = true;
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

<style scoped>
.site-hint {
  margin: 0 0 16px 140px;
  font-size: 13px;
  line-height: 1.5;
  color: var(--el-text-color-secondary);
}
.static-locations-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 8px 0 12px;
  font-size: 14px;
  font-weight: 600;
}
.static-location {
  margin-bottom: 12px;
}
.static-location :deep(.el-card__body) {
  padding: 16px 16px 4px;
}
.static-location-head {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}
.static-location-head .el-input {
  flex: 1;
}
.static-location-head .el-select {
  width: 140px;
  flex: none;
}
.sheet-hint {
  margin: 0 0 12px;
  font-size: 13px;
  line-height: 1.5;
  color: var(--el-text-color-secondary);
}
.sheet-head,
.sheet-row {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr) 48px;
  gap: 8px;
  align-items: center;
}
.sheet-head {
  margin-bottom: 6px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
.sheet-row {
  margin-bottom: 8px;
}
</style>
