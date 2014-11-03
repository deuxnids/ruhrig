(function() {
   'use strict';

   /* Services */

   angular.module('myApp.services', [])

      // put your services here!
      // .service('serviceName', ['dependency', function(dependency) {}]);

     .factory('messageList', ['fbutil', function(fbutil) {
       return fbutil.syncArray('messages', {limit: 10, endAt: null});
     }])
     .factory('activityList', ['fbutil', function(fbutil) {
       return fbutil.syncArray('activities', {limit: 10, endAt: null});
     }])
     .factory('sectionList', ['fbutil', function(fbutil) {
       return fbutil.syncArray('sections', {limit: 10, endAt: null});
     }])
     .factory('tripList', ['fbutil', function(fbutil) {
       return fbutil.syncArray('trips', {limit: 10, endAt: null});
     }])
     .factory('activityList', ['fbutil', function(fbutil) {
       return fbutil.syncArray('activities', {limit: 10, endAt: null});
     }])
     .factory('levelList', ['fbutil', function(fbutil) {
       return fbutil.syncArray('activities', {limit: 10, endAt: null});
     }])

     .factory('timetable', ['$http', function($http) {
      return {
        a: "a",
        getConnections: function(start,stop, callback)
        {
           $http.get('http://transport.opendata.ch/v1/connections?from='+start+'&to='+stop )
            .success(callback) 
              
            .error(function(data, status, headers, config) 
              {
                console.log(data);
              })
      }
      };
      }]);



})();

