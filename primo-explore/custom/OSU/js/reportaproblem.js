// Add Report Problem Banner to Full Display
app.constant('reportProblemOptions', {
    message: "Having trouble accessing a resource?",
    button: "Report a Problem",
    base: "https://library.oregonstate.edu/submit-problem?"
  });
  angular.module('reportProblem', []).component('prmActionListAfter', {
    template: '\n    <div ng-if="show" class="bar filter-bar layout-align-center-center layout-row margin-top-medium" layout="row" layout-align="center center">\n        <span class="margin-right-small">{{ message }}</span>\n        <a ng-href="{{ link }}" target="_blank">\n            <button class="button-with-icon zero-margin md-button md-button-raised md-primoExplore-theme md-ink-ripple" type="button" aria-label="Report a Problem" style="color: #5c92bd;">\n                <prm-icon icon-type="svg" svg-icon-set="primo-ui" icon-definition="open-in-new"></prm-icon>\n                <span style="text-transform: none; font-size: 16px;">{{ button }}</span>\n                <div class="md-ripple-container"></div>\n            </button>\n        </a>\n    </div>\n    ',
      controller: ['$scope', '$location', '$httpParamSerializer', 'reportProblemOptions',
        function ($scope, $location, $httpParamSerializer, reportProblemOptions) {
          $scope.message = reportProblemOptions.message
          $scope.button = reportProblemOptions.button
          $scope.show = $location.path() === '/fulldisplay' || $location.path() === '/openurl'
          $scope.link = reportProblemOptions.base + $location.url()
    }]
  });
  