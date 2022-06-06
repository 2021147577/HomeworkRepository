var map;
var marker_s, marker_e;
var markerArr = new Array();
var distanceArr = new Array();
var pathArr = new Array();
var maxArr = new Array();
var bestArr = new Array();
var testArr = new Array();
var drawInfoArr = [];
var resultdrawArr = [];
var markersPosition = [];
var markers = [];

function startMap() {
	newMap();

	load(37.566831, 126.934991, 37.564797, 126.930436);
	console.log("end");
	
}
function draw(){
	marker_m1 = addMarker(37.566831, 126.934991);//홍입
	marker_m2 = addMarker(37.564797, 126.930436);//신촌역
	
	for(var i = 0; i<markersPosition.length; i++){
		addMarker(markersPosition[i][0], markersPosition[i][1])
	}
	
	for(var i = 0; i<markerArr.length; i++){
		var distance = [];
		for(var j = 0; j<markerArr.length; j++){
			if(i == j) {distance.push(0);}
			else if(i > j) {distance.push(distanceArr[j][i]);}
			else if(i <j) {
				distance.push(findDistance(getX(markerArr[i]), getY(markerArr[i]), getX(markerArr[j]), getY(markerArr[j])))
			};
		}
		distanceArr.push(distance);
	}
	console.log(distanceArr);

	for(var i = 2; i<markerArr.length; i++){
		var p = distanceArr[0][i] + distanceArr[1][i]
		var m = 1/(distanceArr[0][i] + distanceArr[1][i]);
		var path = [p, 0, i, 1];
		var max = [m, 0, i, 1]
		
		maxArr.push(max);
		pathArr.push(path);
	}
	
	bestArr = findMax();
	
	for(var i = 1; i < bestArr.length-1; i++){
		console.log(bestArr[i], bestArr[i+1]);
		findPath(getX(markerArr[bestArr[i]]), getY(markerArr[bestArr[i]]), getX(markerArr[bestArr[i+1]]), getY(markerArr[bestArr[i+1]]));
	}

	console.log(maxArr);
	drawLine(drawInfoArr);
}


function findMax(){
	for(var num = 2; num<markerArr.length-1; num++){
		for(i = 0; i<markerArr.length-2; i++){
			var min_dis = 999999;
			var min_position;
			var min_num;

			for(j = 2; j<markerArr.length; j++){
				var pre_dis = pathArr[i][0];
				var bol = true;
				for(var n = 1; n<pathArr[0].length; n++){
					if(j == pathArr[i][n]){
						bol = false;
					}
				}

				if(bol){
					for(k = 1; k<pathArr[0].length - 1; k++){
						var mid_dis = pre_dis + distanceArr[pathArr[i][k]][j] + distanceArr[j][pathArr[i][k+1]] - distanceArr[pathArr[i][k]][pathArr[i][k+1]]
						if(min_dis > mid_dis){
							min_dis = mid_dis;
							min_position = k;
							min_num = j;
						}
					}
				}
			}
			pathArr[i].splice(min_position+1, 0, min_num);
			pathArr[i][0] = min_dis;

			if((num/min_dis) > maxArr[i][0]){
				maxArr[i] = replexArr(pathArr[i]);
				maxArr[i][0] = num/min_dis;
			}
		}
		
	}
	var bestPath = [0];
	for(i = 0; i<markerArr.length-2; i++){
		if(bestPath[0] < maxArr[i][0]){
			bestPath= replexArr(maxArr[i]);
		}
	}
	return bestPath;
}

function newMap() {
	map = new Tmapv2.Map("map_div", {
		center : new Tmapv2.LatLng(37.570028, 126.989072),
		width : "100%",
		height : "400px",
		zoom : 15,
		zoomControl : true,
		scrollwheel : true
	});
	return map;
}

function replexArr(arr){
	var replex = [];
	for(var i = 0; i<arr.length; i++) { replex.push(arr[i]); }
	return replex
}

function sleep(ms) {
	const wakeUpTime = Date.now() + ms;
	while (Date.now() < wakeUpTime) {}
}

function changeMax(i){
	maxArr[i]
}

function getX(marker){
	return marker.getPosition()._lng.toString();
}

function getY(marker){
	return marker.getPosition()._lat.toString();
}

function addMarker(X,Y){
	var marker = new Tmapv2.Marker({
		position : new Tmapv2.LatLng(X, Y),
		icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_e.png",
		iconSize : new Tmapv2.Size(24, 38),
		map : map
	});
	markerArr.push(marker);
	return marker;
}

