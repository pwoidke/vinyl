/*$(".titleBar").click(function() {
    $('.loading').fadeIn('fast');
    var url = 'index_backend.php';
    var data = 'type=scores';
    $('.titleBar').load(url, data, function() {
        $('.loading').fadeOut('slow');
    });
});*/


var spineWidth = 600;
var spineHeight = 20;


var records, infoShown;

infoShown = false;
getData();


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

    buildRecords(records.releases.release.length);
}


/* INTERFACE */

function buildRecords(length)
{
    var i;

    /* Add artist/title to spines */
    for(i=0;i<length;i++)
    {
        try
        {
            if(typeof records.releases.release[i].artists.artist[0] === 'undefined')
            {
                $('.records').append('<li class="spine" id="' + i + '"><div class="artist-title">' + records.releases.release[i].artists.artist.name + ' - ' + records.releases.release[i].title + '</div></li>');
            }
            else
            {
                $('.records').append('<li class="spine" id="' + i + '"><div class="artist-title">' + records.releases.release[i].artists.artist[0].name + ' - ' + records.releases.release[i].title + '</div></li>');
            }
        }
        catch(err)
        {
            alert(err.message);
        }
    }
}

$('.spine').click(function(){
    loadInfo(this.id);
    if(!infoShown)
    {
        $('.info').show();
        infoShown = true;
    }
});

$('.info').click(function(){
    if(infoShown)
    {
        $('.info').hide();
        infoShown = false;
    }
});

function loadInfo(id)
{
    var notes, details, trackPosition, trackTitle, trackDuration, videoSrc, videoTitle;

    if(!(typeof records.releases.release[id].images === 'undefined'))
    {
        if(!(typeof records.releases.release[id].images.image[0] === 'undefined'))
        {
            $('.cover').html('<a href="' + records.releases.release[id].images.image[0]._uri + '" rel="prettyPhoto[' + records.releases.release[id].title + ']" ><img src="' + records.releases.release[id].images.image[0]._uri + '" height="150" width="150" /></a>');
            if(records.releases.release[id].images.__cnt > 1)
            {
                for(i=1;i<records.releases.release[id].images.__cnt;i++)
                {
                    $('.cover').append('<a href="' + records.releases.release[id].images.image[i]._uri + '" rel="prettyPhoto[' + records.releases.release[id].title + ']" ></a>');
                }
            }
        }
        else if(!(typeof records.releases.release[id].images.image === 'undefined'))
        {
            $('.cover').html('<a href="' + records.releases.release[id].images.image._uri + '" rel="prettyPhoto[' + records.releases.release[id].title + ']" ><img src="' + records.releases.release[id].images.image._uri + '" height="150" width="150" /></a>');
        }
        else
        {
            $('.cover').html('<img src="img/noimg150.png" height="150" width="150" />');
        }
    }
    else
    {
        $('.cover').html('<img src="img/noimg150.png" height="150" width="150" />');
    }
    if(typeof records.releases.release[id].artists.artist[0] === 'undefined')
    {
        $('.artist').text('Artist: ' + records.releases.release[id].artists.artist.name);
    }
    else
    {
        $('.artist').text('Artist: ' + records.releases.release[id].artists.artist[0].name);
    }
    $('.title').text('Title: ' + records.releases.release[id].title);
    if(typeof records.releases.release[id].labels.label[0] === 'undefined')
    {
        $('.label').text('Label: ' + records.releases.release[id].labels.label._name);
    }
    else
    {
        $('.label').text('Label: ' + records.releases.release[id].labels.label[0]._name);
    }
    if(typeof records.releases.release[id].formats.format[0] === 'undefined')
    {
        if(typeof records.releases.release[id].formats.format._text === 'undefined')
        {
            $('.format').text('Format: ' + records.releases.release[id].formats.format._name);
        }
        else
        {
            $('.format').text('Format: ' + records.releases.release[id].formats.format._name + ' (' + records.releases.release[id].formats.format._text + ')');
        }
    }
    else
    {
        if(typeof records.releases.release[id].formats.format[0]._text === 'undefined')
        {
            $('.format').text('Format: ' + records.releases.release[id].formats.format[0]._name);
        }
        else
        {
            $('.format').text('Format: ' + records.releases.release[id].formats.format[0]._name + ' (' + records.releases.release[id].formats.format[0]._text + ')');
        }
    }
    if(!(typeof records.releases.release[id].notes === 'undefined'))
    {
        details = htmlDecode(records.releases.release[id].notes);
        $('.details').text('Details: ' + details);
    }
    else
    {
        $('.details').text('');
    }
    if(!(typeof records.releases.release[id].Collection_Notes[0] === 'undefined'))
    {
        notes = htmlEncode(records.releases.release[id].Collection_Notes);
        $('.notes').css({display:"block"});
        $('.notes').text('Notes: ' + notes);
    }
    else
    {
        $('.notes').css({display:"none"});
        $('.notes').text('');
    }
    $('ul.tracksUL').text('');
    for(i=0;i<records.releases.release[id].tracklist.__cnt;i++)
    {
        if(!(typeof records.releases.release[id].tracklist.track.position === 'undefined'))
        {
            trackPosition = htmlEncode(records.releases.release[id].tracklist.track.position);
        }
        else
        {
            trackPosition = htmlEncode(records.releases.release[id].tracklist.track[i].position);
        }
        if(!(typeof records.releases.release[id].tracklist.track.title === 'undefined'))
        {
            trackTitle = htmlEncode(records.releases.release[id].tracklist.track.title);
        }
        else
        {
            trackTitle = htmlEncode(records.releases.release[id].tracklist.track[i].title);
        }
        if((trackTitle != "[object Object]")&&(trackTitle != "undefined"))
        {
            $('ul.tracksUL').append("<li>");
            if(trackPosition != "[object Object]")
            {
                $('ul.tracksUL').append(trackPosition + ": ");
            }
            $('ul.tracksUL').append(trackTitle);
            if(!(typeof records.releases.release[id].tracklist.track[i].duration[0] === 'undefined'))
            {
                trackDuration = htmlEncode(records.releases.release[id].tracklist.track[i].duration);
                $('ul.tracksUL').append(" (" + trackDuration + ")");
            }
            $('ul.tracksUL').append("</li>");
       }
    }
    $('ul.videosUL').text('');
    if(!(typeof records.releases.release[id].videos === 'undefined'))
    {
        for(i=0;i<records.releases.release[id].videos.__cnt;i++)
        {
            if(!(typeof records.releases.release[id].videos.video._src === 'undefined'))
            {
                videoSrc = records.releases.release[id].videos.video._src;
            }
            else
            {
                videoSrc = records.releases.release[id].videos.video[i]._src;
            }

            if(!(typeof records.releases.release[id].videos.video.title === 'undefined'))
            {
                videoTitle = htmlEncode(records.releases.release[id].videos.video.title);
            }
            else
           {
                videoTitle = htmlEncode(records.releases.release[id].videos.video[i].title);
            }

            $('ul.videosUL').append('<li><a href="' + videoSrc + '" rel="prettyPhoto" title="' + videoTitle + '">' + videoTitle + '</a></li>');
        }
    }
    else
    {
        $('ul.videosUL').html('<li>No videos :(</li>');
    }

    makePretty();
}


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
