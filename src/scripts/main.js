$(document).ready(function() {
    console.log('javascript ready');
    $('.cover').fadeOut();

    $(".button-collapse").sideNav();
    $('.scrollspy').scrollSpy({
        scrollOffset: 5
    });
    $('.scrollspy-mobile').scrollSpy({
        scrollOffset: 5
    });

    // scroll thru all letters, stop on needed one, also do same on letter hover
    var alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    var times = 10;

    // cycle through random letters however many times "times" says then end up on the correct letter in the end
    function cycle($this,  current, increment, alphabet, currentLet, stepTime) {
        var timer = setInterval(function() {
            //$this.addClass('active');//
            var rndLetter = Math.floor((Math.random() * 25));

            current += increment;

            $this.html(alphabet[rndLetter]);

            if (current == times) {
                $this.html(currentLet);
                //$this.removeClass('active');
                clearInterval(timer);
                current = 0;
                setTimeout(function() {
                    cycle($this, current, increment, alphabet, currentLet, stepTime)
                }, 10000);
            }
        }, stepTime);
    }

    $('.changing-text span').each(function(i, v) {
        var $this = $(this);

        // start off name as all random letters
        var rndLetter = Math.floor((Math.random() * 25));
        $this.html(alphabet[rndLetter]);

        var currentLet = $this.data('letter');  
        
        var range = times;
        var current = 0;
        var increment = 1;
        var stepTime = Math.abs(Math.floor(800 / range));
        // initial cycle
        setTimeout(function() {
            cycle($this,  current, increment, alphabet, currentLet, stepTime);
        }, 100*i);

        //loop cycle on hover
        $this.on('mouseover', function() {
            var current = 0;
        cycle($this, current, increment, alphabet, currentLet, stepTime);
        });
    });

    // stagger fade in cards b/c it looks sexy
    var options = [
        {selector: '#about-stagger', offset: 500, callback: function(el) {
            Materialize.showStaggeredList($(el));
        } },
        {selector: '#inner-about-stagger', offset: 500, callback: function(el) {
            // Materialize.showStaggeredList($(el));
        } },
        {selector: '#skills-stagger', offset: 500, callback: function(el) {
            Materialize.showStaggeredList($(el));
        } },
        {selector: '#inner-skills-stagger', offset: 500, callback: function(el) {
            // Materialize.showStaggeredList($(el));
        } },
        {selector: '#inner-skills-stagger', offset: 510, callback: function(el) {
            // Materialize.showStaggeredList($(el));
        } }
    ];
    Materialize.scrollFire(options);

});

// on mobile orientation change, reload
$(window).on('orientationchange', function() {
    location.reload();
});


// on scroll - see when body reaches top to slide down header
$(document).on('scroll', function () {
    var $nav = $('.navbar-fixed nav');

    if ($('.body-container.row').offset().top - $(window).scrollTop() <= 100) {
        $nav.addClass('slidedown');
    } else {
        $nav.removeClass('slidedown');
    }
});