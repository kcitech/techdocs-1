/**
	MyWidget Class
*/
var MyWidget = Class.create({

	initialize: function() {

		
		this.daum_id = Config.daumid;
		this.type = Config.init_type;
		this.page_size = Config.page_size;

		this.first = true;	
		this.page = 1;
		this.total_count = 0;		
		this.nickname = '';

		this.url={ 
			list :'/open/my_news.js'
		};

		this.type_name = {
			recommend:'추천글',
			point:'인기글',
			empty:'최신글'
		};

		/*
		//퍼가기
		Event.observe($('alink_copy'),'click', function() {

			UI.setClip(
			"<iframe src='http://api.v.daum.net/iframe/my_widget?skin="+Config.skin+
			"&page_size="+Config.page_size+"&init_type="+this.type+"&is_footer="+Config.is_footer+
			"&daumid="+Config.daumid+"' width='100%' height='"+Config.iframe_height+"' frameborder='0' scrolling='no' allowtransparency='true'></iframe>");


			this.showMessage('소스가 복사되었습니다.<br>ctrl+v로 원하는 곳에 붙이세요');

		}.bind(this)); 
		*/

	},
	
	showMessage : function(msg){
		clearTimeout(this.message_timer);

		$('message').update('<p>'+msg+'</p>');
		$('message').setStyle({opacity:0});
		$('message').removeClassName("none");
		
		var top = (Config.iframe_height/2) - (parseInt($('message').getStyle('height')) / 2);
		$('message').setStyle({top:top+'px'});
		
		new Effect.Opacity('message', { 
			from: 0, to:1,duration:0.5,
			afterFinish:function(){				
				//$('message').addClassName("none");
				this.message_timer = setTimeout("new Effect.Opacity('message', {from: 1, to:0,duration:0.5,afterFinish:function(){$('message').addClassName('none');}})",1000);			
			}.bind(this)			
		}); 
		
	},
	hideMessage : function(){
		
	},
	setType : function (type){
		if(type=="empty") type="";		
		this.type=type;
	},
	getTypeName : function(type){		
		if(!type) type='empty';
		return this.type_name[type];
	},
	setTitle : function(){
		$('title').update(this.nickname+'님 '+this.getTypeName(this.type));
	},
	toggleTitle : function(){
		new Effect.toggle('select_type','blind',{ duration: 0.2 });
		$('title').toggleClassName('on');
	},
	prevList : function() {
		this.list(this.page - 1);
		return false;
	},
	nextList : function() {
		this.list(this.page + 1);
		return false;
	},

	//리스트 가져오기
	list : function(page_no){
		
		if(this.is_listing) return;
		
		$('ullist').addClassName('loading');
		$('ullist').update();
		
		if(!page_no) page_no = this.page;
		else this.page = page_no;

		new Ajax.Request(this.url.list, {
			method: 'get',
			parameters: {
				type : this.type,
				page_size : this.page_size,
				page_no : page_no, //page
				daum_id : this.daum_id
			},
			onSuccess: this.print.bind(this)			
		});

		this.is_listing = true;
	},
	print : function(response){
		var result = response.responseText.evalJSON();
		
		//에러처리
		if(!result.head || result.head.code != "200" ) 
		{	
			$('ullist').removeClassName('loading');
			$('title').removeClassName('hidden');
			$('title').addClassName('err');

			$('ullist').update('<p><span>'+result.head.message+'</span></p>');			
			return;
		}
				
		//전체갯수
		this.total_count= result.body.page.total;

		if(this.total_count==0)
		{
			$('ullist').removeClassName('loading');
			$('ullist').update('<p>해당 글이 없습니다.</p>');
			
		}

		//이전다음버튼설정
		$('page_btn_prev').onclick = this.prevList.bind(this);
		$('page_btn_next').onclick = this.nextList.bind(this);

		if(this.page==1) $('page_btn_prev').addClassName('hidden');
		else $('page_btn_prev').removeClassName('hidden');
		
		if(Math.ceil(this.total_count/this.page_size) <= this.page ) $('page_btn_next').addClassName('hidden');
		else $('page_btn_next').removeClassName('hidden');


		//맨처음만
		if(this.first)
		{
			this.nickname = result.body.reporter.nickname;

			$('page_btn').removeClassName('hidden');
			$('title').removeClassName('hidden');

			//type변경관련
			Event.observe($('title'), 'click', this.toggleTitle);
			
			this.setTitle();

			//서브레이어설정
			$$('#select_type li').each(function(el,i){
				Event.observe( el, 'mouseover', function() { el.toggleClassName('on')   }); 
				Event.observe( el, 'mouseout', function() { el.toggleClassName('on')   }); 
				
				el.update(this.getTypeName(el.className));

				//다른type선택
				Event.observe( el, 'click', function() {
					this.setType(el.className.replace(' on',''));
					this.setTitle();
					this.toggleTitle();

					this.list(1);
					try{xy.call(el)}catch(e){}
				}.bind(this)); 				

			}.bind(this));

			
		}
		
		//JSON 처리
		var a=[];
		var This=this;
		var link = '';
		result.body.news.each(function(list){
			if(This.type=="recommend") link = '<a href="'+list.link+'" target="_blank">';
			else link = '<a href="'+list.link.replace('view','news')+'" target="_top">';

			a.push('<li><div class="tit">'+link + list.title+'</a></div>'+
			'<div class="btn_recom"><a href="#" id="btn_recom_'+list.id+'" onclick="Recommend.call(this);return false;">'+list.recommend_count+'</a></div></li>');
		});
		
		$('ullist').removeClassName('loading');
		//var ul_page = new Element('ul', {id: 'ulpage_'+this.page }).update(a.join(''));
		var ul_page = new Element('ul').update(a.join(''));
		if(!this.first) ul_page.setStyle({position:'relative',display:'none'});

		$('ullist').appendChild(ul_page);
		
		if(!this.first)
		{
			new Effect.BlindDown(ul_page,{ duration: 0.5 ,
				afterFinish :function(){
					ul_page.style.position='static';				
				}
			});
		}

		this.is_listing = false;
		this.first=false;
	}
});
//1page 불러오기
var myWidget = new MyWidget();
myWidget.list();

