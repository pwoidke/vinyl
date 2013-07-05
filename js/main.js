
var RecordObj = function(id) {
    //State
    this.id         =       id;
    this.spine      =       $('#' + this.id + '.spine');
    this.Artist     =		"(No Artist)";
    this.Title      = 		"(No Title)";
    this.Label      = 		"(None)";
    this.Format     = 		"(None)";
    this.Size       =       12;
    this.Cover      =		[];
    this.Details    =		"";
    this.Notes      =		"";
    this.Tracks     =		[];
    this.Videos     =		[];
};

RecordObj.prototype = function() {
    //Private
    function searchStringInArray (str, strArray) {
        for (var j=0; j<strArray.length; j++) {
            if (strArray[j].match(str)) return j;
        }
        return -1;
    }

    var appendTracks = "", appendVideos = "",

        setSize = function (descriptions) {
            if(!_.isUndefined(descriptions))
            {
                if(_.isUndefined(descriptions.description))
                {
                    if((searchStringInArray("7", descriptions) >= 0) ||
                        (searchStringInArray("45", descriptions) >= 0))
                    {
                        this.Size = 7;
                    }
                    else if(searchStringInArray("10", descriptions) >= 0)
                    {
                        this.Size = 10;
                    }
                }
                else
                {
                    if((searchStringInArray("7", descriptions.description) >= 0) ||
                        (searchStringInArray("45", descriptions.description) >= 0))
                    {
                        this.Size = 7;
                    }
                    else if(searchStringInArray("10", descriptions.description) >= 0)
                    {
                        this.Size = 10;
                    }
                }
            }
        },

        setArtistTitle = function () {
            var div = $('#' + this.id + '.spine');
            div.addClass('spine' + this.Size);
            div.find('.artist-title').html(this.Artist + " - " + this.Title);
        },

        setInfo = function() {
            var item = document.getElementById(this.id.toString());
            item.Title = this.Title;

            //Add cover image
            $(item).find('.cover').html('<img src="' + this.Cover + '" height="150" width="150" />');

            //Artist
            $(item).find('.artist').text('Artist: ' + this.Artist);

            //Title
            $(item).find('.title').text('Title: ' + this.Title);

            //Label
            $(item).find('.label').text('Label: ' + this.Label);

            //Format
            $(item).find('.format').text('Format: ' + this.Format);

            //Details
            if(this.Details.length > 0)
            {
                $(item).find('.details').text('Details: ' + this.Details);
            }

            //Notes
            if(this.Notes.length > 0)
            {
                $(item).find('.notes').css({display:"block"}).text('Notes: ' + this.Notes);
            }

            //Tracks
            if(this.Tracks.length > 0)
            {
                appendTracks = '<ul class="trackList">';
                _.each(this.Tracks, function(track){
                    appendTracks += "<li>";
                    if(track.Position)
                    {
                        appendTracks += track.Position + ": ";
                    }
                    if(track.Title)
                    {
                        appendTracks += track.Title;
                    }
                    if(track.Duration)
                    {
                        appendTracks += track.Duration + ")";
                    }
                    appendTracks += "</li>";
                });
                appendTracks += '</ul>';
            }
            else
            {
                appendTracks = '<ul class="trackList"><li>No track information :(</li></ul>';
            }
            $(item).find('.tracks').append(appendTracks);

            //Videos
            if(this.Videos.length > 0)
            {
                appendVideos = '<ul class="videoList">';
                _.each(this.Videos, function(video){
                    appendVideos += '<li><a href="' + video.URL + '" rel="prettyPhoto[' + item.Title + ' Videos]" title="' + video.Title + '">' + video.Title + '</a></li>';
                });
                appendVideos += '</ul>';
            }
            else
            {
                appendVideos = '<ul class="videoList"><li>No videos :(</li></ul>';
            }
            $(item).find('.videos').append(appendVideos);
        };

    //Public
    return {
        setSize: setSize,
        setArtistTitle: setArtistTitle,
        setInfo: setInfo
    };
}();

function Track() {
    this.Position   =       null;
    this.Title      =       null;
    this.Duration   =       null;
}

function Video() {
    this.URL        =       null;
    this.Title      =       null;
}

function Cover() {
    this.URI        =       "img/noimg150.png";
    this.URI150     =       "img/noimg150.png";
}

