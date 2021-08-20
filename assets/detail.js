// $(function(){
// 	var jobId = getQueryVariable('id');
// 	console.log(jobId)
// 	var jobs = JSON.parse(localStorage.getItem('todayJobs'));
// 	var thisJob = jobs.find((c)=>c.Id==jobId);
// 	console.log('thisJob', thisJob)
// })

var jobId = getQueryVariable('id');
console.log(jobId)
var jobs = JSON.parse(localStorage.getItem('todayJobs'));
var job = jobs.find((c) => c.Id == jobId);
console.log('thisJob', job)
if(job){
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
	document.getElementsByClassName('work-content')[0].innerHTML=html;
}



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
