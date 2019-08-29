$(document).ready(function () {
    // Init
    const webcamElement = document.getElementById('webcam');
    //webcam_app()
    $('.image-section').hide();
    $('.loader').hide();
    $('#result').hide();

    $('.button').click(function(e) {
        e.preventDefault();
        setContent($(this));
    });

    function setContent($el) {
        $('.button').removeClass('active');
        $('.container_inner').hide();

        $el.addClass('active');
        $($el.data('rel')).show();
    }

    // Upload Preview
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#imagePreview').css('background-image', 'url(' + e.target.result + ')');
                $('#imagePreview').hide();
                $('#imagePreview').fadeIn(650);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }
    $("#imageUpload").change(function () {
        $('.image-section').show();
        $('#btn-predict').show();
        $('#result').text('');
        $('#result').hide();
        readURL(this);
    });

    // Predict
    $('#btn-predict').click(function () {

        // Show loading animation
        $(this).hide();
        $('.loader').show();

        var file = document.getElementById("imageUpload").files[0];
        var reader = new FileReader();
        reader.onload = function(e) {
          var image = document.createElement('img');
          image.src = e.target.result;
          let net;

          async function app() {
            console.log('Loading mobilenet..');

            // Load the model.
            net = await mobilenet.load();
            //console.log('Sucessfully loaded model');

            // Make a prediction through the model on our image.
            const result = await net.classify(image);
            //console.log(result[0]);
            // Get and display the result
            $('.loader').hide();
            $('#result').fadeIn(600);
            $('#result').text(' Result: ' + result[0]['className']);
            //console.log('Success!');
          }
          app();
        }
        reader.readAsDataURL(file);
    });

    $('#webcam-predict').click(function () {

      $('#result_web').text('');
      $('#result_web').hide();
      var webcamElement = document.getElementById('webcam');
      async function setupWebcam() {
        return new Promise((resolve, reject) => {
          const navigatorAny = navigator;
          navigator.getUserMedia = navigator.getUserMedia ||
              navigatorAny.webkitGetUserMedia || navigatorAny.mozGetUserMedia ||
              navigatorAny.msGetUserMedia;
          if (navigator.getUserMedia) {
            navigator.getUserMedia({video: true},
              stream => {
                webcamElement.srcObject = stream;
                webcamElement.addEventListener('loadeddata',  () => resolve(), false);
              },
              error => reject());
          } else {
            reject();
          }
        });
      }
      async function webcam_app() {
        console.log('Loading mobilenet..');

        // Load the model.
        net = await mobilenet.load();
        console.log('Sucessfully loaded model');

        await setupWebcam();
        i=0
        while (i==0) {
          const result = await net.classify(webcamElement);
          console.log(result)
          $('#result_web').fadeIn(600);
          $('#result_web').text(' Result: ' + result[0]['className']);
          i++
          //await tf.nextFrame();
        }
      }
      webcam_app();
    });
  });
