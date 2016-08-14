var through = require('through2');



exports.summarize = function(start) {
  return through( function (buf, _, next){
    var line = buf.toString().split('\n').length;
    var byte = buf.length;

    var elapsed = process.hrtime(start)[1] / 1000000; // divide by a million to get nano to milli
    
    var summary = {elapsed_time: elapsed, bytes: byte, lines: --line};
    
    //console.log(summary);

    this.push(JSON.stringify(summary));

    next();
  });
};

exports.logging = function() {
  return through( function(buf, _, next){
    var sum = JSON.parse(buf.toString());
    var throughput_rate = sum.bytes / sum.elapsed_time;

    this.push('elapsed_time:' + sum.elapsed_time + ', bytes:' + sum.bytes + ', lines:' + sum.lines + ', throughput_rate:' + throughput_rate);
    next();
  });
};

