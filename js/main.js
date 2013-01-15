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
    $('body').append('<div class="record" id="' + records.releases.release[i]._id + '"><div class="artist">' + records.releases.release[i].artists.artist.name + '</div><div class="title">' + records.releases.release[i].title + '</div></div>');
    try
    {
        $('.record:last').css('background-image','url("' + records.releases.release[i].images.image._uri150 + '")');
        $('.record:last').click(function() {
            alert("Handler called for #" + this.id);
        });
    }
    catch(err)
    {
        console.log(err.message);
    }
}

//TODO: Check artist info for RHCP - Havana Affair