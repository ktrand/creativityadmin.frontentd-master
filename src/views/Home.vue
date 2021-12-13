<template>
  <div>
	<vx-card v-if="comments.length > 0" title="Комментарии">
		<e-charts autoresize :options="commentLine" theme="ovilia-green" ref="line" auto-resize />
	</vx-card>
	<vx-card class="mt-5" v-if="likes.length > 0" title="Лайки">
		<e-charts autoresize :options="likeLine" theme="ovilia-green" ref="line" auto-resize />
	</vx-card>
	<vx-card class="mt-5" v-if="users.length > 0" title="Пользователи">
		<e-charts autoresize :options="userLine" theme="ovilia-green" ref="line" auto-resize />
	</vx-card>
  </div>
</template>

<script>
import ECharts from 'vue-echarts/components/ECharts'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/chart/line'

export default {
  data() {
    return {
	comments:[],
	likes:[],
	users:[],
    }
  },
  components: {
    ECharts
  },

  computed:{
		commentLine(){
			return {
				visualMap: [{
					show: false,
					type: 'continuous',
					seriesIndex: 0,
					min: 0,
					max: 400
				}],
				tooltip: {
					trigger: 'axis'
				},
				xAxis: {
					data: this.dateList(this.comments)
				},
				yAxis: {
					splitLine: {show: false},
				},
				series: {
					type: 'line',
					showSymbol: false,
					data: this.valueList(this.comments)
				}
			}
		},
		likeLine(){
			return {
				visualMap: [{
					show: false,
					type: 'continuous',
					seriesIndex: 0,
					min: 0,
					max: 400
				}],
				tooltip: {
					trigger: 'axis'
				},
				xAxis: {
					data: this.dateList(this.likes)
				},
				yAxis: {
					splitLine: {show: false},
				},
				series: {
					type: 'line',
					showSymbol: false,
					data: this.valueList(this.likes)
				}
			}
		},
		userLine(){
			return {
				visualMap: [{
					show: false,
					type: 'continuous',
					seriesIndex: 0,
					min: 0,
					max: 400
				}],
				tooltip: {
					trigger: 'axis'
				},
				xAxis: {
					data: this.dateList(this.users)
				},
				yAxis: {
					splitLine: {show: false},
				},
				series: {
					type: 'line',
					showSymbol: false,
					data: this.valueList(this.users)
				}
			}
		}
  },

  methods:{
	getStatistics(){
		this.$http.get('statistics').then(response => {
			this.comments = response.data.comments
			this.likes = response.data.likes
			this.users = response.data.users
		})
	},
	dateList(data){
		return data.map(el => el.date)
	},
	valueList(data){
		return data.map(el => el.count)
	}
  },

  mounted(){
	this.getStatistics()
  }
}
</script>