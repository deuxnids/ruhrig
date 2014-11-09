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
     .factory('levels', ['fbutil', function(fbutil) {
       return {
        forActivity: function(id){
          return fbutil.syncMappedArray('activities', id , 'levels', 
                                        {level:'level'}, 
                                        { name:'name' });
        }
       };
     }])

     .factory('routes', ['fbutil', function(fbutil) {
       return {
        forTrip: function(id){
          return fbutil.syncMappedArray('trips', id , 'routes', 
                                        { route:'route'}, 
                                        { start:'start',
                                          stop:'stop',
                                          duration:'duration',
                                          activity_name:'activity_name',
                                          levels:'levels' });
        }
       };
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
      }, 
      getStation: function(val)
      {
        $http.get('http://transport.opendata.ch/v1/locations', {
          params: {
            query: val,
          }
        }).then(function(response){
          return response.data.stations.map(function(item){
            return item.name;
          });
        });
      }

      };
      }]);



})();

