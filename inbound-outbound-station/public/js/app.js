/**
 * Created by RotelandO on 18/09/2016.
 */

$(document).ready(function() {

    $('.chk_box').on('change', function(evt) {
        var atLeastOne = false;
        var checks = $('.batch-details ul input[type=checkbox]');
        $.each(checks, function(index, check) {
            if (!$(check).is(':checked')) {
                atLeastOne = true;
            }
        });
        
        if(atLeastOne) {
            $('#btnRelease').addClass('disabled');
        } else {
            $('#btnRelease').removeClass('disabled');
        }
    });
});