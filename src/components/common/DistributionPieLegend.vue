<script setup lang="ts">
import { computed, ref } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import { TooltipComponent, LegendComponent } from 'echarts/components';
import VChart from 'vue-echarts';

use([CanvasRenderer, PieChart, TooltipComponent, LegendComponent]);

const props = defineProps<{
  items: Array<{ name: string; value: string; percent: number; color: string }>;
}>();

const activeIndex = ref<number | null>(null);

const option = computed(() => ({
  tooltip: { show: false },
  series: [
    {
      type: 'pie',
      radius: ['52%', '80%'],
      center: ['50%', '50%'],
      data: props.items.map((item, i) => ({
        name: item.name,
        value: item.percent,
        itemStyle: {
          color: item.color,
          opacity: activeIndex.value === null || activeIndex.value === i ? 1 : 0.35
        }
      })),
      label: { show: false },
      labelLine: { show: false },
      emphasis: { scale: true, scaleSize: 6 },
      selectedMode: false
    }
  ]
}));

function onChartClick(params: { dataIndex: number }) {
  activeIndex.value = activeIndex.value === params.dataIndex ? null : params.dataIndex;
}

// zr:click 覆盖整个画布，target 为空表示点到了空白区域
function onCanvasClick(params: { target?: unknown }) {
  if (!params.target) {
    activeIndex.value = null;
  }
}

function onLegendClick(index: number) {
  activeIndex.value = activeIndex.value === index ? null : index;
}
</script>

<template>
  <div class="distribution-wrap">
    <VChart class="pie-chart" :option="option" autoresize @click="onChartClick" @zr:click="onCanvasClick" />
    <div class="legend-card">
      <div
        v-for="(item, index) in items"
        :key="item.name"
        class="legend-row"
        :class="{ active: activeIndex === index, dimmed: activeIndex !== null && activeIndex !== index }"
        @click="onLegendClick(index)"
      >
        <span class="dot" :style="{ background: item.color }" />
        <span class="name">{{ item.name }}</span>
        <span class="percent">{{ item.percent }}%</span>
        <span class="value">{{ item.value }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.distribution-wrap {
  display: grid;
  grid-template-columns: 128px 1fr;
  gap: 12px;
  align-items: center;
}

.pie-chart {
  width: 108px;
  height: 108px;
  cursor: pointer;
}

.legend-card {
  border-radius: var(--nexa-radius-lg);
  background: var(--nexa-color-surface-card);
  padding: 12px;
}

.legend-row {
  display: grid;
  grid-template-columns: 10px 1fr auto auto;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--nexa-color-text-secondary);
  cursor: pointer;
  transition: opacity 0.2s;
  border-radius: 4px;
  padding: 2px 4px;
  margin: 0 -4px;
}

.legend-row + .legend-row {
  margin-top: 6px;
}

.legend-row.active {
  background: rgba(0, 0, 0, 0.04);
}

.legend-row.dimmed {
  opacity: 0.4;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.name {
  color: var(--nexa-color-text-primary);
}

.percent {
  color: var(--nexa-color-text-secondary);
  font-size: 11px;
}

.value {
  color: var(--nexa-color-text-secondary);
}
</style>
