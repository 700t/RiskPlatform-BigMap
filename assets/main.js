var main = {
	
	// 向后台请求数据
	mainMethod: function(){
		this.getTodayJobs();
		this.workView();
		this.jobView();
		this.riskView();
		getAttendFail();
	},
	
	// 定义circle_layer
	circle_layer: '',

	// 异常详情
	showAbnormal: function(id, errortime){
		if (circle_layer && circle_layer !== '') {
			map.removeLayer(circle_layer)
		}		
		//	    var item = JSON.parse(localStorage.getItem('TodayJob'+id));
		var todayJobs = JSON.parse(localStorage.getItem('todayJobs'))
		let currentJobs = todayJobs.filter(function(item) {
			return item.Id === id;
		})
		let item = currentJobs[0]
		var html =
			'<div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title">异常信息</b></h3></div><div class="panel-body">';
		html += '<h3>连续三次人脸识别异常</h3>'
		html += '<ul style="display:block;line-height:30px;font-size:10px;"><li>作业单位：' + item.ConstructCompany + '</li>';
		html += '<li>任务名称：' + item.ScheduleName + '</li>';
		html += '<li>工作地点：' + item.WorkAddress + '</li>';
		html += '<li>专业名称：' + item.TaskType + '</li>';
		html += '<li>工作班组：' + item.ScheduleName + '</li>';
		html += '<li>工作负责人：' + item.WorkDirector + '</li>';
		html += '<li>企业用工人员数量：5人</li>';
		html += '<li>外来人员数量：10人</li>';
		html += '<li>到岗到位人员：' + item.ScheduleName + '</li>';
		html += '<li>预控措施：无</li><li></li></ul>';
		html += '<a href="javascript:showWarnFile(' + id + ', ' + errortime + ')"><b>异常资料 >></b></a></div></div>';
		
		let gps = item.GpsNumber.split(',');
		//			let gpsNumber = kcode2wgs(item.GpsNumber);		
		//			let gps = gpsNumber.split(',');
		circle_layer = L.circle(gps, 10000, {
			color: 'red',
			fillColor: '#f03',
			fillOpacity: 0.5
		}).addTo(map).bindPopup(html);
	},
	
	// 获取日计划
	getTodayJobs: function() {
		$.getJSON(`${common.baseUrl}api/ScheduleExtend`, function(res) {
			// console.log(res)
			if (res.Code != 200) {
				console.log('加载日计划出错');
				return;
			}
			const data = res.Data;
			$.each(data, function(i, item) {
				let gps = item.GpsNumber.split(',');
				if (gps) {
					let marker = L.marker(gps).addTo(map);
					marker.bindPopup('<div style="margin:13px;"><b>任务名称：</b><br />'+item.ScheduleName+'<br /><b><a href="JavaScript:showJobDetail('+item.Id+');">计划进行详情 >>></a></b></div>');
					marker.on('mouseover', function (e) {
					    this.openPopup();
					});
				}
			});
			localStorage.setItem('todayJobs', JSON.stringify(data))
		})
	},
	
	// 查看计划详情
	showJobDetail: function(id) {
		//iframe层
		layer.open({
			type: 2,
			title: '计划进行详情',
			shadeClose: true,
			shade: 0.4,
			area: ['1200px', '90%'],
			content: 'job_detail.html?id=' + id //iframe的url
		});
	},
	
	// 作业总览 （今日作业总数、高风险作业总数）
	workView: function() {
		$.getJSON(`${common.baseUrl}api/Job/TodayJobTotal`, function(res) {
			// console.log(res)
			if (res.Code === 200) {
				$('#today-total').text(res.Data.total);
				$('#high-risk-total').text(res.Data.highRiskTotal);
			}
		})
	},
	
	// 开工情况
	jobView: function() {
		$.getJSON(`${common.baseUrl}api/Job/JobStartTotal`, function(res) {
			console.log(res)
			if (res.Code === 200) {
				let d = res.Data;

				$('#job-nostart').text(d.executePairs.未开工);
				$('#job-executing').text(d.executePairs.执行中);
				$('#job-success').text(d.executePairs.已开工);

				let html = '';
				for(var m in d.workClassifies){
					console.log(m, d.workClassifies[m])
					html+='<div class="xin-xi"><span>'+m+'</span><span>'+d.workClassifies[m]+'</span></div>'
				}
				document.getElementsByClassName('work-container')[0].innerHTML=html;
			}
		})
	},
	
	// 风险总览
	riskView: function() {
		$.getJSON(`${common.baseUrl}api/Job/RiskTotal`, function(res) {
			//			console.log(res)
			if (res.Code === 200) {
				var d = res.Data;
				$('#power-4-1').text(d.Power4_1)
				$('#power-5').text(d.Power5)
				$('#power-6').text(d.Power6)
				$('#power-8-7').text(d.Power8_7)
				$('#run-1-2').text(d.Run1_2)
				$('#run-3').text(d.Run3)
				$('#run-4').text(d.Run4)
				$('#run-5').text(d.Run5)
				$('#base-1-2').text(d.Base1_2)
				$('#base-3').text(d.Base3)
				$('#base-4').text(d.Base4)
				$('#base-5').text(d.Base5)
			}
		})
	},
	
	// 查看 工作环节资料
	showWorkFile: function(id) {
		//iframe层
		layer.open({
			type: 2,
			title: '过程资料管控',
			shadeClose: true,
			shade: 0.8,
			area: ['700px', '90%'],
			content: 'work_file.html?id=' + id
		});
	},
	
	// 查看 考勤记录
	showClockRecord: function(id) {
		//iframe层
		layer.open({
			type: 2,
			title: '打卡情况',
			shadeClose: true,
			shade: 0.8,
			area: ['700px', '90%'],
			content: 'clock.html?id=' + id
		});
	},
	
	// 查看 异常考勤记录
	showWarnFile: function(id, errortime) {
		//iframe层
		layer.open({
			type: 2,
			title: '异常资料',
			shadeClose: true,
			shade: 0.8,
			area: ['700px', '90%'],
			content: `warn.html?id=${id}&errortime=${errortime}`
		});
	},
	
}

	
	// 获取 异常考勤记录
	function getAttendFail(){
		try {
			$.getJSON(`${common.baseUrl}api/Clock/Fails`, function(res) {
				if (res.Code === 200) {
					if (res.Data instanceof Array && res.Data.length > 0) {
						let html = ''
						$.each(res.Data, function(index, item) {
							//					console.log(item.ErrorTime)
							var oldTime = (new Date(item.ErrorTime)).getTime(); //得到毫秒数
							//					console.log(oldTime)
							//					var newTime = new Date(oldTime); //就得到普通的时间了
							//					console.log(newTime)
							//					html += `<li><img src="warn2.png"/><span>${item.ErrorTime}</span>项目打卡异常&ensp;<a href="javascript:showAbnormal(${item.WorkId},${errortime})">详情</a></li>`
							html += '<li><img src="warn2.png"/><span>' + item.ErrorTime +
								'</span>项目打卡异常&ensp;<a href="javascript:showAbnormal(' + item.WorkId +
								',' +
								oldTime + ')">详情</a></li>'
						});
						$('.tips-box ul').empty().append(html)
					}
				}
				setTimeout('getAttendFail()', 10000)
			})
		} catch (e) {
			console.log(e)
			getAttendFail()
		}
	}
	