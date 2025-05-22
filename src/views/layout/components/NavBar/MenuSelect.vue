<template>
  <el-select>
    <template v-for="(item, index) in router.options.routes">
      <template v-if="item.meta">
        <el-option
          v-if="item.meta?.title && item.meta?.hidden != true"
          :key="index"
          :label="item.meta?.title"
          :value="item.meta.path ?? item.path"
        />
      </template>
      <!-- 组 -->
      <template v-if="item.children">
        <template v-for="(childItem, childIndex) in item.children">
          <el-option
            v-if="
              childItem.meta &&
              childItem.meta?.title &&
              childItem.meta?.hidden != true
            "
            :key="index + '-' + childIndex"
            :label="
              (item.meta?.title ? item.meta?.title + '-' : '') +
              childItem.meta?.title
            "
            :value="childItem.path"
          />
        </template>
      </template>
    </template>
  </el-select>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
</script>
