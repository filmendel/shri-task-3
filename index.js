(function () {
    
    /*  
        Все новое находится в applyFilter
        applyFilterToPixel удалена
        Интервал обновления кадров увеличен до 40мс
    */
    
    var video = document.querySelector('.camera__video'),
        canvas = document.querySelector('.camera__canvas');

    var getVideoStream = function (callback) {
        navigator.getUserMedia = navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia;

        if (navigator.getUserMedia) {
            navigator.getUserMedia({video: true},
                function (stream) {
                    video.src = window.URL.createObjectURL(stream);                    
                    video.onloadedmetadata = function (e) {
                        video.play();
                        callback();                        
                    };
                },
                function (err) {
                    console.log("The following error occured: " + err.name);
                }
            );
        } else {
            console.log("getUserMedia not supported");
        }
    };    

    var applyFilter = function () {
        filterName = document.querySelector('.controls__filter').value;
        var filter = filters[filterName];
        var img = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);        
        for (var i = 0; i < img.data.length; i += 4) {
            var curpixel = [img.data[i], img.data[i + 1], img.data[i + 2]];
            var newpixel = filter(curpixel);
            img.data[i] = newpixel[0];
            img.data[i + 1] = newpixel[1];
            img.data[i + 2] = newpixel[2];
        }
        canvas.getContext('2d').putImageData(img, 0, 0);
    };

    var captureFrame = function () {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;       
        canvas.getContext('2d').drawImage(video, 0, 0);
        applyFilter();
    };

    getVideoStream(function () {
        captureFrame();
        setInterval(captureFrame, 16);
    });        
    
    var filters = {
        invert: function (pixel) {
            pixel[0] = 255 - pixel[0];
            pixel[1] = 255 - pixel[1];
            pixel[2] = 255 - pixel[2];

            return pixel;
        },
        grayscale: function (pixel) {
            var r = pixel[0];
            var g = pixel[1];
            var b = pixel[2];
            var v = 0.2126 * r + 0.7152 * g + 0.0722 * b;

            pixel[0] = pixel[1] = pixel[2] = v;

            return pixel;
        },
        threshold: function (pixel) {
            var r = pixel[0];
            var g = pixel[1];
            var b = pixel[2];
            var v = (0.2126 * r + 0.7152 * g + 0.0722 * b >= 128) ? 255 : 0;
            pixel[0] = pixel[1] = pixel[2] = v;

            return pixel;
        }
    };
    
})();
