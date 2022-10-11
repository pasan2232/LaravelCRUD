/*==============================================================*/
// Raque Contact Form  JS
/*==============================================================*/
(function ($) {
    "use strict"; // Start of use strict
    $("#contactForm").validator().on("submit", function (event) {
        if (event.isDefaultPrevented()) {
            // handle the invalid form...
            formError();
            submitMSG(false, "Did you fill in the form properly?");
        } else {
            // everything looks good!
            event.preventDefault();

            grecaptcha.ready(function() {
                grecaptcha.execute('6LdHR8EgAAAAAHMiEzFWTwEijdHT6YqiUfvbBchl', {action: 'submit'}).then(function(token) {  
                    submitForm(token);
                });
              });         
        }
    });


    function submitForm(token){
        // Initiate Variables With Form Content
        var name = $("#name").val();
        var email = $("#email").val();
        var msg_subject = $("#msg_subject").val();
        var phone_number = $("#phone_number").val();
        var message = $("#message").val();

        var contactData = new FormData();
        contactData.append('name', name);
        contactData.append('email', email);
        contactData.append('subject', msg_subject);
        contactData.append('phone_number', phone_number);
        contactData.append('message', message);
        contactData.append('captcha', token);

        $.ajax({
            type: "POST",
            url: "/contact-us",
            method: 'post',
            processData: false,
            contentType: false,
            cache: false,
            async: false,
            dataType: 'json',
            data: contactData,
            headers:{
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success : function(data){
                $("#name").val('');
                $("#email").val('');
                $("#msg_subject").val('');
                $("#phone_number").val('');
                $("#message").val('');
                var successMessage = "Your message has been sent. Thank you!";
                var status = data.status?"success":"error";
                if(data.message){
                    successMessage = data.message;
                }

                Swal.fire('Awesome!',successMessage, status);
            },
            error: function(err) {
                var errorMessage ="Something went wrong.";
                if(err && err.responseJSON){
                    errorMessage = `${err.responseJSON.message}`;
                }
                Swal.fire('Oops!',errorMessage,'error');
            }
        });
    }

    function formSuccess(){
        $("#contactForm")[0].reset();
        submitMSG(true, "Message Submitted!")
    }

    function formError(){
        $("#contactForm").removeClass().addClass('shake animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
            $(this).removeClass();
        });
    }

    function submitMSG(valid, msg){
        if(valid){
            var msgClasses = "h4 tada animated text-success";
        } else {
            var msgClasses = "h4 text-danger";
        }
        $("#msgSubmit").removeClass().addClass(msgClasses).text(msg);
    }
}(jQuery)); // End of use strict