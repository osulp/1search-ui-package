// Add link to ILL in My Account
app.component('prmLoansOverviewAfter', {
    bindings: { parentCtrl: '<' },
    controller: function controller($scope, $element) {},
    template: '<div class=tiles-grid-tile><div class="layout-column tile-content"layout=column><div class="layout-column tile-header"layout=column><h2 class="header-link light-text"role=button tabindex=0><span>Interlibrary Loan</span></h2></div><div class="layout-column layout-align-center-center layout-margin layout-padding message-with-icon" layout=column layout-align="center center"><span><a href="https://access.library.oregonstate.edu/illiad.dll?" target="_blank" aria-label="Link to Interlibrary Loan login" tabindex="0">Log into your ILL account</a> to check pending requests and view articles.</span></div></div></div>'
});
