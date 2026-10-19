<template>
  <el-main
    class="ea-table files-page"
    @dragenter.prevent="handleDragEnter"
    @dragover.prevent="handleDragOver"
    @dragleave="handleDragLeave"
    @drop.prevent="handlePageDrop"
  >
    <div v-show="dragging" class="files-drop-mask">松开后上传到当前目录</div>
    <div class="files-path">
      <el-button :disabled="!path" icon="Top" @click="handleEnterParent" />
      <el-button icon="Refresh" @click="handleTableData" />
      <div class="files-path-bar">
        <span class="files-path-item" @click="handleEnterPath('')">根目录</span>
        <template v-for="item in breadcrumbs" :key="item.path">
          <span class="files-path-split">/</span>
          <span class="files-path-item" @click="handleEnterPath(item.path)">
            {{ item.name }}
          </span>
        </template>
      </div>
    </div>

    <div class="files-actions">
      <el-button
        :icon="table.selectStat ? 'Select' : 'SemiSelect'"
        @click="
          (table.selectStat = !table.selectStat)
            ? ''
            : tableRef.clearSelection()
        "
      />
      <el-button
        v-if="table.selectStat"
        size="small"
        @click="tableRef.toggleAllSelection"
      >
        全选/全不选
      </el-button>
      <el-button
        v-if="table.selectStat"
        size="small"
        type="danger"
        @click="handleDeleteMore"
      >
        删除选中
      </el-button>
      <el-button type="primary" icon="FolderAdd" @click="handleMkdir">
        新建文件夹
      </el-button>
      <el-button type="primary" icon="DocumentAdd" @click="handleNewText">
        新建文本
      </el-button>
      <el-upload
        class="files-upload"
        :show-file-list="false"
        :http-request="handleUpload"
        multiple
      >
        <el-button type="primary" icon="Upload">上传</el-button>
      </el-upload>
    </div>

    <el-table
      ref="tableRef"
      :data="table.data"
      row-key="name"
      stripe
      @row-contextmenu="handleRowContextmenu"
    >
      <el-table-column v-if="table.selectStat" type="selection" width="50" />
      <el-table-column label="名称" min-width="280" show-overflow-tooltip>
        <template #default="scope">
          <div class="files-row">
            <span class="files-icon">
              <svg v-if="scope.row.dir" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"
                />
              </svg>
              <svg
                v-else-if="isImageFile(scope.row.name)"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"
                />
              </svg>
              <svg
                v-else-if="isZipFile(scope.row.name)"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-2 6h-2v2h2v2h-2v2h-2v-2h2v-2h-2v-2h2v-2h-2V8h2v2h2v2z"
                />
              </svg>
              <svg v-else viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"
                />
              </svg>
            </span>
            <span class="files-link" @click="handleOpen(scope.row)">
              {{ scope.row.name }}
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="大小" width="140">
        <template #default="scope">
          {{ scope.row.dir ? "-" : byteFormat(scope.row.size) }}
        </template>
      </el-table-column>
      <el-table-column label="修改时间" width="180">
        <template #default="scope">
          {{ formatModTime(scope.row.modTime) }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="140">
        <template #default="scope">
          <div class="files-ops">
            <el-button link type="danger" @click="handleDelete(scope.row)">
              删除
            </el-button>
            <el-dropdown
              trigger="click"
              @command="(cmd) => handleMore(cmd, scope.row)"
            >
              <el-button link type="primary" @click.stop>更多</el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="open">打开</el-dropdown-item>
                  <el-dropdown-item command="rename">重命名</el-dropdown-item>
                  <el-dropdown-item v-if="!scope.row.dir" command="download">
                    下载
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-main>

  <ul
    v-show="menu.visible"
    class="files-menu"
    :style="{ left: menu.x + 'px', top: menu.y + 'px' }"
    @click.stop
  >
    <li @click="handleMenuOpen">打开</li>
    <li @click="handleMenuRename">重命名</li>
    <li v-if="menu.row && !menu.row.dir" @click="handleMenuDownload">下载</li>
  </ul>

  <el-drawer
    v-model="editor.visible"
    class="files-editor-drawer"
    :title="editor.title"
    :close-on-click-modal="false"
    size="80%"
    @opened="handleEditorOpened"
    @closed="handleEditorClosed"
  >
    <div ref="editorEl" class="files-editor" />
    <template #footer>
      <el-button @click="editor.visible = false">取消</el-button>
      <el-button type="primary" @click="handleSaveText">保存</el-button>
    </template>
  </el-drawer>

  <el-dialog
    v-model="preview.visible"
    :title="preview.title"
    width="70%"
    destroy-on-close
    center
    @closed="handlePreviewClosed"
  >
    <img
      v-if="preview.type === 'image'"
      :src="preview.url"
      style="display: block; max-width: 100%; margin: 0 auto"
    />
    <video
      v-else-if="preview.type === 'video'"
      :src="preview.url"
      controls
      style="display: block; width: 100%"
    />
  </el-dialog>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { byteFormat } from "penndev/utils";
import * as monaco from "monaco-editor/editor/editor.api.js";
import editorWorker from "monaco-editor/editor/editor.worker?worker";
import "monaco-editor/editor/browser/coreCommands.js";
import "monaco-editor/editor/contrib/clipboard/browser/clipboard.js";
import "monaco-editor/editor/contrib/contextmenu/browser/contextmenu.js";
import "monaco-editor/features/find/register.js";
import "monaco-editor/editor/contrib/comment/browser/comment.js";
import "monaco-editor/editor/contrib/bracketMatching/browser/bracketMatching.js";
import "monaco-editor/editor/contrib/wordOperations/browser/wordOperations.js";
import "monaco-editor/features/codicon/register.js";
import "monaco-editor/languages/definitions/html/register.js";
import "monaco-editor/languages/definitions/css/register.js";
import "monaco-editor/languages/definitions/javascript/register.js";
import {
  deleteFiles,
  downloadFile,
  getFiles,
  postFiles,
  putFiles,
  uploadFile,
} from "@/apis/wafcdn/files";

globalThis.MonacoEnvironment = {
  getWorker() {
    return new editorWorker();
  },
};

const route = useRoute();
const router = useRouter();
const path = ref(typeof route.query.path === "string" ? route.query.path : "");
const tableRef = ref();
const editorEl = ref(null);
const dragging = ref(false);
let monacoEditor = null;
let darkObserver = null;

const table = ref({
  selectStat: false,
  data: [],
});

const editor = ref({
  visible: false,
  title: "",
  dir: "",
  name: "",
  content: "",
});

const preview = ref({
  visible: false,
  type: "",
  title: "",
  url: "",
});

const menu = ref({
  visible: false,
  x: 0,
  y: 0,
  row: null,
});

const fileExt = (name) => {
  const idx = name.lastIndexOf(".");
  if (idx < 0) {
    return "";
  }
  return name.slice(idx + 1).toLowerCase();
};

const editorLanguage = (name) => {
  const ext = fileExt(name);
  if (ext === "html" || ext === "htm") {
    return "html";
  }
  if (ext === "css") {
    return "css";
  }
  if (ext === "js") {
    return "javascript";
  }
  return "plaintext";
};

const editorTheme = () => {
  return document.documentElement.classList.contains("dark") ? "vs-dark" : "vs";
};

const isImageFile = (name) => {
  return ["png", "jpg", "jpeg", "gif", "webp", "bmp", "svg", "ico"].includes(
    fileExt(name),
  );
};

const isVideoFile = (name) => {
  return ["mp4", "webm", "ogg", "mov", "m4v"].includes(fileExt(name));
};

const isZipFile = (name) => {
  return ["zip", "gz", "tar", "rar", "7z", "tgz", "bz2", "xz"].includes(
    fileExt(name),
  );
};

const joinPath = (base, name) => {
  if (!base) {
    return name;
  }
  return base + "/" + name;
};

const breadcrumbs = computed(() => {
  if (!path.value) {
    return [];
  }
  const segs = path.value.split("/");
  return segs.map((name, index) => ({
    name,
    path: segs.slice(0, index + 1).join("/"),
  }));
});

const formatModTime = (value) => {
  if (!value) {
    return "";
  }
  return String(value).replace("T", " ").substring(0, 19);
};

const hideMenu = () => {
  menu.value.visible = false;
};

const handleTableData = () => {
  getFiles({ path: path.value }).then((result) => {
    table.value.data = result.data || [];
  });
};

const handleEnterPath = (value) => {
  path.value = value;
  const query = { ...route.query };
  if (value) {
    query.path = value;
  } else {
    delete query.path;
  }
  router.replace({ query });
  handleTableData();
};

watch(
  () => route.query.path,
  (value) => {
    const next = typeof value === "string" ? value : "";
    if (next === path.value) {
      return;
    }
    path.value = next;
    handleTableData();
  },
);

const handleEnter = (row) => {
  handleEnterPath(joinPath(path.value, row.name));
};

const handleEnterParent = () => {
  const idx = path.value.lastIndexOf("/");
  handleEnterPath(idx < 0 ? "" : path.value.slice(0, idx));
};

const handleMkdir = () => {
  ElMessageBox.prompt("文件夹名称", "新建文件夹", {
    confirmButtonText: "创建",
    cancelButtonText: "取消",
    inputPattern: /^[^\\/:*?"<>|]+$/,
    inputErrorMessage: '名称不能包含 \\ / : * ? " < > |',
  }).then(({ value }) => {
    postFiles({ path: path.value, name: value }).then(() => {
      ElMessage.info("创建完成");
      handleTableData();
    });
  });
};

const handleNewText = () => {
  ElMessageBox.prompt("文件名，例如 index.html", "新建文本", {
    confirmButtonText: "创建",
    cancelButtonText: "取消",
    inputPattern: /^[^\\/:*?"<>|]+$/,
    inputErrorMessage: '名称不能包含 \\ / : * ? " < > |',
  }).then(({ value }) => {
    const formData = new FormData();
    formData.append("path", path.value);
    formData.append("file", new File([""], value));
    uploadFile(formData).then(() => {
      ElMessage.info("创建完成");
      handleTableData();
    });
  });
};

const handlePreviewClosed = () => {
  if (preview.value.url) {
    URL.revokeObjectURL(preview.value.url);
  }
  preview.value.url = "";
  preview.value.type = "";
};

const handleOpen = (row) => {
  hideMenu();
  if (!row) {
    return;
  }
  if (row.dir) {
    handleEnter(row);
    return;
  }
  const filePath = joinPath(path.value, row.name);
  if (isImageFile(row.name) || isVideoFile(row.name)) {
    downloadFile({ path: filePath }).then((blob) => {
      handlePreviewClosed();
      preview.value.type = isImageFile(row.name) ? "image" : "video";
      preview.value.title = row.name;
      preview.value.url = URL.createObjectURL(blob);
      preview.value.visible = true;
    });
    return;
  }
  downloadFile({ path: filePath }).then((blob) => {
    if (blob.size > 2 * 1024 * 1024) {
      ElMessage.error("文件超过2MB，请下载后编辑");
      return;
    }
    blob.text().then((text) => {
      if (text.includes("\0")) {
        ElMessage.error("二进制文件不能作为文本打开");
        return;
      }
      editor.value.title = row.name;
      editor.value.dir = path.value;
      editor.value.name = row.name;
      editor.value.content = text;
      editor.value.visible = true;
    });
  });
};

const handleSaveText = () => {
  const content = monacoEditor ? monacoEditor.getValue() : editor.value.content;
  const formData = new FormData();
  formData.append("path", editor.value.dir);
  formData.append("overwrite", "1");
  formData.append("file", new File([content], editor.value.name));
  uploadFile(formData).then(() => {
    ElMessage.info("保存完成");
    editor.value.visible = false;
    handleTableData();
  });
};

const handleUpload = (options) => {
  const formData = new FormData();
  formData.append("path", path.value);
  formData.append("file", options.file);
  return uploadFile(formData)
    .then((res) => {
      ElMessage.info("上传完成");
      handleTableData();
      options.onSuccess(res);
    })
    .catch((err) => {
      options.onError(err);
    });
};

const handleDragEnter = () => {
  dragging.value = true;
};

const handleDragOver = (e) => {
  e.dataTransfer.dropEffect = "copy";
};

const handleDragLeave = (e) => {
  if (e.currentTarget.contains(e.relatedTarget)) {
    return;
  }
  dragging.value = false;
};

const handlePageDrop = (e) => {
  dragging.value = false;
  const files = [];
  const items = e.dataTransfer.items;
  if (items && items.length) {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind !== "file") {
        continue;
      }
      const entry = item.webkitGetAsEntry ? item.webkitGetAsEntry() : null;
      if (entry && entry.isDirectory) {
        continue;
      }
      const file = item.getAsFile();
      if (file) {
        files.push(file);
      }
    }
  } else {
    files.push(...e.dataTransfer.files);
  }
  if (!files.length) {
    ElMessage.warning("请拖入文件，不支持直接拖入文件夹");
    return;
  }
  Promise.allSettled(
    files.map(
      (file, i) =>
        new Promise((resolve, reject) => {
          setTimeout(() => {
            const formData = new FormData();
            formData.append("path", path.value);
            formData.append("file", file);
            uploadFile(formData).then(resolve).catch(reject);
          }, i * 80);
        }),
    ),
  ).then((results) => {
    const fail = results.filter((item) => item.status === "rejected").length;
    const ok = results.length - fail;
    ElMessage.info(fail ? `上传完成 ${ok}，失败 ${fail}` : "上传完成");
    handleTableData();
  });
};

const handleDownload = (row) => {
  const filePath = joinPath(path.value, row.name);
  downloadFile({ path: filePath }).then((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = row.name;
    a.click();
    URL.revokeObjectURL(url);
  });
};

const handleDelete = (row) => {
  hideMenu();
  const filePath = joinPath(path.value, row.name);
  const tip = row.dir
    ? `将删除文件夹 [${row.name}] 及其中全部文件，确认？`
    : `请仔细确认是否删除 [${row.name}]？`;
  ElMessageBox.confirm(tip, "警告", {
    confirmButtonText: "删除",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    deleteFiles({ path: filePath }).then(() => {
      ElMessage.info("删除完成");
      handleTableData();
    });
  });
};

const handleDeleteMore = () => {
  const rows = tableRef.value.getSelectionRows();
  if (!rows.length) {
    ElMessage.warning("请选择要删除的项目");
    return;
  }
  ElMessageBox.confirm(`请仔细确认是否删除选中的 ${rows.length} 项？`, "警告", {
    confirmButtonText: "删除",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    const results = await Promise.allSettled(
      rows.map(
        (row, i) =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              deleteFiles({ path: joinPath(path.value, row.name) })
                .then(resolve)
                .catch(reject);
            }, i * 80);
          }),
      ),
    );
    const fail = results.filter((item) => item.status === "rejected").length;
    const ok = results.length - fail;
    ElMessage.info(fail ? `删除完成 ${ok}，失败 ${fail}` : "删除完成");
    handleTableData();
    tableRef.value.clearSelection();
  });
};

