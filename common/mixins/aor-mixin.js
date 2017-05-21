module.exports = function(Model) {
  Model.afterRemote('find', (ctx, result, next) => {
    Model.count(ctx.args.filter ? ctx.args.filter.where : {}).then((c) => {
      ctx.res.set({
        'X-Total-Count': c,
      });
      return next();
    }).catch(next);
  });
};
