$(function() {
    $('select').styler();
    $('.ret-star').rateYo({
        rating: 5,
        starWidth: "13px",
        readOnly: true
    });

    $('.tour__slider-inner').slick({
        dots: false,
        nextArrow: '<button type="button" class="slick-btn slick-next"></button>',
        prevArrow: '<button type="button" class="slick-btn slick-prev"></button>',
        speed: 300,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [{
                breakpoint: 980,
                settings: {

                    slidesToShow: 3
                }
            },
            {
                breakpoint: 800,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 600,
                settings: {
                    dots: true,
                    slidesToShow: 1,
                    nextArrow: false,
                    prevArrow: false,

                }
            }
        ]

    });


    $('.place__inner-tabs .tab').on('click', function(event) {
        var id = $(this).attr('data-id');
        $('.place__inner-tabs').find('.tab-item').removeClass('active-tab').hide();
        $('.place__inner-tabs').find('.tab').removeClass('active');
        $(this).addClass('active');
        $('#' + id).addClass('active-tab').fadeIn();
        return false;
    });

    $('.header__menu-btn').on('click', function() {
        $('.header__menu-list').slideToggle();
    });
    $('.city__item-slider').slick({
        dots: true,
        speed: 300,
        arrows: false,
        slidesToShow: 1,
        slidesToScroll: 1,
    });

})