const handleRowContextmenu = (row, _column, event) => {
  event.preventDefault();
  menu.value.row = row;
  menu.value.x = event.clientX;
  menu.value.y = event.clientY;
  menu.value.visible = true;
};

const handleMore = (cmd, row) => {
  if (cmd === "open") {
    handleOpen(row);
  } else if (cmd === "rename") {
    handleRename(row);
  } else if (cmd === "download") {
    handleDownload(row);
  }
};

const handleMenuOpen = () => {
  handleOpen(menu.value.row);
};

const handleMenuDownload = () => {
  const row = menu.value.row;
  hideMenu();
  handleDownload(row);
};

const handleMenuRename = () => {
  handleRename(menu.value.row);
};

const handleRename = (row) => {
  hideMenu();
  ElMessageBox.prompt("新名称", "重命名", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    inputValue: row.name,
    inputPattern: /^[^\\/:*?"<>|]+$/,
    inputErrorMessage: '名称不能包含 \\ / : * ? " < > |',
  }).then(({ value }) => {
    putFiles({ path: joinPath(path.value, row.name), name: value }).then(() => {
      ElMessage.info("重命名完成");
      handleTableData();
    });
  });
};

const handleEditorOpened = () => {
  if (monacoEditor) {
    monacoEditor.dispose();
    monacoEditor = null;
  }
  if (!editorEl.value) {
    return;
  }
  monacoEditor = monaco.editor.create(editorEl.value, {
    value: editor.value.content,
    language: editorLanguage(editor.value.name),
    theme: editorTheme(),
    automaticLayout: true,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    fontSize: 14,
  });
};

