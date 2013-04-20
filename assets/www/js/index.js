var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        beamCameraLabel.addEventListener('touchstart', app.takePicture, false);
        beamAlbumLabel.addEventListener('touchstart', app.choosePicture, false);
        beamTextLabel.addEventListener('touchstart', app.beamText, false);
        app.writeSampleTextFile();
    },
    takePicture: function() {
        navigator.camera.getPicture(
            function(imageURI) { // success
                app.beam(imageURI);
                alert("Tap another Android phone to beam photo.");
            },
            function(error) { // failure
                console.log("error");
            },
            { // options
                quality: 50,
                destinationType: navigator.camera.DestinationType.FILE_URI,
                saveToPhotoAlbum: false
            }
        );
    },
    choosePicture: function() {
        navigator.camera.getPicture(
            function(imageURI) { // success
                app.beam(imageURI);
                alert("Tap another Android phone to beam selected photo.");
            },
            function(error) { // failure
                console.log("error");
            },
            { // options
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                destinationType: navigator.camera.DestinationType.FILE_URI
            }
        );
    },
    beamText: function () {
        nfc.beam(
            // "file:///android_asset/www/index.html", Doesn't work
            "file:///mnt/sdcard/foo.txt",
            function() { alert("Tap another Android phone to transfer the sample text file."); },
            function(error) { alert(JSON.stringify(error)); }
        );
    },
    beamLogo: function () {
        // This fails and crashes bluetooth.  I'm guessing the because bluetooth can't access the file uri?
        nfc.beam(
            "file:///android_asset/www/img/logo.png",
            function() {console.log("sharing"); },
            function(error) { alert(JSON.stringify(error)); }
        );
    },
    beam: function (imageURI) {
        nfc.beam(
            imageURI,
            function() {console.log("sharing"); },
            function(error) { alert(JSON.stringify(error)); }
        );
    },
    writeSampleTextFile: function () {

        // write a sample text file to /mnt/sdcard/foo.txt
        // http://docs.phonegap.com/en/2.6.0/cordova_file_file.md.html#FileWriter

        function gotFS(fileSystem) {
            fileSystem.root.getFile("foo.txt", {create: true, exclusive: false}, gotFileEntry, fail);
        }

        function gotFileEntry(fileEntry) {
            fileEntry.createWriter(gotFileWriter, fail);
        }

        function gotFileWriter(writer) {
            writer.write("This is a sample file for the nfc beam demo.\n");
        }

        function fail(error) {
            console.log(error.code);
        }

        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
    }
};
