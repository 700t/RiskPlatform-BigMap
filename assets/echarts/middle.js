var dom = document.getElementById("middle-container");
var myChart = echarts.init(dom);
var app = {};

var option;

option = {
	title: {
		text: '现场打卡识别情况',
		// subtext: '纯属虚构',
		left: 'center'
	},
	tooltip: {
		trigger: 'item'
	},
	legend: {
		top: 'bottom'
	},
	toolbox: {
		show: true,
		feature: {
			mark: {
				show: true
			},
			dataView: {
				show: true,
				readOnly: false
			},
			restore: {
				show: true
			},
			saveAsImage: {
				show: true
			}
		}
	},
	series: [{
		name: '识别情况',
		type: 'pie',
		// radius: [50, 170],
		radius: '40%',
		center: ['50%', '50%'],
		roseType: 'area',
		itemStyle: {
			borderRadius: 8
		},
		data: [{
				value: 40,
				name: 'rose 1'
			},
			{
				value: 38,
				name: 'rose 2'
			},
			{
				value: 32,
				name: 'rose 3'
			},
			{
				value: 30,
				name: 'rose 4'
			},
			{
				value: 28,
				name: 'rose 5'
			},
			{
				value: 26,
				name: 'rose 6'
			},
			{
				value: 22,
				name: 'rose 7'
			},
			{
				value: 18,
				name: 'rose 8'
			}
		]
	}]
};

if (option && typeof option === 'object') {
	myChart.setOption(option);
	setTimeout(function() {
		window.onresize = function() {
			myChart.resize();
		}
	}, 200)
}
