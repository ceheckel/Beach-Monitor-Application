/**
 * Generates a survey object with an id and data
 * @param {String} id
 *      The guid that identifies the object
 * @param data
 *      The data of the survey
 * @constructor
 */
Survey = function(id, data) {
    this.key = id;
    this.data = data;

    // Updates and saves the survey in localforage
    this.save = function(callback) {
        localforage.setItem(this.key, this.data, function(){});

        Surveys.add(this, callback);
    };

    // Deletes the survey from localforage
    this.delete = function(callback) {
        localforage.removeItem(this.key, callback);
        Surveys.remove(this.key, null);
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

        // if key is less than zero, survey is new.  Add to localforage
        if (surveys.indexOf(survey.key) < 0) {
            surveys.push(survey.key);
        }

        localforage.setItem("surveys", surveys, function(settingError, newSurvey) {
            if (callback && !settingError)
                callback(newSurvey);
        });
    });
};

/**
 * Gets a survey from localforage from an id
 * @param id
 * @param deferred
 *      The promise that will be resolved/rejected
 * @param callback
 *      The callback to be executed on the survey after retrieving it from localforage
 */
Surveys.getById = function(id, deferred, callback) {
    localforage.getItem(id, function(error, item) {
        if (!error) {
            callback(item);

            if(deferred != null) {
                deferred.resolve();
            }
        }
        else {
            if(deferred != null) {
                deferred.reject();
            }
        }
    });
};

/**
 * Removes a survey by id from localforage
 * @param id
 * @param callback
 *      The callback to be executed after removing survey from localforage
 */
Surveys.remove = function(id, callback) {
    // getItem("surveys" ...) returns IDs of all surveys
    // IDs stored in result
    localforage.getItem("surveys", function(error, result) {
        // find index of survey to be removed
        var index = result.indexOf(id);
        if (index >= 0) {
            // omit "removed" survey from existing surveys list
            result.splice(index, 1);
            // reset array of survey IDs in localforage to exclude the survey we want to delete
            localforage.setItem("surveys", result, function () {
                localforage.removeItem(id, function() {
                    if (!error) {
                        callback(result);
                    }
                })
            });
        }
    });
};