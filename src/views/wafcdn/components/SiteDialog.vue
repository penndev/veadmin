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
          <el-form-item label="绑定域名">
            <el-select
              v-model="dialog.form.domainIds"
              multiple
              filterable
              clearable
              style="width: 100%"
              placeholder="可绑定多个域名"
            >
              <el-option
                v-for="item in domains"
                :key="item.id"
                :label="domainLabel(item)"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="站点类型" prop="type">
            <el-select v-model="dialog.form.type" placeholder="站点类型">
              <el-option key="proxy" label="反向代理" value="proxy" />
              <el-option key="static" label="静态站点" value="static" />
            </el-select>
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane label="安全防护">
          <SiteSecurity v-model="dialog.form.security" />
        </el-tab-pane>

        <el-tab-pane label="返回头">
          <span></span>
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
              <el-input
                v-model="value.value"
                placeholder="值 如果不设置则为删除本请求头"
              />
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
        <el-tab-pane v-if="dialog.form.type === 'static'" label="静态站点">
          <el-form-item
            label="目录名"
            prop="static.root"
            :rules="[
              {
                required: true,
                message: '请填写静态站点目录名',
                trigger: 'blur',
              },
            ]"
          >
            <el-input
              v-model="dialog.form.static.root"
              placeholder="相对静态根目录的路径，例如 mysite"
            />
          </el-form-item>
          <el-text type="info">
            保存后会在数据根目录的 static
            子目录下创建该目录，可到「文件管理」上传文件。
          </el-text>
          <div
            v-for="(item, index) in dialog.form.static.locations"
            :key="index"
            style="margin-top: 16px"
          >
            <el-form-item
              label="路径"
              :prop="'static.locations.' + index + '.path'"
              :rules="locationPathRules"
            >
              <el-input v-model="item.path" placeholder="/api" />
            </el-form-item>
            <el-button
              type="danger"
              @click="dialog.form.static.locations.splice(index, 1)"
            >
              删除该路径
            </el-button>
            <SiteProxy
              v-model="item.proxy"
              :prop-prefix="'static.locations.' + index + '.proxy'"
            />
          </div>
          <el-button
            type="primary"
            style="margin-top: 12px"
            @click="
              dialog.form.static.locations.push({
                path: '',
                proxy: emptyProxy(),
              })
            "
          >
            添加路径反代
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
import { getDomain } from "@/apis/wafcdn/domain";
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
const domains = ref([]);

const loadDomains = () => {
  getDomain({ page: 1, limit: 500 }).then((result) => {
    domains.value = result.data || [];
  });
};

const domainLabel = (item) => {
  const name = item.domain;
  if (item.SiteId) {
    return name + "（站点" + item.SiteId + "）";
  }
  return name;
};

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

const locationPathRules = [
  { required: true, message: "请填写路径", trigger: "blur" },
  {
    validator: (_rule, value, callback) => {
      const path = String(value || "")
        .trim()
        .replace(/\/+$/, "");
      if (!path.startsWith("/")) {
        callback(new Error("路径必须以 / 开头"));
        return;
      }
      if (
        path === "/" ||
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
  loadDomains();
  dialog.value.title = "绑定新域名";
  dialog.value.visible = true;
  dialog.value.formAction = "add";
  dialog.value.form = {
    domainIds: [],
    header: [],
    type: "proxy",
    static: {
      root: "",
      locations: [],
    },
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
  loadDomains();
  dialog.value.title = "修改 " + row.remark + " 的配置";
  dialog.value.formAction = "edit";
  // 对对象进行copy
  const form = JSON.parse(JSON.stringify(row));
  form.domainIds = (form.Domains || []).map((item) => item.id);
  if (!form.static) {
    form.static = { root: "", locations: [] };
  }
  if (!form.static.locations) {
    form.static.locations = [];
  }
  form.static.locations.forEach((item) => {
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