function findDistance(stX, stY, enX, enY){
	var distance;
    $
		.ajax({
			method : "POST",
			url : "https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json&callback=result",
			async : false,
			data : {
				"appKey" : "l7xx699139287629467e9aeb4001b760cb68",
				"startX" : stX,
				"startY" : stY,
				"endX" : enX,
				"endY" : enY,
				"reqCoordType" : "WGS84GEO",
				"resCoordType" : "EPSG3857",
				"startName" : "출발지",
				"endName" : "도착지"
				},
			success : function(response) {
				var resultData = response.features;
				distance = (resultData[0].properties.totalDistance) / 1000;

				//결과 출력
				var tDistance = "총 거리 : "
					+ ((resultData[0].properties.totalDistance) / 1000)
					.toFixed(1) + "km,";
				var tTime = " 총 시간 : "
					+ ((resultData[0].properties.totalTime) / 60)
				    .toFixed(0) + "분";

				$("#result").text(tDistance + tTime);
                }
        })
		sleep(500);
		return distance;
}

function findPath(stX, stY, enX, enY){
	$
	.ajax({
		method : "POST",
		url : "https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json&callback=result",
		async : false,
		data : {
			"appKey" : "l7xx699139287629467e9aeb4001b760cb68",
			"startX" : stX,
			"startY" : stY,
			"endX" : enX,
			"endY" : enY,
			"reqCoordType" : "WGS84GEO",
			"resCoordType" : "EPSG3857",
			"startName" : "출발지",
			"endName" : "도착지"
		},
		success : function(response) {
			var resultData = response.features;

			//결과 출력
			var tDistance = "총 거리 : "
					+ ((resultData[0].properties.totalDistance) / 1000)
							.toFixed(1) + "km,";
			var tTime = " 총 시간 : "
					+ ((resultData[0].properties.totalTime) / 60)
							.toFixed(0) + "분";

			$("#result").text(tDistance + tTime);
			
			//기존 그려진 라인 & 마커가 있다면 초기화
			if (resultdrawArr.length > 0) {
				for ( var i in resultdrawArr) {
					resultdrawArr[i]
							.setMap(null);
				}
				resultdrawArr = [];
			}
		
			for ( var i in resultData) { //for문 [S]
				var geometry = resultData[i].geometry;
				var properties = resultData[i].properties;
				var polyline_;


				if (geometry.type == "LineString") {
					for ( var j in geometry.coordinates) {
						// 경로들의 결과값(구간)들을 포인트 객체로 변환 
						var latlng = new Tmapv2.Point(
								geometry.coordinates[j][0],
								geometry.coordinates[j][1]);
						// 포인트 객체를 받아 좌표값으로 변환
						var convertPoint = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(
								latlng);
						// 포인트객체의 정보로 좌표값 변환 객체로 저장
						var convertChange = new Tmapv2.LatLng(
								convertPoint._lat,
								convertPoint._lng);
						// 배열에 담기
						drawInfoArr.push(convertChange);
					}
				} else {
					var markerImg = "";
					var pType = "";
					var size;

					if (properties.pointType == "S") { //출발지 마커
						markerImg = "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png";
						pType = "S";
						size = new Tmapv2.Size(24, 38);
					} else if (properties.pointType == "E") { //도착지 마커
						markerImg = "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_e.png";
						pType = "E";
						size = new Tmapv2.Size(24, 38);
					} else { //각 포인트 마커
						markerImg = "http://topopen.tmap.co.kr/imgs/point.png";
						pType = "P";
						size = new Tmapv2.Size(8, 8);
					}

					// 경로들의 결과값들을 포인트 객체로 변환 
					var latlon = new Tmapv2.Point(
							geometry.coordinates[0],
							geometry.coordinates[1]);

					// 포인트 객체를 받아 좌표값으로 다시 변환
					var convertPoint = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(
							latlon);

					var routeInfoObj = {
						markerImage : markerImg,
						lng : convertPoint._lng,
						lat : convertPoint._lat,
						pointType : pType
					};

					// Marker 추가
					marker_p = new Tmapv2.Marker(
							{
								position : new Tmapv2.LatLng(
										routeInfoObj.lat,
										routeInfoObj.lng),
								icon : routeInfoObj.markerImage,
								iconSize : size,
								map : map
							});
				}
			}//for문 [E]
		},
		error : function(request, status, error) {
			console.log("code:" + request.status + "\n"
					+ "message:" + request.responseText + "\n"
					+ "error:" + error);
		}
	});
	sleep(500);
}

