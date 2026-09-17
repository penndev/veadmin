<template>
  <el-card shadow="never" :body-style="{ padding: '12px 16px' }">
    <template #header>
      <span>路径与操作</span>
    </template>
    <el-row :gutter="12" align="middle">
      <el-col :xs="24" :sm="18">
        <el-input
          v-if="path.editing"
          ref="pathInputRef"
          v-model="path.draft"
          placeholder="输入绝对路径，回车前往"
          @keydown.enter.prevent="path.submit()"
          @keydown.esc.prevent="path.cancel()"
          @blur="path.cancel()"
        />
        <div v-else class="files-path-bar" @click="path.start(pathInputRef)">
          <el-link :underline="false" @click.stop="table.go('')">
            <el-icon><HomeFilled /></el-icon>
          </el-link>
          <template
            v-for="(name, idx) in (table.currentPath || '')
              .replace(/\/+$/, '')
              .split('/')
              .filter(Boolean)"
            :key="idx"
          >
            <el-icon><ArrowRight /></el-icon>
            <el-link @click.stop="table.goSegment(idx)">
              {{ name }}
            </el-link>
          </template>
        </div>
      </el-col>
      <el-col :xs="24" :sm="6" style="text-align: right">
        <el-space wrap :size="8" alignment="center">
          <el-button
            :icon="Top"
            circle
            title="上级"
            :disabled="!table.canGoUp()"
            @click="table.goUp()"
          />
          <el-button
            :icon="Refresh"
            circle
            title="刷新"
            @click="table.load()"
          />
          <el-button
            :icon="FolderAdd"
            circle
            title="新建文件夹"
            @click="dialog.openMkdir()"
          />
          <el-button
            :icon="DocumentAdd"
            circle
            title="新建文件"
            @click="dialog.openNewFile()"
          />
          <el-upload
            :show-file-list="false"
            :http-request="table.upload"
            multiple
          >
            <el-button :icon="Upload" circle title="上传" />
          </el-upload>
        </el-space>
      </el-col>
    </el-row>
  </el-card>

  <el-card
    shadow="never"
    class="files-list-card"
    :body-style="{ padding: '12px 16px' }"
  >
    <template #header>
      <span>文件列表</span>
    </template>
    <div class="files-table-wrap">
      <el-table
        v-loading="table.loading"
        :data="table.entries"
        row-key="path"
        highlight-current-row
        style="width: 100%"
        @row-click="(row) => table.openRow(row)"
        @row-contextmenu="ctx.open"
      >
        <el-table-column label="名称" min-width="280">
          <template #default="{ row }">
            <el-space :size="6">
              <el-icon>
                <Folder v-if="row.isDir" />
                <Document v-else />
              </el-icon>
              <span>{{ row.name }}</span>
            </el-space>
          </template>
        </el-table-column>
        <el-table-column label="大小" width="120" align="right">
          <template #default="{ row }">
            {{ row.isDir ? "-" : byteFormat(row.size) }}
          </template>
        </el-table-column>
        <el-table-column label="权限" width="100" align="right">
          <template #default="{ row }">
            {{ table.formatMode(row.mode) }}
          </template>
        </el-table-column>
        <el-table-column label="修改时间" width="180">
          <template #default="{ row }">
            {{ row.modTime ? new Date(row.modTime).toLocaleString() : "-" }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="168" align="center">
          <template #default="{ row }">
            <el-button link type="primary" @click.stop="dialog.openRename(row)">
              重命名
            </el-button>
            <el-button link type="primary" @click.stop="dialog.openChmod(row)">
              权限
            </el-button>
            <el-button link type="danger" @click.stop="table.remove(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-popover
      v-model:visible="ctx.visible"
      :virtual-ref="ctxTriggerRef"
      virtual-triggering
      trigger="click"
      placement="bottom-start"
      :show-arrow="false"
      :width="140"
      :teleported="true"
      popper-class="files-ctx-popper"
    >
      <el-dropdown-menu v-if="ctx.row">
        <el-dropdown-item @click="ctx.run('open')">
          {{ ctx.row.isDir ? "打开" : "编辑" }}
        </el-dropdown-item>
        <el-dropdown-item v-if="!ctx.row.isDir" @click="ctx.run('download')">
          下载
        </el-dropdown-item>
        <el-dropdown-item divided @click="ctx.run('rename')">
          重命名
        </el-dropdown-item>
        <el-dropdown-item @click="ctx.run('chmod')">权限</el-dropdown-item>
        <el-dropdown-item divided @click="ctx.run('delete')">
          <span style="color: var(--el-color-danger)">删除</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-popover>
  </el-card>

  <el-dialog
    v-model="dialog.mkdir.visible"
    title="新建文件夹"
    width="480px"
    destroy-on-close
  >
    <el-form label-width="80px">
      <el-form-item label="目录名">
        <el-input
          v-model="dialog.mkdir.name"
          placeholder="文件夹名称"
          @keyup.enter="dialog.submitMkdir()"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialog.mkdir.visible = false">取消</el-button>
      <el-button type="primary" @click="dialog.submitMkdir()">确定</el-button>
    </template>
  </el-dialog>

  <el-dialog
    v-model="dialog.newFile.visible"
    title="新建文件"
    width="480px"
    destroy-on-close
  >
    <el-form label-width="80px">
      <el-form-item label="文件名">
        <el-input
          v-model="dialog.newFile.name"
          placeholder="文件名称"
          @keyup.enter="dialog.submitNewFile()"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialog.newFile.visible = false">取消</el-button>
      <el-button type="primary" @click="dialog.submitNewFile()">确定</el-button>
    </template>
  </el-dialog>

  <el-dialog
    v-model="dialog.rename.visible"
    title="重命名"
    width="480px"
    destroy-on-close
  >
    <el-form label-width="80px">
      <el-form-item label="新名称">
        <el-input
          v-model="dialog.rename.name"
          @keyup.enter="dialog.submitRename()"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialog.rename.visible = false">取消</el-button>
      <el-button type="primary" @click="dialog.submitRename()">确定</el-button>
    </template>
  </el-dialog>

  <el-dialog
    v-model="dialog.chmod.visible"
    title="修改权限"
    width="480px"
    destroy-on-close
  >
    <el-form label-width="80px">
      <el-form-item label="八进制">
        <el-input
          v-model="dialog.chmod.mode"
          placeholder="0755"
          @keyup.enter="dialog.submitChmod()"
        />
      </el-form-item>
      <el-form-item label="当前">
        <el-text
          >{{ table.formatMode(dialog.chmod.currentMode) }} ({{
            dialog.chmod.currentMode
          }})</el-text
        >
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialog.chmod.visible = false">取消</el-button>
      <el-button type="primary" @click="dialog.submitChmod()">确定</el-button>
    </template>
  </el-dialog>

  <el-dialog
    v-model="dialog.editor.visible"
    :title="'编辑 - ' + dialog.editor.name"
    width="70%"
    destroy-on-close
  >
    <el-input
      v-model="dialog.editor.content"
      type="textarea"
      :rows="22"
      :input-style="{ fontFamily: 'ui-monospace, monospace' }"
    />
    <template #footer>
      <el-button @click="dialog.editor.visible = false">取消</el-button>
      <el-button
        type="primary"
        :loading="dialog.editor.saving"
        @click="dialog.submitEditor()"
      >
        保存
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import {
  Top,
  Refresh,
  HomeFilled,
  Folder,
  Document,
  FolderAdd,
  DocumentAdd,
  Upload,
} from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { byteFormat } from "penndev/utils";
import {
  listDir,
  getContent,
  putContent,
  mkdir,
  removeFile,
  renameFile,
  chmodFile,
  uploadFile,
  downloadFile,
} from "@/apis/files";

const pathInputRef = ref();

const path = ref({
  editing: false,
  draft: "",
  start: (inputRef) => {
    path.value.draft = table.value.currentPath;
    path.value.editing = true;
    nextTick(() => inputRef?.focus?.());
  },
  cancel: () => {
    path.value.editing = false;
  },
  submit: () => {
    path.value.editing = false;
    table.value.go(path.value.draft);
  },
});

const table = ref({
  currentPath: "",
  entries: [],
  loading: false,
  canGoUp: () => {
    const p = (table.value.currentPath || "").replace(/\/+$/, "");
    return !!p && p.lastIndexOf("/") > 0;
  },
  formatMode: (mode) => ((mode ?? 0) & 0o777).toString(8).padStart(4, "0"),
  parentPath: () => {
    const p = (table.value.currentPath || "").replace(/\/+$/, "");
    const i = p.lastIndexOf("/");
    return i <= 0 ? "" : p.slice(0, i);
  },
  goSegment: (idx) => {
    const parts = (table.value.currentPath || "")
      .replace(/\/+$/, "")
      .split("/")
      .filter(Boolean);
    table.value.go("/" + parts.slice(0, idx + 1).join("/"));
  },
  go: (p) => {
    path.value.editing = false;
    table.value.currentPath = (p || "").trim();
    return table.value.load();
  },
  goUp: () => table.value.go(table.value.parentPath()),
  load: async () => {
    table.value.loading = true;
    try {
      const res = await listDir({
        path: (table.value.currentPath || "").trim(),
      });
      const data = res.data || {};
      table.value.currentPath = data.path || table.value.currentPath;
      table.value.entries = [...(data.entries || [])].sort((a, b) => {
        if (a.isDir !== b.isDir) return a.isDir ? -1 : 1;
        return a.name.localeCompare(b.name, undefined, {
          sensitivity: "base",
        });
      });
    } finally {
      table.value.loading = false;
    }
  },
  openRow: (row) => {
    if (row.isDir) table.value.go(row.path);
    else dialog.value.openEditor(row);
  },
  remove: async (row) => {
    await ElMessageBox.confirm(
      `确认删除「${row.name}」？${row.isDir ? "（含子项）" : ""}`,
      "警告",
      { type: "warning", confirmButtonText: "删除", cancelButtonText: "取消" },
    );
    await removeFile({ path: row.path });
    ElMessage.success("已删除");
    await table.value.load();
  },
  download: async (row) => {
    const blob = await downloadFile({ path: row.path });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = row.name;
    a.click();
    URL.revokeObjectURL(url);
  },
  upload: async ({ file, onSuccess, onError }) => {
    try {
      await uploadFile(table.value.currentPath, file);
      ElMessage.success(`「${file.name}」上传成功`);
      onSuccess?.();
      await table.value.load();
    } catch (e) {
      onError?.(e);
    }
  },
});

const dialog = ref({
  mkdir: { visible: false, name: "" },
  newFile: { visible: false, name: "" },
  rename: { visible: false, path: "", name: "" },
  chmod: { visible: false, path: "", mode: "0644", currentMode: 0 },
  editor: {
    visible: false,
    path: "",
    name: "",
    content: "",
    saving: false,
  },
  openMkdir: () => {
    dialog.value.mkdir.name = "";
    dialog.value.mkdir.visible = true;
  },
  openNewFile: () => {
    dialog.value.newFile.name = "";
    dialog.value.newFile.visible = true;
  },
  openRename: (row) => {
    dialog.value.rename.path = row.path;
    dialog.value.rename.name = row.name;
    dialog.value.rename.visible = true;
  },
  openChmod: (row) => {
    dialog.value.chmod.path = row.path;
    dialog.value.chmod.currentMode = row.mode;
    dialog.value.chmod.mode = table.value.formatMode(row.mode);
    dialog.value.chmod.visible = true;
  },
  openEditor: async (row) => {
    dialog.value.editor.path = row.path;
    dialog.value.editor.name = row.name;
    const res = await getContent({ path: row.path });
    dialog.value.editor.content = res.data?.content ?? "";
    dialog.value.editor.visible = true;
  },
  submitMkdir: async () => {
    if (!dialog.value.mkdir.name.trim()) {
      ElMessage.warning("请输入目录名");
      return;
    }
    const base = table.value.currentPath.replace(/\/+$/, "");
    const res = await mkdir({
      path: `${base}/${dialog.value.mkdir.name.trim()}`,
    });
    ElMessage.success(res.message || "完成");
    dialog.value.mkdir.visible = false;
    await table.value.load();
  },
  submitNewFile: async () => {
    if (!dialog.value.newFile.name.trim()) {
      ElMessage.warning("请输入文件名");
      return;
    }
    const base = table.value.currentPath.replace(/\/+$/, "");
    const res = await putContent({
      path: `${base}/${dialog.value.newFile.name.trim()}`,
      content: "",
    });
    ElMessage.success(res.message || "完成");
    dialog.value.newFile.visible = false;
    await table.value.load();
  },
  submitRename: async () => {
    if (!dialog.value.rename.name.trim()) return;
    const parent = dialog.value.rename.path.replace(/\/[^/]+$/, "");
    const res = await renameFile({
      oldPath: dialog.value.rename.path,
      newPath: `${parent}/${dialog.value.rename.name.trim()}`,
    });
    ElMessage.success(res.message || "完成");
    dialog.value.rename.visible = false;
    await table.value.load();
  },
  submitChmod: async () => {
    const res = await chmodFile({
      path: dialog.value.chmod.path,
      mode: dialog.value.chmod.mode,
    });
    ElMessage.success(res.message || "完成");
    dialog.value.chmod.visible = false;
    await table.value.load();
  },
  submitEditor: async () => {
    dialog.value.editor.saving = true;
    try {
      const res = await putContent({
        path: dialog.value.editor.path,
        content: dialog.value.editor.content,
      });
      ElMessage.success(res.message || "完成");
      dialog.value.editor.visible = false;
    } finally {
      dialog.value.editor.saving = false;
    }
  },
});

const ctx = ref({
  visible: false,
  row: null,
  pos: { top: 0, left: 0, width: 0, height: 0 },
  open: (row, _col, e) => {
    e.preventDefault();
    ctx.value.row = row;
    ctx.value.pos.top = e.clientY;
    ctx.value.pos.left = e.clientX;
    ctx.value.visible = true;
  },
  close: () => {
    ctx.value.visible = false;
  },
  run: (cmd) => {
    ctx.value.visible = false;
    const row = ctx.value.row;
    if (!row) return;
    if (cmd === "open") table.value.openRow(row);
    else if (cmd === "download") table.value.download(row);
    else if (cmd === "rename") dialog.value.openRename(row);
    else if (cmd === "chmod") dialog.value.openChmod(row);
    else if (cmd === "delete") table.value.remove(row);
  },
});

const ctxTriggerRef = ref({
  getBoundingClientRect: () => DOMRect.fromRect(ctx.value.pos),
});

const onScrollCloseCtx = () => ctx.value.close();

onMounted(() => {
  document.addEventListener("scroll", onScrollCloseCtx, true);
  table.value.load();
});

onUnmounted(() => {
  document.removeEventListener("scroll", onScrollCloseCtx, true);
});
</script>

<style scoped>
.files-list-card {
  margin-top: 12px;
}

.files-table-wrap {
  width: 100%;
}

.files-path-bar {
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  padding: 4px 11px;
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  background: var(--el-fill-color-blank);
  cursor: text;
}

.files-table-wrap {
  cursor: default;
}
</style>
