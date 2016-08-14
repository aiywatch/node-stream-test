#!/usr/bin/env node

var through = require('through2');
var colors = require('colors');
var substream = require("./substream.js");

var logging = substream.logging();
var summarize = substream.summarize(process.hrtime());

var show_summary = through(write3);

process.stdin.pipe(summarize).pipe(logging).pipe(show_summary);;


function write3(buf, _, next){
  var sum = buf.toString().split(', ');
  var time = "Elapsed Time: " + sum[0].split(':')[1];
  var byte = "Total length in bytes: " + sum[1].split(':')[1];
  var line = "Total lines: " + sum[2].split(':')[1];
  var g_rate = "Growth rate of the file: " + sum[3].split(':')[1] + " bytes/ms";
  
  if(process.argv[2] == 'color'){
    time = time.green;
    byte = byte.red;
    line = line.blue;
    g_rate = g_rate.rainbow;
  }

  console.log(time);
  console.log(byte);
  console.log(line);
  console.log(g_rate);

  next();
}
