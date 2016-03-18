$(document).ready(function() {
  $('#menu .toggle').click(function (event) {
    $(this).closest('header').find('nav').slideToggle(300)
    event.preventDefault()
  })

  $('#video').fitVids()
  $('#slider .container').unslider()

  $('#page aside > span').click(function (event) {
    $(this).nextAll('nav').slideToggle(300)
    $(this).toggleClass('on')
  })

  $('#toggle-overlay a, section .spread').click(function (event) {
    $('#overlay').animate({
      top: '0%'
    }, 400, function () {
      $('body').addClass('no-scroll')
    })

    event.preventDefault()
  })

  $('#overlay .toggle').click(function () {
    $('#overlay').animate({
      top: '100%'
    }, 400, function () {
      $('body').removeClass('no-scroll')
    })
  })

  if ($('#news')) {
    $.ajax({
      type: 'GET',
      url: 'http://davehakkens.nl/tag/preciousplastic/feed/',
      success: function (xml) {
        $(xml).find('item').each(function (index) {
          var article = $('<article />')

          var title = $(this).find('title').text()
          var description = $($(this).find('description').text())[1]
          var url = $(this).find('link').text()

          var preview = $($(this).find('description').text()).find('.wp-post-image')
          var figure = $('<figure></figure>')

          figure.append(preview)
          article.append(figure)
          article.append('<a href="' + url +  '" class="title">' + title + '</a>')

          var descText = $(description).text()

          if (descText.indexOf('-source') == -1 && descText.indexOf(title) == -1) {
            article.append('<p>' + descText + '</p>')
          }

          var news = $('#news .container:first-child')

          news.find('.loading').hide()
          news.append(article)

          if (index == 2) {
            return false;
          }
        })
      }
    })
  }

  if ($().accordion) {
    $('#page dl').accordion()
  }

  if ($().isotope) {
    var grid = $('.extras').isotope({
      itemSelector: '.item'
    })

    $('.filter nav a').click(function (e) {
      var group = $(this).attr('href').split('#')[1]
      var isActive = $(this).hasClass('active')

      grid.isotope({
        filter: isActive ? '*' : '.' + group
      })

      if( !isActive ) {
        $(this).closest('nav').find('.active').removeClass('active')
      }

      $(this).toggleClass('active')
      e.preventDefault()
    })
  }

  //var canonical = $('head link[rel="canonical"]').attr('href')
  var canonical = 'http://preciousplastic.com'
  var url = encodeURIComponent(canonical)

  var counts = [
    {
      url: 'api.facebook.com/method/links.getStats?urls=' + url + '&format=json',
      field: 'share_count'
    }
  ]

  for (var api of counts) {
    $.ajax({
      type: 'GET',
      url: 'https://' + api.url,
      success: function (response) {
        var count = parseInt(response[0][api.field])
        var previous = parseInt($('#overlay .total span').text())

        $('#overlay .total span').html(previous + count)
      }
    })
  }
})
