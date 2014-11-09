'use strict';

/* Controllers */

angular.module('myApp.controllers', ['firebase.utils', 'simpleLogin'])
  .controller('HomeCtrl', ['$scope', 'fbutil', 'user', 'FBURL', function($scope, fbutil, user, FBURL) {
    $scope.syncedValue = fbutil.syncObject('syncedValue');
    console.log( $scope.syncedValue );
    $scope.user = user;
    $scope.FBURL = FBURL;
  }])



  .controller('RoutesCtrl', ['$scope','FBURL','$firebase', function($scope,FBURL,$firebase) {
    /*
    var fb = new Firebase(FBURL);
    var ref = new Firebase.util.join(
      {
        ref: fb.child('activities') ,
        keyMap: {name: 'name',  levels:fb.child('levels') }
      }
    );
    $scope.levels = $firebase(ref).$asArray();
    $scope.routes = [ {activity:"climbing" }];
    $scope.activities = [ {name:"climbing" , difficulties:[{name:"technical skill"}, {name:"technical skill"}]}];
    var ref = new Firebase.util.intersection( 
    {ref:fb.child('activities/'+$scope.newSection.activity.$id+'/levels'), keyMap:{level:'level'}  }, 
    {ref:fb.child('routes') , keyMap:{ start:'start' }} )  ;
    */

    $scope.routes = [{  name:"name of route",
                        start:"start",stop:"stop",
                        duration:"10", activity:{name:"climbing"}, 
                        levels:[{name:"level_name",value:"5", help:"help text"}] }];
    $scope.activities = [{name:"climbing", levels:[{name:"level 1"}] }, {name:"biking" }]; 

    $scope.getLevels = function(){
      console.log($scope.newRoute.activity);

    };
    $scope.addRoute = function(newRoute) {
      if( newRoute ) {
        $scope.routes.$add( newRoute );
      }
    };
    $scope.removeRoute = function(route) {
        $scope.routes.$remove( route );
    };
  }])


 .controller('TripsCtrl', [ '$scope', 'tripList', 'activityList',  function($scope, tripList,activityList,routes) { 
    $scope.trips = tripList;
    $scope.activities = activityList;
    $scope.removeTrip = function(trip){
        $scope.trips.$remove(trip);
    };
    $scope.addTrip = function(newTrip){
      if (newTrip){
        $scope.trips.$add(newTrip);
      }
    };
  }])

  .controller('TripCtrl', [ '$scope', 'activityList','timetable','$http','routes','levels',  function($scope ,activityList,timetable,$http,routes,levels) { 
    $scope.activities = activityList;
    $scope.newRoute = {};
    $scope.max = 5;

    $scope.routes = routes.forTrip($scope.trip.$id); 
    $scope.selected = undefined;

    $scope.$watch('routes',function(val){
      var start = null;
      var stop = null;
      $scope.routes.$loaded().then(function(array) {
          start = array[0].start;
          stop = array[0].stop;
          timetable.getConnections(start,stop,function (data) {
            $scope.transport = data;
          });    
      });
    });

    $scope.getLocation = function(val) {
      return $http.get('http://transport.opendata.ch/v1/locations', {
        params: {
          query: val,
        }
      }).then(function(response){
        return response.data.stations.map(function(item){
          return item.name;
        });
      });
    };

    $scope.addRoute = function(newRoute){
      newRoute.route = true;
      newRoute.activity_name = newRoute.activity.name;
      $scope.routes.$add(newRoute);
    };
    $scope.removeRoute = function(route){
      $scope.routes.$remove(route);
    };
    $scope.getLevels = function(newRoute){
      $scope.newRoute.levels = levels.forActivity(newRoute.activity.$id) ;
    };
  }])

 .controller('LevelsCtrl', [ '$scope','levels',  function($scope,levels) { 

    $scope.levels = levels.forActivity($scope.activity.$id);
    $scope.addLevel = function(newLevel) {
      if( newLevel ) {
        newLevel.level = true;
        $scope.levels.$add(newLevel);
      }
    };
    $scope.removeLevel = function(level) {
      $scope.levels.$remove(level);
    };
  }])

  .controller('ActivitiesCtrl', ['$scope', 'activityList', 'FBURL',function($scope, activityList) {

   $scope.activities = activityList;
   //$scope.activities = [ {name:"name of activity"} ];

   $scope.addActivity = function(newActivity) {
      if( newActivity ) {
        $scope.activities.$add( newActivity );
      }
    };
    $scope.removeActivity = function(activity) {
        $scope.activities.$remove( activity );
    };
  }])

  .controller('LoginCtrl', ['$scope', 'simpleLogin', '$location', function($scope, simpleLogin, $location) {
    $scope.email = null;
    $scope.pass = null;
    $scope.confirm = null;
    $scope.createMode = false;

    $scope.login = function(email, pass) {
      $scope.err = null;
      simpleLogin.login(email, pass)
        .then(function(/* user */) {
          $location.path('/home');
        }, function(err) {
          $scope.err = errMessage(err);
        });
    };

    $scope.createAccount = function() {
      $scope.err = null;
      if( assertValidAccountProps() ) {
        simpleLogin.createAccount($scope.email, $scope.pass)
          .then(function(/* user */) {
            $location.path('/account');
          }, function(err) {
            $scope.err = errMessage(err);
          });
      }
    };

    function assertValidAccountProps() {
      if( !$scope.email ) {
        $scope.err = 'Please enter an email address';
      }
      else if( !$scope.pass || !$scope.confirm ) {
        $scope.err = 'Please enter a password';
      }
      else if( $scope.createMode && $scope.pass !== $scope.confirm ) {
        $scope.err = 'Passwords do not match';
      }
      return !$scope.err;
    }

    function errMessage(err) {
      return angular.isObject(err) && err.code? err.code : err + '';
    }
  }])

  .controller('AccountCtrl', ['$scope', 'simpleLogin', 'fbutil', 'user', '$location',
    function($scope, simpleLogin, fbutil, user, $location) {
      // create a 3-way binding with the user profile object in Firebase
      var profile = fbutil.syncObject(['users', user.uid]);
      profile.$bindTo($scope, 'profile');

      // expose logout function to scope
      $scope.logout = function() {
        profile.$destroy();
        simpleLogin.logout();
        $location.path('/login');
      };

      $scope.changePassword = function(pass, confirm, newPass) {
        resetMessages();
        if( !pass || !confirm || !newPass ) {
          $scope.err = 'Please fill in all password fields';
        }
        else if( newPass !== confirm ) {
          $scope.err = 'New pass and confirm do not match';
        }
        else {
          simpleLogin.changePassword(profile.email, pass, newPass)
            .then(function() {
              $scope.msg = 'Password changed';
            }, function(err) {
              $scope.err = err;
            })
        }
      };

      $scope.clear = resetMessages;

      $scope.changeEmail = function(pass, newEmail) {
        resetMessages();
        profile.$destroy();
        simpleLogin.changeEmail(pass, newEmail)
          .then(function(user) {
            profile = fbutil.syncObject(['users', user.uid]);
            profile.$bindTo($scope, 'profile');
            $scope.emailmsg = 'Email changed';
          }, function(err) {
            $scope.emailerr = err;
          });
      };

      function resetMessages() {
        $scope.err = null;
        $scope.msg = null;
        $scope.emailerr = null;
        $scope.emailmsg = null;
      }
    }
  ]);