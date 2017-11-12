$(document).ready(function() {
    console.log('javascript ready');

    $(".button-collapse").sideNav();

    // scroll thru all letters, stop on needed one, also do same on letter hover
    var alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

    function cycle($this, current, increment, alphabet, currentLet, stepTime) {
        var timer = setInterval(function() {
            current += increment;
            $this.html(alphabet[current]);
            if ((alphabet[current] == currentLet) ||  (current == 25)) {
                if (window.matchMedia("(max-width: 1024px)").matches) {
                    clearInterval(timer);
                    current = currentLet === 'A' ? 25: -1;
                    setTimeout(function() {
                        cycle($this, current, increment, alphabet, currentLet, stepTime)
                    }, 10000);
                } else {
                    clearInterval(timer);
                }
            }
        }, stepTime);
    }
    $('.changing-text span').each(function(i, v) {
        var currentLet = $(this).html();  
        var $this = $(this);
        var range = 25;
        var current = currentLet === 'A' ? 25: -1;
        var increment = range > current? 1 : -1;
        var stepTime = Math.abs(Math.floor(2000 / range));
        // initial cycle
        setTimeout(function() {
            cycle($this, current, increment, alphabet, currentLet, stepTime);
        }, 200*i);

        //loop cycle on hover
        $(this).on('mouseover', function() {
            var current = currentLet === 'A' ? 25: -1;
            cycle($this, current, increment, alphabet, currentLet, stepTime);
        });
    });
});