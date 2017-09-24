/**
 * Generates a survey object with an id and data
 * @param {String} id
 *      The guid that identifies the object
 * @param data
 *      The data of the survey
 * @constructor
 */
Survey = function(id, data) {
    this.data = data;

    this.key = id;

    // Updates and saves the survey in localforage
    this.save = function(callback) {
        localforage.setItem(this.key, this.data, function(){});

        Surveys.add(this, callback);
    };

    // Deletes the survey from localforage
    this.delete = function(callback) {
        localforage.removeItem(this.key, callback);

        Surveys.remove(this.key);
    };
};

Surveys = {};

/**
 * Gets all surveys from localforage and executes a callback on results
 * @param callback
 *      The function to be executed after retreiving surveys from localforage
 */
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

/**
 * Adds a survey to the stored list of survey ids in localforage
 * @param survey
 *      The survey to be added
 * @param callback
 *      A function to be executed after adding the survey
 */
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

/**
 * Gets a survey from localforage from an id
 * @param id
 * @param callback
 *      The callback to be executed on the survey after retreiving it from localforage
 */
Surveys.getById = function(id, callback) {
    localforage.getItem(id, function(error, item) {
        if (!error)
            callback(item);
    });
};

/**
 * Removes a survey by id from localforage
 * @param id
 * @param callback
 *      The callback to be executed after removing survey from localforage
 */
Surveys.remove = function(id, callback) {
    localforage.getItem("surveys", function(error, result) {
        var index = result.indexOf(survey.key);
        if (index >= 0) {
            result.splice(index, 1);
            localforage.setItem("surveys", result, function () {
                localforage.removeItem(id, callback);
            });
        }
    });
};