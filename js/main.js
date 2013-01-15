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
// XML string to JSON

records = X2JS.xml_str2json( xmlDoc );

//alert(records.releases.release[0]._id);


for(var i=0;i<records.releases.release.length;i++)
{
    try
    {
        if(typeof records.releases.release[i].artists.artist[0] === 'undefined')
        {
            $('body').append('<div class="record" id="' + records.releases.release[i]._id + '"><div class="artist">' + records.releases.release[i].artists.artist.name + '</div><div class="title">' + records.releases.release[i].title + '</div></div>');
        }
        else
        {
            $('body').append('<div class="record" id="' + records.releases.release[i]._id + '"><div class="artist">' + records.releases.release[i].artists.artist[0].name + '</div><div class="title">' + records.releases.release[i].title + '</div></div>');
        }
        if(typeof records.releases.release[i].images.image[0]._uri150 === 'undefined')
        {
            $('.record:last').css('background-image','url("' + records.releases.release[i].images.image._uri150 + '")');
        }
        else
        {
            $('.record:last').css('background-image','url("' + records.releases.release[i].images.image[0]._uri150 + '")');
        }
    }
    catch(err)
    {
        console.log(err.message);
    }
    finally
    {
        $('.record:last').click(function() {
            alert("Handler called for #" + this.id);
        });
    }
}

//TODO: Check artist info for RHCP - Havana Affair