<template>
  <div v-if="model.length" class="region-list">
    <div v-for="(item, i) in model" :key="i" class="region-item">
      <span>{{
        [item.Country, item.Province, item.City, item.County]
          .filter(Boolean)
          .join(" / ")
      }}</span>
      <el-button link type="danger" @click="model.splice(i, 1)">删除</el-button>
    </div>
  </div>
  <div class="region-form">
    <el-select
      v-model="draft.Country"
      filterable
      clearable
      placeholder="国家"
      @change="onCountry"
    >
      <el-option
        v-for="name in countries"
        :key="name"
        :label="name"
        :value="name"
      />
    </el-select>
    <el-select
      v-model="draft.Province"
      filterable
      clearable
      placeholder="省份"
      :disabled="!draft.Country"
      @change="onProvince"
    >
      <el-option
        v-for="name in provinces"
        :key="name"
        :label="name"
        :value="name"
      />
    </el-select>
    <el-select
      v-model="draft.City"
      filterable
      clearable
      placeholder="城市"
      :disabled="!draft.Province"
      @change="onCity"
    >
      <el-option
        v-for="name in cities"
        :key="name"
        :label="name"
        :value="name"
      />
    </el-select>
    <el-select
      v-model="draft.County"
      filterable
      clearable
      placeholder="区县"
      :disabled="!draft.City"
    >
      <el-option
        v-for="name in counties"
        :key="name"
        :label="name"
        :value="name"
      />
    </el-select>
    <el-button type="primary" :disabled="!draft.Country" @click="add">
      添加
    </el-button>
  </div>
</template>

<script setup>
import { getIPRegion } from "@/apis/wafcdn/ipRegion";
import { ref } from "vue";

const model = defineModel();
model.value ??= [];

const countries = ref([]);
const provinces = ref([]);
const cities = ref([]);
const counties = ref([]);
const draft = ref({
  Country: "",
  Province: "",
  City: "",
  County: "",
  ISP: "",
});

const load = (query) => {
  return getIPRegion(query).then((result) => result.data || []);
};

load({}).then((data) => {
  countries.value = data;
});

const onCountry = () => {
  draft.value.Province = "";
  draft.value.City = "";
  draft.value.County = "";
  provinces.value = [];
  cities.value = [];
  counties.value = [];
  if (!draft.value.Country) {
    return;
  }
  load({ Country: draft.value.Country }).then((data) => {
    provinces.value = data;
  });
};

const onProvince = () => {
  draft.value.City = "";
  draft.value.County = "";
  cities.value = [];
  counties.value = [];
  if (!draft.value.Province) {
    return;
  }
  load({
    Country: draft.value.Country,
    Province: draft.value.Province,
  }).then((data) => {
    cities.value = data;
  });
};

const onCity = () => {
  draft.value.County = "";
  counties.value = [];
  if (!draft.value.City) {
    return;
  }
  load({
    Country: draft.value.Country,
    Province: draft.value.Province,
    City: draft.value.City,
  }).then((data) => {
    counties.value = data;
  });
};

const add = () => {
  if (!draft.value.Country) {
    return;
  }
  model.value.push({ ...draft.value });
  draft.value.Province = "";
  draft.value.City = "";
  draft.value.County = "";
  cities.value = [];
  counties.value = [];
};
</script>

<style scoped>
.region-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.region-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.region-form {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.region-form .el-select {
  width: 140px;
}
</style>
