var app = angular.module("loginApp",["ngRoute","ngResource","ui.bootstrap"]);

app.config(function($routeProvider,$locationProvider){
	$routeProvider.when("/",{
		controller: "loginController",
		templateUrl: "views/login.html"
	})
	
	.when("/main",{
		controller: "mainViewController",
		templateUrl: "views/mainView.html"

	})
	
	.otherwise({ redirectTo:"/" });
	//$locationProvider.html5Mode(true);
});

app.factory("authService",["$resource",function($resource){
	return $resource("/login",{}, {
		login: {method:"post",params:{username: "", password: ""}, isArray:false}
	});
}]);


app.controller("loginController",function($scope,authService,$location){

	  $scope.credentials = {
	    username: '',
	    password: ''
	  };
	  $scope.alert = {};

	  init();

	  function init(){
	  	$scope.alert = {type:"info",msg:"Enter your credentials"};
	  }

		
	  $scope.setErrorAlert = function(text) {
	    $scope.alert = {type: 'danger',msg: text};
	    $("#alertDiv").fadeIn("fast");
	    setTimeout(function(){	
	    	$("#alertDiv").fadeOut("fast");
	    },3000);
	  };

	  $scope.login = function (credentials) {
	  	console.log(credentials);
	  	authService.login(credentials).$promise.then(function(res){
	  		$location.path("/main");
	  	},function(err){
	  		$scope.setErrorAlert("error en login! "+err);
	  	});
	    //call to authService
	  };
});

app.factory("userInfoService",["$resource",function($resource){
	return $resource("/userInfo");
}]);

app.factory("logoutService",["$resource",function($resource){
	return $resource("/logout",{}, {
		get: {method:"get"}
	});
}]);

app.controller("mainViewController",function($scope,userInfoService,logoutService,$location){
	$scope.user = {};
	$scope.alert = {};

	init();
		
	function init(){
		$("#alertMain").fadeIn("fast");
		$scope.alert = {type: 'info',msg: "click button to log out"};
		$scope.user = userInfoService.get(function(res){
				
		},function(err){
			$scope.setErrorAlert("Error al pedir info de usuario "+err);
		});
	};

	  $scope.setErrorAlert = function(text) {
	    $scope.alert = {type: 'danger',msg: text};
	    $("#alertMain").fadeIn("fast");
	    setTimeout(function(){	
	    	$("#alertMain").fadeOut("fast");
	    },3000);
	  };

	$scope.logout = function(){
		logoutService.get().$promise.then(function(res){
			$location.path("/");
		},function(err){
			$scope.setErrorAlert("Error al cerrar sesión "+err);
		});
	}




});