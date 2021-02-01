(function(){
"use strict";

/************************************* BEGIN Bootstrap Script ************************************/
/* We are a CENTRAL_PACKAGE, so use the below line to bootstrap the module */
// var app = angular.module('viewCustom', ['angularLoad','toggleInstitutions','reportProblem']);
/************************************* END Bootstrap Script ************************************/

var app = angular.module('viewCustom', ['oadoi', 'angularLoad', 'reportProblem']);
// Add Google Scholar and Worldcat search in facet pane
app.component('prmFacetExactAfter', {
    bindings: { parentCtrl: '<' },
    controller: function controller($scope) {
        console.log($scope.$parent.$ctrl.facetGroup.name);
        if ($scope.$parent.$ctrl.facetGroup.name == "tlevel") {
            this.class = "WC_show";
        } else {
            this.class = "WC_hide";
        }
        try {
            this.query = this.parentCtrl.facetService.$location.$$search.query.split(",")[2];
        } catch (e) {
            this.query = "";
        }
    },
    template: '<div class="{{$ctrl.class}}"><div aria-label="Search in Worldcat" class="section-title md-button md-primoExplore-theme md-ink-ripple layout-fill" style="" ><div class="layout-align-start-center layout-row"><h3 class="section-title-header"><span title="External Search" translate="External Search"></span></h3></div><div class="md-ripple-container"></div></div><div aria-hidden="false" class="section-content animate-max-height-variable" style=""><div class="md-chips md-chips-wrap"><div aria-live="polite" class="md-chip animate-opacity-and-scale facet-element-marker-local4"><div class="md-chip-content layout-row" role="button" tabindex="0"><strong dir="auto" title="Search Worldcat" ><a href="https://www.worldcat.org/search?qt=worldcat_org_all&q={{$ctrl.query}}" target="_blank"><img src="custom/OSU/img/worldcat.png" width="22" height="22" alt="worldcat-logo" style="vertical-align:middle;"> Search Worldcat</a></strong></div></div><div aria-live="polite" class="md-chip animate-opacity-and-scale facet-element-marker-local4"><div class="md-chip-content layout-row" role="button" tabindex="0"><strong dir="auto" title="Search Google Scholar" ><a href="https://scholar.google.com/scholar?q={{$ctrl.query}}" target="_blank"> <img src="custom/OSU/img/gscholar.png" width="22" height="22" alt="google-scholar-logo" style="vertical-align:middle;"> Google Scholar</a></strong></div></div></div></div>'
});

/* Hide/Show Summit Institutions - go live July 2018
app.component('prmAlmaMoreInstAfter', { template: '<toggle-institutions />' });
app.constant('showHideMoreInstOptions', {
	default_state: "hidden",
	show_label: "Show Summit libraries",
	hide_label: "Hide Summit libraries"
});
*/

// Add link to ILL in My Account
app.component('prmLoansOverviewAfter', {
    bindings: { parentCtrl: '<' },
    controller: function controller($scope, $element) {},
    template: '<div class=tiles-grid-tile><div class="layout-column tile-content"layout=column><div class="layout-column tile-header"layout=column><h2 class="header-link light-text"role=button tabindex=0><span>Interlibrary Loan</span></h2></div><div class="layout-column layout-align-center-center layout-margin layout-padding message-with-icon" layout=column layout-align="center center"><span><a href="https://access.library.oregonstate.edu/illiad.dll?" target="_blank" aria-label="Link to Interlibrary Loan login" tabindex="0">Log into your ILL account</a> to check pending requests and view articles.</span></div></div></div>'
});

// Add chat widget to header
app.component('prmSearchBookmarkFilterAfter', {
    bindings: {},
    template: '<div class="chat"><a ng-href="http://answers.library.oregonstate.edu/widget_standalone.php?hash=848ad121b384a3768c03838752654abb" target="_blank">Live Chat</a></div>'
});

// Add Report Problem Banner to Full Display
app.constant('reportProblemOptions', {
    message: "Having trouble accessing a resource?",
    button: "Report a Problem",
    base: "https://library.oregonstate.edu/submit-problem?"
});
angular.module('reportProblem', []).component('prmActionListAfter', {
    template: '\n    <div ng-if="show" class="bar filter-bar layout-align-center-center layout-row margin-top-medium" layout="row" layout-align="center center">\n        <span class="margin-right-small">{{ message }}</span>\n        <a ng-href="{{ link }}" target="_blank">\n            <button class="button-with-icon zero-margin md-button md-button-raised md-primoExplore-theme md-ink-ripple" type="button" aria-label="Report a Problem" style="color: #5c92bd;">\n                <prm-icon icon-type="svg" svg-icon-set="primo-ui" icon-definition="open-in-new"></prm-icon>\n                <span style="text-transform: none;">{{ button }}</span>\n                <div class="md-ripple-container"></div>\n            </button>\n        </a>\n    </div>\n    ',
    controller: ['$scope', '$location', '$httpParamSerializer', 'reportProblemOptions', function ($scope, $location, $httpParamSerializer, reportProblemOptions) {
        $scope.message = reportProblemOptions.message;
        $scope.button = reportProblemOptions.button;
        $scope.show = $location.path() === '/fulldisplay' || $location.path() === '/openurl';
        $scope.link = reportProblemOptions.base + $location.url();
    }]
});

// Force users to login to services page
/* delete $location.search().isSerivcesPage because it breaks FindIt@OSU. 1-15-2019 */
app.component('prmAuthenticationAfter', {
    bindings: { parentCtrl: '<' },
    controller: function controller($location) {
        this.$onInit = function () {
            if ($location.search().isServicesPage && !this.parentCtrl.isLoggedIn) {
                this.parentCtrl.loginService.handleLoginClick();
            }
        };
    }
});

// Show search scopes by default on basic searches
app.component('prmSearchBarAfter', {
    bindings: { parentCtrl: '<' },
    controller: 'SearchBarAfterController'
});
app.controller('SearchBarAfterController', ['angularLoad', function (angularLoad) {
    var vm = this;
    vm.parentCtrl.showTabsAndScopes = true;
}]);

// Analytics
(function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments);
    }, i[r].l = 1 * new Date();a = s.createElement(o), m = s.getElementsByTagName(o)[0];a.async = 1;a.src = g;m.parentNode.insertBefore(a, m);
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

/* Add Emergency Banner, use <p>,<br/>,and <hr/> to separate messages like
  template: '<br><div id="covid-19"><p>Elsevier/ScienceDirect is experiencing widespread outages, and full-text access is not appearing for many publications at the moment.</p><hr/><p>Due to the impacts of COVID-19, Summit requesting for physical materials is no longer available but you can still sign in and request books via Interlibrary Loan. Please visit <a href="https://library.oregonstate.edu/reference">Ask a Librarian</a> for help.</p></div><br>',
*/
app.component('prmBackToLibrarySearchButtonAfter', {
  template: '<br><div id="covid-19"><p>Due to the impacts of COVID-19, Summit requesting for physical materials is no longer available but you can still sign in and request books via Interlibrary Loan. Please visit <a href="https://library.oregonstate.edu/reference">Ask a Librarian</a> for help.</p></div><br>',
  scope: {},
  bindings: { parentCtrl: '<' }
});

//OADOI find open access articles
app.constant('oadoiOptions', {
  "imagePath": "custom/OSU/img/oa_50.png",
  "email": "library.1search@oregonstate.edu"
});

//OADOI
angular.module('oadoi', []).component('prmSearchResultAvailabilityLineAfter', {
  bindings: { parentCtrl: '<' },
  controller: function controller($scope, $http, $element, oadoiService, oadoiOptions) {
    this.$onInit = function () {
      $scope.oaDisplay = false; /* default hides template */
      $scope.imagePath = oadoiOptions.imagePath;
      var email = oadoiOptions.email;
      var item = this.parentCtrl.result;  // item data is stored in 'prmSearchResultAvailability' (its parent)
      var obj = item.pnx.addata;

      if (obj.hasOwnProperty("doi")) {
        var doi = obj.doi[0];
        console.log("doi:" + doi);

        if (doi) {
          var url = "https://api.oadoi.org/v2/" + doi + "?email=" + email;

          var response = oadoiService.getOaiData(url).then(function (response) {
            console.log("it worked");
            console.log(response);
            var oalink = response.data.best_oa_location.url;
            console.log(oalink);
            if (oalink === null) {
              $scope.oaDisplay = false;
              console.log("it's false");
              $scope.oaClass = "ng-hide";
            } else {
              $scope.oalink = oalink;
              $scope.oaDisplay = true;
              $element.children().removeClass("ng-hide"); /* initially set by $scope.oaDisplay=false */
              $scope.oaClass = "ng-show";
            }
          });
        } else {
          $scope.oaDisplay = false;
        }
      } else {
        $scope.oaClass = "ng-hide";
      }
    };
  },
  template: '\
<div style="height:50px;padding:15px;" ng-show="{{oaDisplay}}" class="{{oaClass}}"><img src="{{imagePath}}" style="float:left;height:22px;width:22px;margin-right:10px"><p style="font-weight:600;font-size:15px;color:#2c85d4;">Full text available: <a href="{{oalink}}" target="_blank" style="font-weight:600;font-size:15px;color:#2c85d4;">Open Access(via Unpaywall)</a></p></div>'
}).factory('oadoiService', ['$http', function ($http) {
  return {
    getOaiData: function getOaiData(url) {
      return $http({
        method: 'GET',
        url: url,
        cache: true
      });
    }
  };
}]).run(function ($http) {
  // Necessary for requests to succeed...not sure why
  $http.defaults.headers.common = { 'X-From-ExL-API-Gateway': undefined };
});

ga('create', 'UA-35760875-20');
ga('send', 'pageview');
ga('set', 'anonymizeIp', true);
})();
