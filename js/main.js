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

$('#records').css("width", ((records.releases.release.length * 10) + 20) + "px");

for(var i=0;i<records.releases.release.length;i++)
{
    try
    {
        /* Add Artist & Title */
        if(typeof records.releases.release[i].artists.artist[0] === 'undefined')
        {
            $('#records').append('<div class="spine" id="' + records.releases.release[i]._id + '"><div class="artist-title">' + records.releases.release[i].artists.artist.name + ' - ' + records.releases.release[i].title + '</div></div>');
        }
        else
        {
            $('#records').append('<div class="spine" id="' + records.releases.release[i]._id + '"><div class="artist-title">' + records.releases.release[i].artists.artist[0].name + ' - ' + records.releases.release[i].title + '</div></div>');
        }

        /* Set background color */
//        $('.spine:last').css('background-color','red');
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
    finally
    {
        $('.spine:last').click(function() {
            alert("Handler called for #" + this.id);
        });
    }
}

/* Expand album on mouseover */
$(".spine").hover(function(){
    $(this).stop(true, false).animate({height: "30px", marginRight: "-230px", marginLeft: "10px", marginBottom: "240px", marginTop: "-10px"});
    $(this).children().stop(true, false).animate({fontSize: "20px", top: "0px" });
}, function() {
    $(this).stop(true, false).animate({height: "10px", marginRight: "-240px", marginLeft: "0px", marginBottom: "250px", marginTop: "0px"});
    $(this).children().stop(true, false).animate({fontSize: "10px", top: "-10px" });
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