'use strict';

var Fetcher = require('../lib/mail_fetcher/163').Fetcher;
var co = require('co');
var fs = require('fs');
var thunkify = require('thunkify');
var readFile = thunkify(fs.readFile);
var eventWrap = require('co-event-wrap');
var should = require('should');
var net = require('../mockers/163');
var moment = require('moment');
var debug = require('debug')('test_163_login');

var username = 'zzzz@163.com';
var password = 'zzzz';

describe('163 Fetcher',function(){
  it('test list',function *(){
    try{
      var cookie = yield net.getCookie(username,password);
    }catch(e){
      console.log('Get Cookie Error:',e);
    }

    var fetcher = new Fetcher({'cookie':cookie,'date':moment('2015-05-10').toDate()});
    var ev = eventWrap(fetcher);
    ev.on('message', function* (data) {
      data.should.have.property('subject');
      data.should.have.property('content');
      data.should.have.property('date');
    });

    ev.on('error', function* (data) {
      console.log('Error:',data);
    });

    ev.on('end', function* (data){
      console.log('End:',data);
    });

    var res = yield fetcher.getContent();
  });
});