/*$("#titleBar").click(function() {
    $('.loading').fadeIn('fast');
    var url = 'index_backend.php';
    var data = 'type=scores';
    $('#titleBar').load(url, data, function() {
        $('.loading').fadeOut('slow');
    });
});*/

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
var X2JS = new X2JS();
records = X2JS.xml_str2json( xmlDoc );

function getRandomColor()
{
    return 'rgb(' + (Math.floor((200)*Math.random())) + ',' + (Math.floor((200)*Math.random())) + ',' + (Math.floor((200)*Math.random())) + ')';
}

$('#records').css("width", ((records.releases.release.length * 23) + 10) + "px");

for(var i=0;i<records.releases.release.length;i++)
{
    try
    {
        if(typeof records.releases.release[i].artists.artist[0] === 'undefined')
        {
            $('#records').append('<div class="spine" id="' + i + '"><div class="artist-title">' + records.releases.release[i].artists.artist.name + ' - ' + records.releases.release[i].title + '</div></div>');
        }
        else
        {
            $('#records').append('<div class="spine" id="' + i + '"><div class="artist-title">' + records.releases.release[i].artists.artist[0].name + ' - ' + records.releases.release[i].title + '</div></div>');
        }

        /* Set background color */
        $('.spine:last').css('background-color',getRandomColor());
    }
    catch(err)
    {
        console.log(err.message);
    }
}

var infoShown = false;

$(".spine").click(function(e) {
    //Shift records so that spine is centered on shelf
    $("#records").animate({
        left: (parseInt($("#records").css("left"))          //Get the amount the records div is shifted left
                + (($("#shelf").width()/2)                  //Add the xPos of the center of the shelf div
                - (e.clientX - $("#shelf").offset().left)) //Minus the xPos of the click from the center to get the amount to shift
                - ((spineHeight/2) - (e.clientX - $(this).offset().left)))   /*Align center of spine with center of shelf
                                                                               (use unexpanded height because when it moves
                                                                               it won't have the mouseover on it anymore)*/
    });

    if(infoShown == false)
    {
        $("#container").animate({top:"25px"}, 500);
        $(".info").animate({opacity:"1.0"}, 500, function() {
            $(".tracklist").animate({opacity:"1.0", marginLeft:"140px"}, 500);
            $(".videolist").animate({opacity:"1.0", marginLeft:"-30px"}, 500);
        });
        infoShown = true;
        loadInfo(this.id);
    }
    else
    {
        loadInfo(this.id);
    }
});

