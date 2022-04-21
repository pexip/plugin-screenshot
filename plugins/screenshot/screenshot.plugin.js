(function () {
  var canvas;
  var conferenceMediatype;

  function load(participants$, conferenceDetails$) {
    console.log('Screenshot Plugin', 'Loaded');

    canvas = document.createElement('canvas');
    conferenceDetails$.subscribe((details) => {
      conferenceMediatype = details.mediaType;
    });
  }

  function openScreenshotDialog() {
    if (conferenceMediatype === 'video') {
      PEX.pluginAPI
        .openTemplateDialog({
          title: 'Select video to take a screenshot of',
          body: `<div style="display: flex; flex-wrap: wrap; justify-content: center;">
                    <select name="videoSelection" id="videoSelection" style="padding: 5px; margin: 5px; line-height: 45px; font-size: 16px; width: 120px;">
                        <option value="mainVideo" selected>Main video</option>
                        <option value="selfviewVideo">Selfview</option>
                    </select>
                    <br>
                    <button id="screenshotButton" class="dialog-button green-action-button">Take</button>
                </div>`,
        })
        .then((dialogRef) => {
          document
            .getElementById('screenshotButton')
            .addEventListener('click', () =>
              takeScreenshot(document.getElementById('videoSelection').value)
            );
          dialogRef.close$.subscribe(() => {});
        });
    } else {
      PEX.pluginAPI.openTemplateDialog({
        title: 'No video in conference to screenshot',
      });
    }
  }

  function takeScreenshot(id) {
    var videoElement = document.getElementById(id);
    if (videoElement) {
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      var ctx = canvas.getContext('2d');
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      var videoImg = canvas.toDataURL('image/png');
      var x = window.open();
      x.document.write(`<img width='100%' src="${videoImg}">`);
    }
  }

  function unload() {
    console.log('Screenshot Plugin', 'Unloaded');
  }

  PEX.pluginAPI.registerPlugin({
    id: 'screenshot-plugin-1.0',
    load: load,
    unload: unload,
    openScreenshotDialog: openScreenshotDialog,
  });
})();