const handleEditorClosed = () => {
  if (monacoEditor) {
    monacoEditor.dispose();
    monacoEditor = null;
  }
};

onMounted(() => {
  document.addEventListener("click", hideMenu);
  darkObserver = new MutationObserver(() => {
    if (monacoEditor) {
      monaco.editor.setTheme(editorTheme());
    }
  });
  darkObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
});
onBeforeUnmount(() => {
  document.removeEventListener("click", hideMenu);
  if (darkObserver) {
    darkObserver.disconnect();
    darkObserver = null;
  }
  handlePreviewClosed();
  if (monacoEditor) {
    monacoEditor.dispose();
    monacoEditor = null;
  }
});

handleTableData();
</script>

<style scoped>
.files-page {
  position: relative;
  min-height: calc(100vh - 140px);
}
.files-drop-mask {
  position: absolute;
  inset: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  font-size: 16px;
  color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
  border: 2px dashed var(--el-color-primary);
  border-radius: 8px;
}
.files-path {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}
.files-path-bar {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  height: 32px;
  padding: 0 12px;
  overflow: auto;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  background: var(--el-fill-color-blank);
}
.files-path-item {
  flex-shrink: 0;
  color: var(--el-text-color-regular);
  cursor: pointer;
  white-space: nowrap;
}
.files-path-item:hover {
  color: var(--el-color-primary);
}
.files-path-split {
  flex-shrink: 0;
  margin: 0 6px;
  color: var(--el-text-color-placeholder);
}
.files-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 12px;
}
.files-upload {
  display: inline-flex;
}
.files-row {
  display: flex;
  align-items: center;
  min-width: 0;
}
.files-icon {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-right: 8px;
  color: var(--el-text-color-regular);
}
.files-icon svg {
  display: block;
  width: 24px;
  height: 24px;
}
.files-link {
  min-width: 0;
  overflow: hidden;
  color: var(--el-color-primary);
  cursor: pointer;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.files-link:hover {
  text-decoration: underline;
}
.files-ops {
  display: flex;
  align-items: center;
  gap: 8px;
}
.files-ops :deep(.el-dropdown) {
  display: inline-flex;
  align-items: center;
  line-height: 1;
}
.files-menu {
  position: fixed;
  z-index: 3000;
  margin: 0;
  padding: 4px 0;
  list-style: none;
  background: var(--el-bg-color-overlay);
  border: 1px solid var(--el-border-color-light);
  border-radius: 4px;
  box-shadow: var(--el-box-shadow-light);
  min-width: 120px;
}
.files-menu li {
  padding: 8px 16px;
  cursor: pointer;
}
.files-menu li:hover {
  background: var(--el-fill-color-light);
}
</style>

<style>
.files-editor-drawer .el-drawer__header {
  margin-bottom: 0;
  padding: 12px 16px;
}
.files-editor-drawer .el-drawer__body {
  padding: 0;
  overflow: hidden;
}
.files-editor-drawer .el-drawer__footer {
  padding: 8px 16px;
}
.files-editor-drawer .files-editor {
  height: calc(100vh - 105px);
}
</style>
