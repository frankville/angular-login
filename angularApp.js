var app = angular.module("loginApp",["ngRoute","ngResource","ui.bootstrap"]);

app.run(['$rootScope', '$location', 'userInfoService', function ($rootScope, $location, userInfoService) {
    $rootScope.$on('$routeChangeStart', function (event) {
    	event.preventDefault();
	userInfoService.get(function(user){
		switch(user.role){
			case "admin": $location.path("/main"); break;
			case "customer": $location.path("/customer"); break;
			case "user": $location.path("/user"); break;
			default: $location.path("/"); 
		};
	},function(err){
		$location.path("/");
		console.log(err);
	});

    });
}]);

app.config(function($routeProvider,$locationProvider){
	$routeProvider.when("/",{
		controller: "loginController",
		templateUrl: "views/login.html"
	})
	
	.when("/main",{
		controller: "mainViewController",
		templateUrl: "views/mainView.html"
	})
	.when("/customer",{
		controller: "customerController",
		templateUrl: "views/customer.html"
	})
	.when("/user",{
		controller: "userController",
		templateUrl: "views/user.html"
	})
	.otherwise({ redirectTo:"/" });
	//$locationProvider.html5Mode(true);
});

app.factory("authService",["$resource",function($resource){
	return $resource("/login",{}, {
		login: {method:"post",params:{username: "", password: ""}, isArray:false}
	});
}]);

app.factory("authCheckService",["$resource",function($resource){
	return $resource("/isLoggedIn",{}, {
		isLoggedIn: {method:"get"}
	});
}]);

app.controller("loginController",function($scope,authService,$location,$timeout){

	  $scope.credentials = {
	    username: '',
	    password: '',
	    role: ''
	  };

	  $scope.alert = [];
	  $scope.alertCollapsed = true;
	  init();

	  function init(){
	  	 $scope.alert.push({ type: "info" , msg:"Enter your credentials" });
	  }

	  $scope.hideAlert = function(){
	  		$scope.alertCollapsed = true;
	  }

		
	  $scope.setAlert = function(type,text) {
	  	$scope.alertCollapsed = false;
	  	 $scope.alert.splice(0,1);
	  	 $scope.alert.push({ type: type , msg: text });
	  };

	  $scope.login = function (credentials) {
	  	authService.login(credentials).$promise.then(function(user){
		  	switch(user.role){
				case "admin": $location.path("/main"); break;
				case "customer": $location.path("/customer"); break;
				case "user": $location.path("/user"); break;
				default: $location.path("/"); 
			};

	  	},function(err){
	  		$scope.setAlert('danger',"El usuario y/o la contraseña no son válidos");
	  	});
	    //call to authService
	  };
});



app.factory("userInfoService",["$resource",function($resource){
	return $resource("/userInfo",{},{
		get: {method:"get"}, isArray: true
	});
}]);

app.factory("logoutService",["$resource",function($resource){
	return $resource("/logout",{}, {
		get: {method:"get"}
	});
}]);

app.controller("mainViewController",function($scope,authCheckService, userInfoService,logoutService,$location,$timeout){
	$scope.user = {};
	$scope.alert = [];
	$scope.alertCollapsed = true;

	$scope.$watch(authCheckService.query(), function (value, oldValue) {

    if(!value && oldValue) {
      console.log("Disconnect");
      $location.path('/');
    }

    if(value) {
      console.log("Connect");
      //Do something when the user is connected
    }

  }, 401);

	$scope.hideAlert = function(){
	  		$scope.alertCollapsed = true;
	}

	init();
		
	function init(){
		$scope.alert.push({type: 'info',msg: "click button to log out"});
		$scope.user = userInfoService.get(function(res){
			//its ok!

		},function(err){
			$scope.setAlert("danger","Error al pedir info de usuario "+err);
		});
	};
	  $scope.setAlert = function(type,text) {
	  	$scope.alertCollapsed = false;
	  	 $scope.alert.splice(0,1);
	  	 $scope.alert.push({ type: type , msg: text });
	  };

	$scope.logout = function(){
		logoutService.get().$promise.then(function(res){
			$location.path("/");
		},function(err){
			$scope.setAlert("danger","Error al cerrar sesión "+err);
		});
	}

});


app.controller("customerController",function($scope,authCheckService, userInfoService,logoutService,$location,$timeout){
	$scope.user = {};
	$scope.alert = [];
	$scope.alertCollapsed = true;

	$scope.$watch(authCheckService.query(), function (value, oldValue) {

    if(!value && oldValue) {
      console.log("Disconnect");
      $location.path('/');
    }

    if(value) {
      console.log("Connect");
      //Do something when the user is connected
    }

  }, 401);


	$scope.hideAlert = function(){
	  		$scope.alertCollapsed = true;
	}

	init();
		
	function init(){
		$scope.alert.push({type: 'info',msg: "click button to log out"});
		$scope.user = userInfoService.get(function(res){
			//its ok!

		},function(err){
			$scope.setAlert("danger","Error al pedir info de usuario "+err);
		});
	};


	  $scope.setAlert = function(type,text) {
	  	$scope.alertCollapsed = false;
	  	 $scope.alert.splice(0,1);
	  	 $scope.alert.push({ type: type , msg: text });
	  };


	$scope.logout = function(){
		logoutService.get().$promise.then(function(res){
			$location.path("/");
		},function(err){
			$scope.setAlert("danger","Error al cerrar sesión "+err);
		});
	}


});

app.controller("userController",function($scope,authCheckService, userInfoService,logoutService,$location,$timeout){
	$scope.user = {};
	$scope.alert = [];
	$scope.alertCollapsed = true;

	$scope.$watch(authCheckService.query(), function (value, oldValue) {

    if(!value && oldValue) {
      console.log("Disconnect");
      $location.path('/');
    }

    if(value) {
      console.log("Connect");
      //Do something when the user is connected
    }

  }, 401);


	$scope.hideAlert = function(){
	  		$scope.alertCollapsed = true;
	}

	init();
		
	function init(){
		$scope.alert.push({type: 'info',msg: "click button to log out"});
		$scope.user = userInfoService.get(function(res){
			//its ok!

		},function(err){
			$scope.setAlert("danger","Error al pedir info de usuario "+err);
		});
	};
	  $scope.setAlert = function(type,text) {
	  	$scope.alertCollapsed = false;
	  	 $scope.alert.splice(0,1);
	  	 $scope.alert.push({ type: type , msg: text });
	  };

	$scope.logout = function(){
		logoutService.get().$promise.then(function(res){
			$location.path("/");
		},function(err){
			$scope.setAlert("danger","Error al cerrar sesión "+err);
		});
	}

});