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

//alert(records.releases.__cnt);

function getRandomColor()
{
    return 'rgb(' + (Math.floor((200)*Math.random())) + ',' + (Math.floor((200)*Math.random())) + ',' + (Math.floor((200)*Math.random())) + ')';
}

$('#records').css("width", ((records.releases.release.length * 23) + 10) + "px");

for(var i=0;i<records.releases.release.length;i++)
{
    try
    {
        /* Add Artist & Title */
        /*if(typeof records.releases.release[i].artists.artist[0] === 'undefined')
        {
            $('#records').append('<div class="spine" id="' + records.releases.release[i]._id + '"><div class="artist-title">' + records.releases.release[i].artists.artist.name + ' - ' + records.releases.release[i].title + '</div></div>');
        }
        else
        {
            $('#records').append('<div class="spine" id="' + records.releases.release[i]._id + '"><div class="artist-title">' + records.releases.release[i].artists.artist[0].name + ' - ' + records.releases.release[i].title + '</div></div>');
        }*/
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

        /* Add album covers */
        /*if(records.releases.release[i].images.image._uri150)
        {
            $('.record:last').css('background-image','url("' + records.releases.release[i].images.image._uri150 + '")');
        }
        else
        {
            $('.record:last').css('background-image','url("' + records.releases.release[i].images.image[0]._uri150 + '")');
        }*/
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
                - (10 - (e.clientX - $(this).offset().left)))   /*Align center of spine with center of shelf
                                                                  (use unexpanded height because when it moves
                                                                  it won't have the mouseover on it anymore)*/
    });


    if(infoShown == false)
    {
        $("#container").animate({top:"25px"}, 500);
        $(".info").animate({opacity:"1.0"}, 500);
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
    // TODO: Load cover
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
    // TODO: Load multiple formats
    // TODO: Load notes, videos, tracklist
}

$('.info').click(function() {
    $("#container").animate({top:"-200px"}, 500);
    $(".info").animate({opacity:"0.0"}, 500);
    infoShown = false;
});

var spineWidth = 600;
//TODO: Set heights programmatically

$("#shelf").css("height", (spineWidth+"px"));
$("#records").css("height", (spineWidth+"px"));
$(".spine").css({width: (spineWidth+"px"), top: (((spineWidth-20)/2)+"px"), right: (((spineWidth-20)/2)+"px"), marginBottom: (spineWidth+"px"), marginRight: ((-1*(spineWidth-23))+"px")});

/* Expand album on mouseover */
$(".spine").hover(function(){
    $(this).stop(true, false).animate({height: "30px",  width: ((spineWidth+10)+"px"), marginTop: "-10px"}); /* new width = old width + 10 */
    $(this).children().stop(true, false).animate({fontSize: "20px", top: "0px", marginLeft: "20px" });
}, function() {
    $(this).stop(true, false).animate({height: "20px", width: (spineWidth+"px"), marginTop: "0px"});
    $(this).children().stop(true, false).animate({fontSize: "15px", top: "-3px", marginLeft: "5px" });
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
    var amount = (direction === "right" ? "-=1px" : "+=1px");
    $("#records").animate({
        left: amount
    }, 1, function() {
        if (scrolling) {
            scrollContent(direction);
        }
    });
}