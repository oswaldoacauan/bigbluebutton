// Most of this file was based on the reselect package
function getDependencies(funcs) {
  const dependencies = Array.isArray(funcs[0]) ? funcs[0] : funcs;

  if (!dependencies.every(dep => typeof dep === 'function')) {
    const dependencyTypes = dependencies.map(dep => typeof dep).join(', ');

    throw new Error('Selector creators expect all input-selectors to be functions, ' +
      `instead received the following types: [${dependencyTypes}]`);
  }

  return dependencies;
}

// TODO: Try to apply memoization like reselect does
//       Not sure if its possible due the nature of Tracker
export const createSelector = (...funcs) => {
  const resultFunc = funcs.pop();
  const dependencies = getDependencies(funcs);


  const selector = function selector() {
    const params = [];
    const { length } = dependencies;

    for (let i = 0; i < length; i += 1) {
      // apply arguments instead of spreading and mutate a local list of params for performance.
      // eslint-disable-next-line prefer-rest-params
      params.push(dependencies[i].apply(null, arguments));
    }

    // apply arguments instead of spreading for performance.
    // eslint-disable-next-line prefer-spread
    return resultFunc.apply(null, params);
  };

  selector.resultFunc = resultFunc;
  selector.dependencies = dependencies;
  return selector;
};

export default {
  createSelector,
};
