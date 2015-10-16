module.exports = function (app) {
  var Notification = app.models.notification;
  var Application = app.models.application;
  var PushModel = app.models.push;

  function startPushServer() {
// Add our custom routes
    var badge = 1;


    app.post('/notify/:id', function (req, res, next) {

			console.log("Request Body: " + JSON.stringify(req.body));

			if(req.body.type == 'accept') {
				var noti = new Notification({
					title: req.body.title,
					message: "Please select how to join ",
				    planId: req.body.planId,
					tel: req.body.tel,
					type: req.body.type,
                    actions: [
												{ icon: "no", title: "Call", callback: "tab.no" },
												{ icon: "yes", title: "Take", callback: "tab.yes" }
                  ]

				}); 	
			} else {
				var noti = new Notification({
        	        title: req.body.title,
        	        message: "Launch Conference now! ",
                    image: "www/image/logo.png",
					type: req.body.type,
					planId : req.body.planId,
                    conferenceNum : req.body.conferenceNum
				});

			}

			console.log("Noti : " + JSON.stringify(noti));

        /*
			var note_action = new Notification({

				title: "CallPlanner Conference",
				message: "너 컨퍼런스에 초대됐는데 들어올꺼냐? ",
				actions: [
					{ icon: "no", title: "No", callback: "tab.plans", additionalData: {planId:"55f675a1e42223dd0dc874fa"} },
					{ icon: "yes", title: "Yes", callback: "login", additionalData: {planId: "55f675a1e42223dd0dc874fa"} },
					{ icon: "help", title: "Not yet", callback: "tab.plan-detail", additionalData: {planId:"55f675a1e42223dd0dc874fa"} }
				]
			});
		*/

      PushModel.notifyByQuery({userId: req.params.id},noti, function(err,body){
        if (err) {
          console.error('Cannot notify %j: %s', req.params.id, err.stack);
          next(err);
          return;
        }
        console.log('pushing notification to %j', req.params.id);
        //res.send(200, 'OK');
        res.status(200).send(body);
      });

/*		
      PushModel.notifyById(req.params.id, note_action, function (err) {
        if (err) {
          console.error('Cannot notify %j: %s', req.params.id, err.stack);
          next(err);
          return;
        }
        console.log('pushing notification to %j', req.params.id);
				res.send(200,'OK');
        //res.status(200).send(body);
      });
*/
    });

    PushModel.on('error', function (err) {
      console.error('Push Notification error: ', err.stack);
    });

// Pre-register an application that is ready to be used for testing.
// You should tweak config options in ./config.js

    /*
    var config = require('./config');

    var demoApp = {
      id: 'loopback-component-push-app',
      userId: 'strongloop',
      name: config.appName,

      description: 'LoopBack Push Notification Demo Application',
      pushSettings: {
        apns: {
          certData: config.apnsCertData,
          keyData: config.apnsKeyData,
          pushOptions: {
            // Extra options can go here for APN
          },
          feedbackOptions: {
            batchFeedback: true,
            interval: 300
          }
        },
        gcm: {
          serverApiKey: config.gcmServerApiKey
        }
      }
    };

    updateOrCreateApp(function (err, appModel) {
      if (err) {
        throw err;
      }
      console.log('Application id: %j', appModel.id);
    });

//--- Helper functions ---
    function updateOrCreateApp(cb) {
      Application.findOne({
          where: { id: demoApp.id }
        },
        function (err, result) {
          if (err) cb(err);
          if (result) {
            console.log('Updating application: ' + result.id);
            delete demoApp.id;
            result.updateAttributes(demoApp, cb);
          } else {
            return registerApp(cb);
          }
        });
    }

    function registerApp(cb) {
      console.log('Registering a new Application...');
      // Hack to set the app id to a fixed value so that we don't have to change
      // the client settings
      Application.beforeSave = function (next) {
        if (this.name === demoApp.name) {
          this.id = 'loopback-component-push-app';
        }
        next();
      };
      Application.register(
        demoApp.userId,
        demoApp.name,
        {
          description: demoApp.description,
          pushSettings: demoApp.pushSettings
        },
        function (err, app) {
          if (err) {
            return cb(err);
          }
          return cb(null, app);
        }
      );
    }
    */
  }

  startPushServer();
};