$(document).ready(function() {

    var xmlDoc, records;

    if(localDataExists())
    {
        console.log("Getting local data...");
        xmlDoc = $.jStorage.get("vinyl");
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

    $('#records').accordion({
        header: "h3",
        collapsible: true,
        heightStyle: "content",
        active: false
    });

    function buildRecords(length) {
        var i, j, RecordListHTML, Record, infoArray, nextTrack, nextVideo, nextCover, Records = [];

        RecordListHTML = '<ol class="list" id="records">';
        for(i=0;i<length;i++)
        {
            RecordListHTML += '<li class="spine" id="' + i + '" style="background-color: ' + 'rgb(' + (Math.floor((200)*Math.random())) + ',' + (Math.floor((200)*Math.random())) + ',' + (Math.floor((200)*Math.random())) + ')' + '"><h3 class="artist-title"></h3><div class="info"><div class="infoLeft"><div class="cover"></div></div><div class="infoRight"><div class="artist"></div><div class="title"></div><div class="label"></div><div class="format"></div><div class="details"></div><div class="notes"></div></div><div class="tracks"></div><div class="videos"></div></div></li>';
        }
        RecordListHTML += '</ol>';
        $('#shelf').html(RecordListHTML);

        /* Add records to list */
        for(i=0;i<length;i++)
        {
            try
            {
                Record = new RecordObj(i);

                /* Set object properties */

                //Artist
                if(_.isString(records.releases.release[i].artists.artist.name))
                {
                    Record.Artist = records.releases.release[i].artists.artist.name.replace(/ \(\d+\)/, "");
                }
                else if(_.isString(records.releases.release[i].artists.artist[0].name))
                {
                    infoArray = _.map(records.releases.release[i].artists.artist, function(artist){ return artist.name.replace(/ \(\d+\)/, ""); });
                    Record.Artist = infoArray.join(", ");
                }
                else { console.log('Error: Artist'); }

                //Title
                if(_.isString(records.releases.release[i].title))
                {
                    Record.Title = records.releases.release[i].title;
                }
                else { console.log('Error: Title'); }

                //Label
                if(_.isString(records.releases.release[i].labels.label._name))
                {
                    Record.Label = records.releases.release[i].labels.label._name.replace(/ \(\d+\)/, "");
                }
                else if(_.isString(records.releases.release[i].labels.label[0]._name))
                {
                    infoArray = _.map(records.releases.release[i].labels.label, function(label){ return label._name.replace(/ \(\d+\)/, ""); });
                    Record.Label = infoArray.join(", ");
                }
                else { console.log('Error: Label'); }

                //Format
                if(_.isObject(records.releases.release[i].formats.format[0]))
                {
                    infoArray = [];
                    _.each(records.releases.release[i].formats.format, function(format){
                        if(_.isString(format._text))
                        {
                            infoArray.push(format._name + " (" + format._text + ")");
                        }
                        else if(_.isString(format._name))
                        {
                            infoArray.push(format._name);
                        }
                    });
                    Record.Format = infoArray.join(", ");

                    Record.setSize(records.releases.release[i].formats.format[0].descriptions);
                }
                else if(_.isObject(records.releases.release[i].formats.format))
                {
                    //records.releases.release[i].formats.format[0].descriptions.description
                    if(_.isString(records.releases.release[i].formats.format._text))
                    {
                        Record.Format = records.releases.release[i].formats.format._name + " (" + records.releases.release[i].formats.format._text + ")";
                    }
                    else if(_.isString(records.releases.release[i].formats.format._name))
                    {
                        Record.Format = records.releases.release[i].formats.format._name;
                    }

                    Record.setSize(records.releases.release[i].formats.format.descriptions.description);
                }
                else { console.log('Error: Format'); }

                //Details
                if(_.isString(records.releases.release[i].notes))
                {
                    Record.Details = htmlDecode(records.releases.release[i].notes);
                }

                //Notes
                if(!_.isUndefined(records.releases.release[i].Collection_Notes))
                {
                    if(_.isObject(records.releases.release[i].Collection_Notes[0]))
                    {
                        infoArray = _.map(records.releases.release[i].Collection_Notes, function(notes){ return htmlDecode(notes) + " "; });
                        Record.Notes = infoArray.join(", ");
                    }
                    else if(_.isString(records.releases.release[i].Collection_Notes))
                    {
                        Record.Notes = records.releases.release[i].Collection_Notes;
                    }
                }

                //Tracks
                if(_.isObject(records.releases.release[i].tracklist))
                {
                    if(_.isString(records.releases.release[i].tracklist.track.title))
                    {
                        nextTrack = new Track();
                        if(_.isString(records.releases.release[i].tracklist.track.position))
                        {
                            nextTrack.Position = _.escape(records.releases.release[i].tracklist.track.position);
                            nextTrack.Title = _.escape(records.releases.release[i].tracklist.track.title);
                        }
                        else
                        {
                            nextTrack.Title = "<b>" + _.escape(records.releases.release[i].tracklist.track.title) + "</b>";
                        }
                        if(_.isString(records.releases.release[i].tracklist.track.duration))
                        {
                            nextTrack.Duration = _.escape(records.releases.release[i].tracklist.track.duration);
                        }
                        Record.Tracks.push(nextTrack);
                    }
                    else
                    {
                        for(j=0;j<records.releases.release[i].tracklist.__cnt;j++)
                        {
                            nextTrack = new Track();
                            if(_.isString(records.releases.release[i].tracklist.track[j].title))
                            {
                                if(_.isString(records.releases.release[i].tracklist.track[j].position))
                                {
                                    nextTrack.Position = _.escape(records.releases.release[i].tracklist.track[j].position);
                                    nextTrack.Title = _.escape(records.releases.release[i].tracklist.track[j].title);
                                }
                                else
                                {
                                    nextTrack.Title = "<b>" + _.escape(records.releases.release[i].tracklist.track[j].title) + "</b>";
                                }
                                if(_.isString(records.releases.release[i].tracklist.track.duration))
                                {
                                    nextTrack.Duration = _.escape(records.releases.release[i].tracklist.track[j].duration);
                                }
                            }
                            Record.Tracks.push(nextTrack);
                        }
                    }
                }

                //Videos
                if(_.isObject(records.releases.release[i].videos))
                {
                    if(_.isString(records.releases.release[i].videos.video.title))
                    {
                        nextVideo = new Video();
                        nextVideo.URL = records.releases.release[i].videos.video._src;
                        nextVideo.Title = _.escape(records.releases.release[i].videos.video.title);
                        Record.Videos.push(nextVideo);
                    }
                    else
                    {
                        for(j=0;j<records.releases.release[i].videos.__cnt;j++)
                        {
                            nextVideo = new Video();
                            if(_.isString(records.releases.release[i].videos.video[j].title))
                            {
                                nextVideo.URL = records.releases.release[i].videos.video[j]._src;
                                nextVideo.Title = _.escape(records.releases.release[i].videos.video[j].title);
                            }
                            Record.Videos.push(nextVideo);
                        }
                    }
                }

                //Cover
                if(_.isObject(records.releases.release[i].images))
                {
                    if(_.isString(records.releases.release[i].images.image._uri))
                    {
                        nextCover = new Cover();
                        nextCover.URI = records.releases.release[i].images.image._uri;
                        nextCover.URI150 = records.releases.release[i].images.image._uri150;
                        Record.Cover.push(nextCover);
                    }
                    else
                    {
                        for(j=0;j<records.releases.release[i].images.__cnt;j++)
                        {
                            nextCover = new Cover();
                            nextCover.URI = records.releases.release[i].images.image[j]._uri;
                            nextCover.URI150 = records.releases.release[i].images.image[j]._uri150;
                            Record.Cover.push(nextCover);
                        }
                    }
                }
                else
                {
                    Record.Cover.push(new Cover());
                }

                //Add artist/title to spine
                Record.setArtistTitle();

                //Set record info
                Record.setInfo();

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
        var id, i, appendCovers = "";
        id = item.id;

        $(item).find('.cover').html('<a href="' + records[id].Cover[0].URI + '" rel="prettyPhoto[' + records[id].Title + ']" ><img src="' + records[id].Cover[0].URI150 + '" height="150" width="150" /></a>');

        if(records[id].Cover.length > 1)
        {
            for(i=1;i<records[id].Cover.length;i++)
            {
                appendCovers += '<a href="' + records[id].Cover[i].URI + '" rel="prettyPhoto[' + records[id].Title + ']" ></a>';
            }
            $(item).find('.cover').append(appendCovers);
        }

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

    function doneLoading() {
        $('#loading').hide('slow');
    }


    /* EVENTS */

    $('.spine').click(function() {
        loadCover(this);
    });

    $('#sort12').click(function() {
        $('.spine12').toggle('slow');
        if($('#sort12').text().indexOf("Hide") >= 0)
        {
            $('#sort12').text($('#sort12').text().replace("Hide","Show"));
        }
        else
        {
            $('#sort12').text($('#sort12').text().replace("Show","Hide"));
        }
    });

    $('#sort10').click(function() {
        $('.spine10').toggle('slow');
        if($('#sort10').text().indexOf("Hide") >= 0)
        {
            $('#sort10').text($('#sort10').text().replace("Hide","Show"));
        }
        else
        {
            $('#sort10').text($('#sort10').text().replace("Show","Hide"));
        }
    });

    $('#sort7').click(function() {
        $('.spine7').toggle('slow');
        if($('#sort7').text().indexOf("Hide") >= 0)
        {
            $('#sort7').text($('#sort7').text().replace("Hide","Show"));
        }
        else
        {
            $('#sort7').text($('#sort7').text().replace("Show","Hide"));
        }
    });

    $('#sortFormat').click(function() {
        var items7in, items1210in;

        items7in = $('#records').find('.spine7');
        items1210in = $('#records').find('.spine12, .spine10');

        $('.spine').detach();
        if($('#records').find('li')[0].className.indexOf("7") < 0)  //12" or 10" is first
        {
            $('#records').append(items7in);
            $('#records').append(items1210in);
        }
        else
        {
            $('#records').append(items1210in);
            $('#records').append(items7in);
        }
    });

    $('#uploadFile').change(function() {
        $('#loading').show(0);
        console.log("Uploading new data file...");
        var file, reader;
        file=document.getElementById("uploadFile").files[0];
        reader=new FileReader();

        reader.onload = function (e) {
            $.jStorage.set("vinyl", e.target.result);
            if ($.jStorage.get("vinyl") != null) {
                console.log("Done.");
                document.location.reload();
            }
        };

        reader.readAsText(file);
    });


    /* UTILITY FUNCTIONS */

    function htmlDecode(value) {
        return $('<div/>').html(value).text();
    }

    function buildList() {
        var options, recordList;
        options = {
            valueNames: [ 'artist', 'title', 'label'],
            page: 500
        };
        recordList = new List('recordList', options);
        console.log("Done.");
    }

});