'use strict';

const Controller = require('egg').Controller;
const uuid = require('uuid')

const etags = [uuid(), uuid()]

class HttpCacheCtrl extends Controller {
  async index() {
    const { ctx } = this;

    await ctx.render('http-cache')
  }

  async noCacheWithEtag() {
    const {seed} = this.ctx.query

    const {'if-none-match': nonMatch} = this.ctx.headers

    this.ctx.set('Cache-Control', `no-cache;max-age=0`)
    this.ctx.set('ETag', etags[seed])
    this.ctx.status = etags.find(tag => tag === nonMatch) ? 304 : 200
    this.ctx.body = new Date().getTime()
  }

  async noCacheWithModified() {
    const {'if-modified-since': modifiedSince} = this.ctx.headers

    const localTime = new Date()

    this.ctx.set('Cache-Control', `no-cache;max-age=0`)
    this.ctx.set('Last-Modified', localTime)
    this.ctx.status = modifiedSince ? 304 : 200
    this.ctx.body = localTime.getTime()
  }

  async maxAge() {
    this.ctx.set('Cache-Control', 'max-age=5')
    this.ctx.body = new Date().getTime()
  }
}

module.exports = HttpCacheCtrl;
