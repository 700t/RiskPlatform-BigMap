//<!--地球坐标系（WGS）到火星坐标系（GCJ-02）的转换算法-->
var M_PI = 3.14159265358979324;
		var a = 6378245.0;
		var ee = 0.00669342162296594323;
		var x_pi = M_PI * 3000.0 / 180.0;
		function out_of_china(lat,  lon) {
			if (lon < 72.004 || lon > 137.8347)
				return true;
			if (lat < 0.8293 || lat > 55.8271)
				return true;
			return false;
		}
		 
		function wgs2gcj_lat(x, y) {
			var ret1 = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y
					+ 0.2 * Math.sqrt(Math.abs(x));
			
			ret1 += (20.0 * Math.sin(6.0 * x * M_PI) + 20.0 * Math.sin(2.0 * x
					* M_PI)) * 2.0 / 3.0;
			ret1 += (20.0 * Math.sin(y * M_PI) + 40.0 * Math.sin(y / 3.0 * M_PI)) * 2.0 / 3.0;
			ret1 += (160.0 * Math.sin(y / 12.0 * M_PI) + 320 * Math.sin(y * M_PI
					/ 30.0)) * 2.0 / 3.0;
			return ret1;
		}
		 
		function wgs2gcj_lng(x, y) {
			var ret2 = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1
					* Math.sqrt(Math.abs(x));
			ret2 += (20.0 * Math.sin(6.0 * x * M_PI) + 20.0 * Math.sin(2.0 * x
					* M_PI)) * 2.0 / 3.0;
			ret2 += (20.0 * Math.sin(x * M_PI) + 40.0 * Math.sin(x / 3.0 * M_PI)) * 2.0 / 3.0;
			ret2 += (150.0 * Math.sin(x / 12.0 * M_PI) + 300.0 * Math.sin(x / 30.0
					* M_PI)) * 2.0 / 3.0;
			return ret2;
		}
		 
		function wgs2gcj(poi) {
			if (out_of_china(poi.lat, poi.lng)) {
				return poi;
			}
			var poi2 = {};
			var dLat = wgs2gcj_lat(poi.lng - 105.0, poi.lat - 35.0);
			var dLon = wgs2gcj_lng(poi.lng - 105.0, poi.lat - 35.0);
			var radLat = poi.lat / 180.0 * M_PI;
			var magic = Math.sin(radLat);
			magic = 1 - ee * magic * magic;
			var sqrtMagic = Math.sqrt(magic);
			dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * M_PI);
			dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * M_PI);
			poi2.lat = poi.lat + dLat;
			poi2.lng = poi.lng + dLon;
			return poi2;
		}
		
//	<!--火星坐标系 (GCJ-02) 与凯立德K码 的转换算法-->
var codes = "0123456789abcdefghijkmnpqrstuvwxyz";
		function __decode(pch)
		{
			var v = 0;
			for (var i = 3; i >= 0; --i)
				v = v * 34 + (codes.indexOf(pch.charAt(i)));
			v = v * 250 / 9;
			return v;
		}
		 
		function __encode(v)
		{
			var pch = "";
			v = v * 9 / 250;
			for (var i = 0; i < 4; ++i)
			{
				pch += codes.charAt(v % 34);
				v /= 34;
			}
			return pch;
		}
		 
		function DecodeLon(k)
		{
			var lon = __decode(k.substring(1, 5));
			if (k.charAt(0) == '5' || k.charAt(0) == '8')
				lon += 35000000;
			lon += 70000000;
			return lon/1000000.0;
		}
		 
		function DecodeLat(k)
		{
			var lat = __decode(k.substring(5, 9));
			if (k.charAt(0) <= '6')
				lat += 35000000;
			lat += 5000000;
			return lat/1000000.0;
		}
		 
		function Encode(lat, lon)
		{
			lat = parseInt(lat*1000000);
			lon = parseInt(lon*1000000);
			var k;
			lon -= 70000000;
			lat -= 5000000;
			if (lat > 35000000)
				if (lon <= 35000000)
					k = "6";
				else
					k = "5";
			else
				if (lon <= 35000000)
					k = "7";
				else
					k = "8";
			if (lon > 35000000)
				lon -= 35000000;
			if (lat > 35000000)
				lat -= 35000000;
			k += __encode(lon);
			k += __encode(lat);
			return k;
		}
		
		
// 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换算法
		function gcj2bd(poi) {
			var poi2 = {};
			var x = poi.lng, y = poi.lat;
			var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
			var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
			poi2.lng = z * Math.cos(theta) + 0.0065;
			poi2.lat = z * Math.sin(theta) + 0.006;
			return poi2;
		}
		 
		function bd2gcj(poi) {
			var poi2 = {};
			var x = poi.lng - 0.0065, y = poi.lat - 0.006;
			var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
			var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
			poi2.lng = z * Math.cos(theta);
			poi2.lat = z * Math.sin(theta);
			return poi2;
		}
