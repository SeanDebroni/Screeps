//Source for most of this is http://me.dt.in.th/page/JavaScript-override/

let globalBenchmarks = {};

module.exports = {
  override(object, methodName, callback)
  {
    object[methodName] = callback(object[methodName])
  },

  after(extraBehavior)
  {
    return function (original)
    {
      return function ()
      {
        var returnValue = original.apply(this, arguments)
        extraBehavior.apply(this, arguments)
        return returnValue
      }
    }
  },

  before(extraBehavior)
  {
    return function (original)
    {
      return function ()
      {
        extraBehavior.apply(this, arguments)
        return original.apply(this, arguments)
      }
    }
  },

  compose(extraBehavior)
  {
    return function (original)
    {
      return function ()
      {
        return extraBehavior.call(this, original.apply(this, arguments))
      }
    }
  },

  //modified
  benchmark(original)
  {
    let finishTime = 10000;
    let startTime = 10000;
    return function ()
    {
      startTime = Game.cpu.getUsed();
      let returnValue = original.apply(this, arguments)
      finishTime = Game.cpu.getUsed();

      let name = original.name;

      let time = finishTime - startTime;
      if (globalBenchmarks[name] == undefined)
      {
        globalBenchmarks[name] = {
          min: time,
          max: time,
          count: 1,
          sum: time
        };
      }
      else
      {
        let bench = globalBenchmarks[name];
        if (time < bench.min) bench.min = time;
        if (time > bench.max) bench.max = time;
        bench.sum = bench.sum + time;
        bench.count = bench.count + 1;
        globalBenchmarks[name] = bench;
      }
      return returnValue
    }
  },
  //own code
  outputBenchmarks()
  {

    let keys = Object.keys(globalBenchmarks);
    for (let i = 0; i < keys.length; ++i)
    {
      let benchmark = globalBenchmarks[keys[i]];
      let average = benchmark.sum / benchmark.count;
      console.log("Benchmark: " + keys[i] + " | Sum " + benchmark.sum.toFixed(3) + " | Average " + average.toFixed(3) + " | Count " + benchmark.count + " | Min " + benchmark.min.toFixed(3) + " | Max " + benchmark.max.toFixed(3));
    }
  },

  // XXX: Work only with functions with 1 argument.
  memoize(original)
  {
    var memo = {}
    return function (x)
    {
      if (Object.prototype.hasOwnProperty.call(memo, x)) return memo[x]
      memo[x] = original.call(this, x)
      return memo[x]
    }
  }

};
