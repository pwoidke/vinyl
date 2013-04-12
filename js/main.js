/* TinySort 1.5.3
 * Copyright (c) 2008-2013 Ron Valstar http://tinysort.sjeiti.com/
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
(function(e,c){var h=!1,k=null,o=parseFloat,l=Math.min,m=/(-?\d+\.?\d*)$/g,g=/(\d+\.?\d*)$/g,i=[],f=[],b=function(p){return typeof p=="string"},n=Array.prototype.indexOf||function(r){var p=this.length,q=Number(arguments[1])||0;q=q<0?Math.ceil(q):Math.floor(q);if(q<0){q+=p}for(;q<p;q++){if(q in this&&this[q]===r){return q}}return -1};e.tinysort={id:"TinySort",version:"1.5.2",copyright:"Copyright (c) 2008-2013 Ron Valstar",uri:"http://tinysort.sjeiti.com/",licensed:{MIT:"http://www.opensource.org/licenses/mit-license.php",GPL:"http://www.gnu.org/licenses/gpl.html"},plugin:(function(){var p=function(q,r){i.push(q);f.push(r)};p.indexOf=n;return p})(),defaults:{order:"asc",attr:k,data:k,useVal:h,place:"start",returns:h,cases:h,forceStrings:h,ignoreDashes:h,sortFunction:k}};e.fn.extend({tinysort:function(){var C,B,E=this,s=[],r=[],F=[],G=[],v=0,q,A=[],x=[],y=function(H){e.each(i,function(I,J){J.call(J,H)})},w=function(S,Q){var H=0;if(v!==0){v=0}while(H===0&&v<q){var O=G[v],L=O.oSettings,P=L.ignoreDashes?g:m;y(L);if(L.sortFunction){H=L.sortFunction(S,Q)}else{if(L.order=="rand"){H=Math.random()<0.5?1:-1}else{var R=h,K=!L.cases?a(S.s[v]):S.s[v],J=!L.cases?a(Q.s[v]):Q.s[v];if(!t.forceStrings){var I=b(K)?K&&K.match(P):h,T=b(J)?J&&J.match(P):h;if(I&&T){var N=K.substr(0,K.length-I[0].length),M=J.substr(0,J.length-T[0].length);if(N==M){R=!h;K=o(I[0]);J=o(T[0])}}}H=O.iAsc*(K<J?-1:(K>J?1:0))}}e.each(f,function(U,V){H=V.call(V,R,K,J,H)});if(H===0){v++}}return H};for(C=0,B=arguments.length;C<B;C++){var z=arguments[C];if(b(z)){if(A.push(z)-1>x.length){x.length=A.length-1}}else{if(x.push(z)>A.length){A.length=x.length}}}if(A.length>x.length){x.length=A.length}q=A.length;if(q===0){q=A.length=1;x.push({})}for(C=0,B=q;C<B;C++){var D=A[C],t=e.extend({},e.tinysort.defaults,x[C]),u=!(!D||D==""),p=u&&D[0]==":";G.push({sFind:D,oSettings:t,bFind:u,bAttr:!(t.attr===k||t.attr==""),bData:t.data!==k,bFilter:p,$Filter:p?E.filter(D):E,fnSort:t.sortFunction,iAsc:t.order=="asc"?1:-1})}E.each(function(O,H){var K=e(H),I=K.parent().get(0),J,N=[];for(j=0;j<q;j++){var P=G[j],L=P.bFind?(P.bFilter?P.$Filter.filter(H):K.find(P.sFind)):K;N.push(P.bData?L.data(P.oSettings.data):(P.bAttr?L.attr(P.oSettings.attr):(P.oSettings.useVal?L.val():L.text())));if(J===c){J=L}}var M=n.call(F,I);if(M<0){M=F.push(I)-1;r[M]={s:[],n:[]}}if(J.length>0){r[M].s.push({s:N,e:K,n:O})}else{r[M].n.push({e:K,n:O})}});e.each(r,function(H,I){I.s.sort(w)});e.each(r,function(K,N){var M=N.s.length,J=[],I=M,L=[0,0];switch(t.place){case"first":e.each(N.s,function(P,Q){I=l(I,Q.n)});break;case"org":e.each(N.s,function(P,Q){J.push(Q.n)});break;case"end":I=N.n.length;break;default:I=0}for(C=0;C<M;C++){var O=d(J,C)?!h:C>=I&&C<I+N.s.length,H=(O?N.s:N.n)[L[O?0:1]].e;H.parent().append(H);if(O||!t.returns){s.push(H.get(0))}L[O?0:1]++}});E.length=0;Array.prototype.push.apply(E,s);return E}});function a(p){return p&&p.toLowerCase?p.toLowerCase():p}function d(q,s){for(var r=0,p=q.length;r<p;r++){if(q[r]==s){return !h}}return h}e.fn.TinySort=e.fn.Tinysort=e.fn.tsort=e.fn.tinysort})(jQuery);


/*$(".titleBar").click(function() {
    $('.loading').fadeIn('fast');
    var url = 'index_backend.php';
    var data = 'type=scores';
    $('.titleBar').load(url, data, function() {
        $('.loading').fadeOut('slow');
    });
});*/


