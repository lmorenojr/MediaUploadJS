#MediaUploadJS

It works as a wrapper of the JS api alredy provided by phonegap/cordova, to provide features of media (photo / video) sharing (HTTP multi-part upload).  

Tested and actively used in both Adndroid(2.2 and up)/iOS (4.3 an up).

#Requirements
MUjs' only dependency is phonegap's js library. 
Support for the Camera API can be verified by platform 
[here.](http://phonegap.com/about/feature/)

It's also useful to understand/review the camera api features/limitations for the version and platform you are working on.
Please read [here](http://docs.phonegap.com/en/3.2.0/index.html) also in case of issues.

#Limitations
Currently supports only one file selection/upload at a time.

#Usage
```javascript
var postendpoint = "http://posttestserver.com/post.php?dir=mediauploadjs";
	function onCancelledSelection() {
       alert("The user cancelled selection")
    }

    function onUploadStarted() {
    	//As an example, we display jquery's mobile loading message.
    	$.mobile.showPageLoadingMsg();
    }

    function onErrorApp(error) {
    	//As an example, we remove jquery's mobile loading message.
      $.mobile.hidePageLoadingMsg();
      	if(error !== undefined ){
      		alert("there was an error and we couldnt complete upload = " + error);
      	} else {
      		alert("there was an error and we couldnt complete upload")
      	}
    }

   	 function onProgressApp(percentage) {
    	// ideally used to display some progress indicator to the user, percentage already 
	 	// represents X of 100% value.
    }

    function onFinished() {
     	$.mobile.hidePageLoadingMsg();
    	alert("Upload Finished.");
    }

	function takeImageSnapshotAndUpload() {
		mediaupload.ImageFromCamera(postendpoint, null, onCancelledSelection, 	onUploadStarted, onErrorApp, onProgressApp, onFinished);
	}

	function takeVideoAndUpload() {
		mediaupload.VideoFromCamera(postendpoint, null, onCancelledSelection, onUploadStarted, onErrorApp, onProgressApp, onFinished);
	}

	function getExistingImageAndUpload() {
		mediaupload.ImageFromGallery(postendpoint, null,  onCancelledSelection, onUploadStarted, onErrorApp, onProgressApp, 
	}

```


#API

##Methods
### ImageFromGallery()
* endpoint
* parameters
* onSelectionCancelledCallback
* onErrorCallback
* onProgressCallback
* onCompletionCallback

### ImageFromCamera()
* endpoint
* parameters
* onSelectionCancelledCallback
* onErrorCallback
* onProgressCallback
* onCompletionCallback

### VideoFromCamera()
* endpoint
* parameters
* onSelectionCancelledCallback
* onErrorCallback
* onProgressCallback
* onCompletionCallback
* captureLimit



### Parameters
The only required parameter is `endpoint`, which is the location for our multipart post request. 

The following are all optional parameters:

* `parameters` = allows you to specify post parameters for your upload.

*	`onSelectionCancelledCallback` = expects a method (with no params). 

It is called by the library in case the user decides to cancel the process of selecting a picture(gallery or camera).

*	`onStartCallBack` = expects a method (with no params). 

It is called by the library when the upload process is started. Useful to update your app's UI and indicate the upload activity.

*	`onErrorCallback` = expects a method (with no params). 

It is called by the library in case of any unexpected error while performing an upload operation, the entire upload process is cancelled.

*	`onProgressCallback` = expects a method (with one param). 

It is called by the library during the upload process, and will indicate the current progress of the upload by passing the current progress' percentage (1-100). Useful to update your UI.

* 	`onCompletionCallback` = expects a method (with no params). 

It is called by the library once the upload process has been completed with no errors.

* 	`captureLimit` = expects an Integer value. 

It is used by the library and indicates the maximum duration of the video clip, in seconds.


#License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2013 lmorenojr

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. 