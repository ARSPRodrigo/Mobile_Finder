function SearchCtrl($scope, $http) {
	$scope.url = 'search.php';
		
	$scope.search = function() {

		$http.post($scope.url, { "data" : $scope.brand}).
		success(function(data, status) {
			$scope.status = status;
			$scope.data = data;
			$scope.result = data;
		})
		.
		error(function(data, status) {
			$scope.data = data || "Request failed";
			$scope.status = status;			
		});
	};
}
