
function escapeURL(url){
    if(encodeURIComponent)
        return encodeURIComponent(url);
    else
        return escape(url);
}
(function(){
    var rf = escapeURL('http://ioriy2k.pe.kr/archives/24');
    var url="<";
    url+="iframe src='http://ttb2.aladin.co.kr/ad.aspx?&ttbkey=";
    url+=aladdin_ttb_key;
    url+="&channel=";
    url+=aladdin_ttb_channel;
    url+="&ts=";
    url+=new Date().getTime();
    url+="&gw=";
    url+=1788823130804
    url+="&rf="
    url+=rf
    url+="' frameborder='0' scrolling='no' allowtransparency='true' width='";
    url+=aladdin_ttb_width;
    url+="' height='";
    url+=aladdin_ttb_height;
    url+="'";
    url+="><";
    url+="\/iframe>";
    document.write(url);
})();