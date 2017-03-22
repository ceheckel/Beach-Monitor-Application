/**
 * Created by miles on 3/19/17.
 */
$(function() {
    "use strict";
    console.log("SAVING SURVEY");
    $("#createnew").click(function() {
        var survey = new Survey();

        survey.save();
    });
});