var records;

console.log("Getting data...");
getData();
console.log("Building records...");
buildRecords(records.releases.release.length);



/* DATA CONNECTION */

function getData()
{
    var xmlhttp, xmlDoc;
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.open("GET","data/vinyl.xml",false);
    xmlhttp.send();
    xmlDoc=xmlhttp.responseText;
    records = x2js.xml_str2json( xmlDoc );
    console.log("Done.");
}


/* INTERFACE */

$('.records').accordion({
    header: "h3",
    collapsible: true,
    heightStyle: "content",
    active: false
});

function buildRecords(length)
{
    var i, j;

    /* Add artist/title to spines */
    for(i=0;i<length;i++)
    {
        try
        {
            //Add artist/title to spine
            if(typeof records.releases.release[i].artists.artist[0] === 'undefined')
            {
                $('.records').append('<li class="spine" id="' + i + '" style="background-color: ' + getRandomColor() + '"><h3 class="artist-title">' + records.releases.release[i].artists.artist.name + ' - ' + records.releases.release[i].title + '</h3><div class="info"><div class="cover"></div><div class="artist"></div><div class="title"></div><div class="label"></div><div class="format"></div><div class="details"></div><div class="notes"></div><div class="tracks"><ul class="trackList"></ul></div><div class="videos"><ul class="videoList"></ul></div></div></li>');
            }
            else
            {
                $('.records').append('<li class="spine" id="' + i + '" style="background-color: ' + getRandomColor() + '"><h3 class="artist-title">' + records.releases.release[i].artists.artist[0].name + ' - ' + records.releases.release[i].title + '</h3><div class="info"><div class="cover"></div><div class="artist"></div><div class="title"></div><div class="label"></div><div class="format"></div><div class="details"></div><div class="notes"></div></div></li>');
            }

            var item, notes, details, trackPosition, trackTitle, trackDuration, videoSrc, videoTitle;
            item = document.getElementById(i.toString());

            //Default cover image
            $(item).find('.cover').html('<img src="img/noimg150.png" height="150" width="150" />');
            //Artist
            if(typeof records.releases.release[i].artists.artist[0] === 'undefined')
            {
                $(item).find('.artist').text('Artist: ' + records.releases.release[i].artists.artist.name);
            }
            else
            {
                $(item).find('.artist').text('Artist: ' + records.releases.release[i].artists.artist[0].name);
            }
            //Title
            $(item).find('.title').text('Title: ' + records.releases.release[i].title);
            //Label
            if(typeof records.releases.release[i].labels.label[0] === 'undefined')
            {
                $(item).find('.label').text('Label: ' + records.releases.release[i].labels.label._name);
            }
            else
            {
                $(item).find('.label').text('Label: ' + records.releases.release[i].labels.label[0]._name);
            }
            //Format
            if(typeof records.releases.release[i].formats.format[0] === 'undefined')
            {
                if(typeof records.releases.release[i].formats.format._text === 'undefined')
                {
                    $(item).find('.format').text('Format: ' + records.releases.release[i].formats.format._name);
                }
                else
                {
                    $(item).find('.format').text('Format: ' + records.releases.release[i].formats.format._name + ' (' + records.releases.release[i].formats.format._text + ')');
                }
            }
            else
            {
                if(typeof records.releases.release[i].formats.format[0]._text === 'undefined')
                {
                    $(item).find('.format').text('Format: ' + records.releases.release[i].formats.format[0]._name);
                }
                else
                {
                    $(item).find('.format').text('Format: ' + records.releases.release[i].formats.format[0]._name + ' (' + records.releases.release[i].formats.format[0]._text + ')');
                }
            }
            //Details
            if(!(typeof records.releases.release[i].notes === 'undefined'))
            {
                details = htmlDecode(records.releases.release[i].notes);
                $(item).find('.details').text('Details: ' + details);
            }
            else
            {
                $(item).find('.details').text('');
            }
            //Notes
            if(!(typeof records.releases.release[i].Collection_Notes[0] === 'undefined'))
            {
                notes = htmlEncode(records.releases.release[i].Collection_Notes);
                $(item).find('.notes').css({display:"block"}).text('Notes: ' + notes);
            }
            else
            {
                $(item).find('.notes').css({display:"none"}).text('');
            }
            //Tracks
            var useArr = false;
            for(j=0;j<records.releases.release[i].tracklist.__cnt;j++)
            {
                if(!(typeof records.releases.release[i].tracklist.track.position === 'undefined'))
                {
                    trackPosition = htmlEncode(records.releases.release[i].tracklist.track.position);
                }
                else
                {
                    trackPosition = htmlEncode(records.releases.release[i].tracklist.track[j].position);
                }
                if(!(typeof records.releases.release[i].tracklist.track.title === 'undefined'))
                {
                    trackTitle = htmlEncode(records.releases.release[i].tracklist.track.title);
                }
                else
                {
                    trackTitle = htmlEncode(records.releases.release[i].tracklist.track[j].title);
                    useArr = true;
                }
                if(!((typeof trackTitle === '[object Object]')||(typeof trackTitle === 'undefined')))
                {
                    $(item).find('ul.trackList').append("<li>");
                    if(!(typeof trackPosition === '[object Object]'))
                    {
                        $(item).find('ul.trackList').append(trackPosition + ": ");
                    }
                    $(item).find('ul.trackList').append(trackTitle);
                    if(useArr)
                    {
                        if(!(typeof records.releases.release[i].tracklist.track[j].duration[0] === 'undefined'))
                        {
                            trackDuration = htmlEncode(records.releases.release[i].tracklist.track[j].duration);
                            $(item).find('ul.trackList').append(" (" + trackDuration + ")");
                        }
                    }
                    else
                    {
                        if(!(typeof records.releases.release[i].tracklist.track.duration[0] === 'undefined'))
                        {
                            trackDuration = htmlEncode(records.releases.release[i].tracklist.track.duration);
                            $(item).find('ul.trackList').append(" (" + trackDuration + ")");
                        }
                    }
                    $(item).find('ul.trackList').append("</li>");
                }
            }
            //Videos
            $(item).find('ul.videoList').text('');
            if(!(typeof records.releases.release[i].videos === 'undefined'))
            {
                for(j=0;j<records.releases.release[i].videos.__cnt;j++)
                {
                    if(!(typeof records.releases.release[i].videos.video._src === 'undefined'))
                    {
                        videoSrc = records.releases.release[i].videos.video._src;
                    }
                    else
                    {
                        videoSrc = records.releases.release[i].videos.video[j]._src;
                    }

                    if(!(typeof records.releases.release[i].videos.video.title === 'undefined'))
                    {
                        videoTitle = htmlEncode(records.releases.release[i].videos.video.title);
                    }
                    else
                    {
                        videoTitle = htmlEncode(records.releases.release[i].videos.video[j].title);
                    }

                    $(item).find('ul.videoList').append('<li><a href="' + videoSrc + '" rel="prettyPhoto[' + records.releases.release[i].title + ' Videos]" title="' + videoTitle + '">' + videoTitle + '</a></li>');
                }
            }
            else
            {
                $(item).find('ul.videoList').html('<li>No videos :(</li>');
            }
        }
        catch(err)
        {
            console.log(err.message);
        }
    }

    console.log("Done.");
}

