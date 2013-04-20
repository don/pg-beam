var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        cameraLabel.addEventListener('touchstart', app.takePicture, false);
        beamTextLabel.addEventListener('touchstart', app.beamText, false);
        beamLogoLabel.addEventListener('touchstart', app.beamLogo, false);
        app.writeSampleTextFile();
        //nfc.addNdefListener(app.onndef);
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    onndef: function(nfcEvent) {
        alert(JSON.stringify(nfcEvent.tag));
    },
    takePicture: function() {
        navigator.camera.getPicture(
            function(imageURI) { // success
                //image.src = imageURI;
                app.beam(imageURI);
                alert("Tap another Android phone to beam photo.");
            },
            function(error) { // failure
                console.log("error");
            },
            { // options
                quality: 50,
                destinationType: navigator.camera.DestinationType.FILE_URI,
                targetWidth: 320,
                targetHeight: 320,
                allowEdit: true,
                saveToPhotoAlbum: false
            }
        );
    },
    beamText: function () {
        nfc.beam(
            // Doesn't work "file:///android_asset/www/index.html",
            "file:///mnt/sdcard/foo.txt",
            function() {console.log("sharing"); },
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
            writer.write("This is a sample file for nfc beam demo.\n");
        }

        function fail(error) {
            console.log(error.code);
        }

        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
    }
};
