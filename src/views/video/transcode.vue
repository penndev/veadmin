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
      <el-table-column
        fixed
        prop="id"
        label="ID"
        width="80"
        sortable="custom"
      />
      <el-table-column prop="name" label="编码名称" width="140" />
      <el-table-column prop="format" label="编码格式" width="140" />
      <el-table-column label="视频配置" width="160">
        <template #default="scope">
          <el-link class="ea-tag" type="primary">
            编码器: {{ scope.row.vcodec }}
          </el-link>
          <br /><el-link class="ea-tag" type="success">
            帧率: {{ scope.row.vfps > 0 ? scope.row.vfps : "默认" }}
          </el-link>
          <br /><el-link class="ea-tag" type="info">
            分辨率: {{ scope.row.vwidth > 0 ? scope.row.vwidth : "适应" }}×{{
              scope.row.vheight > 0 ? scope.row.vheight : "适应"
            }}
          </el-link>
          <br /><el-link class="ea-tag" type="warning">
            码率/kbps:
            {{ scope.row.vbitrate > 0 ? scope.row.vbitrate : "默认" }}
          </el-link>
          <br /><el-link class="ea-tag" type="danger">
            质量: {{ scope.row.vcrf > 0 ? scope.row.vcrf : "默认" }}
          </el-link>
        </template>
      </el-table-column>

      <el-table-column prop="acodec" label="音频配置" width="160">
        <template #default="scope">
          <el-link class="ea-tag" type="primary">
            编码器: {{ scope.row.acodec }}
          </el-link>
          <br /><el-link class="ea-tag" type="success">
            采样率/Hz:
            {{ scope.row.asamplerate > 0 ? scope.row.asamplerate : "适应" }}
          </el-link>
          <br /><el-link class="ea-tag" type="info">
            比特率/kbps:
            {{ scope.row.abitrate > 0 ? scope.row.abitrate : "默认" }}
          </el-link>
          <br /><el-link class="ea-tag" type="warning">
            声道: {{ scope.row.achannel > 0 ? scope.row.achannel : "默认" }}
          </el-link>
        </template>
      </el-table-column>

      <el-table-column prop="command" label="附加配置" width="180">
        <template #default="scope">
          <span style="white-space: pre-wrap">{{ scope.row.command }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="updatedAt" label="最近更新" width="200" />
      <el-table-column prop="createdAt" label="创建日期" width="200" />
      <el-table-column fixed="right" label="操作" width="120">
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

    <el-pagination
      background
      layout="total, sizes, prev, pager, next"
      :total="table.total"
      :page-size="table.query.limit"
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
      <el-form-item label="编码名称" prop="name">
        <el-input v-model="dialog.form.name" />
      </el-form-item>
      <el-form-item label="编码格式" prop="format">
        <el-input
          v-model="dialog.form.format"
          placeholder="文件后缀 m3u8 mpd mp4 等"
        />
      </el-form-item>
      <el-form-item label="视频编码器" prop="vcodec">
        <el-input
          v-model="dialog.form.vcodec"
          placeholder="ffmpeg -encoders 查看支持的编码器"
        />
      </el-form-item>
      <el-form-item label="视频宽" prop="vwidth">
        <el-input-number
          v-model="dialog.form.vwidth"
          :min="0"
          :max="7680"
          controls-position="right"
          placeholder="“0”或者“空”为源文件宽 或根据高自适应"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="视频高" prop="vheight">
        <el-input-number
          v-model="dialog.form.vheight"
          :min="0"
          :max="4320"
          controls-position="right"
          placeholder="“0”或者“空”为源文件高 或根据宽自适应"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="质量控制" prop="vcrf">
        <el-input-number
          v-model="dialog.form.vcrf"
          :min="0"
          :max="51"
          controls-position="right"
          placeholder="数值越小，视频质量越高 默认为23"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="视频帧率" prop="vfps">
        <el-input-number
          v-model="dialog.form.vfps"
          :min="0"
          :max="60"
          controls-position="right"
          placeholder="“0”或者“空”为源文件帧率"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="视频码率" prop="vbitrate">
        <el-input-number
          v-model="dialog.form.vbitrate"
          :min="0"
          controls-position="right"
          placeholder="kbps 不输入则使用ffmpeg内置码率"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="音频编码器" prop="acodec">
        <el-input
          v-model="dialog.form.acodec"
          placeholder="ffmpeg -encoders 查看支持的编码器"
        />
      </el-form-item>

      <el-form-item label="音频比特率" prop="abitrate">
        <el-input-number
          v-model="dialog.form.abitrate"
          :min="0"
          :max="1000"
          placeholder="kbps 不输入则使用ffmpeg内置码率"
          controls-position="right"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="音频采样率" prop="asamplerate">
        <el-input-number
          v-model="dialog.form.asamplerate"
          :min="0"
          placeholder="(44100  48000)Hz 不输入则使用ffmpeg内置采样率"
          controls-position="right"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="音频通道" prop="achannel">
        <el-input-number
          v-model="dialog.form.achannel"
          :min="0"
          :max="8"
          placeholder="不输入则使用ffmpeg内置采样率"
          controls-position="right"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="FFMPEG参数" prop="command">
        <el-input
          v-model="dialog.form.command"
          rows="3"
          type="textarea"
          placeholder="FFMPEG自定义的参数 按行分割"
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
  addTranscode,
  listTranscode,
  updateTranscode,
  deleteTranscode,
} from "@/apis/video";
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
  listTranscode(table.value.query).then((result) => {
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
    name: [
      { required: true, message: "名称", trigger: "blur" },
      { min: 2, message: "用户名最少为2个字符", trigger: "blur" },
    ],
    format: [
      { required: true, message: "转码格式", trigger: "blur" },
      { min: 2, message: "转码格式最少为2个字符", trigger: "blur" },
    ],
    vcodec: [
      { required: true, message: "视频编码器", trigger: "blur" },
      { min: 2, message: "编码器最少为2个字符", trigger: "blur" },
    ],
    acodec: [
      { required: true, message: "音频编码器", trigger: "blur" },
      { min: 2, message: "编码器最少为2个字符", trigger: "blur" },
    ],
  },
  formAction: "add", // add|edit
});
const handleDialogAdd = () => {
  dialog.value.title = "新增编码器";
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
const handleDialogDelete = (id) => {
  ElMessageBox.confirm(`请仔细确认是否删除数据[${id}]?`, "警告", {
    confirmButtonText: "删除",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    deleteTranscode({ id }).then((result) => {
      ElMessage.warning(result);
    });
  });
};
const handleSubmitForm = () => {
  // 提交数据
  dialogRef.value.validate((validate) => {
    if (validate) {
      // 判断表单是否验证通过。
      if (dialog.value.formAction === "add") {
        addTranscode(dialog.value.form).then((result) => {
          dialog.value.visible = false;
          ElMessage.success(result);
          handleTableData();
        });
      } else if (dialog.value.formAction === "edit") {
        updateTranscode(dialog.value.form).then((result) => {
          dialog.value.visible = false;
          ElMessage.info(result);
          handleTableData();
        });
        dialog.value.visible = false;
      } else {
        ElMessage.warning("提交错误");
      }
    } else {
      ElMessage.error("请输入正确的数据！");
    }
  });
};

handleTableData();
</script>
