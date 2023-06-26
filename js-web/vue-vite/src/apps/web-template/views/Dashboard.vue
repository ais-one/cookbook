<template>
  <div class="ds-stat-container">
    <a-row :gutter="8">
      <a-col class="ds-stat" :sm="24" :md="12" :xl="6">
        <a-card>
          <a-statistic title="Feedback" :value="11.28" :precision="2" suffix="%" :value-style="{ color: '#3f8600' }">
            <template #prefix>
              <arrow-up-outlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col class="ds-stat" :sm="24" :md="12" :xl="6">
        <a-card>
          <a-statistic title="Storage" :value="'87 of 120'" suffix="GB" class="demo-class" :value-style="{ color: '#cf1322' }" />
        </a-card>
      </a-col>

      <a-col class="ds-stat" :sm="24" :md="12" :xl="6">
        <a-card>
          <a-statistic title="VM Instances" :precision="0" :value="3" />
        </a-card>
      </a-col>
      <a-col class="ds-stat" :sm="24" :md="12" :xl="6">
        <a-card>
          <a-statistic title="DB Instances" :precision="0" :value="1" />
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="8">
      <a-col class="ds-stat" :lg="24" :xl="16">
        <a-page-header title="Services" />
        <a-list :grid="{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 3 }" :data-source="data">
          <template #renderItem="{ item }">
            <a-list-item>
              <a-card :bordered="false">
                <a-avatar :size="64">
                  <template #icon><UserOutlined /></template>
                </a-avatar>
                <a-card-meta>
                  <template #title>
                    <span>{{ item.name }}</span>
                  </template>
                  <template #description>
                    <span style="font-size: 0.8em">{{ item.title }}</span>
                  </template>
                </a-card-meta>
              </a-card>
            </a-list-item>
          </template>
        </a-list>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { ArrowUpOutlined, ArrowDownOutlined, UserOutlined } from '@ant-design/icons-vue'

const data = [
  { name: 'Note', title: 'Notes Application' }
  // { name: 'GIS', title: 'Data Scientist' },
  // { name: 'Great Barrier Reef', title: 'Data Engineer' },
  // { name: 'Love', title: 'Data Scientist' }
]

export default {
  name: 'DashBoard',
  components: {
    ArrowUpOutlined,
    // ArrowDownOutlined,
    UserOutlined
  },
  setup() {
    return {
      data
    }
  }
}
</script>

<style>
.ds-stat {
  margin-top: 0px;
  padding-top: 0px;
}

.ds-stat-container {
  padding: 0;
}

.ant-card-meta-title {
  margin-bottom: 0 !important;
}

.ant-card-body {
  text-align: center;
}
</style>
