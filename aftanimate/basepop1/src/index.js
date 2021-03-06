import AeJson from './data.js';
function init(){
  window.WindVane.call('WVPopLayer', 'display', {});
  setTimeout(function(){document.querySelector('#canvas').classList.add('show')},500)

  let ua = window.navigator.userAgent;
  let isIos = /iPhone|iPad/.test(ua);

  let iosToPlay = popData.ioslink;
  let adToPlay = popData.adrlink;
  let webLink = popData.weblink;
  let closeTime = popData.closetime;
  let glodkey = popData.dtgoldlog;
  let timer = null;

  const sendlog = function (src, errorcallback) {
    let id = "youku-uniplayer-stat";
    if(src.indexOf("http:") < 0 && src.indexOf("https:") < 0){
       src = "https:" + src;
    }
    let fr = document.createElement('img');
    if (errorcallback) {
      fr.addEventListener('error', errorcallback, false);
    }
    fr.src = src + '&r_=' + Math.floor(Math.random() * 10000);
    fr.id = id;
  }
  /**
   * 黄金令箭埋点统计方法
   * @param  {[type]} code     所在位置标识码
   * @param  {[type]} action   具体操作 CLK EXP SLD OTHER
   * @return {[type]}          [description]
   */
  function sendgoldlog (code,action,param) {
    let _str = "pageCode=homepop&actCode=card&posCode="+code;
    if(param){
      for(let key in param){
        _str += ("&"+key+"="+param[key]);
      }
    }
    if(!action){
      action = 'CLK';
    }
      
    try{
      goldlog.record('/yt/jslmhd.jslm.jslm',action,_str,'H1476877877');
    }catch(e){
      let _logUrl = '//gm.mmstat.com/yt/jslmhd.jslm.jslm?'+_str;
      sendlog(_logUrl);
    }
  }

  //安卓开启硬件加速
  if(!isIos){
    window.WindVane.call('WVPopLayer', 'setHardwareAccelerationEnable', {"enable":true},function(s){}, function(e) {});//开启硬件加速
  }

  //强制设置点透
  function dianTou(n){
    console.log(n)
    window.WindVane.call('WVPopLayer', 'setModalThreshold', {
        modalThreshold: n, // 点透率0-1，越大越难点透
    }, function (s) {
        //成功设置点透率
        log.debug('点透率设置为1');
    }, function (e) {
        //error
    });
  }
  dianTou(1)

  let anim = aftui.playAnim({
    wrapper: document.querySelector('#canvas'),
    loop: false,
    path: AeJson
  });

  window.anim = anim;
  let isBind = false;
  anim.onEnterFrame = function() {
    //document.querySelector('.image_7') 按钮
    let skipTo = document.querySelector('#canvas');
    if (!isBind) {
      isBind = true;

      //黄金令件
      skipTo.addEventListener('click', function(){
        sendgoldlog("dllk","CLK");
        anim.destroy();
      })

      setTimeout(function(){
         openToUrl(skipTo)
      },100)
    }
  }

  function openToUrl(skip){
    if(popData.skiptoplay){
        //跳转到任意播放页
        skip.addEventListener('click',function(){
            if(isIos){
                window.WindVane.call('DYKBaseJSBridge', 'nativeOpen', {
                    'url': iosToPlay
                }, function (s) {
                    //跳转成功
                }, function (e) {
                    
                });
            } else {
                window.WindVane.call('WVPopLayer', 'navToUrl', { 'url':adToPlay}, function(s){
                   // do something when success;
                }, function(e) {
                 // do something when failed;
                });
            }
        })
    } else {
        //跳出poplayer到webview
        skip.addEventListener('click',function(){
          if(isIos){
              window.WindVane.call('DYKBaseJSBridge', 'nativeOpen', {
                  'url': 'youku://openWVH5?isWindVane=1&url='+webLink
              }, function (s) {
                  //跳转成功
              }, function (e) {
                var url = encodeURIComponent(webLink);
                location.href="youku://jsbjump?weburl="+url;
              });
          }else{
              window.WindVane.call('WVPopLayer', 'navToUrl', {
                  'url': webLink
              }, function (s) {
                  //跳转成功
              }, function (e) {
              });
          }
        })
    }
  }

  function closeTo(){
    setTimeout(function(){
      sendgoldlog("atclose","CLK");
      location.href="https://hudong.vip.youku.com/act/actEntrance.html?isNuShow=1"
    }, 100)
  }

  //动画结束之后操作
  anim.onComplete = function() {
    anim.playSegments([70,160], true);
    if(!timer){
      timer=setTimeout(function(){
        closeTo()
        anim.destroy();
        document.querySelector('#canvas').classList.remove('show')
        dianTou(0.8)
      }, closeTime)
    }
    window.WindVane.call('WVPopLayer', 'setHardwareAccelerationEnable', {"enable":false},function(s){}, function(e) {});
  }
}
window.onload = init()