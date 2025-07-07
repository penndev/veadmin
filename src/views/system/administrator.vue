<template>
  <el-form :inline="true">
    <el-form-item label="管理员">
      <el-input
        v-model="table.query.email"
        placeholder="管理员邮箱"
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
      <el-table-column prop="email" label="邮箱" min-width="240" />
      <el-table-column prop="nickname" label="名称" min-width="160" />
      <el-table-column prop="SysRole.name" label="权限" min-width="160" />
      <el-table-column prop="status" label="状态" min-width="120">
        <template #default="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            size="large"
            inline-prompt
            active-text="启用"
            inactive-text="禁用"
            :disabled="true"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建日期" width="200" />
      <el-table-column fixed="right" label="操作" width="120">
        <template #default="scope">
          <el-button link type="primary" @click="handleDialogEdit(scope.row)">
            编辑
          </el-button>
          <el-button link type="danger" @click="handleDialogDelete(scope.row)">
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
  <!-- 新增编辑弹窗 -->
  <el-dialog
    v-model="dialog.visible"
    :title="dialog.title"
    :close-on-click-modal="false"
    destroy-on-close
    close-on-press-escape
    center
  >
    <el-form ref="dialogRef" :model="dialog.form" :rules="dialog.formRule">
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="dialog.form.email" />
      </el-form-item>
      <el-form-item label="密码" prop="passwd">
        <el-input
          v-if="dialog.resetPasswd == true || dialog.formAction == 'add'"
          v-model="dialog.form.passwd"
          type="password"
          show-password
        >
          <template v-if="dialog.formAction == 'edit'" #append>
            <el-button size="small" @click="dialog.resetPasswd = false">
              取消
            </el-button>
          </template>
        </el-input>
        <el-button
          v-if="dialog.formAction == 'edit' && dialog.resetPasswd == false"
          size="small"
          @click="dialog.resetPasswd = true"
        >
          重置密码
        </el-button>
      </el-form-item>

      <el-form-item label="两步验证">
        <el-switch
          v-model="dialog.form.otpStatus"
          :active-value="1"
          :inactive-value="0"
        />
        &nbsp;
        <div
          v-if="dialog.form.otpStatus"
          style="display: flex; align-items: center; gap: 10px"
        >
          <el-input v-model="dialog.form.otpTitle" placeholder="验证器名称" />
          <el-popover :visible="dialog.otp.visible" width="400">
            <div
              style="
                text-align: center;
                display: flex;
                flex-direction: column;
                align-items: center;
              "
            >
              <p style="text-align: left; margin-bottom: 10px">
                <strong>使用的应用程序步骤介绍：</strong><br />
                1. 下载并安装OTP验证器(Google Authenticator,
                腾讯身份验证器等)<br />
                2. 打开应用程序，点击“+”按钮添加新账户。<br />
                3. 选择“扫描条形码”并使用手机扫描下方的二维码。<br />
                4. 谷歌验证器会生成一个动态验证码，输入该验证码完成绑定。<br />
              </p>
              <img
                v-if="dialog.otp.uri"
                :src="`https://api.qrserver.com/v1/create-qr-code/?data=${dialog.otp.uri}&size=150x150`"
                alt="验证器参数"
                style="
                  margin-bottom: 10px;
                  border: 1px solid gray;
                  border-radius: 5px;
                "
              />
              <el-input
                v-model="dialog.otp.code"
                type="number"
                max="999999"
                min="100000"
                placeholder="请输入验证码"
                style="margin-bottom: 10px; width: 200px"
              />
              <el-button type="primary" @click="handleVerifyOtpSecret">
                确认添加
              </el-button>
            </div>
            <template #reference>
              <el-button @click="handleAddOtpSecret"> 添加 </el-button>
            </template>
          </el-popover>
        </div>
      </el-form-item>

      <!-- <el-input v-model="dialog.form.otpSecret" /> -->

      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="dialog.form.nickname" />
      </el-form-item>
      <el-form-item label="权限" prop="SysRoleId">
        <el-select
          v-model="dialog.form.SysRoleId"
          filterable
          remote
          remote-show-suffix
          placeholder="输入权限名称来搜索权限列表"
          :remote-method="handleRoleSelectSearch"
          :loading="dialog.roleSelect.loading"
        >
          <el-option
            v-for="item in dialog.roleSelect.options"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-switch
          v-model="dialog.form.status"
          :active-value="1"
          :inactive-value="0"
          active-text="启用账号"
          inactive-text="禁用账号"
        />
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
import {
  getSystemAdmin,
  postSystemAdmin,
  putSystemAdmin,
  deleteSystemAdmin,
  getOTPSecret,
  verifyOTPSecret,
} from "@/apis/system/administrator";
import { ElMessage, ElMessageBox } from "element-plus";
import { getSystemRole } from "@/apis/system/permission";

