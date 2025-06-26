<template>
  <div>
    <el-form :inline="true">
      <el-form-item label="名称">
        <el-input v-model="table.query.fileName" placeholder="名称" clearable />
      </el-form-item>
      <el-form-item label="校验码">
        <el-input v-model="table.query.fileMd5" placeholder="MD5" clearable />
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
    <upload :on-success="handleUploadSuccess" />
    <el-table :data="table.data" @sort-change="handleSortChange">
      <el-table-column
        fixed
        prop="id"
        label="ID"
        width="80"
        sortable="custom"
        align="center"
      />
      <el-table-column
        prop="fileName"
        label="文件名"
        min-width="160"
        align="center"
      />
      <el-table-column
        prop="fileMd5"
        label="文件MD5"
        min-width="110"
        align="center"
      >
        <template #default="scope">
          <el-tooltip
            class="box-item"
            effect="dark"
            :content="scope.row.fileMd5"
            placement="top-end"
          >
            <span>{{ scope.row.fileMd5.substring(0, 12) }}...</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" align="center">
        <template #default="scope">
          <el-link :type="scope.row.status > 0 ? 'success' : 'danger'">
            {{ table.querySelect.status[scope.row.status] }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column label="视频信息" min-width="180" align="center">
        <template #default="scope">
          <el-tag class="ea-tag" type="success">
            时长 {{ timeFormat(scope.row.videoDuration) }}
          </el-tag>
          <el-tag class="ea-tag" type="info">
            帧率 {{ scope.row.videoFps }}
          </el-tag>
          <el-tag class="ea-tag">
            分辨率 {{ scope.row.videoWidth }}×{{ scope.row.videoHeight }}
          </el-tag>
          <el-tag class="ea-tag" type="info">
            码率 {{ scope.row.videoBitrate }}
          </el-tag>
          <el-tag class="ea-tag" type="success">
            大小 {{ byteFormat(scope.row.fileSize) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="createdAt"
        label="创建日期"
        min-width="170"
        align="center"
      />
      <el-table-column fixed="right" label="操作" width="200">
        <template #default="scope">
          <el-popover
            placement="top-start"
            title="Play"
            :width="220"
            trigger="hover"
          >
            <el-button @click="handlePlay(scope.row.FilePath)">
              VideoJS
            </el-button>
            <el-button @click="handleDownload(scope.row.FilePath)">
              Download
            </el-button>
            <template #reference>
              <el-button link type="info"> 预览 </el-button>
            </template>
          </el-popover>
          <el-button link type="warning" @click="handleTranscode(scope.row)">
            转码
          </el-button>
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

    <el-pagination
      background
      layout="total, sizes, prev, pager, next"
      :total="table.total"
      :default-page-size="table.query.limit"
      @current-change="handleChangePage"
      @size-change="handleChangeLimit"
    />
  </el-main>

  <!-- 处理数据|编辑 -->
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
      label-width="80px"
      :model="dialog.form"
      :rules="dialog.formRule"
    >
      <el-form-item label="名称" prop="fileName">
        <el-input v-model="dialog.form.fileName" />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialog.visible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitForm">确定</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 播放dialog -->
  <el-dialog
    v-model="playDialogVisible"
    title="播放"
    width="40%"
    destroy-on-close
    center
  >
    <play :options="playOptions" />
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="playDialogVisible = false">
          关闭
        </el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 选择转码编辑dialog -->
  <el-dialog
    v-model="transcodeDialog.visible"
    :title="transcodeDialog.title"
    destroy-on-close
    center
  >
    <el-form
      ref="dialogTranscodeRef"
      :model="transcodeDialog.form"
      :rules="transcodeDialog.formRule"
    >
      <el-form-item label="源文件" prop="id">
        <el-input-number
          v-model="transcodeDialog.form.id"
          disabled
          style="display: none"
        />
        <span>{{ transcodeDialog.form.fileName }}</span>
      </el-form-item>

      <el-form-item label="编码器" prop="transcodeId">
        <el-select
          v-model="transcodeDialog.form.transcodeId"
          filterable
          placeholder="输入编码器名称"
        >
          <el-option
            v-for="item in transcodeDialog.transcodeSelect"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="FFMPEG参数" prop="command">
        <el-input
          v-model="transcodeDialog.form.command"
          rows="3"
          type="textarea"
          placeholder="FFMPEG自定义的参数 按行分割"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button type="info" @click="transcodeDialog.visible = false"
          >关闭
        </el-button>
        <el-button type="primary" @click="handleSubmitTask">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import upload from "./components/upload.vue";
import play from "@/components/Video.vue";
import { ref } from "vue";
// import api
import {
  listFile,
  updateFile,
  deleteFile,
  addTask,
  listTranscode,
} from "@/apis/video";
import { ElMessage, ElMessageBox } from "element-plus";
import { byteFormat, timeFormat } from "penndev/utils";

const table = ref({
  total: 0,
  data: [],
  query: {
    limit: 20,
    page: 1,
    order: null,
    fileName: null,
    fileMd5: null,
  },
  querySelect: {
    status: {
      "-2": "视频损坏",
      "-1": "文件损坏",
      0: "上传中",
      1: "文件正常",
    },
  },
});
const handleQueryRefresh = (_value) => {
  table.value.query.fileName = null;
  table.value.query.fileMd5 = null;
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
  listFile(table.value.query).then((result) => {
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
    fileName: [
      { required: true, message: "文件名称", trigger: "blur" },
      { min: 5, message: "文件名最少为5个字符", trigger: "blur" },
    ],
  },
  formAction: "edit", // add|edit
});
const handleDialogEdit = (row) => {
  dialog.value.title = "创建数据";
  dialog.value.visible = true;
  dialog.value.formAction = "edit";
  dialog.value.form = row;
};
const handleDialogDelete = (row) => {
  ElMessageBox.confirm("请仔细确认是否删除 " + row.fileName + " ?", "警告", {
    confirmButtonText: "删除",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    deleteFile({ id: row.id }).then((result) => {
      ElMessage.warning(result);
      handleTableData();
    });
  });
};
/**
 * 提交表单数据
 */
const handleSubmitForm = () => {
  dialogRef.value.validate((validate) => {
    if (validate) {
      if (dialog.value.formAction === "edit") {
        updateFile(dialog.value.form).then((result) => {
          dialog.value.visible = false;
          ElMessage.info(result);
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

// 播放弹窗
const playDialogVisible = ref(false);
const playOptions = ref({});
const handlePlay = (path) => {
  playOptions.value = {
    autoplay: true,
    controls: true,
    sources: [path],
    html5: {
      vhs: {
        cacheEncryptionKeys: true,
      },
    },
  };
  playDialogVisible.value = true;
};
const handleDownload = (path) => {
  open(path, "_bank");
};

const handleUploadSuccess = () => {
  ElMessage.success("上传成功！");
  handleTableData();
};

// 转码任务弹窗
const transcodeDialog = ref({
  visible: false,
  title: "",
  form: {},
  formRule: {
    id: [{ required: true, message: "选择文件", trigger: "blur" }],
    transcodeId: [{ required: true, message: "选择编码器", trigger: "blur" }],
  },
  transcodeSelect: null,
});
const getTranscodeSelect = async () => {
  if (!transcodeDialog.value.transcodeSelect) {
    const resData = await listTranscode({ page: 1, limit: 999 });
    transcodeDialog.value.transcodeSelect = resData.data;
  }
};
const handleTranscode = (row) => {
  transcodeDialog.value.title = row.fileName;
  transcodeDialog.value.visible = true;
  transcodeDialog.value.form = row;
};
const dialogTranscodeRef = ref(null);
const handleSubmitTask = () => {
  dialogTranscodeRef.value.validate((validate) => {
    if (validate) {
      addTask({
        fileId: transcodeDialog.value.form.id,
        transcodeId: transcodeDialog.value.form.transcodeId,
        command: transcodeDialog.value.form.command,
      }).then((resp) => {
        ElMessage.success(resp.message);
        transcodeDialog.value.visible = false;
      });
      transcodeDialog.value.visible = false;
    } else {
      ElMessage.error("请输入正确的数据！");
    }
  });
};

handleTableData();
getTranscodeSelect();
</script>

<style lang="scss" scoped>
.ea-tag {
  margin: 2px;
}
</style>
