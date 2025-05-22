<template>
  <el-col :xs="xs" :sm="sm" :lg="lg">
    <div class="card-panel" :style="{ '--icon-color': iconColor }">
      <div class="card-panel-icon">
        <el-icon>
          <component :is="icon" />
        </el-icon>
      </div>
      <div class="card-panel-description">
        <p class="card-panel-title">
          {{ title }}
        </p>
        <span class="card-panel-text">
          {{ text }}
        </span>
      </div>
    </div>
  </el-col>
</template>

<script setup>
defineProps({
  xs: {
    type: Number,
    default: 12,
  },
  sm: {
    type: Number,
    default: 12,
  },
  lg: {
    type: Number,
    default: 12,
  },
  title: {
    type: String,
    default: "",
  },
  text: {
    type: [String, Number],
    default: "",
  },
  icon: {
    type: String,
    default: "",
  },
  iconColor: {
    type: String,
    default: "#666",
  },
});
</script>

<style lang="scss" scoped>
.card-panel {
  height: 108px;
  font-size: 12px;
  margin-bottom: 12px;
  color: var(--icon-color);
  background: var(--ea-main-color);
  display: flex;
  flex-direction: row;
  align-items: center;

  .card-panel-icon {
    // border: 1px dotted;
    width: 70px;
    height: 60px;
    margin-left: 8px;
    padding-top: 8px;
    font-size: 48px;
    text-align: center;
  }

  &:hover {
    .card-panel-icon {
      color: white;
      background: var(--icon-color);
    }
    .card-panel-description .card-panel-title {
      color: var(--icon-color);
    }
  }

  .card-panel-description {
    flex: 1;
    text-align: right;
    margin-right: 15px;
    .card-panel-title {
      color: #82828273;
      font-size: 16px;
    }

    .card-panel-text {
      font-size: 20px;
      color: #828282;
    }
  }
}
</style>
