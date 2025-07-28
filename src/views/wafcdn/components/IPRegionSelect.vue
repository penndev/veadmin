<template>
  <el-text> 下面为地区选择 </el-text>
  <el-divider border-style="solid" />
  <el-row
    :gutter="10"
    style="
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      margin-top: 12px;
    "
    v-for="(v, i) of model"
    :key="i"
  >
    <el-col style="flex: 0 0 auto">
      <el-text type="primary">
        <el-icon><Location /></el-icon> {{ v }}
      </el-text>
    </el-col>
    <el-col style="flex: 1">
      <el-button
        size="small"
        type="danger"
        icon="Delete"
        circle
        @click="model.splice(i, 1)"
      />
    </el-col>
  </el-row>
  <el-divider border-style="solid" />
  <el-row
    :gutter="10"
    style="display: flex; flex-wrap: nowrap; align-items: center"
  >
    <!-- 左侧：文本 -->
    <el-col :style="{ flex: '0 0 auto' }">
      <el-text type="info">
        <el-icon><Location /></el-icon>
        {{ region || "请选择详细的地址" }}
      </el-text>
    </el-col>

    <!-- 中间：下拉选择 -->
    <el-col style="flex: 1; max-width: 400px">
      <el-select
        v-model="current"
        filterable
        reserve-keyword
        placeholder="选择地区"
        style="width: 100%"
      >
        <el-option
          v-for="item in options"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
    </el-col>

    <!-- 右侧：按钮 -->
    <el-col :style="{ flex: '0 0 auto' }">
      <el-button type="primary" icon="Plus" circle @click="add()" />

      <el-button type="info" icon="Refresh" circle @click="reset()" />
    </el-col>
  </el-row>
</template>
<script setup>
import { getIpregion } from "@/apis/wafcdn/ipregion";
import { ref, watch } from "vue";

// 处理默认数据展示
const model = defineModel();
model.value ??= [];

const options = ref([]);

const current = ref("");

const region = ref({
  Country: "",
  Province: "",
  City: "",
  County: "",
  ISP: "",
});

const load = () => {
  getIpregion(region.value).then((result) => {
    options.value = result.data;
  });
};

watch(current, () => {
  if (region.value.Country == "") {
    region.value.Country = current.value;
  } else {
    if (region.value.Province == "") {
      region.value.Province = current.value;
    } else {
      if (region.value.City == "") {
        region.value.City = current.value;
      } else {
        region.value.County = current.value;
      }
    }
  }
  options.value = [];
  load();
});

const reset = () => {
  for (const item in region.value) {
    region.value[item] = "";
  }
  current.value = "";
};

const add = () => {
  model.value.push(JSON.parse(JSON.stringify(region.value)));
  reset();
};

load();
</script>
