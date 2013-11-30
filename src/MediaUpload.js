
/**
 * Author: lmorenojr
 * Description: integrates with phonegap, and allowin to:
 * Upload media selected from:
 * - User's photo gallery (existing picture).
 * - The camera itself (taking a picture and uploading after selection) -  Video/ Pictures.
 * Supported for: Android (2.2 and up) y iOS (4.3 and up).
 * Limitations: One file upload at a time.
 */
var mediaupload = (function () {
    var isExecutingUpload = false,
        params,
        executeImageSelection,
        uploadEndPoint,
        onSelectionCancelled,
        onStart,
        onError,
        onProgress,
        onCompletion,
        isDefined,
        invokeInternalMethod,
        cleanStates,
        getImageFromGallery,
        getImageFromCamera,
        captureError,
        captureSuccess,
        captureSuccessVideo,
        processCaptureMediaFiles,
        gallerySelectionSuccess,
        uploadPhoto,
        onUploadProgress,
        onUploadError,
        onUploadSuccess;

    isDefined = function (value) {
        return (typeof(value) != 'undefined' && value !== null);
    };

    invokeInternalMethod = function (method) {
        if (isDefined(method)) {
            method();
        }
    };

    cleanStates = function () {
        isExecutingUpload = false;
        onStart = null;
        onError = null;
        onProgress = null;
        onCompletion = null;
        parameters = null;
    };

    captureError = function (error) {
        invokeInternalMethod(onSelectionCancelled);
        cleanStates();
    };

    processCaptureMediaFiles = function(isVideo, mediaFiles) {
        var i, path, name,len;
        for (i = 0, len = mediaFiles.length; i < len; i += 1) {
            name = mediaFiles[i].name;
            path = mediaFiles[i].fullPath;
            if(isVideo) {
                uploadVideo(path,name);
            } else {
                uploadPhoto(path,name);
            }
        }
    };

    captureSuccess = function (mediaFiles) {
        processCaptureMediaFiles(false, mediaFiles);
    };

    captureSuccessVideo = function (mediaFiles) {
        processCaptureMediaFiles(true, mediaFiles);
    };

    gallerySelectionSuccess = function (imageURI) {
        var filename = imageURI.substr(imageURI.lastIndexOf('/')+1);
        uploadPhoto(imageURI, filename);
    };

    onUploadProgress = function (progressEvent) {
        if (progressEvent.lengthComputable) {
            var progressPercentage = (progressEvent.loaded / progressEvent.total);
            if(isDefined(onProgress)) {
                onProgress(progressPercentage);
            }
        }
    };

    onUploadError = function (error) {
        if(isDefined(onError)) {
            onError(error.code);
        }
        cleanStates();
    };

    onUploadSuccess = function (response) {
        invokeInternalMethod(onCompletion);
        cleanStates();
    };

    uploadVideo = function (path, name) {
        if( isDefined(uploadEndPoint)) {

            var options = new FileUploadOptions();
            options.chunkedMode = false;
            options.fileName= name;

            if( isDefined (params) ) {
                options.params = params;
            }

            invokeInternalMethod(onStart);

            var transfer = new FileTransfer();
            transfer.onprogress = onUploadProgress;
            transfer.upload(path, encodeURI(uploadEndPoint), onUploadSuccess, onUploadError, options, true);

        } else {
            invokeInternalMethod(onError);
            cleanStates();
        }
    };

    uploadPhoto = function (path, name) {
        if( isDefined(uploadEndPoint)) {
            //On a few occasions Android does not include the photo's jpg extension.
            //As a best practice we make sure this is corrected.
            name = name.toLowerCase();
            if( name.indexOf(".jp") == -1) {
                name = name + ".jpg";
            }
            var options = new FileUploadOptions();
            options.chunkedMode = false;
            options.fileKey="file";
            options.fileName= name;
            options.mimeType="image/jpeg";

            if( isDefined (params) ) {
                options.params = params;
            }

            invokeInternalMethod(onStart);

            var transfer = new FileTransfer();
            transfer.onprogress = onUploadProgress;
            transfer.upload(path, encodeURI(uploadEndPoint), onUploadSuccess, onUploadError, options, true);

        } else {
            invokeInternalMethod(onError);
            cleanStates();
        }
    };

    getImageFromGallery = function() {
        navigator.camera.getPicture(gallerySelectionSuccess, captureError, {
                quality: 50,
                destinationType: navigator.camera.DestinationType.FILE_URI,
                sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
                allowEdit : true
            }
        );
    };

    getImageFromCamera = function () {
        navigator.device.capture.captureImage(captureSuccess, captureError,{limit:1});
    };

    getVideoFromCamera = function (captureSecondsLimit) {
        var options = { limit: 1, duration: captureSecondsLimit };
        navigator.device.capture.captureVideo(captureSuccessVideo, captureError, options);
    };

    executeMediaSelection = function (isVideo, endpoint, parameters, onSelectionCancelledCallback, onStartCallBack, onErrorCallback, onProgressCallback, onCompletionCallback, isLiveCapture, captureLimit) {
        if (mediaupload.isSupported() && !isExecutingUpload) {
            cleanStates();

            isExecutingUpload = true;

            uploadEndPoint = endpoint;
            onSelectionCancelled = onSelectionCancelledCallback;
            onStart = onStartCallBack;
            onError = onErrorCallback;
            onProgress = onProgressCallback;
            onCompletion = onCompletionCallback;
            params = parameters;

            if (isVideo) {
                if(isLiveCapture){
                    getVideoFromCamera(captureLimit);
                }
            } else {
                if (isLiveCapture) {
                    getImageFromCamera();
                } else {
                    getImageFromGallery();
                }
            }
        } else {
            invokeInternalMethod(onError);
        }
    };

    return {
        isSupported: function () {
            return (navigator.userAgent.match(/Android/i) ||  navigator.userAgent.match(/iPhone|iPad|iPod/i));
        },
        ImageFromGallery: function(endpoint, parameters, onSelectionCancelledCallback, onStartCallBack, onErrorCallback, onProgressCallback, onCompletionCallback) {
            executeMediaSelection(false,endpoint, parameters, onSelectionCancelledCallback, onStartCallBack, onErrorCallback, onProgressCallback, onCompletionCallback, false);
        },
        ImageFromCamera:  function(endpoint, parameters, onSelectionCancelledCallback, onStartCallBack, onErrorCallback, onProgressCallback, onCompletionCallback) {
            executeMediaSelection(false,endpoint, parameters, onSelectionCancelledCallback, onStartCallBack, onErrorCallback, onProgressCallback, onCompletionCallback, true);
        },
        VideoFromCamera:  function(endpoint, parameters, onSelectionCancelledCallback, onStartCallBack, onErrorCallback, onProgressCallback, onCompletionCallback, captureLimit) {
            executeMediaSelection(true,endpoint, parameters, onSelectionCancelledCallback, onStartCallBack, onErrorCallback, onProgressCallback, onCompletionCallback, true, captureLimit);
        }
    };

})();

