function fadeOut(_, element) {
  var elementTop = $(element).offset().top;
  var elementBottom = elementTop + $(element).outerHeight(true);
  var offset = 300;

  function refresh() {
    var scrollTop = $(window).scrollTop() + offset;

    if (scrollTop  > elementBottom) {
      var blub = scrollTop - elementBottom;
      var value = Math.min(blub / offset, 1);

      // console.log(value);
      $(element).css('background-color', 'rgba(220, 220, 220 , ' + value + ')')
    } else {
      $(element).css('background-color', '#fff')
    }
  }

  refresh()
  $(window).scroll(refresh);
}

function fadeIn(_, element) {
  var elementTop = $(element).offset().top;
  var offset = 150;

  function refresh() {
    var scrollBottom = $(window).scrollTop() + $(window).height() - offset;
    console.log(elementTop)
    console.log(scrollBottom)

    if (scrollBottom > elementTop) {
      var blub = scrollBottom - elementTop;
      console.log('blub', blub);
      var value = 1- Math.max(blub / offset, 0);
      console.log('value', value);

      // console.log(value);
      $(element).css('background-color', 'rgba(220, 220, 220 , ' + value + ')')
    } else {
      $(element).css('background-color', 'rgba(220, 220, 220, 1)')
    }
  }

  refresh()
  $(window).scroll(refresh);
}

$(document).ready(function () {
  $('[data-fade-out]').each(fadeOut);
  $('[data-fade-in]').each(fadeIn);
});

