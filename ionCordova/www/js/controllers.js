angular.module('starter.controllers', [])
 
.controller('AppCtrl', function() {})

/////////////////////////////////// Device Controller///////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

.controller('DeviceCtrl', function($ionicPlatform, $scope, $cordovaDevice) {
    $ionicPlatform.ready(function() {
        $scope.$apply(function() {
            // sometimes binding does not work! :/
 
            // getting device infor from $cordovaDevice
            var device = $cordovaDevice.getDevice();
 
            $scope.manufacturer = device.manufacturer;
            $scope.model = device.model;
            $scope.platform = device.platform;
            $scope.uuid = device.uuid;
 
        });
 
    });
})

///////////////////////////////////Battery Controller///////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

.controller('BatteryCtrl', function($ionicPlatform, $rootScope, $scope, $cordovaBatteryStatus) {
 
    $ionicPlatform.ready(function() {
 
        // This code never worked on my Samsung Note III
        $rootScope.$on('$cordovaBatteryStatus:status', function(result) {
            $scope.$apply(function() {
                // sometimes binding does not work! :/
 
                $scope.batteryLevel = result.level; // (0 - 100)
                $scope.isPluggedIn = result.isPlugged; // bool
            });
        });
 
        // But this code works!!
        // $scope.onBatteryStatus = function(result) {
        //     $scope.batteryLevel = result.level; // (0 - 100)
        //     $scope.isPluggedIn = result.isPlugged; // bool
        // }
 
        // if (!$rootScope.batteryEvtAttached) {
        //     // prevent from registering multiple times
        //     // Ideally needs to be added in .run()
        //     // This is for the sake of example
 
        //      window.addEventListener('batterystatus', $scope.onBatteryStatus, false);
        //     $rootScope.batteryEvtAttached = true;
        // }
    });
})

/////////////////////////////////// Camera Controller///////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

.controller('CameraCtrl', function($ionicPlatform, $rootScope, $scope, $cordovaCamera) {
    $ionicPlatform.ready(function() {
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 100,
            targetHeight: 100,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };
 
        $scope.takePicture = function() {
            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.imgSrc = "data:image/jpeg;base64," + imageData;
            }, function(err) {
                console.log(err);
            });
        }
 
    });
})
/////////////////////////////////// Device Motion Controller///////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

.controller('MotionCtrl', function($ionicPlatform, $scope, $timeout, $cordovaDeviceMotion) {
    $ionicPlatform.ready(function() {
        // Values @ this instance
        // Get accelaration at that moment
        $cordovaDeviceMotion.getCurrentAcceleration().then(function(result) {
            $scope.X = result.x;
            $scope.Y = result.y;
            $scope.Z = result.z;
            $scope.timeStamp = result.timestamp;
        }, function(err) {
            // An error occurred. Show a message to the user
            console.log(err);
        });
 
 
        // Keep watching for change in values
        // watch Acceleration
        var options = {
            frequency: 2000
        };

        // Keep watching the acceleration params & update UI accordingly
        $scope.watch = $cordovaDeviceMotion.watchAcceleration(options);
        $scope.watch.then(
            null,
            function(error) {
                // An error occurred
            },
            function(result) {
                $scope.X = result.x;
                $scope.Y = result.y;
                $scope.Z = result.z;
                $scope.timeStamp = result.timestamp;
            });
 
        $timeout(function() {
 
            $scope.watch.clearWatch();
 
            // or
 
            // $cordovaDeviceMotion.clearWatch(watch)
            // .then(function(result) {
            //   // success
            //   }, function (error) {
            //   // error
            // });
 
        }, 10000);
 
 
    });
})

/////////////////////////////////// Notification Controller///////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

.controller('NotificationCtrl', function($ionicPlatform, $scope, $cordovaLocalNotification){
  $ionicPlatform.ready(function(){
    $scope.notify = function() {
      $cordovaLocalNotification.add({
        id:'welcome_notif',
        title:'This is a local Notification',
        text: 'Notification text'
      }).then(function(){
        console.log('Notification fired');
      })
    };
  });
})

/////////////////////////////////// Network Controller////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

.controller('NetworkCtrl', function($ionicPlatform, $rootScope, $scope, $cordovaNetwork) {
    $ionicPlatform.ready(function() {
 
        $scope.type = $cordovaNetwork.getNetwork()
        $scope.isOnline = $cordovaNetwork.isOnline()
        $scope.isOffline = $cordovaNetwork.isOffline()
 
        // listen for Online event
        $rootScope.$on('$cordovaNetwork:online', function(event, networkState) {
            console.log('The device has come online!', networkState);
            // Sync local data to your server here
        });
 
        // listen for Offline event
        $rootScope.$on('$cordovaNetwork:offline', function(event, networkState) {
            console.log('The device has gone offline!', networkState);
            // the device is offline, we need to store the data locally
        });
 
    });
})

