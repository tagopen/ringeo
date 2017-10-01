$(function() {
  $('.form').validator({focus: false}).on('submit', function (e) {
    var $form = $(this);
    if (e.isDefaultPrevented()) {
      // handle the invalid form...
    } else {
      e.preventDefault();
      $form.find(".ajax-button__btn").prop("disabled", true).addClass("ajax-button__btn--loading");

       // get values from FORM
      var form               = $form.find('[type=submit]').val(),
          name               = $form.find('[name=name]').val(),
          email              = $form.find('[name=email]').val(),
          phone              = $form.find('[name=phone]').val(),
          message            = $form.find('[name=message]').val(),
          time               = $form.find('[name=time]').val(),
          method             = $form.find('[name=method]').val(),
          range1             = $form.find('[name=range1]').val(),
          range2             = $form.find('[name=range2]').val(),
          period             = new Array(),
          material           = new Array();

      $form.find("[name^=\"period\"]:checked").each(function() {
        if ($(this).prop("checked")) {
          var radioText = $(this).siblings().text();

          period.push($.trim(radioText));
        }
      });

      $form.find("[name^=\"material\"]:checked").each(function() {
        if ($(this).prop("checked")) {
          var radioText = $(this).siblings().text();

          material.push($.trim(radioText));
        }
      });

      $.ajax({
        url: "./mail/mail.php",
        type: "POST",
        data: {
          form: $.trim(form),
          name: $.trim(name),
          phone: $.trim(phone),
          email: $.trim(email),
          method: $.trim(method),
          message: $.trim(message),
          time: $.trim(time),
          period: period,
          material: material,
          range1: range1,
          range2: range2,
        },
        cache: false,
        success: function(response) {
          setTimeout(function() {
            // remove prevent submit behaviour and disable preloading
            $form.find("[type=submit]").prop("disabled", false).addClass("ajax-button__btn--hide-loading");
            // For failed icon just replace ".done" with ".failed"
            $(".ajax-button__icon--done").addClass("ajax-button__icon--finish");
          }, 1000);
          setTimeout(function() {
            $form.find("[type=submit]").removeClass("ajax-button__btn--loading");
            $form.find("[type=submit]").removeClass("ajax-button__btn--hide-loading");
            $form.find(".ajax-button__icon").removeClass("ajax-button__icon--finish");
          }, 2000);
          
          //clear all fields
          $form.trigger("reset");
        },
        error: function() {

          setTimeout(function() {
            // remove prevent submit behaviour and disable preloading
            $form.find("[type=submit]").prop("disabled", false).addClass("ajax-button__btn--hide-loading");

            // For failed icon just replace "done" with "failed"
            $(".ajax-button__icon--failed").addClass("ajax-button__icon--finish");
          }, 1000);
          setTimeout(function() {
            $form.find("[type=submit]").removeClass("ajax-button__btn--loading");
            $form.find("[type=submit]").removeClass("ajax-button__btn--hide-loading");
            $form.find(".ajax-button__icon").removeClass("ajax-button__icon--finish");
          }, 2000);

                    $('.tabs__item--active').next().addClass('tabs__item--active').siblings('.tabs__item').removeClass('tabs__item--active');


          //clear all fields
          //$form.trigger("reset");
        },
      });
    }
  }); 
});
