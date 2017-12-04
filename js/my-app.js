
var isAndroid = Framework7.prototype.device.android === true;
var isIos = Framework7.prototype.device.ios === true;

// sets up flag to check if custom analytics file exists. 
var analyticsFileExists = false;    
var consoleWarningTriggered = false;

// Set Template7 global devices flags
Template7.global = {
    android: isAndroid,
    ios: isIos
};

// Export selectors engine
var $$ = Dom7;
/*
if (isAndroid) {
    // Change class
    $$('.view .navbar-through').removeClass('navbar-through').addClass('navbar-fixed');
    // And move Navbar into Page
    $$('.view .navbar').prependTo('.view .page');
}*/

// Initialize your app
var myApp = new Framework7({
    //Enable Material theme for Android device only
    material: isAndroid ? true : false,
    //Enable Template7 pages
    template7pages: true,
    precompileTemplates: true,
    animateNavBackIcon: true,
    pushState: true,
    sortable: false, // disable sortable lists, improves performance
    swipeout: false, // not using this
    scrollTopOnNavbarClick : true
});

// Add view
var mainView = myApp.addView('.view-main', {
    // Material doesn't support it but don't worry about it
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});


// Triggers Analytics, using a custom function in js/analytics.js. 
myApp.onPageBeforeInit('*', function(page){
   
   if(analyticsFileExists){
	if(bypassAnalytics){i
	  // analytics is bypassed, and bypass is turned off ready for next pageView
	  bypassAnalytics = false;
       }else{
         var pageTitle = $$(page.navbarInnerContainer).find('.center.sliding').html();
         pingAnalytics(page.url,pageTitle);
	}
    }else if (window.console && !consoleWarningTriggered){
        console.warn('js/analytics.js does not exist. Analytics not implemented.');
        consoleWarningTriggered = true;
    }
});

// These bypass flags prevent extra pageViews when user hits back on sub children pages.
myApp.onPageBack('gcs', function(page){
  bypassAnalytics = true;
});
myApp.onPageBack('post-traumatic-amnesia', function(page){
  bypassAnalytics = true;
});

// Custom Page Initializers 

myApp.onPageInit('neuroendocrine-disorders', function(page){
    $$(page.container).find('#fluidButton').on('click', function(e){
        window.open('https://www.mdcalc.com/maintenance-fluids-calculations', '_blank')
    });
});

myApp.onPageInit('stroke', function(page){
    var aphasiaUserChoices = [false,false,false]

    $$('#comprehension_switch').on('click', function(e){
        updateAphasiaImpairments('comprehension', $$('#comprehension_switch')[0].checked, aphasiaUserChoices);
    });

    $$('#fluency_switch').on('click', function(e){
        updateAphasiaImpairments('fluency', $$('#fluency_switch')[0].checked, aphasiaUserChoices);
    });

    $$('#repetition_switch').on('click', function(e){
        updateAphasiaImpairments('repetition', $$('#repetition_switch')[0].checked, aphasiaUserChoices);
    });
})

var gcssliders = [];
myApp.onPageInit('gcs', function (page) {

    var gcs = new GCS_Scale();    // load the questions from the gcs.js model
    var gcsHTML = "";
    
    for(i=0;i<gcs.questions.length;i++){
        var q = gcs.questions[i];
        var subSectionHTML = "<div class=\"content-block-title normal-word-wrap\">" + q.title + "</div>\n\t\t" +
                            "<div class=\"swiper-container gcs-mini-slider swiper-" + i + "\" index=\"" + i +  "\">\n\t\t\t" +
                            "<div class=\"swiper-pagination\"></div>\n" + 
                            "<div class=\"swiper-wrapper\">\n\t";

        for (j=0; j < q.choices.length; j++){
            subSectionHTML += "<div class=\"swiper-slide swiper-slide-gcs\" score=\"" + q.choices[j].value + "\"><span>("+ q.choices[j].value + 
            ") " + q.choices[j].description + "</span></div>\n";
        }
        subSectionHTML += "</div>\n</div>\n";
        gcsHTML = gcsHTML + subSectionHTML;
    }
    gcsHTML = gcsHTML + "\n\n<p><a href=\"#\" id=\"resetGCSscoresButton\" class=\"button button-fill color-red button-round\">Reset Scores</a></p>";

    $$('#gcs-page-content').append(gcsHTML);
    $$('#gcsScore').html("Total: " + getSum(gcs.userScores));

    for(i=0;i<gcs.questions.length;i++){
        // Activate the slider functionality
        var targetSwiperDiv = '.swiper-'+i;

        gcssliders[i] = myApp.swiper(targetSwiperDiv, {
            pagination:'.swiper-pagination',
            grabCursor: true,
            spaceBetween: 50,
            onSlideChangeEnd: function(swiper){
                // callback function triggered when slide finishes moving
                var newScore = swiper.slides[swiper.activeIndex].getAttribute("score");
                gcs.userScores[swiper.container[0].getAttribute("index")] = parseInt(newScore);
                $$('#gcsScore').html("Total: " + getSum(gcs.userScores));
            }
        });
    }

     $$('#resetGCSscoresButton').click(function(){
        
        gcs.userScores = [6,5,4];                      // reset all user scores to max

        for(i=0;i<gcs.questions.length;i++) {
           gcssliders[i].slideTo(0, 500, false);      // move all sliders back to the first option & skip callbacks
        }

        $$('#gcsScore').html("Total: " + getSum(gcs.userScores));
    });
    
});


// Gets sum of array items
function getSum(scores){
    var sum =0;
    for (i=0; i<scores.length;i++){
        sum+= scores[i];
    }
    return sum;
}

function updateAphasiaImpairments(impairment,value, userPicks){

    if(impairment == 'fluency'){
        userPicks[0] = value
    }else if(impairment == 'comprehension'){
        userPicks[1] = value
    }else if(impairment == 'repetition'){
        userPicks[2] = value
    }else{
        alert('error with aphasia')
    }

    console.log(userPicks)
    // match that to the right aphasia
    for(i=0; i<aphasias.length; i++){
        if(aphasias[i][1].equals(userPicks)){
            // update the description label.
            $$('#aphasia_label').html(aphasias[i][0])
            console.log("match")
        } else {
            // console.log(userPicks + " != " + aphasias[i][1] )
        }
    }

}

// extend Array to compare two arrays for equality - used in Aphasia Impairments
Array.prototype.equals = function(arr){
    if(this.length !== arr.length){
        return false
    }else{
        for(j=0; j<this.length; j++){
            if(this[j] !== arr[j]){
                return false
            }
        }
        return true
    }
}