function loadInfo(id)
{
    if(!(typeof records.releases.release[id].images === 'undefined'))
    {
        if(!(typeof records.releases.release[id].images.image[0] === 'undefined'))
        {
            $(".cover").html('<a href="' + records.releases.release[id].images.image[0]._uri + '" rel="prettyPhoto[' + records.releases.release[id].title + ']" ><img src="' + records.releases.release[id].images.image[0]._uri + '" height="150" width="150" /></a>');
            if(records.releases.release[id].images.__cnt > 1)
            {
                for(var i=1;i<records.releases.release[id].images.__cnt;i++)
                {
                    $(".cover").append('<a href="' + records.releases.release[id].images.image[i]._uri + '" rel="prettyPhoto[' + records.releases.release[id].title + ']" ></a>');
                }
            }
        }
        else if(!(typeof records.releases.release[id].images.image === 'undefined'))
        {
            $(".cover").html('<a href="' + records.releases.release[id].images.image._uri + '" rel="prettyPhoto[' + records.releases.release[id].title + ']" ><img src="' + records.releases.release[id].images.image._uri + '" height="150" width="150" /></a>');
        }
        else
        {
            $(".cover").html('<img src="img/noimg150.png" height="150" width="150" />');
        }
    }
    else
    {
        $(".cover").html('<img src="img/noimg150.png" height="150" width="150" />');
    }
    if(typeof records.releases.release[id].artists.artist[0] === 'undefined')
    {
        $(".artist").text('Artist: ' + records.releases.release[id].artists.artist.name);
    }
    else
    {
        $(".artist").text('Artist: ' + records.releases.release[id].artists.artist[0].name);
    }
    $(".title").text('Title: ' + records.releases.release[id].title);
    if(typeof records.releases.release[id].labels.label[0] === 'undefined')
    {
        $(".label").text('Label: ' + records.releases.release[id].labels.label._name);
    }
    else
    {
        $(".label").text('Label: ' + records.releases.release[id].labels.label[0]._name);
    }
    if(typeof records.releases.release[id].formats.format[0] === 'undefined')
    {
        if(typeof records.releases.release[id].formats.format._text === 'undefined')
        {
            $(".format").text('Format: ' + records.releases.release[id].formats.format._name);
        }
        else
        {
            $(".format").text('Format: ' + records.releases.release[id].formats.format._name + ' (' + records.releases.release[id].formats.format._text + ')');
        }
    }
    else
    {
        if(typeof records.releases.release[id].formats.format[0]._text === 'undefined')
        {
            $(".format").text('Format: ' + records.releases.release[id].formats.format[0]._name);
        }
        else
        {
            $(".format").text('Format: ' + records.releases.release[id].formats.format[0]._name + ' (' + records.releases.release[id].formats.format[0]._text + ')');
        }
    }
    if(!(typeof records.releases.release[id].notes === 'undefined'))
    {
        var details = htmlDecode(records.releases.release[id].notes);
        $(".details").text('Details: ' + details);
    }
    else
    {
        $(".details").text('');
    }
    if(!(typeof records.releases.release[id].Collection_Notes[0] === 'undefined'))
    {
        var notes = htmlEncode(records.releases.release[id].Collection_Notes);
        $(".notes").css({display:"block"});
        $(".notes").text('Notes: ' + notes);
    }
    else
    {
        $(".notes").css({display:"none"});
        $(".notes").text('');
    }
    $("ul.tracksUL").text('');
    for(var i=0;i<records.releases.release[id].tracklist.__cnt;i++)
    {
        if(!(typeof records.releases.release[id].tracklist.track.position === 'undefined'))
        {
            var trackPosition = htmlEncode(records.releases.release[id].tracklist.track.position);
        }
        else
        {
            var trackPosition = htmlEncode(records.releases.release[id].tracklist.track[i].position);
        }
        if(!(typeof records.releases.release[id].tracklist.track.title === 'undefined'))
        {
            var trackTitle = htmlEncode(records.releases.release[id].tracklist.track.title);
        }
        else
        {
            var trackTitle = htmlEncode(records.releases.release[id].tracklist.track[i].title);
        }
        if((trackTitle != "[object Object]")&&(trackTitle != "undefined"))
        {
            $("ul.tracksUL").append("<li>");
            if(trackPosition != "[object Object]")
            {
                $("ul.tracksUL").append(trackPosition + ": ");
            }
            $("ul.tracksUL").append(trackTitle);
            if(!(typeof records.releases.release[id].tracklist.track[i].duration[0] === 'undefined'))
            {
                var trackDuration = htmlEncode(records.releases.release[id].tracklist.track[i].duration);
                $("ul.tracksUL").append(" (" + trackDuration + ")");
            }
            $("ul.tracksUL").append("</li>");
        }
    }
    $("ul.videosUL").text('');
    if(!(typeof records.releases.release[id].videos === 'undefined'))
    {
        for(var i=0;i<records.releases.release[id].videos.__cnt;i++)
        {
            if(!(typeof records.releases.release[id].videos.video._src === 'undefined'))
            {
                var videoSrc = records.releases.release[id].videos.video._src;
            }
            else
            {
                var videoSrc = records.releases.release[id].videos.video[i]._src;
            }

            if(!(typeof records.releases.release[id].videos.video.title === 'undefined'))
            {
                var videoTitle = htmlEncode(records.releases.release[id].videos.video.title);
            }
            else
            {
                var videoTitle = htmlEncode(records.releases.release[id].videos.video[i].title);
            }

            $("ul.videosUL").append('<li><a href="' + videoSrc + '" rel="prettyPhoto" title="' + videoTitle + '">' + videoTitle + '</a></li>');
        }
    }
    else
    {
        $("ul.videosUL").html('<li>No videos :(</li>');
    }

    makePretty();
}

$(function() {
    $(".info").bind('click', function (e) {
        $("#container").animate({top:"-200px"}, 500);
        $(".info").animate({opacity:"0.0"}, 500);
        $(".tracklist").animate({opacity:"0.0", marginLeft:"80px"}, 100);
        $(".videolist").animate({opacity:"0.0", marginLeft:"10px"}, 100);
        infoShown = false;
    });
    $(".info .cover").bind('click', function(e) {
        //e.stopPropagation(); //TODO: Don't hide info if cover is clicked
    });
});

