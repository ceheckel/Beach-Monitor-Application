/**
 * Created by miles on 3/19/17.
 */
$(function() {
    Surveys.getAll(function(surveys) {
        console.log(surveys);
        for (var i = 0; i < surveys.length; i++)
        {
            console.log(surveys[i]);
        }
    });
});
