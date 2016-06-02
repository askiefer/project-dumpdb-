// Checks the zipcode input box for a valid zipcode (client-side validation)
$(document).ready(function () {

    $(function () {
        $('#report-form').parsley().on('field:validated', function() {
            var ok = $('.parsley-error').length === 0;
            $('.callout-success').toggleClass('hidden', !ok);
            $('.callout-warning').toggleClass('hidden', ok);
        })
        .on('form:submit', function() {
    return false; // Don't submit form for this demo
    });
    });
});
