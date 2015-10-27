angular.module('fetch.services', [])

.factory('DogFactory', function($http) {
  var processSelection = function(input) {
    console.log('in dog factory processSelection')
    return $http({
      method: 'POST',
      url: '/processSelection',
      params: {
        activity: input
      }
    }).then(function(response) {
      toggleAvail(response);
      return response;
    });
  };


  var toggleAvail = function(response) {

  };

  return {
    processSelection: processSelection
  };
})

.factory('ShelterFactory', ['$http', function($http) {

  var addDog = function(dog) {
    return $http({
        method: 'POST',
        url: '/addDog',
        params: {
        }
      })
      .then(function(resp) {

      })
  }

  return {
    addDog: addDog
  }
}])

.factory('AuthorizationFactory', ['$http', '$state', function($http, $state) {

  var login = function(user) {
    return $http({
        method: 'POST',
        url: '/login',
        params: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          password: user.password
        }
      })
      .success(function(response) {
        $state.go(response);
      });
  };

  var register = function(user) {
    return $http({
        method: 'POST',
        url: '/register',
        params: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          password: user.password
        }
      })
      .success(function(response) {
        $state.go(response);
      });
  };

  var shelterLogin = function(shelter) {
    return $http({
        method: 'POST',
        url: '/shelterLogin',
        params: {
          email: shelter.email,
          displayName: shelter.displayName,
          password: shelter.password
        }
      })
      .success(function(response) {
        $state.go(response);
      });
  };

  var shelterRegister = function(shelter) {
    return $http({
        method: 'POST',
        url: '/shelterRegister',
        params: {
          email: shelter.email,
          displayName: shelter.displayName,
          password: shelter.password
        }
      })
      .success(function(response) {
        $state.go(response);
      });
  };

  var logout = function() {

  };

  return {
    login: login,
    register: register,
    shelterLogin: shelterLogin,
    shelterRegister: shelterRegister,
    logout: logout

  };


}]);