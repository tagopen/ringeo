(function($) {
  "use strict"; // Start of use strict

  // Old browser notification
  $(function() {
    $.reject({
      reject: {
        msie: 9
      },
      imagePath: 'img/icons/jReject/',
      display: [ 'chrome','firefox','safari','opera' ],
      closeCookie: true,
      cookieSettings: {
        expires: 60*60*24*365
      },
      header: 'Ваш браузер устарел!',
      paragraph1: 'Вы пользуетесь устаревшим браузером, который не поддерживает современные веб-стандарты и представляет угрозу вашей безопасности.',
      paragraph2: 'Пожалуйста, установите современный браузер:',
      closeMessage: 'Закрывая это уведомление вы соглашаетесь с тем, что сайт в вашем браузере может отображаться некорректно.',
      closeLink: 'Закрыть это уведомление',
    });
  });

  HTMLElement.prototype.onEvent = function (eventType, callBack, useCapture) {
    this.addEventListener(eventType, callBack, useCapture);
    if (!this.myListeners) {
      this.myListeners = [];
    };
    this.myListeners.push({ eType: eventType, callBack: callBack });
    return this;
  };


  HTMLElement.prototype.removeListeners = function () {
    if (this.myListeners) {
      for (var i = 0; i < this.myListeners.length; i++) {
        this.removeEventListener(this.myListeners[i].eType, this.myListeners[i].callBack);
      };
      delete this.myListeners;
    };
  };

  $(function() {
    var triggerBttn = document.querySelectorAll( '[data-toggle="modal"]' ),
        tabControl = document.querySelector('[data-tabs-control="next"]'),
        tabItems = document.querySelectorAll('.tabs__item'),
        tabItemActive = 'tabs__item--active',
        nextTab = document.querySelector('.tabs__item--active').nextSibling.nextSibling,
        tabReset = document.querySelector('[data-tabs-control="reset"]'),
        firstTab = tabItems[0],
        selects = {},
        price = document.querySelector('.price__value'),
        descr = document.querySelector('.js-descr'),
        descrPhone = '';

    var transEndEventNames = {
        'WebkitTransition': 'webkitTransitionEnd',
        'MozTransition': 'transitionend',
        'OTransition': 'oTransitionEnd',
        'msTransition': 'MSTransitionEnd',
        'transition': 'transitionend'
      },
      transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ],
      support = { transitions : Modernizr.csstransitions };

    for (var j = 0; j < triggerBttn.length; j++) {
      var select = triggerBttn[j].nextSibling.nextSibling,
          id = select.getAttribute('id');
      selects[id] = select;
    }

    if (tabControl) {
      tabControl.onEvent( 'click', function(e) {
        e.preventDefault();
        for (var j = 0; j < tabItems.length; j++) {
          tabItems[j].classList.remove(tabItemActive);
        }
        nextTab.classList.add(tabItemActive);
        price.innerHTML = selects.condition.options[selects.condition.selectedIndex].getAttribute('data-price');
        for (var key in selects) {
          var select = selects[key],
              text = select.options[select.selectedIndex].text;
              descrPhone += text + ' ';
        }
        descr.innerHTML = descrPhone;
      });
    }

    if (tabReset) {
      tabReset.onEvent( 'click', function(e) {
        e.preventDefault();
        for (var j = 0; j < tabItems.length; j++) {
          tabItems[j].classList.remove(tabItemActive);
        }
        firstTab.classList.add(tabItemActive);
        init();
      });
    }

    function toggleOverlay(overlay) {
      if( classie.has( overlay, 'open' ) ) {
        classie.remove( overlay, 'open' );
        classie.add( overlay, 'close' );
        var onEndTransitionFn = function( ev ) {
          if( support.transitions ) {
            if( ev.propertyName !== 'visibility' ) return;
            this.removeEventListener( transEndEventName, onEndTransitionFn );
          }
          classie.remove( overlay, 'close' );
        };
        if( support.transitions ) {
          overlay.addEventListener( transEndEventName, onEndTransitionFn );
        }
        else {
          onEndTransitionFn();
        }
      }
      else if( !classie.has( overlay, 'close' ) ) {
        classie.add( overlay, 'open' );
      }
    }

    function init() {
      for (var i = 0; i < triggerBttn.length; i ++) {

        var btn = triggerBttn[i],
            targetModal = btn.getAttribute('data-target'),
            modal = document.querySelector(targetModal),
            select = btn.nextSibling.nextSibling,
            navs = document.querySelectorAll(".overlay .nav"),
            tabControl = document.querySelector('[data-tabs-control="next"]');

        if (tabControl) {
          tabControl.disabled = true;
        }

        if ( modal ) {
          var closeBttn = modal.querySelector( 'button.overlay__close' );

          closeBttn.removeListeners();
          closeBttn.onEvent( 'click', toggleOverlay.bind(null, modal) );
          btn.removeListeners();
          btn.onEvent( 'click', loadSelectInModal.bind(null, select, modal) );
          select.value = "placeholder";
          btn.innerHTML = select.options[select.selectedIndex].text;
          btn.classList.add("field__control--placeholder");

          if (i > 0) {
            select.disabled = true;
          }

          if (select.disabled == true) {
            btn.style.pointerEvents = 'none';
            btn.classList.add("field__control--disabled");
          } else {
            btn.classList.remove("field__control--disabled");
          }

          for(var j = 0; j < navs.length; j ++) {
            navs[j].innerHTML = '';
          }
        }
      }
    }

    function jsUcfirst(string) 
    {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function toTitleCase(str)
    {
      return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }

    function removeDashes(string) {
      return string.replace(/[_-]/g, " "); 
    }

    function isEmpty(obj) {
      for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
          return false;
      }
      return JSON.stringify(obj) === JSON.stringify({});
    }

    function pricesData(select) {
      var options = prices,
          currentSelectId = select.getAttribute('id'),
          data = {},
          price = {};

      for (var key in selects) {
        if (selects[key].getAttribute('id') !== currentSelectId && key !== "product_id") {
          options = options[selects[key].value];
        } else {
          break;
        }
      }

      Object.keys(options).sort().forEach(function(key) {
        if(key === "product_id") {
          var productInput = document.querySelector("#product_id");
          if (productInput) {
            productInput.value = options[key];
          }
        } else {
          var temp = jsUcfirst(removeDashes(key));
          switch (key) {
            case "works":
              temp = "Хорошее";
              break;
            case "best":
              temp = "Отличное";
              break;
            case "like_new":
              temp = "Как новый";
              break;
          }
          if (currentSelectId === "memory") {
            data[key] = temp + "ГБ";
          } else if (currentSelectId === "color") {
            data[key] = toTitleCase(temp);
          } else {
            data[key] = temp;
          }

          if (options[key] !== null && typeof options[key] !== 'object') {
            price[key] = options[key];
          }
        }
      });

       return [data, price];
    }

    function getOptions(select) {
      var optionsArray = {};

      for (var i = 0; i < select.length; i++) {
        var option = select.options[i];
        if (option.value !== "placeholder") {
          optionsArray[option.value] = option.text;
        }
      }

      return optionsArray;
    }

    function setOptions(select) {
      var pricedata = pricesData(select),
          data = pricedata[0],
          price = pricedata[1],
          placeholder = select.options[0].text,
          html = '',
          priceValue = '';

      if (select.value === "placeholder") {
        html += '<option value="placeholder">' + placeholder + '</option>';
        for (var key in data) {
          if (!isEmpty(price)) {
            for (var val in price) {
              if (val === key) {
                priceValue = ' data-price="' + price[val] + '"';
              }
            }
          }
          html += '<option value="' + key + '"' + priceValue + '>' + data[key] + '</option>';
        }

        select.innerHTML = html;
      }
      return data;
    }

    function loadSelectInModal(select, modal) {
      var 
          selectId = select.getAttribute('id'),
          nav     = modal.querySelector('.nav'),
          data = setOptions(select),
          options = getOptions(select);

      if (nav.innerHTML === "" || select.value === "placeholder") {
        nav.innerHTML = '';
        for (var key in data) {
          if (data.hasOwnProperty(key)) {

            var li = document.createElement("li"),
                a = document.createElement("a");

            li.class = "nav__item";

            a.className = "nav__link";
            a.href = "#" + selectId;
            a.setAttribute("data-option-id", key);
            a.innerHTML = data[key];
            a.addEventListener("click", setSelect.bind(a,modal));

            li.appendChild(a);
            nav.appendChild(li);
          }
        }
      }

      toggleOverlay(modal);
    }


    function setSelect(modal) {
      var target = this.getAttribute('href'),
          optionID = this.getAttribute("data-option-id"),
          select = document.querySelector(target),
          btn = select.previousSibling.previousSibling,
          navLinks = modal.querySelectorAll('.nav__link'),
          currentLink = this;


      for(var j = 0; j < navLinks.length; j ++) {
        navLinks[j].classList.remove('nav__link--active');
      }

      currentLink.classList.add('nav__link--active');

      select.value = optionID;
      btn.innerHTML = select.options[select.selectedIndex].text;
      btn.classList.remove("field__control--placeholder");
      toggleOverlay(modal);
      activeNextElement(btn);
    }

    function activeNextElement(currentBtn) {
      var nextStep = currentBtn.closest(".step__item").nextSibling.nextSibling,
          i = 0,
          tab = document.querySelector('[data-tabs-control="next"]');

      if(nextStep) {
        tab.disabled = true;
      } else {
        tab.disabled = false;
      }

      while(nextStep) {
        var btn = nextStep.querySelector('[data-toggle="modal"]') || false;
        if (btn) {
          var select = btn.nextSibling.nextSibling;

          select.value = "placeholder";
          btn.innerHTML = select.options[select.selectedIndex].text;

          if (i < 1) {
            select.disabled = false;
            btn.classList.remove("field__control--disabled");
              btn.classList.add("field__control--placeholder");
            btn.style.pointerEvents = 'auto';
          } else {
              btn.classList.add("field__control--disabled");
              btn.classList.add("field__control--placeholder");
              btn.style.pointerEvents = 'none';
              select.disabled = true;
          }
        }

        nextStep = nextStep.nextSibling.nextSibling;
        i ++;
      }
    }

    init();
  });

  // add placeholders
  $(function() {
    var $select = $('.field__select');
      $select.each(function() {
        var $this = $(this),
            $control = $this.siblings('.field__control'),
            placeholder = $this.find('option[value="placeholder"]').text();

        $control.text(placeholder);
      })
  });

})(jQuery); // End of use strict
