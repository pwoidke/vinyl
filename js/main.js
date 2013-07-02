
var Record = function(id) {
    //State
    this.id         =       id;
    this.spine      =       $('#' + this.id + '.spine');
    this.Artist     =		"(No Artist)";
    this.Title      = 		"(No Title)";
    this.Label      = 		"(None)";
    this.Format     = 		"(None)";
    this.Cover      =		[];
    this.Details    =		"";
    this.Notes      =		"";
    this.Tracks     =		[];
    this.Videos     =		[];
};

Record.prototype = function() {
    //Private
    var createHTML = function(id) {
            $('.records').append('<li class="spine" id="' + id + '" style="background-color: ' + 'rgb(' + (Math.floor((200)*Math.random())) + ',' + (Math.floor((200)*Math.random())) + ',' + (Math.floor((200)*Math.random())) + ')' + '"><h3 class="artist-title"></h3><div class="info"><div class="infoLeft"><div class="cover"></div></div><div class="infoRight"><div class="artist"></div><div class="title"></div><div class="label"></div><div class="format"></div><div class="details"></div><div class="notes"></div></div><div class="tracks"><ul class="trackList"><li>No track information :(</li></ul></div><div class="videos"><ul class="videoList"><li>No videos :(</li></ul></div></div></li>');
        },

        setArtistTitle = function () {
            $('#' + this.id + '.spine .artist-title').html(this.Artist + " - " + this.Title);
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
                $(item).find('ul.trackList').text('');
                _.each(this.Tracks, function(track){
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
            if(this.Videos.length > 0)
            {
                $(item).find('ul.videoList').text('');
                _.each(this.Videos, function(video){
                    $(item).find('ul.videoList').append('<li><a href="' + video.URL + '" rel="prettyPhoto[' + item.Title + ' Videos]" title="' + video.Title + '">' + video.Title + '</a></li>');
                });
            }
        };

    //Public
    return {
        createHTML: createHTML,
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

    $('.records').accordion({
        header: "h3",
        collapsible: true,
        heightStyle: "content",
        active: false
    });

    function AddRecord(id) {
        var record = new Record(id);
        record.createHTML(id);
        return record;
    }

    function buildRecords(length) {
        var i, j, Record, infoArray, nextTrack, nextVideo, nextCover, Records = [];

        $('ol.records').empty();

        /* Add records to list */
        for(i=0;i<length;i++)
        {
            try
            {
                Record = new AddRecord(i);

                /* Set object properties */

                //Artist
                if(_.isString(records.releases.release[i].artists.artist.name))
                {
                    Record.Artist = records.releases.release[i].artists.artist.name;
                }
                else if(_.isString(records.releases.release[i].artists.artist[0].name))
                {
                    infoArray = _.map(records.releases.release[i].artists.artist, function(artist){ return artist.name; });
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
                    Record.Label = records.releases.release[i].labels.label._name;
                }
                else if(_.isString(records.releases.release[i].labels.label[0]._name))
                {
                    infoArray = _.map(records.releases.release[i].labels.label, function(label){ return label._name; });
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
                }
                else if(_.isObject(records.releases.release[i].formats.format))
                {
                    if(_.isString(records.releases.release[i].formats.format._text))
                    {
                        Record.Format = records.releases.release[i].formats.format._name + " (" + records.releases.release[i].formats.format._text + ")";
                    }
                    else if(_.isString(records.releases.release[i].formats.format._name))
                    {
                        Record.Format = records.releases.release[i].formats.format._name;
                    }
                }
                else { console.log('Error: Format'); }

                //Details
                if(_.isString(records.releases.release[i].notes))
                {
                    Record.Details = htmlDecode(records.releases.release[i].notes);
                }

                //Notes
                if(_.isObject(records.releases.release[i].Collection_Notes[0]))
                {
                    infoArray = _.map(records.releases.release[i].Collection_Notes, function(notes){ return htmlDecode(notes) + " "; });
                    Record.Notes = infoArray.join(", ");
                }
                else if(_.isString(records.releases.release[i].Collection_Notes))
                {
                    Record.Notes = records.releases.release[i].Collection_Notes;
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
        var id, i;
        id = item.id;

        $(item).find('.cover').html('<a href="' + records[id].Cover[0].URI + '" rel="prettyPhoto[' + records[id].Title + ']" ><img src="' + records[id].Cover[0].URI150 + '" height="150" width="150" /></a>');

        for(i=1;i<records[id].Cover.length;i++)
        {
            $(item).find('.cover').append('<a href="' + records[id].Cover[i].URI + '" rel="prettyPhoto[' + records[id].Title + ']" ></a>');
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
        $('.loading').hide('slow');
    }


    /* EVENTS */

    $('.spine').click(function() {
        loadCover(this);
    });

    //TODO: Add loading spinner to file upload
    $('#uploadFile').change(function() {
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
            valueNames: [ 'artist', 'title', 'label', 'format' ],
            page: 500
        };
        recordList = new List('recordList', options);
        console.log("Done.");
    }

});