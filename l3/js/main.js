$(function() {

    $('.testimonial__inner').slick({
        arrows: true,
        dots: false,
        autoplay: true,
        autoplaySpeed: 2300,
        infinite: false,
        nextArrow: '<button type="button" class="slick-btn slick-next"></button>',
        prevArrow: '<button type="button" class="slick-btn slick-prev"></button>',
        responsive: [{
                breakpoint: 970,
                settings: {
                    nextArrow: false,
                    prevArrow: false
                }

            },

        ]
    });

    $('.header__menu-btn').on('click', function() {
        $('.header__menu').slideToggle();
    });
});