$(function() {
  $('.form').validator({focus: false}).on('submit', function (e) {
    var $form = $(this);
    if (e.isDefaultPrevented()) {
      // handle the invalid form...
    } else {
      e.preventDefault();
      $form.find(".ajax-button__btn").prop("disabled", true).addClass("ajax-button__btn--loading");

       // get values from FORM
      var form               = $form.find('[type=submit]').attr("name"),
          product_id         = $form.find('#product_id').val(),
          phone              = $form.find('[name=phone]').val(),
          condition          = new Array();

      $form.find('.field__select').each(function() {
        condition.push($.trim($(this).val()));
      });

      $.ajax({
        url: "/new_trade_request",
        type: "POST",
        data: {
          name: $.trim(form),
          product: $.trim(product_id),
          phone: $.trim(phone),
          condition: condition
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
          
          $('.tabs__item--active').next().addClass('tabs__item--active').siblings('.tabs__item').removeClass('tabs__item--active');
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
          //clear all fields
          //$form.trigger("reset");
        },
      });
    }
  }); 
});