function drawLine(arrPoint) {
	var polyline_;

	polyline_ = new Tmapv2.Polyline({
		path : arrPoint,
		strokeColor : "#DD0000",
		strokeWeight : 6,
		map : map
	});
	resultdrawArr.push(polyline_);
}


function load(stX, stY, enX, enY){
    var xhr = new XMLHttpRequest();
    var url = `http://openapi.seoul.go.kr:8088/4d74574c717a696138385a74757765/xml/safeOpenCCTV_sm/1/1000/`; /* URL */
    xhr.open('GET', url);
    xhr.onreadystatechange = function () {
    if (this.readyState == xhr.DONE) {  // <== 정상적으로 준비되었을때
        if(xhr.status == 200||xhr.status == 201){ // <== 호출 상태가 정상적일때
            var latlng = getData(xhr);
            //marker 좌표 불러오기
            removeMarkers();
            for (var i = 0; i < 1000; i++) {
                var lat = latlng[i][0];
                var lng = latlng[i][1];
                }
                
            var start = [stX, stY];
            var end = [enX, enY];
            var incircle = getCctvInCircle(start, end, latlng);
            console.log(incircle);
			markersPosition = replexArr(incircle);
            for(var k = 0; k<incircle.length;k++){
            var marker = new Tmapv2.Marker({
                position: new Tmapv2.LatLng(incircle[k][0], incircle[k][1]), //Marker의 중심좌표 설정.
                label: 'test'+k //Marker의 라벨.
            });
            marker.setMap(map); //Marker가 표시될 Map 설정.
            markers.push(marker);
			console.log(markersPosition);
			draw();
        }}}};
xhr.send('');
};

function getData(xhr){
    var xmlDoc = xhr.responseXML;
    var latlng = [];
    for (var i=0; i<1000; i++){
        var lat = xmlDoc.getElementsByTagName('row')[i].getElementsByTagName('WGSXPT')[0].firstChild.data;
        var lng = xmlDoc.getElementsByTagName('row')[i].getElementsByTagName('WGSYPT')[0].firstChild.data;
        latlng.push([lat,lng]);
    }
    return latlng
}
	
// 100개의 마커를 추가하는 함수입니다.
function addMarkersTooMuch() {
    removeMarkers();
    var latlng = load();
    console.log(latlng);
    for (var i = 0; i < 10; i++) {
        var lat = latlng[i][0];
        var lng = latlng[i][1];
        //Marker 객체 생성.
        var marker = new Tmapv2.Marker({
            position: new Tmapv2.LatLng(lat, lng), //Marker의 중심좌표 설정.
            label: 'test' //Marker의 라벨.
        });
        marker.setMap(map); //Marker가 표시될 Map 설정.
        markers.push(marker);
        }
}
    
// 모든 마커를 제거하는 함수입니다.
function removeMarkers() {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(null);
	}
	markers = [];
}
	
function getCctvInCircle(start, end, latlng){
    var incircle = [];
    for(var i = 0; i < latlng.length; i++){
        if(makeCircle(start, end, latlng[i]) == true){
            incircle.push(latlng[i]);
        } ;}
    return incircle;
}

function makeCircle(start, end, cctvlatlng){
    //input start: 출발지의 latlng (array)
    //input end: 도착지의 latlng(array)
    //input cctvlatlng: 비교하기 위한 cctv latlng(array)  
    //출발지 도착지의 원 반경안에 있는 cctv인지 검사하는 함수 
    //원 반경 안에 있는 경우 return true
    var center = [(start[0]+end[0])/2, (start[1]+end[1])/2];
    var dis_x = start[0]-end[0];
    var dis_y = start[1]-end[1];
    var dis_ctocc_x = cctvlatlng[0]-center[0];
    var dis_ctocc_y = cctvlatlng[1]-center[1];
    var radius = Math.sqrt(Math.abs(dis_x*dis_x)+Math.abs(dis_y*dis_y))/2; 
    var distance = Math.sqrt(Math.abs(dis_ctocc_x*dis_ctocc_x)+Math.abs(dis_ctocc_y*dis_ctocc_y));
    
    if(radius>=distance){
        return true;
    }
    else{
        return false;
    }
}
	