/////////////////////////////////// Pin Dialog Controller/////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

.controller('PinCtrl', function($ionicPlatform, $scope, $cordovaPinDialog, $ionicLoading) {
    $ionicPlatform.ready(function() {
        var txt;
        $cordovaPinDialog.prompt('Enter your PIN').then(
            function(result) {
                // result
                if (result.buttonIndex === 1) {
                    // clicked OK
                    txt = 'You have entered ' + result.input1;
                    showDialog(txt);
                    $scope.pin = txt;
 
                } else {
                    // clicked Cancel
                    txt = 'You cancelled the Pin Dialog :/'
                    showDialog(txt);
                    $scope.pin = txt;
                }
            },
            function(error) {
                // error
                console.log(error);
            });
 
        function showDialog(text) {
            $ionicLoading.show({
                template: text
            });
 
            setTimeout(function() {
                $ionicLoading.hide();
            }, 2000);
        }
 
    });
})

/////////////////////////////////// Social Sharing Controller//////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

.controller('ShareCtrl', function($ionicPlatform, $scope, $cordovaSocialSharing) {
  $ionicPlatform.ready(function() {
    var message = 'Something goes here',
        subject = 'Subject goes here',
           link = 'https://www.google.fi/images/srpr/logo11w.png';

    // The native share invokes the $cordovaSocialSharing.share() which triggers the native share
    // When user selects the app to share the code with 
    // The msg, subj & link will be passed based on selected app

    $scope.nativeShare = function() {
      $cordovaSocialSharing
        .share(message,subject,link); //share via native share 
    };
  });
})

/////////////////////////////////// SQLite  Controller////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

.controller('SqliteCtrl', function($ionicPlatform, $scope, $cordovaSQLite, $sce) {
    $ionicPlatform.ready(function() {
        $scope.messages = '';
 
        var db = $cordovaSQLite.openDB({
            name: "demo.db"
        });
 
        $scope.messages = '';
        $scope.showMessage = function(msg) {
            $scope.messages += $sce.trustAsHtml('> '+msg);
        }
 
        $scope.showMessage('<b>Opened new DB</b><br/>');
 
        db.transaction(function(tx) {
 
            // Drop demo_table if it exists 
            tx.executeSql('DROP TABLE IF EXISTS demo_table');
            $scope.showMessage('<b>Dropped exsiting demo_table</b><br/>');
 
            // create table 
            tx.executeSql('CREATE TABLE IF NOT EXISTS demo_table (id integer primary key, data text, data_num integer)');
            $scope.showMessage('<b>Created demo_table</b><br/>');
 
            $scope.showMessage('<b>Inserting Sample Data</b><br/>');
            // insert sample data
            tx.executeSql("INSERT INTO demo_table (data, data_num) VALUES (?,?)", ["demo", 100], function(tx, res) {
 
                $scope.showMessage('&nbsp;&nbsp;&nbsp;insertId: ' + res.insertId + '<br/>');
                $scope.showMessage('&nbsp;&nbsp;&nbsp;rowsAffected: ' + res.rowsAffected + '<br/>');
 
            });
        });
 
    });
})

/////////////////////////////////// Toast  Controller//////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

.controller('ToastCtrl', function($ionicPlatform, $scope, $cordovaToast) {
    $ionicPlatform.ready(function() {
        $cordovaToast.showShortTop('Hello World!!');

        //allows you to show a native Toast (a little text popup) on iOS, Android and WP8.
        // It’s great for showing a non intrusive native notification which is guaranteed 
        //always in the viewport of the browser.

        $scope.showToast = function() {
            $cordovaToast
                .show('You clicked a button!!', 'long', 'center');
        }
    });
})

/////////////////////////////////// Vibration  Controller/////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

.controller('VibrateCtrl', function($ionicPlatform, $scope, $cordovaVibration, $timeout) {
    $ionicPlatform.ready(function() {
 
        $scope.vibrateDevice = function() {
            // A vibration pattern
            $cordovaVibration.vibrate(100);
 
            $timeout(function() {
                
                $cordovaVibration.vibrate(100);
 
                $timeout(function() {
                    $cordovaVibration.vibrate(100);
                }, 300);
 
            }, 300);
        }
 
    });
});




