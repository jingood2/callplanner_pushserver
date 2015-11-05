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
					title: 'New Plan is created',
					message: 'host:' + req.body.host + '\nwhen:' + req.body.scheduledAt + '\ntitle:' + req.body.title + '\n\nPlease select how to join\n' ,
				    planId: req.body.planId,
                    scheduledAt: req.body.scheduledAt,
                    repeat: req.body.repeat,
                    host: req.body.host,
					type: req.body.type,
                    actions: [
					    { icon: "no", title: "I Dial", callback: "tab.no" },
						{ icon: "yes", title: "Call me", callback: "tab.yes" }
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

    });

    PushModel.on('error', function (err) {
      console.error('Push Notification error: ', err.stack);
    });

  }

  startPushServer();
};
