function MyLocation(){
    this.longitude =0;  //经度
    this.latitude =0;   //纬度
    this.address ="";
}
/***************地图初始化**************************
 * 该功能块为地图默认功能 
 * map ： 地图对象
 * point: 初始化位置
 * marker: 标记
 ****************************************************/
var loc = new MyLocation();
var map = new BMap.Map("allmap",{enableMapClick:false});    // 创建Map实例
var point = new BMap.Point(116.4035,39.915);                //设置中心点
var marker = new BMap.Marker(point);                        // 创建标注
map.enableScrollWheelZoom(true);                            //允许地图可被鼠标滚轮缩放
map.enableDragging();                                       //允许拖拽	
map.centerAndZoom(point,8);                                 //初始化时，即可设置中心点和地图缩放级别。
map.addOverlay(marker);                                     // 将标注添加到地图中
marker.setAnimation(BMAP_ANIMATION_BOUNCE);                 //跳动的动画
marker.enableDragging();
getAddress(point);
marker.addEventListener("onmouseup",function(e){getAddress(e.point);})//标记被移动事件
setTimeout(() => {
    marker.setAnimation(null);
}, 800);        //移除动画

/***************自定义控件类**************************
 * FindControl : 搜索框类
 * BtnControl  ：按钮类
 ****************************************************/
//定义一个控件类
function FindControl() {
   this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
   this.defaultOffset = new BMap.Size(20, 20)
   this.ac = new BMap.Autocomplete({    //建立一个自动完成的对象
        "input" : "findText",
        "location" : map
    });
}
FindControl.prototype = new BMap.Control();         //通过JavaScript的prototype属性继承于BMap.Control
FindControl.prototype.initialize = function(map) {  //实现initialize方法，并且将控件的DOM元素返回
    var input = document.createElement('input');    //创建一个dom元素
    input.setAttribute("id","findText");
    input.setAttribute("type","text");
    map.getContainer().appendChild(input);          // 添加DOM元素到地图中
    return input;                                   // 将DOM元素返回
}
//创建控件元素
var myfindCtrl = new FindControl();
//地图下拉搜索框功能
myfindCtrl.ac.addEventListener("onhighlight", function(e) {  //鼠标放在下拉列表上的事件
    var str = "";
	var _value = e.fromitem.value;
	var value = "";
	if (e.fromitem.index > -1) {
		value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
	}    
	str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;
	
	value = "";
	if (e.toitem.index > -1) {
		_value = e.toitem.value;
        value = _value.province +  _value.city +  _value.district +
                _value.street +  _value.business;
	}    
	str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
	document.getElementById("searchResultPanel").innerHTML = str;
});

myfindCtrl.ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
    var _value = e.item.value;
    var myValue = _value.province +  _value.city +  _value.district +
              _value.street +  _value.business;
    document.getElementById("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
    function myFun(){
        var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
        getAddress(pp);                                 //获取该位置地址 经纬 街道
	}
	var local = new BMap.LocalSearch(map, { //智能搜索
	  onSearchComplete: myFun
	});
	local.search(myValue);
});


function BtnControl(id,offset,func) {
    this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
    this.defaultOffset = offset;
    this.func=func;
    this.id=id;
}
BtnControl.prototype = new BMap.Control()
BtnControl.prototype.initialize = function(map) {
    var input = document.createElement('input');
    input.setAttribute("id",this.id);
    input.setAttribute("type","button");
    map.getContainer().appendChild(input);
    // 绑定点击事件
    input.onclick = this.func;
    return input;
}

var clearBtn = new BtnControl("clear-button",new BMap.Size(251,20),function(){
    document.getElementById("findText").value="";
});

var findBtn = new BtnControl("find-button",new BMap.Size(290,20),function(){
    var _marker =marker;
    map.clearOverlays();
    marker=_marker;
    map.addOverlay(marker);
	var local = new BMap.LocalSearch(map, {
		renderOptions:{map: map}
	});
	local.search(document.getElementById("findText").value);
});

//添加到地图中
map.addControl(myfindCtrl)
map.addControl(findBtn);
map.addControl(clearBtn);
/***********************************原生控件****************************************/
map.addControl(new BMap.MapTypeControl({            //地图类型 
        mapTypes: [BMAP_NORMAL_MAP,BMAP_HYBRID_MAP],//2D图，混合图
        anchor: BMAP_ANCHOR_TOP_RIGHT               //位置 左上角
    })
);

map.addControl(new BMap.OverviewMapControl({        //缩略地图
        isOpen:true,                                //打开
        anchor: BMAP_ANCHOR_BOTTOM_RIGHT            //右下角位置
    })
);

map.addControl(new BMap.NavigationControl({
    offset: new BMap.Size(10, 80)                   //平移缩放控件  size 控件所在位置
    })                 
);    

map.addControl(new BMap.ScaleControl());           //比例尺   
//map.addControl(new BMap.GeolocationControl());   //定位 目前无效
//map.addControl(new BMap.CopyrightControl());     //版权
map.setCurrentCity("北京"); // 仅当设置城市信息时，MapTypeControl的切换功能才能可用   


/*************************************右键菜单***************************************/
var menu = new BMap.ContextMenu();
menu.addEventListener("open",function(e){
    loc.longitude = e.point.lng;
    loc.latitude = e.point.lat;
})

function setPos() {
    var point = new BMap.Point();
    point.lat = loc.latitude;
    point.lng = loc.longitude;
    getAddress(point);
    setPosition();
}

function zoomIn() {
    map.zoomIn();
}

function zoomOut() {
    map.zoomOut();
}
menu.addItem(new BMap.MenuItem("定位至此",setPos, 100));
menu.addItem(new BMap.MenuItem("放大一级",zoomIn, 100));
menu.addItem(new BMap.MenuItem("缩小一级",zoomOut, 100));
map.addContextMenu(menu);


// 根据传入经纬 获取地址信息，设置地址label
function getAddress(point){
    var gc = new BMap.Geocoder();
    gc.getLocation(point, function(rs){
        var addComp = rs.addressComponents;
        var address =  addComp.province +  addComp.city + addComp.district + addComp.street + addComp.streetNumber;//获取地址
        loc.address=address;
        loc.longitude=point.lng;
        loc.latitude=point.lat;
        marker.setPosition(point);
        map.panTo(point);
    });
}  



// //自定义标注
// var myIcon = new BMap.Icon("/images/2.png", new BMap.Size(40,40));
// var marker2 = new BMap.Marker(point,{icon:myIcon});  // 创建标注
// map.addOverlay(marker2);
// marker2.enableDragging();
// marker2.addEventListener("dragend", function (e) {
//      addPoint(e.point.lng,e.point.lat);

// });


/*********qt通信**** */

var context;

// 初始化 qt通信类
function init(){
    if (typeof qt != 'undefined'){
        new QWebChannel(qt.webChannelTransport, function(channel){
            context = channel.objects.context;
        });
    }else{
        alert("qt对象获取失败！");
    }
}

// 向qt发送消息
function sendMessage(msg){
    if(typeof context == 'undefined'){
        alert("context对象获取失败！");
    }else{
        context.onMsg(msg); //onMsg QT内定义槽函数
    } 
}

// 接收qt发送的消息
function recvMessage(msg){
    if(msg==1){
        map.zoomIn();
    }
    else if(msg==2){
        map.zoomOut();
    }else
        alert(msg);
}

init();

//确认坐标
function setPosition(){
    sendMessage(loc.address+"  经度："+loc.longitude+ " 纬度："+loc.latitude);
}





