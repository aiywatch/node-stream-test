#!/usr/bin/env node

var split = require('split');
var through = require('through2');
var stream = require('stream');
// var Duplex = stream.Duplex || require('reaable-stream').Duplex;

// var readline = require('readline');


var line = 0;
var byte = 0;
console.time("elapsed time");
var start = process.hrtime();
// console.log(start);
var logging = through(write2);
var show_summary = through(write3);


process.stdin.pipe(split('\n')).pipe(through(write, end)).pipe(logging).pipe(show_summary);


function write(buf, _, next){
  line++;
  byte += buf.length;
  // console.log(buf.length);
  next();
}

function end (done) {

  // console.log(--line);
  // console.log(byte);
  console.timeEnd("elapsed time");
  // var precision = 3;
  var elapsed = process.hrtime(start)[1] / 1000000; // divide by a million to get nano to milli
  console.log(process.hrtime(start)[0] + " s, " + elapsed + " ms - ");
  
  var summary = {elapsed_time: elapsed, bytes: byte, lines: --line};
  console.log(summary);

  sum_obj = JSON.stringify(summary);
  this.push(sum_obj);
  this.push(null);
  done();
}



function write2(buf, _, next){
  var sum = JSON.parse(buf.toString());
  var throughput_rate = sum.bytes / sum.elapsed_time;

  this.push('elapsed_time:' + sum.elapsed_time + ', bytes:' + sum.bytes + ', lines:' + sum.lines + ', throughput_rate:' + throughput_rate);
  next();
}

function write3(buf, _, next){
  var sum = buf.toString().split(', ');
  console.log("Elapsed Time: " + sum[0].split(':')[1]);
  console.log("Total length in bytes: " + sum[1].split(':')[1]);
  console.log("Total lines: " + sum[2].split(':')[1]);
  console.log("Growth rate of the file: " + sum[3].split(':')[1] + " bytes/ms");
  next();
}