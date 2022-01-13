(function(){
"use strict";

/**********************************************************************************************************************/
/* Use the below line to bootstrap the module */
/* var app = angular.module('viewCustom', ['angularLoad','toggleInstitutions','reportProblem']); */

/*CENTRAL_PACKAGE - comment out the below line to replace the other module definition*/
/*var app = angular.module('centralCustom', ['angularLoad']);*/

/* To load customized oadoi to local view */
/* var app = angular.module('viewCustom', ['angularLoad', 'oadoi', 'oadoiResults','hathiTrustAvailability', 'reportProblem']); */
/**********************************************************************************************************************/

var app = angular.module('viewCustom', ['angularLoad', 'externalSearch', 'availabilityCounts', 'reportProblem', 'hathiTrustAvailability']);

/* Add Google Scholar and Worldcat external search in facet pane */
/* PCSG External Search -- https://github.com/alliance-pcsg/primo-explore-external-search */
/* PCSG Availabiliy count (Primo VE) -- both externalSearch and availabilityCounts modules must in the same template because they use the same component prmFacetExactAfter */
angular.module('externalSearch', []).value('searchTargets', []).component('prmFacetAfter', {
  bindings: { parentCtrl: '<' },
  controller: ['externalSearchService', function (externalSearchService) {
    externalSearchService.controller = this.parentCtrl;
    externalSearchService.addExtSearch();
  }]
}).component('prmPageNavMenuAfter', {
  controller: ['externalSearchService', function (externalSearchService) {
    if (externalSearchService.controller) externalSearchService.addExtSearch();
  }]
}).component('prmFacetExactAfter', {
  bindings: { parentCtrl: '<' },
  template: '\n      <availability-counts></availability-counts>\n      <div ng-if="name === \'External Search\'">\n          <div ng-hide="$ctrl.parentCtrl.facetGroup.facetGroupCollapsed">\n              <div class="section-content animate-max-height-variable">\n                  <div class="md-chips md-chips-wrap">\n                      <div ng-repeat="target in targets" aria-live="polite" class="md-chip animate-opacity-and-scale facet-element-marker-local4">\n                          <div class="md-chip-content layout-row" role="button" tabindex="0">\n                              <strong dir="auto" title="{{ target.name }}">\n                                  <a ng-href="{{ target.url + target.mapping(queries, filters) }}" target="_blank">\n                                      <img ng-src="{{ target.img }}" width="22" height="22" alt="{{ target.alt }}" style="vertical-align:middle;"> {{ target.name }}\n                                  </a>\n                              </strong>\n                          </div>\n                      </div>\n                  </div>\n              </div>\n          </div>\n      </div>',
  controller: ['$scope', '$location', 'searchTargets', function ($scope, $location, searchTargets) {
    $scope.name = this.parentCtrl.facetGroup.name;
    $scope.targets = searchTargets;
    var query = $location.search().query;
    var filter = $location.search().pfilter;
    $scope.queries = Array.isArray(query) ? query : query ? [query] : false;
    $scope.filters = Array.isArray(filter) ? filter : filter ? [filter] : false;
  }]
}).factory('externalSearchService', function () {
  return {
    get controller() {
      return this.prmFacetCtrl || false;
    },
    set controller(controller) {
      this.prmFacetCtrl = controller;
    },
    addExtSearch: function addExtSearch() {
      var xx = this;
      var checkExist = setInterval(function () {

        if (xx.prmFacetCtrl.facetService.results[0] && xx.prmFacetCtrl.facetService.results[0].name != "External Search") {
          if (xx.prmFacetCtrl.facetService.results.name !== 'External Search') {
            xx.prmFacetCtrl.facetService.results.unshift({
              name: 'External Search',
              displayedType: 'exact',
              limitCount: 0,
              facetGroupCollapsed: false,
              values: undefined
            });
          }
          clearInterval(checkExist);
        }
      }, 100);
    }
  };
});
app.value('searchTargets', [{
  "name": "Worldcat",
  "url": "https://oregonstate.on.worldcat.org/search?",
  "img": "https://raw.githubusercontent.com/alliance-pcsg/primo-explore-external-search/master/worldcat-logo.png",
  "alt": "Worldcat Logo",
  mapping: function mapping(queries, filters) {
    var query_mappings = {
      'any': 'kw',
      'title': 'ti',
      'creator': 'au',
      'subject': 'su',
      'isbn': 'bn',
      'issn': 'n2'
    };
    try {
      return 'queryString=' + queries.map(function (part) {
        var terms = part.split(',');
        var type = query_mappings[terms[0]] || 'kw';
        var string = terms[2] || '';
        var join = terms[3] || '';
        return type + ':' + string + ' ' + join + ' ';
      }).join('');
    } catch (e) {
      return '';
    }
  }
}, {
  "name": "Google Scholar",
  "url": "https://scholar.google.com/scholar?q=",
  "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/200px-Google_%22G%22_Logo.svg.png",
  "alt": "Google Scholar Logo",
  mapping: function mapping(queries, filters) {
    try {
      return queries.map(function (part) {
        return part.split(",")[2] || "";
      }).join(' ');
    } catch (e) {
      return '';
    }
  }
}]);

/* Toggle institutions for Primo VE */
app.component("prmAlmaOtherMembersAfter", {
  bindings: {
  parentCtrl: "<",
  },
  controller: [
  function () {
  var ctrl = this;
  ctrl.parentCtrl.isCollapsed = true;
  },
  ],
 });

/* Add link to ILL in My Account */
app.component('prmLoansOverviewAfter', {
    bindings: { parentCtrl: '<' },
    controller: function controller($scope, $element) {},
    template: '<div class=tiles-grid-tile><div class="layout-column tile-content"layout=column><div class="layout-column tile-header"layout=column><h2 class="header-link light-text"role=button tabindex=0><span>Interlibrary Loan</span></h2></div><div class="layout-column layout-align-center-center layout-margin layout-padding message-with-icon" layout=column layout-align="center center"><span><a href="https://access.library.oregonstate.edu/illiad.dll?" target="_blank" aria-label="Link to Interlibrary Loan login" tabindex="0">Log into your ILL account</a> to check pending requests and view articles.</span></div></div></div>'
});

/* Add chat widget to header */
app.component('prmSearchBookmarkFilterAfter', {
    bindings: {},
    template: '<div class="chat"><a ng-href="http://answers.library.oregonstate.edu/widget_standalone.php?hash=848ad121b384a3768c03838752654abb" target="_blank">Live Chat</a></div>'
});

/* Add Report Problem Banner to Full Display */
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

/* Force users to login to services page */
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

/* Show search scopes by default on basic searches */
app.component('prmSearchBarAfter', {
    bindings: { parentCtrl: '<' },
    controller: 'SearchBarAfterController'
});
app.controller('SearchBarAfterController', ['angularLoad', function (angularLoad) {
    var vm = this;
    vm.parentCtrl.showTabsAndScopes = true;
}]);

/* Google Analytics */
(function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments);
    }, i[r].l = 1 * new Date();a = s.createElement(o), m = s.getElementsByTagName(o)[0];a.async = 1;a.src = g;m.parentNode.insertBefore(a, m);
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

/* Google Tag Manager */
const gtmId = 'GTM-MWMMS9V'
function addGTM(doc) {
  const newScript = doc.createElement('script')
  const scriptText = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`
  newScript.innerHTML = scriptText
  doc.head.append(newScript)

  const noscript = doc.createElement('noscript')
  const noscriptText = `<iframe src="//www.googletagmanager.com/ns.html?id=${gtmId}"
height="0" width="0" style="display:none;visibility:hidden"></iframe>`
  noscript.innerHTML = noscriptText
  doc.body.insertBefore(noscript, doc.body.firstChild) 
}
addGTM(document)

/* Add Emergency Banner, use <p>,<br/>,and <hr/> to separate messages like
  template: '<br><div id="covid-19"><p>Elsevier/ScienceDirect is experiencing widespread outages, and full-text access is not appearing for many publications at the moment.</p><hr/><p>Due to the impacts of COVID-19, Summit requesting for physical materials is no longer available but you can still sign in and request books via Interlibrary Loan. Please visit <a href="https://library.oregonstate.edu/reference">Ask a Librarian</a> for help.</p></div><br>',
*/
/* Banner for Summit service, which restored in September 2021
app.component('prmBackToLibrarySearchButtonAfter', {
  template: '<br><div id="covid-19"><p>Due to the impacts of COVID-19, Summit requesting for physical materials is no longer available but you can still sign in and request books via Interlibrary Loan. Please visit <a href="https://library.oregonstate.edu/reference">Ask a Librarian</a> for help.</p></div><br>',
  scope: {},
  bindings: { parentCtrl: '<' }
}); */

/* OADOI find open access articles */
app.constant('oadoiOptions', {
  "imagePath": "custom/01ALLIANCE_OSU-OSU/img/oa_50.png",
  "email": "library.1search@oregonstate.edu",
  "debug": false,
  "showOnResultsPage": true
});

/* OADOI */
/* Based on OaDOI Link developed by Orbis Cascade Alliance's PCSG group
  https://github.com/alliance-pcsg/primo-explore-oadoi-link
*/
angular.module('oadoi', []).component('prmFullViewServiceContainerAfter', {
  bindings: { parentCtrl: '<' },
  controller: function controller($scope, $http, $element, oadoiService, oadoiOptions) {
    this.$onInit = function () {
      $scope.oaDisplay = false; /* default hides template */
      $scope.imagePath = oadoiOptions.imagePath;
      var email = oadoiOptions.email;
      var section= $scope.$parent.$ctrl.service.scrollId;
      var obj = $scope.$ctrl.parentCtrl.item.pnx.addata;
      var debug = oadoiOptions.debug;
      if (debug) {console.log($scope.$ctrl.parentCtrl.item.pnx.addata);}
      
      // Not add && obj.hasOwnProperty("oa") to include Unpaywall OA link for as many articles, it could cause oalink is null for some
      if (obj.hasOwnProperty("doi")) {
        var doi = obj.doi[0];
        if(debug){console.log("oa " + "doi:" + doi);}

        if (doi && section=="action_list") {
          var url = "https://api.oadoi.org/v2/" + doi + "?email=" + email;

          var response = oadoiService.getOaiData(url).then(function (response) {
            if(debug){
              console.log("response from oadoiService received:");
              console.log(response);
            }
            var oalink = response.data.best_oa_location.url;
            if (debug) {console.log("oalink" + oalink);}
            if (oalink === null) {
              $scope.oaDisplay = false;
              if(debug){console.log("oaDisplay set to false (no link returned");}
              $scope.oaClass = "ng-hide";
            } else {
              if(debug){ console.log("oalink from response: " + oalink); }
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
  template: '<div style="height:50px;padding:15px;" ng-show="{{oaDisplay}}" class="{{oaClass}}"><img src="{{imagePath}}" style="float:left;height:22px;width:22px;margin-right:10px"><p style="font-weight:600;font-size:15px;color:#2c85d4;">Full text available: <a href="{{oalink}}" target="_blank" style="font-weight:600;font-size:15px;color:#2c85d4;">Open Access(via Unpaywall)</a></p></div>'
}).factory('oadoiService', ['$http', function ($http) {
  return {
    getOaiData: function getOaiData(url) {
      return $http({
        method: 'GET',
        url: url,
        cache: true
      })
    }
  }
}]).run(function ($http) {
  // Necessary for requests to succeed...not sure why
  $http.defaults.headers.common = { 'X-From-ExL-API-Gateway': undefined }
},
);

/* OADOIResults */
/* The components are case sensitive, target "oadoiResults" instead of "oadoiresults" */
angular
  .module('oadoiResults', [])
  .component('oadoiResults', {
    bindings: {parentCtrl: '<'},
    controller:
      function oadoiResultsCtrl(oadoiOptions, $scope, $element, $http) {
       this.$onInit = function () {
        var self = this;
        // get data from oadoiOptions
        var debug = oadoiOptions.debug;
        var showOnResultsPage = oadoiOptions.showOnResultsPage;

        // get the item from the component's parent controller
        var addata = $scope.$parent.$parent.$parent.$ctrl.item.pnx.addata;
        if (debug) {console.log("addata" + JSON.stringify(addata));}

        // ensure that preference is set to display
        var onFullView = $scope.$parent.$parent.$parent.$ctrl.onFullView || $scope.$parent.$parent.$parent.$ctrl.isOverlayFullView;
        self.show = showOnResultsPage && !onFullView;;
        if(!showOnResultsPage){ return; }

        try{
          // obtain doi and open access information from the item PNX (metadata)
          if(addata){
            self.doi = addata.hasOwnProperty("doi")? addata.doi[0] : null; //default to first doi (list)
            if (debug) {console.log("doi: " + self.doi);}
            self.is_oa = addata.hasOwnProperty("oa"); //true if property is present at all (regardless of value)
          }

          // if there's a doi and it's not already open access, ask the oadoi.org for an OA link
          /* not use this.doi && !this.is_oa because articles with is_oa is true can require patrons sign in */ 
          if(self.doi){
            $http.get("https://api.oadoi.org/v2/"+self.doi+"?email="+oadoiOptions.email)
              .then(function(response){
                // if there is a link, save it so it can be used in the template above
                self.best_oa_link = (response.data.best_oa_location)? response.data.best_oa_location.url : "";
              }, function(error){
                if(debug){
                  console.log(error);
                }
              });
          }
        }catch(e){
          if(debug){
            console.log("error caught in oadoiResultsCtrl: " + e);
          }
        }
      }
    },
    // 
    /*  Use oadoi-result other than oadoi-results because that's the same as the component you added within prmSearchResultAvailabilityLineAfter
      The repetition will result in Angular JS putting more <oadoi-results> copies inside <oadoi-results> on loop instead of printing your Unpaywall link
    */  
    template: `
    <oadoi-result ng-if="$ctrl.show">
      <div layout="flex" ng-if="$ctrl.best_oa_link" class="layout-row" style="margin-top: 5px;">
        <prm-icon icon-type="svg" svg-icon-set="action" icon-definition="ic_lock_open_24px"></prm-icon>
        <a class="arrow-link-button md-primoExplore-theme md-ink-ripple" style="margin-left: 3px; margin-top: 3px;"
           target="_blank" href="{{$ctrl.best_oa_link}}"><strong>Open Access(via Unpaywall)</strong></a>
        <prm-icon link-arrow icon-type="svg" svg-icon-set="primo-ui" icon-definition="chevron-right"></prm-icon>
      </div>
    </oadoi-result>`,
  });

  /* Based on the HathiTrust availabilty developed by the Orbis Cascade Alliance's PCSG
    https://www.orbiscascade.org/programs/systems/pcsg/primo-toolkit/hathitrust-availability/
  */
  app.component('prmSearchResultAvailabilityLineAfter', { template: '<hathi-trust-availability></hathi-trust-availability><oadoi-results></oadoi-results>' });
  app.value('hathiTrustAvailabilityOptions', {
    msg: 'Check for Full Text Availability at HathiTrust',
    hideOnline: false,
    hideIfJournal: false,
    ignoreCopyright: true,
    entityId: 'https://login.oregonstate.edu/idp/shibboleth'
   });

ga('create', 'UA-35760875-20');
ga('send', 'pageview');
ga('set', 'anonymizeIp', true);
})();
