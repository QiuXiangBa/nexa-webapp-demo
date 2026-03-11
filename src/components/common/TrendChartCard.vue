<script setup lang="ts">
import { computed } from 'vue';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, DataZoomComponent } from 'echarts/components';

// 按需注册 ECharts 模块，避免全量引入增大包体积
use([CanvasRenderer, LineChart, GridComponent, TooltipComponent, DataZoomComponent]);

interface TrendPoint {
  date: string;
  value: number | string;
}

const props = defineProps<{
  points: TrendPoint[];
}>();

// 超过此数量才启用 dataZoom 拖动（mock 数据固定 7 点，真实接口可能更多）
const WINDOW_SIZE = 10;
const needZoom = computed(() => props.points.length > WINDOW_SIZE);

// 点数多时隐藏顶部数值标签，改为 tooltip 交互查看
const showValueLabel = computed(() => !needZoom.value);

// 点数多时缩小圆点
const symbolSize = computed(() => (needZoom.value ? 3 : 5));

const option = computed(() => {
  const n = props.points.length;
  const zoomStart = needZoom.value ? Math.max(0, Math.round(((n - WINDOW_SIZE) / n) * 100)) : 0;

  return {
    backgroundColor: 'transparent',
    grid: {
      top: showValueLabel.value ? 28 : 14,
      bottom: 20,
      left: 8,
      right: 8,
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      confine: true,
      backgroundColor: 'rgba(0,0,0,0.7)',
      borderWidth: 0,
      textStyle: { color: '#fff', fontSize: 10 },
      formatter: (params: { name: string; value: number }[]) => {
        const p = params[0];
        return `${p.name}  ${p.value} 诺`;
      }
    },
    dataZoom: needZoom.value
      ? [{ type: 'inside', start: zoomStart, end: 100, zoomOnMouseWheel: false, moveOnMouseWheel: false }]
      : [],
    xAxis: {
      type: 'category',
      data: props.points.map((p) => p.date),
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.25)' } },
      axisTick: { show: false },
      axisLabel: { color: 'rgba(255,255,255,0.95)', fontSize: 8, fontWeight: 700, interval: 0 },
      boundaryGap: false
    },
    yAxis: { type: 'value', show: false },
    series: [
      {
        type: 'line',
        data: props.points.map((p) => Number(p.value) || 0),
        smooth: true,
        symbol: 'circle',
        symbolSize: symbolSize.value,
        itemStyle: { color: '#fff' },
        lineStyle: { color: '#7EDCFA', width: 1.6 },
        label: {
          show: showValueLabel.value,
          position: 'top',
          color: 'rgba(255,255,255,0.9)',
          fontSize: 6,
          fontWeight: 700,
          formatter: '{c} ¥'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(126,220,250,0.3)' },
              { offset: 1, color: 'rgba(126,220,250,0)' }
            ]
          }
        }
      }
    ]
  };
});
</script>

<template>
  <div class="trend-chart-card">
    <VChart class="chart" :option="option" autoresize />
  </div>
</template>

<style scoped>
.trend-chart-card {
  position: relative;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  border-radius: var(--nexa-radius-sm);
  background: var(--nexa-gradient-trend-card);
  height: 108px;
  box-sizing: border-box;
}

.chart {
  width: 100% !important;
  max-width: 100%;
  height: 100%;
  display: block;
}
</style>
