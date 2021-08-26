
var jobId = getQueryVariable('id');
// console.log(jobId)
var jobs = JSON.parse(localStorage.getItem('todayJobs'));
var job = jobs.find((c) => c.Id == jobId);
// console.log('thisJob', job)
if (job) {
	let html = `<p><b>任务名称：</b>${job.ScheduleName}</p>
				<p><b>工作地点：</b>${job.WorkAddress}</p>
				<p><b>专业名称：</b>${job.TaskType}</p>
				<p><b>作业单位：</b>${job.ConstructCompany}</p>
				<p><b>工作班组：</b>${job.WorkTeam}</p>
				<p><b>预控措施：</b>${job.PrecontrolMethod}</p>
				<p><b>工作负责人：</b>${job.WorkDirector}</p>
				<p><b>企业用工人数：</b>${job.MainWorkerCount}人</p>
				<p><b>外来用工人数：</b>${job.ExternalWorkerCount}人</p>
				<p><b>到岗到位人员：</b>${job.CountryUser}</p>
				<p><b>电网运检等级：</b>${job.PowerGridRunRank}</p>
				<p><b>计划当前状态：</b>${job.ExecuteStatus}</p>`;
	document.getElementsByClassName('work-content')[0].innerHTML = html;
}

$.getJSON(`${common.baseUrl}api/Job/RunDetail/${jobId}`, function(res) {
	if (res.Code === 200) {
		console.log('res', res)
		// 中间 现场打卡识别情况 图表
		middleChart(res.Data.ClockData)
		// 左下 本月历史率 图表
		leftBottomChart(res.Data.MonthClockData)
		// 打卡成功列表
		clockOkList(res.Data.SuccessRecords)
		// 异常列表
		exceptionList(res.Data.FailRecords)

	} else {
		layer.msg('加载数据失败', {
			icon: 2
		});
	}
})

function getQueryVariable(variable) {
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		if (pair[0] == variable) {
			return pair[1];
		}
	}
	return (false);
}

function middleChart(mdata) {
	var dom = document.getElementById("middle-container");
	var myChart = echarts.init(dom);
	var app = {};

	var option = {
		title: {
			text: '现场打卡识别情况',
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
		series: [{
			name: '识别情况',
			top: '8%',
			type: 'pie',
			radius: '40%',
			data: mdata,
			emphasis: {
				itemStyle: {
					shadowBlur: 10,
					shadowOffsetX: 0,
					shadowColor: 'rgba(0, 0, 0, 0.5)'
				}
			}
		}]
	};
	// console.log('showMiddle', option)
	if (option && typeof option === 'object') {
		myChart.setOption(option);
	}
}

function leftBottomChart(mdata) {
	var dom = document.getElementById("left-buttom-container");
	var myChart = echarts.init(dom);
	var app = {};

	var option = {
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
		series: [{
			name: '识别情况',
			top: '8%',
			type: 'pie',
			radius: '40%',
			data: mdata,
			emphasis: {
				itemStyle: {
					shadowBlur: 10,
					shadowOffsetX: 0,
					shadowColor: 'rgba(0, 0, 0, 0.5)'
				}
			}
		}]
	};
	// console.log('showLeftBottom', option)
	if (option && typeof option === 'object') {
		myChart.setOption(option);
	}
}

function clockOkList(mdata) {
	let html = '<tr><th>打卡时间</th><th>打卡人员</th><th>所属公司</th><th>其他</th></tr>';
	mdata.forEach(function(item, i) {
		html += `<tr><td>${item.Time}</td><td>${item.Name}</td><td>${item.Company}</td><td><a href="JavaScript:photoTip('${item.Photo}');">查看</a></td></tr>`;
	})
	document.getElementsByClassName('table')[0].innerHTML = html;
}

function exceptionList(mdata) {
	let html = '';
	if (!mdata || !mdata instanceof Array || mdata.length == 0) {
		html += '<p>暂无告警信息</p>';
		document.getElementsByClassName('warn-content')[0].innerHTML = html;
		return
	}
	mdata.forEach(function(item, i) {
		html +=
			`<p>${item.ClockTime}&emsp;&emsp;${item.ErrorMsg}&emsp;&emsp;<a href="JavaScript:photoTip('${item.ClockPhoto}');">查看</a></p>`;
	})
	document.getElementsByClassName('warn-content')[0].innerHTML = html;
}

function photoTip(src) {
	layer.photos({
		photos: {
			"data": [{
				'src': src
			}],
		} //格式见API文档手册页
		,
		anim: 5 //0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）  
	});
}

// 调用示例
$("body").on("click", ".warn-content img", function(e) {
	layer.photos({
		photos: {
			"data": [{
				"src": e.target.src,
			}]
		}
	});
});