const table = ref({
  total: 0,
  query: {
    limit: 20,
    page: 1,
    order: null,
    email: null,
  },
  data: [],
});
const handleQueryRefresh = () => {
  table.value.query.email = null;
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
  getSystemAdmin(table.value.query).then((result) => {
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
    SysRoleId: [{ required: true, message: "角色", trigger: "blur" }],
  },
  formAction: "add", // add|edit
  roleSelect: {
    // 权限数据辅助框
    value: null,
    loading: false,
    options: [],
  },
  resetPasswd: false, // 是否重置密码
  otp: {
    // 二维码数据
    visible: false, // 是否显示两步验证
    uri: "", // 二维码文本内容
    code: null, // 二维码验证码
    secret: null, // 二维码密钥
  },
});
const handleAddOtpSecret = () => {
  // 发送请求添加两步验证
  getOTPSecret({
    topic: import.meta.env.VE_NAME,
    title: dialog.value.form.otpTitle,
  }).then((result) => {
    dialog.value.otp.secret = result.secret;
    dialog.value.otp.uri = result.uri;
    dialog.value.otp.visible = true;
  });
};
const handleVerifyOtpSecret = () => {
  // 验证两步验证
  if (dialog.value.otp.code == null) {
    ElMessage.error("请输入验证码");
    return;
  }
  verifyOTPSecret({
    code: dialog.value.otp.code,
    secret: dialog.value.otp.secret,
  }).then((result) => {
    console.log(result);
    ElMessage.success("验证成功");
    dialog.value.otp.visible = false;
    dialog.value.form.otpSecret = dialog.value.otp.secret;
  });
};
const handleDialogAdd = () => {
  dialog.value.title = "创建数据";
  dialog.value.visible = true;
  dialog.value.formAction = "add";
  dialog.value.form = {};
};
const handleDialogEdit = (row) => {
  if (row.SysRoleId < 1) {
    ElMessage.warning("超级管理员不允许被编辑");
    return;
  }
  dialog.value.title = `编辑数据(${row.id})`;
  dialog.value.visible = true;
  dialog.value.formAction = "edit";
  dialog.value.form = row;
};
const handleDialogDelete = (row) => {
  if (row.id <= 1) {
    ElMessage.warning("超级管理员不允许被编辑");
    return;
  }
  ElMessageBox.confirm(`请仔细确认是否删除管理员《${row.email}》 ?`, "警告", {
    confirmButtonText: "删除",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    deleteSystemAdmin({ id: row.id }).then((result) => {
      ElMessage.warning(result);
      handleTableData();
    });
  });
};
const handleSubmitForm = () => {
  // 提交数据
  dialogRef.value.validate((validate) => {
    if (validate) {
      // 判断表单是否验证通过。
      if (dialog.value.formAction === "add") {
        postSystemAdmin(dialog.value.form).then((result) => {
          dialog.value.visible = false;
          ElMessage.info(result);
          handleTableData();
        });
      } else if (dialog.value.formAction === "edit") {
        putSystemAdmin(dialog.value.form).then((result) => {
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
const handleRoleSelectSearch = async (query) => {
  const roleList = await getSystemRole({ page: 1, limit: 20, name: query });
  dialog.value.roleSelect.options = roleList.data;
};

handleTableData();
</script>
