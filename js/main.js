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

var records;

getData();

$('.records').accordion({
    collapsible: true,
    heightStyle: "content"
});


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
    console.log("Building records...");
    var i, j;

    /* Add artist/title to spines */
    for(i=0;i<length;i++)
    {
        try
        {
            //Add artist/title to spine
            if(typeof records.releases.release[i].artists.artist[0] === 'undefined')
            {
                $('.records').append('<li class="spine" id="' + i + '"><h3 class="artist-title">' + records.releases.release[i].artists.artist.name + ' - ' + records.releases.release[i].title + '</h3><div class="info"><div class="cover"></div><div class="artist"></div><div class="title"></div><div class="label"></div><div class="format"></div><div class="details"></div><div class="notes"></div><div class="tracks"><ul class="trackList"></ul></div><div class="videos"><ul class="videoList"></ul></div></div></li>');
            }
            else
            {
                $('.records').append('<li class="spine" id="' + i + '"><h3 class="artist-title">' + records.releases.release[i].artists.artist[0].name + ' - ' + records.releases.release[i].title + '</h3><div class="info"><div class="cover"></div><div class="artist"></div><div class="title"></div><div class="label"></div><div class="format"></div><div class="details"></div><div class="notes"></div></div></li>');
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

                    $(item).find('ul.videoList').append('<li><a href="' + videoSrc + '" rel="prettyPhoto" title="' + videoTitle + '">' + videoTitle + '</a></li>');
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

$('.spine').click(function(){
    loadInfo(this);
});

/* Function to load cover, tracks, and videos */
function loadInfo(item)
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
