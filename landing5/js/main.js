$(function () {
    

    $('.header__slider').slick({
        infinite: true,
        fade: true,
        asNavFor: '.slider-dots',
        nextArrow: '<img class= "slider-arrow slider-arrow__next" src="images/rarrow.svg" alt="right-arrow">',
        prevArrow: '<img class= "slider-arrow slider-arrow__prev" src="images/larrow.svg" alt="left-arrow">'
    });

    $('.slider-dots').slick({
        slidesToShow: 4,
        slidesToScroll: 4,
        asNavFor: '.header__slider'
    });
    $('.surf-slider').slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: '0px',
        nextArrow: '<img class= "slider-arrow slider-arrow__next" src="images/rarrow.svg" alt="right-arrow">',
        prevArrow: '<img class= "slider-arrow slider-arrow__prev" src="images/larrow.svg" alt="left-arrow">',
        asNavFor: '.slider-map'
    });
    $('.slider-map').slick({
        slidesToShow: 8,
        slidesToScroll: 1,
        arrows: false,
        asNavFor: '.surf-slider',
        focusOnSelect: true,

    });


    $('<div class="quantity-nav"><div class="quantity-button quantity-up"><img src="images/plus.svg" alt=""></div><div class="quantity-button quantity-down"><img src="images/minus.svg" alt=""></div></div>').insertAfter('.quantity input');
    $('.quantity').each(function () {
        var spinner = $(this),
            input = spinner.find('input[type="number"]'),
            btnUp = spinner.find('.quantity-up'),
            btnDown = spinner.find('.quantity-down'),
            min = input.attr('min'),
            max = input.attr('max');

        btnUp.click(function () {
            var oldValue = parseFloat(input.val());
            if (oldValue >= max) {
                var newVal = oldValue;
            } else {
                var newVal = oldValue + 1;
            }
            spinner.find("input").val(newVal);
            spinner.find("input").trigger("change");
        });

        btnDown.click(function () {
            var oldValue = parseFloat(input.val());
            if (oldValue <= min) {
                var newVal = oldValue;
            } else {
                var newVal = oldValue - 1;
            }
            spinner.find("input").val(newVal);
            spinner.find("input").trigger("change");
        });

    });
    $('.holder__slider,.shop__slider').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        fade: true,
        nextArrow: '<img class= "slider-arrow slider-arrow__next" src="images/rarrow.svg" alt="right-arrow">',
        prevArrow: '<img class= "slider-arrow slider-arrow__prev" src="images/larrow.svg" alt="left-arrow">',


    });

    var summs = document.querySelectorAll('.price__summ')
    var nights = document.querySelectorAll('.nights')
    var guests = document.querySelectorAll('.guests')
    
    
    $('.quantity-button').on('click', function () {
    
           
     for(let i=0;i<summs.length;i++){
        let summ = nights[i].value * summs[i].dataset.nights + (guests[i].value - 1) * summs[i].dataset.guests;
        console.log(nights[i].getAttribute('value'))
        summs[i].innerHTML = summ;
       } 
 
    })
  
    let summ = $('.nights').val() * $('.price__summ').data('nights') + ($('.guests').val() - 1) * $('.price__summ').data('guests');
    $('.price__summ').html(summ)

    $('.surfboard-box__circle').on('click',function(){
        $(this).toggleClass('active')
    })

});