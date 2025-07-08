<template>
  <el-table-column :label="label" :prop="prop" :align="align" v-bind="$attrs">
    <template #default="{ row }">
      <el-tooltip raw-content :content="'<pre>' + row[prop] + '</pre>'">
        <el-text class="is-truncated">{{ row[prop] }}</el-text>
      </el-tooltip>
    </template>
  </el-table-column>
</template>

<script setup>
defineProps({
  label: String,
  prop: String,
  align: {
    type: String,
    default: "center",
  },
});
</script>