/* Function to load cover, tracks, and videos */
function loadCover(item)
{
    //Cover
    var id, i;
    id = item.id;

    if(!(typeof records.releases.release[id].images === 'undefined'))
    {
        if(!(typeof records.releases.release[id].images.image[0] === 'undefined'))
        {
            $(item).find('.cover').html('<a href="' + records.releases.release[id].images.image[0]._uri + '" rel="prettyPhoto[' + records.releases.release[id].title + ']" ><img src="' + records.releases.release[id].images.image[0]._uri + '" height="150" width="150" /></a>');
            if(records.releases.release[id].images.__cnt > 1)
            {
                for(i=1;i<records.releases.release[id].images.__cnt;i++)
                {
                    $(item).find('.cover').append('<a href="' + records.releases.release[id].images.image[i]._uri + '" rel="prettyPhoto[' + records.releases.release[id].title + ']" ></a>');
                }
            }
        }
        else if(!(typeof records.releases.release[id].images.image === 'undefined'))
        {
            $(item).find('.cover').html('<a href="' + records.releases.release[id].images.image._uri + '" rel="prettyPhoto[' + records.releases.release[id].title + ']" ><img src="' + records.releases.release[id].images.image._uri + '" height="150" width="150" /></a>');
        }
    }

    makePretty();
}


/* EVENTS */

$('.spine').click(function(){
    loadCover(this);
});

$('.sortID, .sortArtist, .sortTitle').click(function(){
    if(this.className.contains("ID"))
    {
        console.log("Sorting by ID");
        $('ol.records>li.spine').tsort('h3',{attr:'id',order:'desc'});
    }
    else if(this.className.contains("Artist"))
    {
        console.log("Sorting by Artist");
        $('ol.records>li.spine').tsort('.artist');
    }
    else if(this.className.contains("Title"))
    {
        console.log("Sorting by Title");
        $('ol.records>li.spine').tsort('.title');
    }
});


/* UTILITY FUNCTIONS */

function getRandomColor()
{
    return 'rgb(' + (Math.floor((200)*Math.random())) + ',' + (Math.floor((200)*Math.random())) + ',' + (Math.floor((200)*Math.random())) + ')';
}

function htmlEncode(value)
{
    return $('<div/>').text(value).html();
}

function htmlDecode(value)
{
    return $('<div/>').html(value).text();
}

function makePretty()
{
    $("a[rel^='prettyPhoto']").prettyPhoto({
        animation_speed: 'normal', /* fast/slow/normal */
        opacity: 0.80,
        show_title: true,
        allow_resize: true,
        theme: 'pp_default', /* light_rounded / dark_rounded / light_square / dark_square / facebook */
        deeplinking: false,
        social_tools: false
    });
}
