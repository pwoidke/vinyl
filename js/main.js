function RecordObj()
{
    this.Artist     =		"(No Artist)";
    this.Title      = 		"(No Title)";
    this.Label      = 		"(None)";
    this.Format     = 		"(None)";
    this.Cover      =		[];
    this.Details    =		"";
    this.Notes      =		"";
    this.Tracks     =		[];
    this.Videos     =		[];
}

function TrackObj()
{
    this.Position   =       null;
    this.Title      =       null;
    this.Duration   =       null;
}

function VideoObj()
{
    this.URL        =       null;
    this.Title      =       null;
}

function CoverObj()
{
    this.URI        =       "img/noimg150.png";
    this.URI150     =       "img/noimg150.png";
}

$(document).ready(function(){

    var records;

    if(localDataExists())
    {
        console.log("Getting local data...");
        var xmlDoc = $.jStorage.get("vinyl");
        records = x2js.xml_str2json( xmlDoc );
    }
    else
    {
        records = getData();
    }
    console.log("Done.");
    build();
    doneLoading();


    /* DATA CONNECTION */

    function localDataExists() {
        if($.jStorage.index().length <= 0)
        {
            $.jStorage.flush();
            return false;
        }
        return true;
    }

    //TODO: In the future, change this to just show an upload file dialog (no initial data)
    function getData() {
        console.log("Getting data...");
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
        $.jStorage.set("vinyl", xmlDoc);
        records = x2js.xml_str2json( xmlDoc );
        return records;
    }


    /* INTERFACE */

    function build() {
        console.log("Building records...");
        try
        {
            records = buildRecords(records.releases.release.length);
        }
        catch(err)
        {
            console.log(err.message);
            records = getData();
            records = buildRecords(records.releases.release.length);
        }
        console.log("Building list...");
        buildList();
        console.log("Loading complete.");
    }

    $('.records').accordion({
        header: "h3",
        collapsible: true,
        heightStyle: "content",
        active: false
    });

    function buildRecords(length) {
        var i, j, item, notes, details, Record, nextTrack, nextVideo, nextCover, Records = [];

        $('ol.records').empty();

        /* Add artist/title to spines */
        for(i=0;i<length;i++)
        {
            try
            {
                Record = new RecordObj();

                //Artist
                if(typeof records.releases.release[i].artists.artist !== 'undefined')
                {
                    Record.Artist = records.releases.release[i].artists.artist.name;
                }
                else if(typeof records.releases.release[i].artists.artist[0] !== 'undefined')
                {
                    Record.Artist = _.reduce(records.releases.release[i].artists.artist, function(artist){ return artist.name + ", "; });
                }

                //Title
                if(typeof records.releases.release[i].title !== 'undefined')
                {
                    Record.Title = records.releases.release[i].title;
                }

                //Label
                if(typeof records.releases.release[i].labels.label !== 'undefined')
                {
                    Record.Label = records.releases.release[i].labels.label._name;
                }
                else if(typeof records.releases.release[i].labels.label[0] !== 'undefined')
                {
                    Record.Label = _.reduce(records.releases.release[i].labels.label, function(label){ return label._name + ", "; });
                }

                //Format
                if(typeof records.releases.release[i].formats.format !== 'undefined')
                {
                    if(typeof records.releases.release[i].formats.format._text === 'undefined')
                    {
                        Record.Format = records.releases.release[i].formats.format._name;
                    }
                    else
                    {
                        Record.Format = records.releases.release[i].formats.format._name + " (" + records.releases.release[i].formats.format._text + ")";
                    }
                }
                else if(typeof records.releases.release[i].formats.format[0] !== 'undefined')
                {
                    if(typeof records.releases.release[i].formats.format[0]._text === 'undefined')
                    {
                        Record.Format = _.reduce(records.releases.release[i].formats.format, function(format){ return format._name + ", "});
                    }
                    else
                    {
                        Record.Format = _.reduce(records.releases.release[i].formats.format, function(format){ return format._name +  " (" + format._text + ")" + ", "});
                    }
                }

                //Details
                if(typeof records.releases.release[i].notes !== 'undefined')
                {
                    Record.Details = htmlDecode(records.releases.release[i].notes);
                }

                //Notes
                if(typeof records.releases.release[i].Collection_Notes !== 'undefined')
                {
                    Record.Notes = htmlDecode(records.releases.release[i].Collection_Notes);
                }
                else if(typeof records.releases.release[i].Collection_Notes[0] !== 'undefined')
                {
                    Record.Notes = _.reduce(records.releases.release[i].Collection_Notes, function(notes){ return htmlDecode(notes) + " "; });
                }

                //Tracks
                for(j=0;j<records.releases.release[i].tracklist.__cnt;j++)
                {
                    nextTrack = new TrackObj();

                    if(typeof records.releases.release[i].tracklist.track.title !== 'undefined')
                    {
                        nextTrack.Position = htmlEncode(records.releases.release[i].tracklist.track.position);
                        nextTrack.Title = htmlEncode(records.releases.release[i].tracklist.track.title);
                    }
                    else if((typeof records.releases.release[i].tracklist.track[j].title !== 'undefined') && (typeof records.releases.release[i].tracklist.track[j].title !== 'object'))
                    {
                        nextTrack.Position = htmlEncode(records.releases.release[i].tracklist.track[j].position);
                        nextTrack.Title = htmlEncode(records.releases.release[i].tracklist.track[j].title);
                        if(typeof records.releases.release[i].tracklist.track[j].duration !== 'object')
                        {
                            nextTrack.Duration = htmlEncode(records.releases.release[i].tracklist.track[j].duration);
                        }
                    }
                    else if(typeof records.releases.release[i].tracklist.track.title !== 'object')
                    {
                        nextTrack.Position = htmlEncode(records.releases.release[i].tracklist.track.position);
                        nextTrack.Title = htmlEncode(records.releases.release[i].tracklist.track.title);
                        if(typeof records.releases.release[i].tracklist.track[j].duration !== 'object')
                        {
                            nextTrack.Duration = htmlEncode(records.releases.release[i].tracklist.track.duration);
                        }
                    }

                    Record.Tracks.push(nextTrack);
                }

                //Videos
                if(typeof records.releases.release[i].videos !== 'undefined')
                {
                    for(j=0;j<records.releases.release[i].videos.__cnt;j++)
                    {
                        nextVideo = new VideoObj();

                        if(typeof records.releases.release[i].videos.video.title === 'undefined')
                        {
                            nextVideo.URL = records.releases.release[i].videos.video[j]._src;
                            nextVideo.Title = htmlEncode(records.releases.release[i].videos.video[j].title);
                        }
                        else
                        {
                            nextVideo.URL = records.releases.release[i].videos.video._src;
                            nextVideo.Title = htmlEncode(records.releases.release[i].videos.video.title);
                        }

                        Record.Videos.push(nextVideo);
                    }
                }

                //Cover
                nextCover = new CoverObj();
                if(typeof records.releases.release[i].images !== 'undefined')
                {
                    if (typeof records.releases.release[i].images.image[0] !== 'undefined')
                    {
                        for(j=0;j<records.releases.release[i].images.__cnt;j++)
                        {
                            nextCover.URI = records.releases.release[i].images.image[j]._uri;
                            nextCover.URI150 = records.releases.release[i].images.image[j]._uri150;

                            Record.Cover.push(nextCover);
                            nextCover = new CoverObj();
                        }
                    }
                    else if(typeof records.releases.release[i].images.image !== 'undefined')
                    {
                        nextCover.URI = records.releases.release[i].images.image._uri;
                        nextCover.URI150 = records.releases.release[i].images.image._uri150;

                        Record.Cover.push(nextCover);
                    }
                    else
                    {
                        Record.Cover.push(nextCover);
                    }
                }
                else
                {
                    Record.Cover.push(nextCover);
                }

                //Add artist/title to spine
                $('.records').append('<li class="spine" id="' + i + '" style="background-color: ' + getRandomColor() + '"><h3 class="artist-title">' + Record.Artist + ' - ' + Record.Title + '</h3><div class="info"><div class="infoLeft"><div class="cover"></div></div><div class="infoRight"><div class="artist"></div><div class="title"></div><div class="label"></div><div class="format"></div><div class="details"></div><div class="notes"></div></div><div class="tracks"><ul class="trackList"><li>No track information :(</li></ul></div><div class="videos"><ul class="videoList"><li>No videos :(</li></ul></div></div></li>');

                item = document.getElementById(i.toString());

                //Add cover image
                $(item).find('.cover').html('<img src="' + Record.Cover + '" height="150" width="150" />');

                //Artist
                $(item).find('.artist').text('Artist: ' + Record.Artist);

                //Title
                $(item).find('.title').text('Title: ' + Record.Title);

                //Label
                $(item).find('.label').text('Label: ' + Record.Label);

                //Format
                $(item).find('.format').text('Format: ' + Record.Format);

                //Details
                $(item).find('.details').text('Details: ' + Record.Details);

                //Notes
                $(item).find('.notes').css({display:"block"}).text('Notes: ' + Record.Notes);

                //Tracks
                if(Record.Tracks.length > 0)
                {
                    $(item).find('ul.trackList').text('');
                    _.each(Record.Tracks, function(track){
                        $(item).find('ul.trackList').append("<li>");
                        if(track.Position)
                        {
                            $(item).find('ul.trackList').append(track.Position + ": ");
                        }
                        if(track.Title)
                        {
                            $(item).find('ul.trackList').append(track.Title);
                        }
                        if(track.Duration)
                        {
                            $(item).find('ul.trackList').append(" (" + track.Duration + ")");
                        }
                        $(item).find('ul.trackList').append("</li>");
                    });
                }

                //Videos
                if(Record.Videos.length > 0)
                {
                    $(item).find('ul.videoList').text('');
                    _.each(Record.Videos, function(video){
                        $(item).find('ul.videoList').append('<li><a href="' + video.URL + '" rel="prettyPhoto[' + Record.Title + ' Videos]" title="' + video.Title + '">' + video.Title + '</a></li>');
                    });
                }

                Records.push(Record);
            }
            catch(err)
            {
                console.log(err.message);
            }
        }

        console.log("Done.");
        return Records;
    }

    /* Function to load cover, tracks, and videos */
    function loadCover(item) {
        //Cover
        var id, i;
        id = item.id;

        $(item).find('.cover').html('<a href="' + records[id].Cover[0].URI + '" rel="prettyPhoto[' + records[id].Title + ']" ><img src="' + records[id].Cover[0].URI150 + '" height="150" width="150" /></a>');

        for(i=1;i<records[id].Cover.length;i++)
        {
            $(item).find('.cover').append('<a href="' + records[id].Cover[i].URI + '" rel="prettyPhoto[' + records[id].Title + ']" ></a>');
        }

        makePretty();
    }

    function doneLoading() {
        $('.loading').hide('slow');
    }


    /* EVENTS */

    $('.spine').click(function(){
        loadCover(this);
    });

    //TODO: Add loading spinner to file upload
    $('#uploadFile').change(function(){
        console.log("Uploading new data file...");
        var file, reader;
        file=document.getElementById("uploadFile").files[0];
        reader=new FileReader();

        reader.onload = function(e) {
            $.jStorage.set("vinyl", e.target.result);
            if($.jStorage.get("vinyl") != null)
            {
                console.log("Done.");
                document.location.reload();
            }
        }

        reader.readAsText(file);
    });


    /* UTILITY FUNCTIONS */

    function getRandomColor() {
        return 'rgb(' + (Math.floor((200)*Math.random())) + ',' + (Math.floor((200)*Math.random())) + ',' + (Math.floor((200)*Math.random())) + ')';
    }

    function htmlEncode(value) {
        return $('<div/>').text(value).html();
    }

    function htmlDecode(value) {
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

    function buildList() {
        var options, recordList;
        options = {
            valueNames: [ 'artist', 'title', 'label', 'format' ],
            page: 500
        };
        recordList = new List('recordList', options);
        console.log("Done.");
    }

});