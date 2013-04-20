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
    beam: function (imageURI) {
        nfc.beam(
            imageURI,
            function() {console.log("sharing"); },
            function(error) { alert(JSON.stringify(error)); }
        );
    }
};
