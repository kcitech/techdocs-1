function fs(j){
    window.status='';
    var b = document.getElementById(j);
    if(!b || typeof(b)=='undefined') return true;
    var bh = b.href;
    var bi = bh.indexOf("&fk=");
    // alert(bh);
    if(bi<0) {
        b.href += "&fk=1";
        return true;
    }
    var fk='';
    var fkn = 1;
    var bh0 = bh.substring(0,bi+4); 
    var bh1 = bh.substring(bi+4,bh.length);
    var bh1i = bh1.indexOf("&");
    var bh2 = '';
      
    if (bh1i < 0) {
        fk = bh1;
    } else {
        fk = bh1.substring(0, bh1i);
        bh2 = bh1.substring(bh1i, bh1.length); 
    }
    fkn = parseInt(fk,10);  
    if(isNaN(fkn)) fkn=1; 
    fkn++;
    b.href= bh0+(fkn)+bh2;
    return true;
}
function mrk(o, rk){
    if(!o || typeof(o)=='undefined') return;
    var oh = o.href;
    var oi = oh.indexOf("&rk=");
    if(oi>-1) return;
    o.href = o.href + "&rk=" + rk;
    return;
}