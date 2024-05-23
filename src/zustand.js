import { useSyncExternalStoreWithSelector } from "use-sync-external-store/with-selector";

const createStore = (initialState) => {
  let state;
  const listeners = new Set();

  const getState = () => state;

  const setState = (newState, replace) => {
    // 更新状态时，直接传递下一个状态，也可以根据上一个状态计算出下一个状态
    let nextState = typeof newState === "function" ? newState(state) : newState;

    // 通过 Object.is 进行浅比较，如果相等，忽略更新
    if (!Object.is(nextState, state)) {
      // replace 不为 undefined 或下一状态值为原始类型的值
      const previousState = state;

      state =
        replace ?? (typeof nextState !== "object" || typeof nextState === null)
          ? nextState
          : Object.assign({}, state, nextState);

      listeners.forEach((listener) => {
        // 将新旧状态提供给订阅状态变更的监听者
        listener(state, previousState);
      });
    }
  };

  const subscribe = (listener) => {
    listeners.add(listener);
    const unsubscribe = () => listeners.delete(listener);
    return unsubscribe;
  };

  const store = {
    getState,
    setState,
    subscribe,
  };

  // 将store相关的API作为初始化函数的参数，提供给使用者
  state = initialState(setState, getState, store);

  return store;
};

const useStoreWithEqualityFn = (store, selector, equalityFn) => {
  return useSyncExternalStoreWithSelector(
    store.subscribe,
    store.getState,
    store.getState,
    selector,
    equalityFn
  );
};

const createImpl = (createInitialState) => {
  const store = createStore(createInitialState);

  const useBoundStore = (selector = store.getState, equalityFn) => {
    return useStoreWithEqualityFn(store, selector, equalityFn);
  };

  // 将store相关的API暴露给使用者
  Object.assign(useBoundStore, store);

  return useBoundStore;
};

const create = (createInitialState) => {
  return createInitialState ? createImpl(createInitialState) : createImpl;
};

export default createStore;
