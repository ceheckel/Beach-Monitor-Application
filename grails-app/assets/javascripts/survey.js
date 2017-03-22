/**
 * Created by miles on 3/19/17.
 */
function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

Survey = function() {
    this.data = {
        beach_seq : 1234,
        monitor_site_seq : 5678,
        sample_date_time : Date.now(),
        sampler_seq : 1111,
    };

    // TODO: Finish the rest of the fields and allow the user to edit surveys / take data from current surveys

    this.key = guid();

    this.save = function(callback) {
        localforage.setItem(this.key, this.data, callback);

        Surveys.add(this, callback);
    }
}

Surveys = {};
Surveys.getAll = function(callback) {
    localforage.getItem("surveys", function(error, result) {
        if (result == null || result.length === 0)
            return callback([]);

        var surveys = [];

        for (var i = 0; i < result.length; i++)
        {
            localforage.getItem(result[i], function (error, item) {
                surveys.push(item);
                if (surveys.length === result.length)
                {
                    callback(surveys);
                }
            });
        }
    })
};

Surveys.add = function(survey, callback) {
    localforage.getItem("surveys", function(error, result) {
        var surveys = result;
        if (result == null)
            surveys = [];

        surveys.push(survey.key);

        localforage.setItem("surveys", surveys, function(settingError, newSurvey) {
            if (callback && !settingError)
                callback(newSurvey);
        });
    })
};

Surveys.getById = function(id, callback) {
    localforage.getItem(id, function(error, item) {
        if (!error)
            callback(item);
    });
};