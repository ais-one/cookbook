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
          <a-statistic title="Idle" :value="9.3" :precision="2" suffix="%" class="demo-class" :value-style="{ color: '#cf1322' }">
            <template #prefix>
              <arrow-down-outlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>

      <a-col class="ds-stat" :sm="24" :md="12" :xl="6">
        <a-card>
          <a-statistic title="Active Users" :value="112893" />
        </a-card>
      </a-col>
      <a-col class="ds-stat" :sm="24" :md="12" :xl="6">
        <a-card>
          <a-statistic title="Account Balance (CNY)" :precision="2" :value="112893" />
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="8">
      <a-col class="ds-stat" :lg="24" :xl="16">
        <a-row :gutter="8">
          <a-col class="ds-stat" :span="12">
            <a-page-header title="Team Members" />
            <a-list :grid="{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 3 }" :data-source="data">
              <template #renderItem="{ item }">
                <a-list-item>
                  <a-card :bordered="false">
                    <a-avatar :size="64">
                      <template #icon><UserOutlined /></template>
                    </a-avatar>
                    <a-card-meta>
                      <template #title><span>{{ item.name }}</span></template>
                      <template #description><span style="font-size: 0.8em;">{{ item.title }}</span></template>
                    </a-card-meta>
                  </a-card>
                </a-list-item>
              </template>
            </a-list>
          </a-col>
          <a-col class="ds-stat" :span="12">
            <a-page-header title="Comments" />
            <a-list item-layout="horizontal" :data-source="data">
              <template #renderItem="{ item }">
                <a-list-item>
                  <a-list-item-meta
                    description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                  >
                    <template #title>
                      <a href="https://www.antdv.com/">{{ item.title }}</a>
                    </template>
                    <template #avatar>
                      <a-avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                    </template>
                  </a-list-item-meta>
                </a-list-item>
              </template>
            </a-list>
          </a-col>
          <a-col class="ds-stat" :span="24">
            <a-page-header title="Something Here" />
            <a-skeleton :paragraph="{ rows: 2 }" />
          </a-col>
          <a-col class="ds-stat" :span="24"></a-col>
        </a-row>
      </a-col>

      <a-col class="ds-stat" :lg="24" :xl="8">
        <a-row :gutter="8">
          <a-col class="ds-stat" :span="24">
            <a-page-header title="Useful Links" />
            <a-skeleton :paragraph="{ rows: 3 }" />
          </a-col>
          <a-col class="ds-stat" :span="24">
            <a-page-header title="Useful Links 2" />
            <a-skeleton :paragraph="{ rows: 15 }" />
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
  <!--
    <a-row :gutter="8">
      <a-col class="ds-stat" :xs="24" :sm="12" :md="8" :lg="6">
        <a-statistic title="Feedback" :value="1128" style="margin-right: 50px">
          <template #suffix><like-outlined /></template>
        </a-statistic>
      </a-col>
      <a-col class="ds-stat" :xs="24" :sm="12" :md="8" :lg="6">
        <a-statistic title="Unmerged" :value="93" class="demo-class">
          <template #suffix><span>/ 100</span></template>
        </a-statistic>
      </a-col>
    </a-row>
  -->
</template>

<script>
import { ArrowUpOutlined, ArrowDownOutlined, UserOutlined } from '@ant-design/icons-vue'

const data = [
  { name: 'Faith', title: 'Full-stack Dev' },
  { name: 'Hope', title: 'Data Scientist' },
  { name: 'Charity', title: 'Data Engineer' },
  { name: 'Love', title: 'Data Scientist' }
]

export default {
  components: {
    ArrowUpOutlined,
    ArrowDownOutlined,
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
  /* background-color: lightslategray; */
}

.ds-stat-container {
  /* background: #ececec; */
  padding: 0;
}

.ant-card-meta-title {
  margin-bottom: 0 !important;
}

.ant-card-body {
  /* justify-content: center !important; */
  text-align: center;
}
</style>
