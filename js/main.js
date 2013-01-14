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

var records =
{"releases": [
    {"release": [
        {"release": [
            {"images": [
                {"image": [
                    {"@attributes":{
                        "height": "",
                        "type": "",
                        "uri": "",
                        "uri150": "",
                        "width": ""
                    }}
                ]}
            ]},
            {"artists": [
                {"artist": [
                    {"name": ""}
                ]}
            ]},
            {"title": ""},
            {"labels": [
                {"label": [
                    {"@attributes":{
                        "name": ""
                    }}
                ]}
            ]},
            {"formats": [
                {"format": [
                    {"@attributes":{
                        "name": ""
                    }}
                ]},
                {"descriptions": [
                    {"description": ""}
                ]}
            ]},
            {"genres": [
                {"genre": ""}
            ]},
            {"styles": [
                {"style": ""}
            ]},
            {"country": ""},
            {"released": ""},
            {"tracklist": [
                {"track": [
                    {"position": ""},
                    {"title": ""},
                    {"duration": ""}
                ]}
            ]},
            {"videos": [
                {"video": [
                    {"@attributes":{
                        "src": ""
                    }}
                ]}
            ]},
            {"Collection_Notes": ""}
        ]}
    ]}
]};

records = X2JS.xml_str2json( xmlDoc );

//alert(records.releases.release[0].images.image.toSource());


for(var i=0;i<records.releases.release.length;i++)
{
    $('body').append('<div class="record"><div class="artist">' + records.releases.release[i].artists.artist.name + '</div><div class="title">' + records.releases.release[i].title + '</div></div>');
    try
    {
        $('.record:last').css('background-image','url("' + records.releases.release[i].images.image._uri150 + '")');
    }
    catch(err)
    {
        console.log(err.message);
    }
}

//TODO: Check artist info for RHCP - Havana Affair