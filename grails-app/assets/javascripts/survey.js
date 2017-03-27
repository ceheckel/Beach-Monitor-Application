Survey = function(id, data) {
    this.data = data;

    this.key = id;

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

        if (surveys.indexOf(survey.key) < 0)
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