var tracksShown = false;

$(".tracklist").click(function() {
    if(tracksShown)
    {
        $(".tracklist").animate({marginLeft:"140px"}, 500);
        tracksShown = false;
    }
    else
    {
        $(".tracklist").animate({marginLeft:"390px"}, 500);
        tracksShown = true;
    }
});

var videosShown = false;

$(".videolist").click(function() {
    if(videosShown)
    {
        $(".videolist").animate({marginLeft:"-30px"}, 500);
        videosShown = false;
    }
    else
    {
        $(".videolist").animate({marginLeft:"-280px"}, 500);
        videosShown = true;
    }
});


var spineWidth = 600;
var spineHeight = 20;

$("#shelf").css("height", (spineWidth+"px"));
$(".scroll-left").css({"height": (spineWidth+"px"), "width": ((spineWidth *.08)+"px")});
$(".scroll-right").css({"height": (spineWidth+"px"), "width": ((spineWidth *.08)+"px")});
$("#records").css("height", (spineWidth+"px"));
$(".spine").css({
    width: (spineWidth+"px"),
    height: (spineHeight+"px"),
    top: (((spineWidth-spineHeight)/2)+"px"),
    right: (((spineWidth-spineHeight)/2)+"px"),
    marginBottom: (spineWidth+"px"),
    marginRight: ((-1*(spineWidth-(spineHeight+3)))+"px"),
    marginTop:"0px"
});
$(".spine").children().css({
    fontSize: (.75*spineHeight+"px"),
    top: "-3px",
    marginLeft: (.25*spineHeight+"px")
});

/* Expand album on mouseover */
$(".spine").hover(function(){
    $(this).stop(true, false).animate({
        height: (1.5*spineHeight+"px"),
        top: (((spineWidth-spineHeight)/2)+(.25*spineHeight)+"px"),
        right: (((spineWidth-spineHeight)/2)-(.25*spineHeight)+"px"),
        marginRight: ((-1*(spineWidth-(spineHeight+3)))+(.5*spineHeight)+"px"),
        marginTop: ((-1*spineHeight)+"px")
    });
    $(this).children().stop(true, false).animate({
        fontSize: (spineHeight+"px"),
        top: "0px",
        marginLeft: (.5*spineHeight+"px")
    });
}, function() {
    $(this).stop(true, false).animate({
        height: (spineHeight+"px"),
        top: (((spineWidth-spineHeight)/2)+"px"),
        right: (((spineWidth-spineHeight)/2)+"px"),
        marginRight: ((-1*(spineWidth-(spineHeight+3)))+"px"),
        marginTop:"0px"
    });
    $(this).children().stop(true, false).animate({
        fontSize: (.75*spineHeight+"px"),
        top: "-3px",
        marginLeft: (.25*spineHeight+"px")
    });
});

/* Scroll records on mouseover on Left/Right buttons */
var scrolling = false;

$(".scroll-left").bind("mouseover", function(event) {
    scrolling = true;
    scrollContent("left");
}).bind("mouseout", function(event) {
    scrolling = false;
});

$(".scroll-right").bind("mouseover", function(event) {
        scrolling = true;
        scrollContent("right");
}).bind("mouseout", function(event) {
    scrolling = false;
});

function scrollContent(direction) {
    if(
        ((direction==="left")&&(parseInt($("#records").css("left"))<((parseInt($("#shelf").css("width"))/2)-10)))||((direction==="right")&&(parseInt($("#records").css("left"))>(-1*(((parseInt($("#records").css("width")))-23)-((parseInt($("#shelf").css("width")))/2)))))
        )
    {
        var amount = (direction === "right" ? "-=1px" : "+=1px");
        $("#records").animate({
            left: amount
        }, 1, function() {
            if (scrolling) {
                scrollContent(direction);
            }
        });
    }
}

function htmlEncode(value){
    //create a in-memory div, set it's inner text(which jQuery automatically encodes)
    //then grab the encoded contents back out.  The div never exists on the page.
    return $('<div/>').text(value).html();
}

function htmlDecode(value){
    return $('<div/>').html(value).text();
}

function makePretty() {
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