/**
	추천하기
*/
var Recommend={
	call : function(el){
		
		var id=el.id.replace('btn_recom_','');
		
		//if(el.rec) return;
		//el.rec=true;

		$('ullist').addClassName('loading');

			new Ajax.Request('/open/recommend.xml', {
			method: 'post',
			parameters: {
				nid : id
			},
			onSuccess: Recommend.callBack
		});
		try{xy.call(el)}catch(e){}

	},	
	getNodeValue : function(xml,elName) {
		return xml.getElementsByTagName(elName)[0].firstChild.nodeValue;
	},

	callBack : function(res){
		var result = res.responseXML;
		
		$('ullist').removeClassName('loading');

		var code = Recommend.getNodeValue(result,'code');
		var message = Recommend.getNodeValue(result,'message');
		var id = result.getElementsByTagName('news')[0].getAttribute('id');

		if(code != "200") 
		{
			//alert(message.replace('<br>','\n'));
			myWidget.showMessage(message);
			return;
		}
				
		$("btn_recom_"+id).innerHTML=Recommend.getNodeValue(result,'recommend_count');
		
	}
};



/**
	추천왕표시 Class
*/
var RecommendRolling= Class.create({

	initialize: function() {
		this.n=0;
		this.data = openeditor_list.list;
		this.max = this.data.length;
		this.timer = 0;

		if(this.data.length==0)
		{
			$('recommend_nick').update('');
			return;
		}
		this.setNick();
		this.setTimer();
		$('recommend_nick_link').onclick = this.next.bind(this);
	},
	setTimer : function(){
		clearInterval(this.timer);
		this.timer = setInterval(this.setNick.bind(this),3000);

	},
	setNick : function(){

		var permlink = this.data[this.n].recommender.permlink;
		var nick = this.data[this.n].recommender.nickname;		
		var daumid = permlink.substring(permlink.lastIndexOf("/")+1 , permlink.length);

		var url = '/iframe/my_widget'+
		'?skin='+Config.skin+'&page_size='+Config.page_size+'&daumid='+daumid+'&is_footer='+Config.is_footer+'&init_type='+myWidget.type;

		$('recommend_nick').update('<a href="'+url+'">'+nick+'</a>');
		this.n++;
		if(this.n==this.max) this.n=0;
	},
	next : function(){
		this.setNick();
		this.setTimer();
		return false;
	}

});

if(Config.is_footer=="1") new RecommendRolling();


/**
	jes
UI={};
UI.setClip=function(s,m){
	try{
		var swf=(navigator.appName.indexOf("Microsoft")!=-1)?window['UIclipSwf']:document['UIclipSwf'];
		swf.setClip(s);		
	}catch(e){
		alert("해당 브라우저에서는 지원하지 않습니다.");
	}
}
UI.setClip.url='/static/clip.swf';
UI.setClip.print=function()
{
	document.write('<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="1" height="1" id="UIclipSwf"><param name="allowScriptAccess" value="always" /><param name="movie" value="'+UI.setClip.url+'" /><embed src="'+UI.setClip.url+'" width="1" height="1" name="UIclipSwf" allowScriptAccess="always" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" /></object>');
}
UI.setClip.print();
*/