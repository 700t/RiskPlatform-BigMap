var dom = document.getElementById("left-buttom-container");
var myChart = echarts.init(dom);
var app = {};

var option;

option = {
    title: {
        text: '本月历史率',
        // subtext: '纯属虚构',
        left: 'center'
    },
    tooltip: {
        trigger: 'item'
    },
    legend: {
        orient: 'vertical',
        left: 'left',
		bottom: 'bottom'
    },
    series: [
        {
            name: '访问来源',
			top: '8%',
            type: 'pie',
            radius: '40%',
            data: [
                {value: 1048, name: '搜索引擎'},
                {value: 735, name: '直接访问'},
                {value: 580, name: '邮件营销'},
                {value: 484, name: '联盟广告'},
                {value: 300, name: '视频广告'}
            ],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
};

if (option && typeof option === 'object') {
	myChart.setOption(option);
}
