var echonest = require('../helpers/echonest');
var youtube = require('../helpers/youtube');

module.exports = {

  findNextSong: function(req, res) {

    var attempts = 0;

    var tryNext = function() {
      
      if (attempts > 4) {
        res.sendStatus(500);
        return;
      }

      var handleEchonestSong = function(err, song) {
        if (err) {
          handleError(err);
        } else {
          youtube.searchYoutube(song, handleYoutubeResults);
        }
      };

      var handleYoutubeResults = function(err, song) {
        if (err) {
          handleError(err);
        } else {
          youtube.checkDurations(song, handleCheckDurations)
        }
      };

      var handleCheckDurations = function(err, song) {
        if (err) {
          handleError(err);
        } else {
          res.send({song: {
            ytid: song.ytid
          }});
        }
      };

      var handleError = function(err) {
        console.log(err);
        attempts++;
        tryNext();
      };

      echonest.getNextSong(req.query.sessionId, handleEchonestSong);

    //   songController.song(req.query.sessionId)
    //   .then(songController.search)
    //   .then(songController.duration)
    //   .then(function(song) {
    //     res.send({song: {
    //       ytid: song.ytid
    //     }});
    //   })
    //   .catch(function(err) {
    //     console.log('Error or null after tryNext song recursion, calling tryNext()');
    //     attempts++;
    //     tryNext();
    //   });
    // };
    };

    tryNext();
  }
};
